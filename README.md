# video-yt

## Animation skills (Claude Code)

Is repo me reels ke liye chhe animation skills hain, footage ki zaroorat nahi. Claude Code is repo me khulte hi ye commands de deta hai:

| Command | Kya banata hai | Example |
|---|---|---|
| `/graph` | Line graph jo khud banta hai, saath me ek number ginta hai | `/graph 0 to 100K followers in 9 months: 1.2K, 2.1K, 3.4K, 5K, 9K, 24K, 51K, 78K, 100K` |
| `/map-route` | 3D map, rasta khud banta hai, ETA card aur pin | `/map-route home to the gym, 2.8 km, 9 minutes` |
| `/breakdown` | Phone ka 3D exploded view, har part par label | `/breakdown my phone, label it like a joke` |
| `/minimalistic-graphics` | Black-and-white line art: seedhiyan aur ek bindu | `/minimalistic-graphics every step feels small until you look back` |
| `/stick-figure` | Stick-figure explainer reel (30 se 45 s) | `/stick-figure why did pirates wear eye patches?` |
| `/zach-d-films` | 3D cartoon "what if" short | `/zach-d-films could ancient armour stop an arrow?` |

Pehle chaar 10 second se 1.5 minute me 1080x1920 ka mp4 de dete hain. `/stick-figure` aur `/zach-d-films` poori reel hain: script, voice, captions aur shots, ek lambi working session.

**Pehli baar:** naye session me setup apne aap chalta hai jab skill pehli baar use ho. Haath se chalana ho to:

```bash
bash .claude/kit/setup.sh
```

```bash
bash .claude/kit/setup.sh --voice
```

Doosra wala `/stick-figure` aur `/zach-d-films` ke liye free voice (Kokoro) aur word timings (Parakeet) bhi laata hai, lagbhag 1 GB.

Source, licence aur upstream se kya badla: `.claude/kit/README.md`.
