# Setup

About 15 minutes the first time. Everything runs locally except the API calls you choose to enable.

## 1. Prerequisites

| Tool | Version | Get it |
|---|---|---|
| Claude Code | current | <https://claude.com/claude-code> |
| Python | 3.10+ | <https://python.org> |
| Node.js | 18+ | <https://nodejs.org> |
| ffmpeg + ffprobe | any recent | Windows: `winget install Gyan.FFmpeg` · macOS: `brew install ffmpeg` · Linux: your package manager |
| Git | any | <https://git-scm.com> |

`ffmpeg`, `ffprobe`, `node` and `npx` must be on your PATH. Python packages go in a virtual environment (next step), not globally.

## 2. Clone and install

Run everything from the repo root.

```bash
git clone https://github.com/raisaksham377-bot/youtube-shorts-ai-editor
cd youtube-shorts-ai-editor

# Python tools (virtual environment at the repo root)
python -m venv venv
venv/Scripts/python -m pip install -r requirements.txt      # Windows
./venv/bin/pip install -r requirements.txt                  # macOS / Linux

# Real-page capture: download the Chromium that Playwright drives (once per machine, about 115 MB)
venv/Scripts/python -m playwright install chromium          # Windows
./venv/bin/python -m playwright install chromium            # macOS / Linux

# Remotion (the renderer) and its shot registry
cd remotion
npm install
npm run gen
cd ..
```

> **Why the venv matters.** A bare `python` that points at your system interpreter fails with `ModuleNotFoundError`
> (`requests`, `Pillow`, `playwright`, `google-*`). That error always means "you are not on the venv". Either activate it or call
> `venv/Scripts/python tools/<tool>.py`.

## 3. API keys

```bash
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
```

Open `.env` in a text editor and fill in what you use. **Never paste keys into a chat with Claude, and never commit `.env`**
(it is git-ignored). Edit the file yourself, then tell Claude "done".

| Key | Needed for | Works without it? |
|---|---|---|
| `ASSEMBLYAI_API_KEY` | `/clean-cut` transcription (step 1) | **No.** It is the one required key. Free tier is enough to start |
| `ELEVENLABS_API_KEY` | generating **new** SFX / music beds, `/clean-audio` voice isolation | **Yes.** The repo ships 36 SFX clips and 6 music beds, and `/clean-audio` has a local RNNoise method |
| `GEMINI_API_KEY` | thumbnails (long-form `/packaging`, `/thumbnail`) | Yes. Shorts do not need it |
| `FAL_KEY` | `tools/gen_video.py` generated clips (generic motion, **no lip-sync**) | Yes. Optional |
| `NOTION_TOKEN`, `NOTION_LONGS_PAGE_ID` | `tools/notion_sync.py` content tracker | Yes. Optional |

**YouTube upload uses OAuth, not a key.** One-time setup: [tools/yt_upload_SETUP.md](../tools/yt_upload_SETUP.md), then
`python tools/yt_upload.py auth`. Tokens are cached in `.youtube/` (git-ignored).

Two things worth knowing about ElevenLabs sound-effect generation:

- the Sound Effects API refuses clips shorter than **0.5 s** (`HTTP 400 invalid_generation_settings`), so a `duration_s` below 0.5
  in `media/library/sfx/palette.json` will fail;
- an empty `ELEVENLABS_API_KEY=` line makes `gen_sfx.py` stop with "key not set". That is expected, not a bug.

## 4. Check that it works

```bash
ffmpeg -version | head -1
venv/Scripts/python tools/gen_sfx.py --dry-run          # "to generate: 0" means the shipped library is intact
cd remotion
npx tsc --noEmit                                         # no output = typecheck passes
npm run studio                                           # opens Remotion Studio; open "ShortsFormatDemo"
npx remotion still src/index.ts ShortsFormatDemo ../demo.png --frame=170    # renders one frame to ../demo.png
```

If `ShortsFormatDemo` shows a navy photo placeholder in the top half and a grey silhouette with a caption word in the bottom half,
the whole render chain works.

## 5. Open Claude Code in the repo

```bash
claude
```

Claude reads `CLAUDE.md` automatically and picks the right skill from your request. First thing to say:

> set up my brand

That runs `/brand-setup`, which rewrites `brand.md`, `remotion/src/brand.ts` and `remotion/src/fonts.ts` together so your Shorts
carry your name and colours instead of the template's. Then continue with [PROMPTS.md](PROMPTS.md).

## Windows notes

- Use **PowerShell** or **Git Bash**. In Git Bash, write paths with forward slashes. A path that ends in a backslash inside double
  quotes (`ls "C:\x\y\"`) swallows the closing quote and fails with `unexpected EOF`.
- `venv/Scripts/python.exe` is a Windows binary and rejects MSYS-style `/c/...` paths from some Git Bash tooling. Pass
  `C:\...` or `C:/...` paths to Python.
- **No NVIDIA GPU?** `tools/render_cuts.py` and `tools/make_proxy.py` already use CPU encoders (`libx264` / `libx265`). On a GPU
  machine you can switch back to `h264_nvenc` / `hevc_nvenc`: the comments at the top of each file say exactly what to revert.
  CPU `libx265` at the final quality is slow. Previews are quick.

## Where things go

| You do | Goes to |
|---|---|
| Drop raw footage | `videos/video-1/` (git-ignored) |
| Ask for the cut | `videos/video-1/work/analysis/cuts.json`, `work/edited-transcript.json` |
| Ask for the Short | `remotion/src/shots/video-1/` |
| Real photos / page captures | `media/projects/video-1/real/` (git-ignored by default) |
| Final files | `videos/video-1/output/` (git-ignored) |

Next: [PIPELINE.md](PIPELINE.md).
