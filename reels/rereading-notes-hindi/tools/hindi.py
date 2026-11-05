# Hindi voice, word timings and time-warp for a stick-figure reel whose shots were timed to an English voice.
# Run from the reel folder with the kit's Python:
#   python tools/hindi.py tts     # one Kokoro take per line -> audio/vo.wav + audio/lines.json
#   python tools/hindi.py words   # word times -> audio/words_new.json, web/words.js, audio/warp.json, web/warp.js
#   python tools/hindi.py all
# The English word aligner (Parakeet) does not understand Hindi, so word times come from the take itself:
# each line is synthesized on its own (its start and end are exact), pauses inside a line are found in the
# audio and matched to the commas, and the words between pauses share the time by their phoneme counts.
# Captions show the Roman Hinglish of each word; the voice reads the Devanagari.
import json, os, re, shutil, sys, tempfile
import numpy as np, soundfile as sf

ROOT = os.getcwd()
KIT = os.path.realpath(os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', '..', '..', '.claude', 'kit'))
SPEC = json.load(open(os.path.join(ROOT, 'script_hi.json'), encoding='utf-8'))
GAP = .12
PAUSE_END = re.compile(r'[,।?!.]$')

def kokoro():
    from kokoro_onnx import Kokoro, EspeakConfig
    import espeakng_loader
    data = espeakng_loader.get_data_path()
    if len(data) > 100:  # espeak-ng fails on a long data path
        short = os.path.join(tempfile.gettempdir(), 'kokoro-espeak-ng-data')
        if not os.path.exists(os.path.join(short, 'phontab')):
            shutil.rmtree(short, ignore_errors=True); shutil.copytree(data, short)
        data = short
    return Kokoro(os.path.join(KIT, 'models/kokoro-v1.0.onnx'), os.path.join(KIT, 'models/voices-v1.0.bin'),
                  espeak_config=EspeakConfig(lib_path=espeakng_loader.get_library_path(), data_path=data))

def tts(k):
    os.makedirs('audio', exist_ok=True)
    out, meta, t, sr = [], [], 0.0, 24000
    for i, L in enumerate(SPEC['lines']):
        text = ' '.join(d for d, _ in L['words'])
        s, sr = k.create(text, voice=SPEC['voice'], speed=SPEC['speed'], lang='hi')
        a = np.abs(s); idx = np.where(a > .01)[0]
        s = s[max(0, idx[0] - int(.02 * sr)): idx[-1] + int(.05 * sr)]
        sf.write(f'audio/line_{i:02d}.wav', s, sr)
        meta.append({'i': i, 'text': text, 'start': round(t, 3), 'dur': round(len(s) / sr, 3)})
        out += [s, np.zeros(int(GAP * sr), dtype=s.dtype)]
        t += len(s) / sr + GAP
        print(meta[-1])
    vo = np.concatenate(out[:-1])
    sf.write('audio/vo.wav', vo, sr)
    json.dump(meta, open('audio/lines.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(SPEC['voice'], 'total', round(len(vo) / sr, 2), 's')

def silences(seg, sr, min_len=.06, db=-30):
    hop = int(.01 * sr); n = len(seg) // hop
    rms = np.array([np.sqrt(np.mean(seg[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
    quiet = rms < rms.max() * 10 ** (db / 20)
    runs, i = [], 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]: j += 1
            if (j - i) * .01 >= min_len and i > 0 and j < n: runs.append((i * .01, j * .01))
            i = j
        else: i += 1
    return runs

def phonemes(k, dev):
    p = k.tokenizer.phonemize(dev, 'hi')
    return max(1, len(re.sub(r'[ˈˌ\s,.?!।]', '', p.replace('ː', ''))) + .5 * p.count('ː'))

def words(k):
    meta = json.load(open('audio/lines.json', encoding='utf-8'))
    allw = []
    for i, L in enumerate(SPEC['lines']):
        seg, sr = sf.read(f'audio/line_{i:02d}.wav')
        dur = len(seg) / sr
        W = L['words']; w = [phonemes(k, d) for d, _ in W]
        brk = [j for j in range(len(W) - 1) if PAUSE_END.search(W[j][0])]
        runs = silences(seg, sr)
        if len(runs) >= len(brk):
            pauses = sorted(sorted(runs, key=lambda r: r[0] - r[1])[:len(brk)])
        else:
            print(f'line {i}: found {len(runs)} pauses for {len(brk)} commas, spreading by phonemes only')
            pauses = None
        # groups of words between pauses, each with its time span
        groups, a, prev = [], 0.0, 0
        for g, j in enumerate(brk):
            b = pauses[g][0] if pauses else None
            groups.append((prev, j + 1, a, b)); prev = j + 1; a = pauses[g][1] if pauses else None
        groups.append((prev, len(W), a, dur))
        if not pauses:  # one span for the whole line, a comma counts as 3 phonemes of air
            ww = [w[j] + (3 if j in brk else 0) for j in range(len(W))]
            groups = [(0, len(W), 0.0, dur)]; w = ww
        times = [None] * len(W)
        for j0, j1, a, b in groups:
            tot = sum(w[j0:j1]); t = a
            for j in range(j0, j1):
                times[j] = [t, t + (b - a) * w[j] / tot]; t = times[j][1]
        off = meta[i]['start']
        for j, (_, roman) in enumerate(W):
            allw.append({'w': roman, 's': round(off + times[j][0], 3), 'e': round(off + times[j][1], 3), 'line': i})
        print(i, ' '.join(f"{W[j][1]}@{off + times[j][0]:.2f}" for j in range(len(W))))
    json.dump(allw, open('audio/words_new.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    open('web/words.js', 'w', encoding='utf-8').write('const WORDS=' + json.dumps(allw, ensure_ascii=False) + ';')
    # time-warp: English moments (old) -> the Hindi words that carry them (new)
    ref = json.load(open(SPEC['ref_words'], encoding='utf-8'))
    first_old = {}
    for r in ref: first_old.setdefault(r['line'], r['s'])
    by_line = {}
    for x in allw: by_line.setdefault(x['line'], []).append(x)
    anchors = []
    for i, L in enumerate(SPEC['lines']):
        anchors.append([first_old[i], by_line[i][0]['s']])
        anchors += [[old, by_line[i][j]['s']] for old, j in L['anchors']]
    new_end = meta[-1]['start'] + meta[-1]['dur']
    anchors.append([ref[-1]['e'], new_end])
    anchors.sort()
    clean = [anchors[0]]
    for p in anchors[1:]:
        if p[0] > clean[-1][0] + 1e-3 and p[1] > clean[-1][1] + 1e-3: clean.append(p)
        else: print('dropped anchor (not increasing):', p)
    warp = {'anchors': clean, 'old_end': ref[-1]['e'], 'new_end': round(new_end, 3)}
    json.dump(warp, open('audio/warp.json', 'w'))
    open('web/warp.js', 'w').write('window.WARP=' + json.dumps(warp) + ';')
    print('anchors', len(clean), 'new_end', warp['new_end'])

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'all'
    k = kokoro()
    if cmd in ('tts', 'all'): tts(k)
    if cmd in ('words', 'all'): words(k)
