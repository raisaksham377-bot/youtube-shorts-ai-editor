# Troubleshooting

Nearly every entry here is something we actually hit while building the two reference Shorts. Format: **symptom**, cause, fix.

## Python and tools

**`ModuleNotFoundError: No module named 'requests'` (or `PIL`, `playwright`, `google`)**
You are running the system Python, not the venv. Call `venv/Scripts/python tools/<tool>.py` (Windows) or
`./venv/bin/python tools/<tool>.py`, or activate the venv. Install with `pip install -r requirements.txt` *inside* the venv.

**`Python was not found; run without arguments to install from the Microsoft Store` (Windows)**
The Store alias is shadowing Python. Use the venv interpreter by full path, or turn the alias off in *Settings → Apps → Advanced app
settings → App execution aliases*.

**`ModuleNotFoundError: No module named 'playwright'`, or Chromium missing**
`pip install -r requirements.txt` and then, once per machine, `python -m playwright install chromium` (about 115 MB).

**Git Bash: `unexpected EOF while looking for matching '"'`**
A path ending in a backslash inside double quotes (`ls "C:\x\y\"`) escapes the closing quote. Use forward slashes
(`"C:/x/y"`) and no trailing separator.

**A `venv/Scripts/python.exe` tool rejects a `/c/...` path**
It is a Windows binary. Pass `C:\...` or `C:/...`.

**`tools/format_transcript.py` → `FileNotFoundError … work/analysis/takes-clip1.txt`**
The output folder does not exist yet. `mkdir -p videos/video-1/work/analysis` first.

**`verify_cut.py` → `FileNotFoundError … transcripts/preview.json`**
`transcribe.py` only processes `work/audio/*.wav`, and the clip id is the file stem. Extract the render's audio to
`work/audio/preview.wav`, then `python tools/transcribe.py videos/video-1 --clips preview --force`. Running `--clips preview` with no
such WAV silently does nothing.

## Rendering and encoding

**`Cannot load nvEncodeAPI64.dll` or an NVENC error**
You have no NVIDIA GPU. `tools/render_cuts.py` and `tools/make_proxy.py` already use `libx264` / `libx265`; if you edited them back to
NVENC, revert. `libx265` at final quality is slow by nature; previews are quick.

**ffmpeg: `No option name near '30'` / `Error parsing a filter description`**
`r=30` is an output option, not a filter. Inside `-vf` use `fps=30`; or put `-r 30` outside the filter graph.

**The render stutters, frames repeat, or lip-sync feels off**
Remotion's `OffthreadVideo` is starved by a heavy source (4K, 10-bit HEVC, 60 fps). Transcode a comp-native copy first (1080 wide,
30 fps, 8-bit H.264, `-c:a copy`). See [PIPELINE.md](PIPELINE.md) step 2.

**My new composition is not in Remotion Studio**
Run `cd remotion && npm run gen` after adding or renaming a shot, and read its output. `gen-registry` **skips a duplicate
composition `id`** and only prints `DUPLICATE id, skipping`. Give every Short its own `id`.

**Bundling takes a long time, or "Copying public dir 80 MB"**
Remotion copies `media/` (the public dir) on every bundle. Keep only comp-native footage and the assets a Short needs under
`media/projects/<video>/`; do not leave raw footage there.

**Audio is about 40–55 ms longer than video**
That is the normal AAC priming gap, consistent across renders. Gate on the **video** stream equalling the composition length. Only
worry if the audio is *shorter*, or the gap grows well past 60 ms.

**A long render "times out" in Claude Code**
It is not failing. Claude moves it to the background and checks the log; the progress line prints once per percent, so the log is long.

## Footage

**Faint logo fragments in the corners of the face crop**
The crop window touches a watermark tile. Shrink the window, keep the 9:8 aspect, and re-check at the **final scale** on many
timestamps. A leak invisible in a small thumbnail is obvious once scaled 3–4×. See [AVATAR-FOOTAGE.md](AVATAR-FOOTAGE.md).

**The face is stretched**
The crop window is not 9:8 (1080 : 960). Choose `W:H` with that aspect before scaling.

**A levels/curves adjustment will not remove a watermark**
We tried. It fades on light areas and gets worse on dark ones. Crop around it instead.

## Sound

**`ELEVENLABS_API_KEY not set in .env — cannot generate`**
The line is present but empty. Add the key yourself in `.env`. You do not need it to *use* the shipped SFX and music; only to
generate new sounds.

**`HTTP 400 invalid_generation_settings … duration_seconds … greater or equal to 0.5`**
The Sound Effects API will not make a clip shorter than 0.5 s. Set `duration_s` to 0.5 or more in `palette.json`.

**A sound cue is inaudible**
Measure it in a tight window ([SOUND-AND-MUSIC.md](SOUND-AND-MUSIC.md)). Short percussive clips need a few dB more gain than
sustained ones, and cues that sit fully under continuous speech will not measure at any gain; move them into a pause or cut them.

## Git and privacy

**`warning: CRLF will be replaced by LF`**
Harmless on Windows; `.gitattributes` normalises line endings.

**What must never be committed**
`.env`, `.youtube/` (OAuth tokens), raw footage, renders. All git-ignored. Also ignored on purpose: `videos/*/work/transcripts*/`,
because raw AssemblyAI JSON embeds an unlisted `audio_url` pointing at your uploaded audio, and `media/projects/*/real/`, because
captures of other people's sites and photos are not yours to republish. If you ever commit one by accident, treat it as published
and rotate or remove it.

## Still stuck?

Open an issue with: the command you ran, the full error, your OS, and the output of `ffmpeg -version | head -1`, `node -v` and
`python --version`. Please remove any key or personal URL first.
