# What this edition changed

This repo is a **Shorts-focused edition** of [claude-youtube-editor](https://github.com/hassancs91/claude-youtube-editor) by Hasan
Aboul Hasan (MIT). Upstream is built for **long-form YouTube**: 16:9, cutaways away from the talking head, a long edit. This edition
adds a **90-second vertical format with the face on screen the whole time**, plus the pieces needed to make it look produced.

The comparison baseline is the upstream state as of its 2026-08-11 "Updated" commit. Everything not listed below is upstream's work and
unchanged.

## Summary

| Area | Upstream | This edition |
|---|---|---|
| Format | 16:9 long-form, full-screen cutaways | **1080 × 1920 Short**, split frame: B-roll top, face bottom, captions over the face |
| B-roll | clones and graphics | **real photos and real page captures by default**; icons only for abstract ideas |
| Sound | SFX pass; "music is the final-mix step" (referenced but not shipped) | SFX pass **plus a shipped `/assemble` step**: music bed, ducking, −14 LUFS |
| Machines | assumes an NVIDIA GPU (NVENC) | **CPU encoders by default**, with notes to switch back |
| Brand | ships a house brand | ships a neutral **template brand**; `/brand-setup` makes it yours |
| Examples | 37 long-form shots | those, plus **two complete reference Shorts** and a footage-free demo |

## New skills

| Skill | What it does |
|---|---|
| [`/build-vertical-reel`](../.claude/skills/build-vertical-reel/SKILL.md) | The split-frame Short format: crop-offset technique for the face, caption safe zone, top-half-only scene pattern, the full pipeline from footage to final mix, and the environment gotchas (no GPU, AAC priming gap, comp-native transcode) |
| [`/assemble`](../.claude/skills/assemble/SKILL.md) | Step 5. Auditions a music bed with `tools/mix_music.py`, user-audit gate, then a two-pass EBU R128 loudness normalisation. Upstream tools (`gen_music.py`, `mix_music.py`, `mix_sfx.py`) all say "final mix is `/assemble`'s job", but the skill did not exist |

## Changed skills and contracts

| File | Change |
|---|---|
| `.claude/skills/make-tsx/SKILL.md` | Principle P3 rewritten: **real assets over generic icons**, with the two workflows (live page capture; real photo plus Ken Burns) and sourcing hygiene |
| `brand.md` | §6 *Real assets over generic icons*; §9 locked decision; §10 new `camera-snap` cue; §11 *Music bed and final mix*. Identity sections turned into a neutral template |
| `CLAUDE.md` | pipeline table gains `/assemble` and the Shorts examples; conventions gain the real-assets rule and the privacy ignores |
| `requirements.txt` | `playwright` is a real dependency (was commented out) |

## Remotion kit (`remotion/src/lib/`)

| Export | File | Purpose |
|---|---|---|
| `WordCaptionOverlay`, `CaptionWord`, `activeCaptionWord` | `kit.tsx` | word-by-word captions, one active word, scale-only entrance so there is never a low-contrast state |
| `TopCard` | `kit.tsx` | top-half statement card sized for a 1080 × 960 region, with `default` / `danger` / `positive` / `signature` tones |
| `WarmGradientBg` | `kit.tsx` | an alternative warm backdrop (a deliberate off-brand option used in one example) |
| `RealPhotoKenBurns` | `kit.tsx` | a real photo with a slow push, driven by a local frame so it works inside the beat scheduler |
| `sampleCursor`, `CursorPointer` | `screencast.tsx` | now exported so top-half scenes can hand-roll a cursor with local frames |

New composition: [`remotion/src/shots/shorts-demo/ShortsFormatDemo.tsx`](../remotion/src/shots/shorts-demo/ShortsFormatDemo.tsx), a footage-free
demo of the whole format.

## Tools

| Tool | Change |
|---|---|
| `tools/find_content_box.py` | **new.** Finds the real picture inside a letterboxed frame and prints an ffmpeg crop |
| `tools/render_cuts.py`, `tools/make_proxy.py` | CPU encoders (`libx264`, `libx265`) instead of NVENC, with `HWACCEL` empty and revert notes |
| `tools/capture_web.py` | unchanged code, but now a first-class part of the workflow (Playwright is required, not optional) |

## Media

| Asset | Change |
|---|---|
| `media/library/sfx/clips/camera-snap.mp3` + `palette.json` + `catalog.json` | new sound for real-asset reveals (36 clips total) |
| `media/library/placeholders/real-photo-placeholder.png` | neutral image for the demo and for trying `RealPhotoKenBurns` |

## Examples (`examples/`)

Two complete reference Shorts built with this pipeline from AI-avatar footage, the footage-independent building blocks, and
upstream's thumbnail prompt recipes (moved out of a per-video folder so the `/thumbnail` skill can point at them). See
[examples/README.md](../examples/README.md).

## Removed from this edition

Upstream's per-video project data is **not** shipped, because it is another channel's content rather than part of the engine:
`videos/video-1…3` (scripts, thumbnails, notion records), the 82 long-form shots in `remotion/src/shots/video-1/`,
`media/projects/video-1/`, a scratch folder (`.stems_tmp/`) and a promotional comparison image. The reusable engine, the 37-shot
`shots/example`, the libraries and every skill remain.

## Git hygiene added

`.gitignore` additionally ignores `videos/*/work/transcripts*/` (raw AssemblyAI JSON embeds an unlisted `audio_url`) and
`media/projects/*/real/` (captures of other people's pages and photos).

## Keeping in sync with upstream

This edition starts from a fresh git history, so there is no shared ancestry to merge. To pull in upstream improvements, diff
against its repository and apply what you want by hand, then re-run `npx tsc --noEmit` and the demo render.

## Credit

All of upstream's code, skills and libraries are © Hasan Aboul Hasan, MIT. This edition's additions are by Saksham, under the same
license. See [LICENSE](../LICENSE).
