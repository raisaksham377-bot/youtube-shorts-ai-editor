---
name: build-vertical-reel
description: Build a split-frame vertical Short/Reel (1080x1920) from talking-head footage — real face cropped into the bottom half throughout, bespoke motion-graphic beats + word-by-word captions in the top half. Use when the user wants a "vertical short", "reel", "9:16 video", "split-frame" format, asks to keep their face on screen the whole time while graphics play above it, wants an in-context app/UI mockup moment (like clicking a button in a browser) without cutting away from their face, or hits caption-pill-covers-my-face / no-GPU-rendering / audio-duration-mismatch problems while building one. Covers the crop-offset technique for framing the face, the caption-pill safe zone, the top-half-only UI-mockup scene pattern, the full pipeline from raw footage to final SFX mix, and the environment gotchas (no NVIDIA GPU, AAC priming gap, comp-native transcode). Topic-agnostic — this is a layout/technique skill, not tied to any one video's content. Builds on /clean-cut, /make-tsx conventions, and /suggest-sfx; doesn't replace them.
---

# build-vertical-reel — the split-frame vertical Short/Reel format

A **format**, not a topic: bottom half of a 1080x1920 canvas is the real talking-head footage,
cropped and held in frame for the entire video; top half is a sequence of bespoke motion-graphic
beats timed to the narration; word-by-word captions sit near the bottom of the frame, below the
chin, for the whole runtime. The premise is **the host's face never leaves the screen** — which is
what makes this different from `/make-tsx`'s cutaway/overlay model (that format cuts AWAY from the
talking head for concept beats; this one never does). Everything here generalizes to any subject —
what follows is technique, learned building one real video, written so it applies the same way to
the next one on a completely different topic.

## The layout, top to bottom

```
AbsoluteFill (1080x1920)
 └─ background layer (full canvas — brand bg or a per-video treatment)
 └─ bottom-half video div: position:absolute, top:960, width:1080, height:960, overflow:hidden
     └─ OffthreadVideo, position:absolute, top:<CROP_OFFSET>px, left:0, width:1080, height:1920
 └─ top-half content: ONE bespoke scene or a generic statement card, height:960, swapped by beat
 └─ WordCaptionOverlay — always last (topmost), so captions survive every beat, including UI-mockup ones
```

The video element is oversized to the FULL 1920 canvas height and then shifted up by `CROP_OFFSET`
so the crop window (the bottom-half div, 0-960 in its own local coordinates) lands on the right part
of the frame. This is the whole trick — read on for how to find that number.

## 1. The crop-offset technique (framing the face)

You're taking a 1080x1920 source (or a source transcoded to that spec — see the environment section)
and showing only a 1080x960 WINDOW of it in the bottom half. `CROP_OFFSET` is the `top` value (usually
negative) applied to the full-height video element inside that clipped window.

**The formula**, once you have `CROP_OFFSET`:
```
canvas_y = 960 + (video_local_y - CROP_OFFSET)
```
`video_local_y` is a pixel row in the SOURCE footage (0 = top of frame); `canvas_y` is where that row
ends up on the final 1920-tall canvas. Anything with `canvas_y < 960` is invisible (cropped off above
the window) or `> 1920` (cropped off below).

