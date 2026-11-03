# Animation skills kit

The six skills in `.claude/skills/` (`breakdown`, `graph`, `map-route`, `minimalistic-graphics`, `stick-figure`, `zach-d-films`) and this `kit/` folder are copied from
[artemnovitckii/claude-animation-skills](https://github.com/artemnovitckii/claude-animation-skills) at commit `5dbea55c23aa6a5c93dc3cfb5583840513b56b94`. MIT licence, see `LICENSE`.

## Layout

The skills find this folder as `<skill folder>/../../kit`, so it must stay at `.claude/kit` next to `.claude/skills`.

```
.claude/skills/<name>/   SKILL.md, build.py, template.html, or an engine/ for stick-figure and zach-d-films
.claude/kit/anim.py      fill a template, render with HyperFrames, snapshots, contact sheet
.claude/kit/words.py     word timings for a voiceover (Parakeet, runs locally)
.claude/kit/setup.sh     one-time setup
```

`setup.sh` installs into folders that git ignores: `node_modules/`, `vendor/` (GSAP), and with `--voice` also `.venv/` and `models/` (about 1 GB).
A fresh session has none of them. Each skill's "First use" step runs `setup.sh` when they are missing, or run it by hand:

```bash
bash .claude/kit/setup.sh            # graph, minimalistic-graphics, map-route, breakdown
bash .claude/kit/setup.sh --voice    # also the free voice and word timings for stick-figure and zach-d-films
```

## Changes from upstream

Only `setup.sh` differs:

1. In a Claude Code cloud container (`/opt/pw-browsers` exists and Playwright is installed globally) it links `node_modules/playwright` to the preinstalled Playwright instead of running `playwright install chromium`. The container's Chromium is already there, and downloading another one is not allowed there. Elsewhere it behaves as upstream.
2. If cdnjs is blocked, it takes GSAP 3.12.5 from the `gsap` npm package (the same file).
3. Model downloads go to `<file>.part` first and retry, so a cut-off download is not skipped as finished on the next run.

## Updating

Copy `skills/*` over `.claude/skills/` and `kit/{anim.py,words.py,package.json,package-lock.json,fonts}` over `.claude/kit/`, then keep the three changes above in `setup.sh` and update the commit hash here.
