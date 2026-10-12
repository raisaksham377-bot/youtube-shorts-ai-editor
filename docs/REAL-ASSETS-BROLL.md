# Real assets for B-roll

**The rule (`brand.md` §6):** when a beat names something a viewer can recognise (a company, a person, a city or country, a real
app, a job posting), the top half shows a **real photo or a real screenshot of it**. Not a generic icon, not a hand-drawn
imitation. Icons and text cards are the fallback for abstract ideas (a stat, a process step, an emotion) that have nothing real to
show.

Why: real pictures read as proof, they make the Short look produced by a person who did research, and a screen recording of the
actual page beats a drawn mockup of it every time.

> **Honest status.** The two reference reels in `examples/shorts/` were built *before* this rule and use icon-style and
> hand-drawn beats. The rule, the tooling and the components below are in place and tested; rebuilding a reel with real assets is
> the natural first exercise.

## What to show, and how to get it

| The narration names… | Show | Get it with | Animate with |
|---|---|---|---|
| a company, its logo, a person | the real logo / photo | search, then download from the entity's own site, Wikipedia / Wikimedia Commons, or its profile page | `RealPhotoKenBurns` |
| a city, country, landmark | a real photo or map | Wikimedia Commons, official tourism or press pages | `RealPhotoKenBurns` |
| a website, app, job posting | the real live page | `tools/capture_web.py` (Playwright) | `WebBrowserFrame` (one page) or `/fake-screencast` (click-through) |
| a product or object | a real product photo | the maker's press or product page | `RealPhotoKenBurns` |
| an abstract idea | a motion graphic or `TopCard` | built in TSX | the scene's own animation |

Claude does the searching and downloading itself (web search, its browser tools, `curl`), so you only name the topic. If you have
exact files you want used, drop them into `media/projects/<video>/real/` and say so.

## Workflow A: capture a live page

`tools/capture_web.py` drives a real Chromium through a small JSON spec and saves one PNG per `shot`, plus a `manifest.json`
mapping each image to its URL label and tab title.

```json
{
  "viewport": [1280, 900],
  "out_dir": "media/projects/video-1/real",
  "steps": [
    { "goto": "https://example.com/" },
    { "wait": 1200 },
    { "shot": "home", "url_label": "example.com", "title": "Example Domain" }
  ]
}
```

```bash
python tools/capture_web.py --spec videos/video-1/work/capture-spec.json
```

Steps available: `goto`, `wait`, `wait_for`, `click`, `fill`, `press`, `scroll`, `eval`, `shot`. The tool header documents all of
them, including booting VS Code in the browser for developer content. A worked spec is in
[`examples/shorts/outreach-pitch/work/capture-spec.json`](../examples/shorts/outreach-pitch/work/capture-spec.json).

First run on a machine needs the browser download: `python -m playwright install chromium`.

**Use the captures:**

- *One static page* (highlight a line, drift slowly): put the image inside `WebBrowserFrame` (`remotion/src/lib/browser.tsx`).
- *A click-through* (cursor eases to a button, ripples, the URL bar changes): `/fake-screencast` turns the screenshots into a
  simulated screen recording with `Screencast` (`remotion/src/lib/screencast.tsx`). It is a real state capture replayed with motion,
  not a redrawn mockup.

Two vertical-format gotchas:

- `Screencast` reads the **global** frame, so add the beat's `startFrame` to every `enterAt`, cursor key and click frame. Or hand-roll
  the scene with local frames. `sampleCursor` and `CursorPointer` are exported for exactly that.
- Size the `box` for a 1080 × 960 region. Do not crop a 1080 × 1920 mockup to its top half, or you will clip its base.

## Workflow B: a real photo with motion

Download the file into `media/projects/<video>/real/`, then:

```tsx
import { RealPhotoKenBurns } from '../../lib/kit';

<RealPhotoKenBurns
  src={staticFile('projects/video-1/real/city.jpg')}
  frame={localFrame}            // the beat's local frame (see SHORTS-FORMAT.md)
  holdFrames={holdFrames}
  focal={{ x: 0.5, y: 0.4 }}    // 0..1 point of the image to push toward
  boxW={860} boxH={700}         // fits the 1080 × 960 top half with margin
/>
```

It fades in and out over 10 frames and pushes from 1.0× to 1.12× over the whole hold (`from` / `to` to change). It is driven
by the local frame, so it works inside the beat scheduler. A photo that does not move reads as a slide. Always give it motion.

## The sound that goes with it

A real-asset reveal gets the **`camera-snap`** cue, a crisp shutter click with a tiny wind-on tick, so the sound says "this is a
real picture" and stays distinct from the UI clicks used elsewhere. It is in `media/library/sfx/` already. See
[SOUND-AND-MUSIC.md](SOUND-AND-MUSIC.md).

## Sourcing hygiene (please read)

- Prefer **official or openly licensed** sources: the entity's own site or press kit, Wikipedia / Wikimedia Commons, a company's
  own profile page. Avoid random image-search results.
- A company's own logo used to *refer to that company* is low-risk. A stranger's copyrighted stock photo is not worth it when an
  official source exists, especially for anything you publish.
- Do not publish other people's photos or personal data you captured. `media/projects/*/real/` is **git-ignored** in this repo for
  that reason. If you do want to commit a capture, force-add it deliberately.
- Real captures can include signed-in or personal data. Capture logged-out pages, or crop and blur before use.

## Related

[SHORTS-FORMAT.md](SHORTS-FORMAT.md) · [REAL-ASSETS in brand.md §6](../brand.md) · skills `make-tsx` (principle P3),
`fake-screencast`, `build-vertical-reel`.
