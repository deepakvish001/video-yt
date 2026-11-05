#!/usr/bin/env bash
# Build the Hindi reel: Hindi voice + word times + time-warp (tools/hindi.py) -> music + SFX -> picture -> <folder>.mp4
# The stick-figure make.sh is not used here: its word aligner only understands English.
#   bash build.sh            # reuse the voice in audio/ (makes it if missing)
#   VOICE=1 bash build.sh    # a new Kokoro take first (after changing script_hi.json)
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENGINE="$(cd "$DIR/../../.claude/skills/stick-figure/engine" && pwd)"
KIT="$(cd "$DIR/../../.claude/kit" && pwd)"
PY="$KIT/.venv/bin/python"
[ -x "$PY" ] || { echo "the voice tools aren't set up: run  bash $KIT/setup.sh --voice"; exit 1; }
export NODE_PATH="$KIT/node_modules"
WORKERS="${WORKERS:-4}"
NAME="$(basename "$DIR")"
cd "$DIR"; mkdir -p audio

echo "== voice and word times"
if [ "${VOICE:-0}" = "1" ] || [ ! -f audio/vo.wav ] || [ ! -f audio/line_00.wav ]; then "$PY" -I tools/hindi.py all; else "$PY" -I tools/hindi.py words; fi

echo "== music + sfx mix"
"$PY" audio.py

echo "== rendering shots with $WORKERS workers"
rm -rf seg; mkdir -p seg
N=$(grep -c "SHOTS.push" web/shots.js)
pids=()
for ((w = 0; w < WORKERS; w++)); do
  ids=""; for ((i = w; i < N; i += WORKERS)); do ids="${ids:+$ids,}$i"; done
  [ -n "$ids" ] && { node "$ENGINE/tools/render.js" segments "$ids" > "seg/log$w.txt" 2>&1 & pids+=($!); }
done
for p in "${pids[@]}"; do wait "$p"; done
[ "$(ls seg/shot_??.mp4 | wc -l)" -eq "$N" ] || { echo "a shot failed to render, see $DIR/seg/log*.txt"; exit 1; }
for f in seg/shot_??.mp4; do echo "file '$PWD/$f'"; done > seg/list.txt
ffmpeg -v error -y -f concat -safe 0 -i seg/list.txt -c copy silent.mp4

echo "== final mux"
ffmpeg -v error -y -i silent.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy \
  -af "alimiter=limit=0.8:attack=2:release=60,loudnorm=I=-14:TP=-1.5:LRA=9" \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$NAME.part.mp4"
mv "$NAME.part.mp4" "$NAME.mp4"
echo "done: $DIR/$NAME.mp4"
