# The pipeline, step by step

You normally just ask Claude for a step and the matching skill runs. This page shows what each step does, the commands underneath,
and the quality gate that must pass before moving on.

> Commands are shown as `python …`. Use your venv's interpreter: `venv/Scripts/python` (Windows) or `./venv/bin/python`
> (macOS/Linux). Run everything from the repo root and pass the project as `videos/video-1`.

```
footage ─▶ 1 cut ─▶ 2 build the Short ─▶ 3 sound design ─▶ 4 assemble ─▶ upload
          /clean-cut  /build-vertical-reel   /suggest-sfx      /assemble
```

Do step 0 once per channel: say **"set up my brand"** (`/brand-setup`).

---

## 0. Footage

Two sources work.

**Your own camera.** Drop the clip(s) into `videos/video-1/`. Static camera, face centred, good light.

**An AI avatar.** Download the avatar tool's export as `videos/video-1/<name>.mp4`. Read [AVATAR-FOOTAGE.md](AVATAR-FOOTAGE.md)
first: some exports carry a watermark or letterbox the avatar inside the frame, and the crop decision is made in step 2.

## 1. The cut: `/clean-cut`

Turns raw footage into a clean master plus `edited-transcript.json`, the word-level timing spine every later step anchors to.

| Stage | Command / artifact |
|---|---|
| Extract audio | `ffmpeg -i videos/video-1/clip.mp4 -vn -ac 1 -ar 16000 videos/video-1/work/audio/clip1.wav` |
| Spell the names right | write `videos/video-1/work/keyterms.txt` (one brand/tech term per line) |
| Transcribe | `python tools/transcribe.py videos/video-1` |
| Readable view | `mkdir -p videos/video-1/work/analysis && python tools/format_transcript.py videos/video-1` |
| **Author the cut** | Claude reads the transcript and writes `work/analysis/cuts.json` (keeps, categorised cuts, fluff suggestions) |
| QA reports | `python tools/analyze_cut.py videos/video-1` · `python tools/make_review.py videos/video-1` |
| Preview | `python tools/render_cuts.py videos/video-1 --style natural --mode preview` |
| Machine-verify the render | extract the preview's WAV into `work/audio/preview.wav`, then `python tools/transcribe.py videos/video-1 --clips preview --force` and `python tools/verify_cut.py videos/video-1 --style natural` |
| Audit (optional UI) | `python tools/editor/server.py videos/video-1` then open <http://localhost:8765> |
| Final master | `python tools/render_cuts.py videos/video-1 --style natural --mode final` |
| Handoff spine | transcribe the master's audio, normalise to `{ "words": [{ "text", "start", "end" }] }` (ms) in `work/edited-transcript.json` |

**Gate:** `verify_cut.py` reports 0 extra words, 0 missing words and 0 A/V drift flags, **and** `ffprobe` shows the video and audio
streams of the master with the same duration. A mistimed word token or an untranscribed false start is invisible in the raw
transcript; the second ASR pass over the render is what catches it.

**Single-take AI-avatar shortcut.** An avatar read has no retakes, fillers or false starts. Both example Shorts used one keep
span covering the whole clip (`"cuts": []`), still ran the QA and verify gates, and skipped the editor UI. See
[`examples/shorts/*/work/cuts.json`](../examples/shorts/).

## 2. The Short: `/build-vertical-reel`

Builds the 1080×1920 split-frame composition. Full spec: [SHORTS-FORMAT.md](SHORTS-FORMAT.md).

1. **Comp-native footage.** Remotion's `OffthreadVideo` needs a decode-friendly source:
   `ffmpeg -i master.mp4 -vf "scale=1080:1920" -r 30 -c:v libx264 -pix_fmt yuv420p -c:a copy master-comp-native.mp4`
   into `media/projects/video-1/`. (If you pre-crop the face window yourself, scale straight to `1080:960`.)
2. **Frame the face.** Find the crop offset by rendering a still and *looking at it*, then iterating. Never guess.
3. **Plan the beats.** Claude reads `edited-transcript.json`, lists the beats, and for each named company/person/place/app decides
   which **real** photo or screenshot to fetch ([REAL-ASSETS-BROLL.md](REAL-ASSETS-BROLL.md)). Abstract ideas get a motion graphic.
4. **Author one scene per beat** in `remotion/src/shots/video-1/FullReel.tsx`, then register it:
   `cd remotion && npm run gen`.
5. **Typecheck, then proof stills at every beat.**
   `npx tsc --noEmit` · `npx remotion still src/index.ts FullReel out/proof.png --frame=<N>`. Read each still.
6. **Render.** `node scripts/render-all.mjs FullReel --scale=1` writes `remotion/out/FullReel.mp4` (several minutes on CPU for ~100 s).

**Gate:** the face is visible and legible for the entire runtime, captions never touch it at any word length (check the longest
word), and the **video** stream duration equals the composition length. The audio stream measuring about 40–55 ms longer is the
normal AAC priming gap, not drift.

## 3. The sound: `/suggest-sfx`

Claude writes `videos/video-1/work/sfx-plan.json`, one event per cue, `at_s` taken from word times and frame timings.
Guide: [SOUND-AND-MUSIC.md](SOUND-AND-MUSIC.md).

```bash
python tools/mix_sfx.py videos/video-1/work/sfx-plan.json --print     # the cue sheet you audit
python tools/mix_sfx.py videos/video-1/work/sfx-plan.json             # mix once approved
```

**Gate (hard): you approve the cue sheet before anything is mixed.** Then verify audibility with numbers: compare mean/peak volume
of the SFX-mixed file against the voice-only file in a tight window around a key cue.

## 4. The mix: `/assemble`

Lays a music bed under the whole Short, ducked under your voice, then normalises loudness for delivery.

```bash
python tools/mix_music.py --bed ambient-pad --base videos/video-1/output/video-1-full-reel-sfx.mp4 \
       --out videos/video-1/output/video-1-audition.mp4
# compare every bed at once:   python tools/mix_music.py --all --base <that same file>
```

**Gate (hard): you pick the bed.** Then the two-pass loudness normalization (commands in [SOUND-AND-MUSIC.md](SOUND-AND-MUSIC.md))
produces `videos/video-1/output/video-1-final.mp4` at **−14 LUFS integrated, −1.5 dBTP**. Re-check that the video stream's
duration did not move.

## 5. Upload

`python tools/yt_upload.py` uploads as a private draft after re-checking ghost speech and A/V drift. One-time OAuth setup:
[tools/yt_upload_SETUP.md](../tools/yt_upload_SETUP.md). Titles, descriptions and thumbnails (`/packaging`, `/thumbnail`) are built
for long-form; Shorts mostly need a strong first line and caption.

---

## All quality gates in one table

| After | Check | Pass looks like |
|---|---|---|
| Cut | `verify_cut.py` + `ffprobe` v:0 vs a:0 | 0 extra / 0 missing / 0 drift flags; equal stream durations |
| Face crop | a rendered still, several words and beats | face fully visible; caption pill below the chin for the shortest **and** longest word |
| Each beat | a rendered still **at each cue** | looked at, not assumed |
| Full render | `ffprobe` on the output | video duration = composition length; audio ≤ ~55 ms longer |
| SFX | cue sheet audit, then dB check | you approved it; key cues rise by several dB in a tight window |
| Music | you pick the bed | bed audible in gaps, receded under speech |
| Final | `loudnorm` summary | about −14 LUFS, −1.5 dBTP, A/V gate still passes |
