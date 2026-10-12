# CLAUDE.md — youtube-shorts-ai-editor

**You record the talking head. Claude Code does the rest.** Every screen moment — UI walkthroughs,
full-screen statements, diagrams, terminal mockups — is built as Remotion TSX and composited over
your cut. No screen recording, no video editor. The right skill is picked from the request.

**This is the Shorts edition.** The headline format is a 1080×1920 split-frame Short (B-roll on top, the face on screen the whole
time): `/build-vertical-reel`, then `/suggest-sfx`, then `/assemble`. The long-form pipeline is still here. See `docs/` for the
guides and `examples/` for two complete reference Shorts. A footage-free demo is `ShortsFormatDemo` in Remotion Studio.

| The user asks to… | Skill | Output |
|---|---|---|
| set up / change their brand, colors, fonts, wordmark | `/brand-setup` | `brand.md` + `remotion/src/{brand.ts,fonts.ts}` + a proof render |
| cut the raw footage / tighten pacing / remove fillers | `/clean-cut` | master cut + `videos/<project>/work/{analysis/cuts.json, edited-transcript.json}` |
| build the visual beats / add overlays | `/make-tsx` (+ `/fake-screencast`) | shots in `remotion/src/shots/<project>/` + a baked preview |
| build a split-frame vertical Short/Reel (face on screen the whole time) | `/build-vertical-reel` | a `FullReel`-style composition + rendered/SFX-mixed output |
| write a crash-free TSX shot | `/vidtsx-2d-generator` | the low-level Remotion authoring rules |
| remove background noise / isolate voice | `/clean-audio` | a cleaned master (levels preserved) |
| add SFX / sound-design a beat | `/suggest-sfx` | `videos/<project>/work/sfx-plan.json` + an audition mix |
| add background music / the "soothing" bed under the voice / final loudness pass | `/assemble` | `videos/<project>/output/<project>-final.mp4`, loudness-normalized, upload-ready |
| package a video / titles + thumbnails | `/packaging` | `videos/<project>/packaging/` (1 title × 3 thumbnail bets + rendered thumbs) |
| make / iterate thumbnails only | `/thumbnail` | rendered + verified frames in `videos/<project>/packaging/thumbs/` (asks which style elements you want) |
| upload it | `tools/yt_upload.py` | a private draft on YouTube |
| track it / put it in Notion | `tools/notion_sync.py` | the video's row in the Notion content tracker |

The pipeline order is: **cut → visuals → voice → SFX → assemble (music + final loudness) →
packaging → upload.**

`brand.md` is the style contract every step-2+ skill reads (palette, motion, delivery specs, SFX
taste). `remotion/src/brand.ts` + `fonts.ts` are the same contract as code — **`/brand-setup` owns all
three together; they drift silently if you hand-edit one.**

## Layout

```
tools/            Python tools (see requirements.txt); the cut-editor UI in tools/editor/;
                  RNNoise models in tools/models/rnnoise/
remotion/         the Remotion project — src/lib/ (kit, browser, screencast, vscode),
                  src/shots/<project>/; registry is GENERATED (npm run gen)
media/            Remotion's public root: library/ (reusable: sfx, music, logos, faces)
                  + projects/<project>/ (media for ONE video — via staticFile('projects/<p>/x'))
videos/           per-video project data — EMPTY until you make one. See videos/README.md
examples/         two reference Shorts, building blocks, thumbnail recipes — read before building (examples/README.md)
docs/             the guides (setup, pipeline, Shorts format, real assets, sound, avatar footage, prompts, troubleshooting)
brand.md          the style contract (ships as a template — run /brand-setup)
```

## The examples

`examples/shorts/` holds two complete reference Shorts and their building blocks. They are NOT auto-registered: copy a folder into
`remotion/src/shots/<name>/`, run `npm run gen`, and see `examples/README.md`. In their code comments `video-4` means
`job-search-tips` and `video-5` means `outreach-pitch`. Both pre-date the real-assets rule, so their B-roll is icon-style: copy the
*structure*, not the visuals.

`remotion/src/shots/example/` is **37 real shots** from a published video — the worked example of the
kit. They render standalone with no footage: `cd remotion && npm run studio`. Read a few before
authoring new ones; that's the fastest way to learn `remotion/src/lib/`.

`remotion/src/shots/brand/BrandProof.tsx` is not a video beat — it's a utility shot that renders the
current brand (wordmark, palette, type) so you can see it. `/brand-setup` uses it.

## Conventions (hard rules)

- **Run everything from the repo root.** Tools resolve *engine* paths (media/library, catalogs,
  remotion/out) against their own location, but *project* paths against the CWD — so pass the project
  as `videos/video-1` and run from the repo root. Example: `python tools/render_cuts.py videos/video-1
  --style natural --mode preview`.

