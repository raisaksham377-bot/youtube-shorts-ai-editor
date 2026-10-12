---
name: assemble
description: Step 5 (final) of the AI Video Editor pipeline — lay a music bed under the SFX-mixed video, ducked under the voice, then normalize loudness for delivery. Use when the user wants to "add music", "add a background sound/beat", asks where the soothing/ambient background music in typical finance/job-search/AI-tech education Reels comes from, wants the video ready for upload/packaging, or says a video sounds "dry"/"empty" without a bed under the voice. Covers the shared music library (media/library/music/, 6 pre-generated beds), picking a bed by content register, tools/mix_music.py's audition mix + hard sidechain duck, the user-audit gate, and the final two-pass EBU R128 loudnorm pass that produces the actual upload-ready file. Not the SFX pass (that is /suggest-sfx, step 4) and not the visual beats (that is /make-tsx or /build-vertical-reel).
---

# assemble — step 5, the final mix

Last step before packaging/upload. Two things happen here, in order, and neither happens anywhere
else in the pipeline:

1. **A continuous instrumental music bed** goes under the whole video, hard-ducked under the voice.
   This is what makes a typical finance/job-search/AI-tech education Reel or Short sound "produced"
   — that ever-present soft ambient/lofi bed is not part of anyone's original recording; it's a
   licensed or generated loop, added and ducked in the edit. Read **brand.md §11** every session —
   it names the 6 real beds already in the library and which register each fits.
2. **Final loudness normalization** for delivery — the SFX pass (`/suggest-sfx`) only lightly ducks
   its own bus; nothing before this step has normalized the WHOLE mix to a delivery loudness target.

## Inputs (read these first, every session)

- **`brand.md` §11** — bed choice by content register, default gain/duck/fade, the loudnorm target.
- **`videos/video-N/output/video-N-*-sfx.mp4`** (or the vertical-reel equivalent, e.g.
  `video-N-full-reel-sfx.mp4`) — the SFX-mixed file from `/suggest-sfx`. This is the base you mix
  music onto; never re-run this step over a preview that hasn't had its SFX pass yet.
- **`media/library/music/catalog.json`** — the 6 pre-generated beds (`ambient-pad`, `tech-pulse`,
  `lofi-warm`, `cinematic-min`, `docu-pluck`, `lullaby-tender`). Library-first: reuse one; only touch
  `tools/gen_music.py` / `palette.json` for a genuinely new mood brand.md doesn't already cover.

## Workflow

1. **Read** brand.md §11 and the video's content/register (what kind of beat is this — a build demo,
   a personal pitch, a tutorial, a reflective story) to shortlist 1-2 candidate beds, not all 6 by
   default (offer `--all` if the user wants to hear everything).
2. **Audition**: `python tools/mix_music.py --bed <id> --base <video>-sfx.mp4 --out
   <scratch>/<video>-<id>-audition.mp4` per candidate, or `--all` to render every bed at once.
   Defaults (`--bed-gain -7 --duck 9 --fade 1.5`) are the brand defaults; only override with a stated
   reason (e.g. the voice sits unusually quiet in this cut, or the bed still pokes through — check
   with `--print` first to see the resolved settings before rendering).
3. **USER-AUDIT GATE (hard, same as cuts.json / the sfx-plan).** Present the candidate(s) — which
   bed, at what gain — and get the user's pick or notes BEFORE finalizing. Don't guess their taste on
   a subjective call like this one.
4. **Final loudnorm pass** on the chosen audition file — two-pass EBU R128, target **−14 LUFS
   integrated, −1.5 dBTP true-peak, LRA 11** (brand.md §11 explains why −14 not −17): first pass
   measures (`loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json`, `-f null -`), second pass feeds those
   `measured_*` values back in for a sample-accurate result. Video stream-copy, audio re-encoded AAC.
   Output `videos/video-N/output/video-N-final.mp4` (or the project's equivalent final name) — THIS
   is the file `/packaging` markets and `tools/yt_upload.py` uploads, not the `-sfx.mp4` one.
5. **Re-verify the A/V duration gate** (`ffprobe -show_entries stream=duration` on v:0 vs a:0) —
   loudnorm re-encodes the audio stream; confirm the video track's length didn't shift and the audio
   is still within the normal small AAC-priming-gap tolerance (see `/build-vertical-reel`'s notes),
   not something larger.
6. **Spot-listen-by-numbers**: RMS-diff a quiet narration gap before vs. after the music pass to
   confirm the bed is actually present and ducking correctly (audible in gaps, receded under speech)
   — same audibility-by-measurement discipline as `/suggest-sfx`, since this environment can't play
   audio back directly.

## Tooling quick reference

- Grow the bed library (only for a new mood): `python tools/gen_music.py [--only id] [--dry-run]
  [--renorm]`. Needs `ELEVENLABS_API_KEY` in `.env`.
- Audition: `python tools/mix_music.py --bed <id> --base <file> [--out <path>] [--print]` or `--all`.
- Final loudnorm: no dedicated tool yet — run the two-pass `ffmpeg loudnorm` by hand per brand.md §11
  (a `finalize.py` wrapping this cleanly is a reasonable future addition, not required to do the step).

Done = a bed is picked WITH the user (not assumed), the mix is ducked correctly (verified by
RMS, not assumed), the final file is loudness-normalized to −14 LUFS/−1.5 dBTP, the A/V duration
gate still passes, and the output is named `-final.mp4` so `/packaging`/upload point at the right
file.