**How to find `CROP_OFFSET` for a new video** (don't guess — measure):
1. Pick a candidate offset (start from 0 or from the previous video's value as a rough prior).
2. Render ONE still frame of the actual composition at that offset.
3. Look at it. Is the hairline/head cut off at the top of the bottom half? Offset is too small
   (not negative enough) — push it more negative to shift the video content up and reveal more head.
   Is there too much dead space above the head? Offset is too negative — pull it back toward 0.
4. Re-render, re-look, converge. Two or three iterations is normal. This is the same
   render-a-still-and-actually-look discipline as everything else in this repo — never ship a crop
   offset you haven't seen.
5. Once converged, use the formula above to compute `canvas_y` for any landmark you need later
   (eyes, chin, collar) without re-measuring by eye every time — you already have the mapping.

Worked example from one build (numbers are specific to that shoot's framing — re-measure for any
new footage, don't reuse them): `CROP_OFFSET = -140` put the hairline right at the top of the
bottom-half window (`canvas_y ≈ 960`), eyes/glasses landed around `canvas_y ≈ 1380-1470`, and the
chin/collar line fell around `canvas_y ≈ 1650-1850`. A different framing (wider shot, different
camera height, sitting vs standing) will produce completely different numbers — the FORMULA and the
measure-render-look LOOP are what transfer, not the constant.

## 2. The caption-pill safe zone (never covers the face)

Word-by-word captions (`WordCaptionOverlay` in `lib/kit.tsx`) are positioned with a `bottomPad` prop:
distance in px from the bottom of the full 1920 canvas to the bottom of the pill. Bigger `bottomPad`
= higher up the screen; smaller = closer to the bottom edge.

**The bug this format is prone to:** picking a `bottomPad` that lands the pill directly on the
eyes/glasses — it looks fine on a spot-check at one frame (a short word, small pill) and then fails
on a long word (wider/taller pill) or a different beat where the framing shifted. It was caught
exactly this way once already: reported by checking several different real rendered frames, not one.

**Where the pill should sit:** below the chin, at the collar/upper-chest line — clear of the face
under ANY word length, since this is normally a static-camera shot and the neck line doesn't move
frame to frame. Use the crop-offset formula from §1 to convert your measured chin/collar
`video_local_y` into a target `canvas_y`, then work backward: `bottomPad = 1920 - canvas_y_target`
(roughly — the pill has some height above its bottom edge, so bias `bottomPad` a little smaller than
the raw subtraction and verify).

**Verification checklist before calling a `bottomPad` value done** (all of these, not a subset):
- Render stills at several different words, not just one, including the SHORTEST word in the
  transcript (narrowest pill) and the LONGEST word (widest/sometimes tallest pill — check it doesn't
  wrap or grow into the danger zone).
- Render stills at different beats/scenes, since some beats may change what's visible in the bottom
  half (a full-width UI mockup in the top half doesn't affect this, but any future variation in the
  crop or framing would).
- Actually look at each still. Confirm the pill is below the jaw/chin line and hasn't drifted onto
  the neck's shadow or the eyes.

## 3. The top-half-only UI/app-mockup scene pattern

Sometimes a beat needs a concrete on-screen action — clicking a button, filling a form, scrolling a
page — shown as a real (mocked) UI rather than described in text. The instinct is to build it as its
own full-screen Remotion composition and drop it in via `<Sequence>`, the way `/make-tsx`'s cutaway
shots work elsewhere in this repo. **Don't do that here** — a full-screen cutaway hides the talking
head for its whole duration, which breaks this format's entire premise. Two real symptoms of getting
this wrong: the mockup covering the whole page instead of sharing it with the face, and the mockup
never actually appearing in the final composite because a full-screen `<Sequence>` was wired in as a
separate overlay instead of through the beat-scheduling system everything else uses (both happened in
one real build; both wasted a full render-and-review cycle each).

**Source the mockup from a REAL capture, not a hand-drawn clone (brand.md §6, creator feedback
2026-09-03).** Both example reels in `examples/shorts/` hand-coded a fake LinkedIn "Easy Apply"
UI from scratch (a `LinkedInTopScene` built purely from CSS boxes/colors chosen by eye) — it worked,
but it's a fabricated UI, and it's strictly worse than the real thing when a real thing exists (which
it almost always does: the actual job posting, the actual app, the actual company page). Before
hand-drawing ANY UI mockup, spend two minutes checking whether you can capture the real one instead:
`tools/capture_web.py` against the real public URL → real PNGs in `media/projects/<video>/real/` →
use those bitmaps as the scene's content (via `<Img src={staticFile(...)}>`, cropped/scaled to the
top-half region per point 3 below) instead of redrawing the page in JSX. Only fall back to a
hand-drawn clone when no real equivalent exists (a hypothetical/future UI, a competitor's page you
can't reach, a private/authenticated view) — and say so in a comment when you do.

**The correct pattern — treat it exactly like every other bespoke scene:**
1. Build a scene component `SomeUiMockupScene: React.FC<{ frame: number; holdFrames: number }>`,
   confined to `height: 960` (top half only), driven ENTIRELY by the `frame`/`holdFrames` props —
   not by calling `useCurrentFrame()` internally. It is not wrapped in its own `<Sequence>`; the
   outer beat-scheduler computes `localFrame = frame - card.startFrame` and passes it straight in,
   same as a statement card or an icon animation.
2. **Gotcha:** reusable chrome components (a browser-window frame, a phone-status-bar component,
   etc.) often call `useCurrentFrame()` internally to drive their OWN entrance animation. That reads
   the GLOBAL timeline frame, which is wrong once the scene is driven by a local frame instead of a
   `<Sequence>` — the entrance either fires at the wrong time or (if the beat starts well past frame
   0) never visibly fires at all. Either hand-roll a smaller version of the chrome sized for the
   top-half region (safest — full control over scale and timing), or, if reusing the shared
   component, pass its `appearAt` prop equal to the beat's GLOBAL start frame so its internal
   comparison lines up with when local frame 0 actually happens.
3. Scale every coordinate to fit inside 1080 wide x 960 tall with margin — don't just crop a
   1080x1920 mockup down to its top 960px, or you'll clip whatever chrome/base sits at the bottom
   (a laptop's base, a phone's home indicator, a browser's lower content). Re-derive box/button
   coordinates for the smaller canvas rather than reusing the full-screen version's numbers.
4. Any cursor/click micro-interaction (reusable from `lib/screencast.tsx`'s `sampleCursor` /
   `CursorPointer` / `CursorKey`): keyframe coordinates are VIEWPORT-FRACTION (0-1), not pixels — so
   they're canvas-size-agnostic. Just be consistent about multiplying by the REGION's own dimensions
   (e.g. `cur.x * 1080, cur.y * 960`) when placing the cursor, not the full 1920 canvas height.
5. Wire it into the same beat-scheduling table every other scene uses (a `Card`-like list with
   `startFrame`/`endFrame`/`scene`, dispatched by a chain of `if (activeCard.scene === 'x') return
   <XScene .../>`). This means the SAME mockup component can appear at multiple points in the
   timeline for free — just add a second entry to the schedule referencing the same scene — instead
   of duplicating the component or wiring a second bespoke `<Sequence>`.

## 4. Full pipeline, raw footage → final delivered file

This format is layered ON TOP of the existing pipeline, not a replacement for it:

1. **`/clean-cut`** on the raw talking-head footage → an approved master cut + `edited-transcript.json`
   (word-level timestamps in the master's timeline). Unchanged from the standard pipeline — do this
   first, exactly as documented there, including its own user-audit gate.
2. **Comp-native transcode** — Remotion's `OffthreadVideo` needs a decode-friendly source. Whatever
   the master's native spec, transcode a copy to this format's target (1080x1920, 30fps, 8-bit H.264):
   ```
   ffmpeg -i master.mp4 -vf "scale=1080:1920" -r 30 -c:v libx264 -pix_fmt yuv420p -c:a copy master-comp-native.mp4
   ```
   Skipping this and pointing `OffthreadVideo` at a high-bitrate/odd-fps/10-bit master starves the
   decoder during render — duplicated frames, visible stutter, perceived desync (documented in
   `/clean-cut` too; it bites here just as hard since the video plays for the ENTIRE runtime, not
   just cutaway spans).
3. **Find `CROP_OFFSET`** per §1 above, and build the split-frame shell (background + cropped
   bottom-half video div + caption overlay).
4. **Read the transcript**, decide the beat list, and author one bespoke scene per beat that needs
   punch (icons/animation sized generously for the top-half region — this format reads better with
   big, confident graphics than small restrained ones) or a generic statement card for plain-text
   beats. Any beat needing a concrete UI moment follows §3.
5. **`npm run gen`** after adding/renaming any scene file (the shot registry is generated, not
   hand-maintained — same rule as the rest of this repo).
6. **Render proof stills** at each new beat's key frames (entrance, a mid-hold frame, and — for
   anything caption-adjacent — per §2's checklist) and actually look at them before moving on.
   `npx tsc --noEmit` first to catch type errors cheaply, before spending render time.
7. **Render the full composite.**
8. **A/V duration gate** — `ffprobe -show_entries stream=duration` on `v:0` vs `a:0`. The VIDEO
   track duration must equal the intended composition length exactly. See the AAC note below for why
   the audio track alone is expected to differ slightly at this stage.
9. **SFX pass** (`/suggest-sfx` conventions apply as-is): author/re-use a `sfx-plan.json`, get it
   audited, then mix: `python tools/mix_sfx.py <path/to/sfx-plan.json>`. **Gotcha:** the script's
   positional argument is the PLAN FILE path, not the project directory — passing a directory fails
   with a confusing `PermissionError` (it tries to `open()` the directory itself), not a helpful
   "wrong argument" message.
10. **Re-verify durations** on the SFX-mixed output (video track should still match exactly; the mix
    step also tends to bring the audio track back in line). Pull a few final stills at the changed
    beats to confirm nothing regressed, then deliver.

Whenever a beat changes later, only re-render from step 6 onward for the affected span — but the
A/V gate (step 8) and a fresh SFX mix (step 9) are cheap enough to just always re-run on the whole
file rather than trying to patch a segment in place.

## 5. Environment gotchas (real, not hypothetical — hit them once each)

- **No NVIDIA GPU on some machines.** `h264_nvenc` / `hevc_nvenc` and `-hwaccel cuda` fail with
  `Cannot load nvEncodeAPI64.dll` on a machine with no NVIDIA card. Fix: fall back to CPU encoders —
  `libx264` for preview-grade renders, `libx265` for final-grade — and drop the `-hwaccel cuda` flag
  entirely (an empty hardware-accel option list). This is a real, working fallback, not a
  degraded/broken mode — just slower. Keep it easy to revert (a single constant/flag) for anyone
  running the same tools on a GPU-equipped box later.
- **The AAC audio-priming gap is normal, not a bug.** Every render tends to show the audio track
  measuring a small amount (roughly 40-55ms) LONGER than the video track when probed independently —
  this is a well-known, consistent AAC-encoder artifact (encoder priming samples), not drift and not
  something to chase or "fix" with padding/trimming. Gate correctness on the VIDEO track matching the
  intended duration (step 8 above); don't fail a render over a sub-60ms audio-track mismatch that
  reproduces identically every time. If the gap ever grows well beyond that range, or the audio is
  SHORTER than the video, THAT is a real problem worth investigating — the small, consistent,
  audio-longer case is not.
- **Comp-native transcode is not optional** — see step 2 above. This is the single most common
  "why does my render stutter" cause when the source wasn't prepared for `OffthreadVideo`.
- **(Windows/Git-Bash) venv Python needs drive-letter paths.** `venv/Scripts/python.exe` is a
  Windows-native binary — it rejects MSYS-style `/c/...` paths some Git-Bash tooling produces. Pass
  `C:\...`-style paths when invoking Python tools from Git Bash on Windows.

## Principles (apply these)

- **The face is the constant; graphics are the variable.** Every design decision (crop offset,
  caption position, mockup scene sizing) starts from "does the face stay visible and legible" and
  works outward from there.
- **Measure, don't guess, and verify by looking.** Crop offsets, caption safe zones, and any new
  scene's timing all get found by rendering a real still and looking at it — never asserted from
  arithmetic alone, and never confirmed from a single frame when a range of words/beats could break it.
- **Big, confident graphics.** This format's top half reads better with icons and text sized
  generously for a 1080x960 region than with restrained desktop-sized graphics — when in doubt, size
  up.
- **Reuse the beat-scheduling system for everything**, including UI mockups — a second appearance of
  the same scene is a second table entry, not a second component or a second `<Sequence>`.
- **Topic-agnostic.** Nothing in this skill should reference any one video's script or subject —
  when writing scenes for a specific video, keep the content decisions (what the beats say) separate
  from the technique decisions (how the format works) described here.

Done = the face is on screen and legible for the entire runtime, captions never touch it at any
word length, any UI-mockup beats share the frame with the face instead of hiding it, the A/V
duration gate passes, the SFX mix is applied and re-verified, and every new beat has been confirmed
by looking at a real rendered still — not asserted.