- **Python: use a venv at the repo root.** These tools have real dependencies. Create it once:
  ```
  python -m venv venv
  venv/Scripts/python -m pip install -r requirements.txt     # Windows
  ./venv/bin/pip install -r requirements.txt                 # macOS/Linux
  ```
  Then either activate the venv or call `venv/Scripts/python tools/<tool>.py`. A bare `python` that
  resolves to a system interpreter will hit `ModuleNotFoundError` (requests, Pillow, google-*) — that
  error means you're not on the venv. `ffmpeg`/`ffprobe` and `node`/`npx` must be on PATH (not pip).

- **API keys** live in `.env` at the repo root (copy `.env.example`). Never commit `.env`.
  `ASSEMBLYAI_API_KEY` = transcription · `ELEVENLABS_API_KEY` = voice-isolate + SFX + music ·
  `GEMINI_API_KEY` = thumbnails · `NOTION_TOKEN` + `NOTION_LONGS_PAGE_ID` = the content tracker.
  **YouTube uses OAuth, not a key**: `tools/yt_upload.py` (upload) and
  `tools/yt_stats.py` (stats) authorize via a browser and cache tokens under `.youtube/`
  (git-ignored). One-time setup: see `tools/yt_upload_SETUP.md`, then `python tools/yt_upload.py auth`.

- **Notion is the tracker, the repo is the source of truth.** `python tools/notion_sync.py
  videos/<project> --apply` pushes a project's row: properties from `videos/<project>/notion.json`
  (committed) and the page body from its `script/script.md`. It is a **dry run without `--apply`**,
  and it **matches an existing row before creating one** — ideas get parked in that database months
  early under a rough working name, so a blind create makes a duplicate. Never hand-edit the script
  in Notion; edit the repo and re-run with `--resync`. `--list` shows every row and its stage.

- **The Remotion registry is generated:** after adding/renaming a shot, `cd remotion && npm run gen`
  (the render/frames scripts do NOT run it themselves). `npm run gen` discovers `src/shots/**` and
  writes `src/registry.gen.tsx` + `src/shots.manifest.json` (both git-ignored).

- **Media rules:** `media/library/` is for CROSS-VIDEO reusable assets only (each with a catalog).
  Anything generated FOR ONE video (screen-caps, example art) goes in `media/projects/<project>/`,
  referenced as `staticFile('projects/<project>/x')`. Reuse before you generate — check the catalogs.
  The face-reference kit for thumbnails is `media/library/faces/` — **you supply your own** images
  (git-ignored; see its README). No face kit, no face thumbnails.

- **B-roll defaults to REAL assets, not generic icons (brand.md §6).** When a beat names a real
  company/person/place/app/job-posting, fetch the real photo/logo (`WebSearch` + Browser tool + `curl`
  into `media/projects/<video>/real/`) or capture the real live page (`python tools/capture_web.py`,
  Playwright — `pip install -r requirements.txt` then `playwright install chromium` once per machine)
  instead of a lucide-icon graphic or a hand-drawn UI clone. `lib/kit.tsx`'s `RealPhotoKenBurns` and
  `lib/browser.tsx`'s `WebBrowserFrame` / `/fake-screencast` frame and animate it. Icons stay the
  fallback for abstract concepts only. Pairs with the `camera-snap` SFX cue (brand.md §10).

- **Committed vs git-ignored:** the repo carries the *reproducible pipeline* — `cuts.json`, edit
  plans, `timeline.json`, `edited-transcript.json`, TSX shots, SFX/music plans, catalogs. Raw AssemblyAI JSON
  (`videos/*/work/transcripts*/`) and `media/projects/*/real/` captures are git-ignored on purpose: the first embeds an unlisted
  `audio_url`, the second is other people's content. **Raw footage and master
  cuts NEVER go to git** (`videos/*/*.MP4`, `videos/*/reference/`), and neither do rendered
  previews/outputs, audio work files, or rendered face thumbnails (`.gitignore` covers all of it). The
  SFX/music library `clips/*.mp3` ARE committed (there is deliberately no blanket `*.mp3` ignore).

- **QA is not optional:** render frames and READ them before declaring a shot done; run
  `verify_cut.py` on every cut render (it catches ghost speech + A/V drift); audit the SFX cue sheet
  before mixing. Scratch renders/frames go in a scratch dir, not the project.

- **The brand contract is three files.** `brand.md`, `remotion/src/brand.ts`, `remotion/src/fonts.ts`.
  Nothing errors when they disagree — the docs just stop describing the videos. Change them together,
  or run `/brand-setup`.
