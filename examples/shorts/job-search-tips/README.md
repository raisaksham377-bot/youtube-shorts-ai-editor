# Reference Short #1: job-search tips (about 70 s)

A job-search-psychology explainer: why a long rejection streak makes applying feel dangerous, and five small fixes.

| | |
|---|---|
| Composition | `ExampleShortJobSearch` · 1080 × 1920 · 30 fps · 69.87 s |
| Footage | AI-avatar read, 720 × 1280, clean full-bleed export (about 70.9 s raw) |
| Face strategy | **offset crop** (`CROP_OFFSET = −140`), see [SHORTS-FORMAT](../../../docs/SHORTS-FORMAT.md) A |
| Beats | 14 (bespoke scenes plus a hand-built mockup used twice) |
| Backdrop | `WarmGradientBg`, a deliberate off-brand orange/yellow variant requested for this reel |

## What to learn from it

- **A beat scheduler driven by real word times.** Every window in `CARDS` comes from a word's start in `work/edited-transcript.json`.
  Each scene is a pure function of a local `frame` and `holdFrames`.
- **Scenes sized for a 1080 × 960 region.** Big icons, a counting stat, a staggered three-item reveal, a breathing circle, a scale.
  Bigger than they would be in a 16:9 cutaway.
- **A top-half-only UI mockup** (`LinkedInTopScene`) that shares the frame with the face instead of cutting away to a laptop. It is
  hand-built from CSS. Today you would capture the real page instead ([REAL-ASSETS-BROLL](../../../docs/REAL-ASSETS-BROLL.md)).
- **A single-take avatar cut.** `work/cuts.json` is one keep span over the whole clip and no cuts; the QA and verify gates still ran.

## Files

`FullReel.tsx` the composition · `work/cuts.json` · `work/edited-transcript.json` (203 words, ms) · `work/sfx-plan.json` ·
`work/keyterms.txt`.

## Honest notes

- B-roll here is icon-style, from before the real-assets policy.
- The footage is not shipped. See [../../README.md](../../README.md) for a stand-in so you can still preview it.
- The content is an AI-avatar script, included as a structural reference, not as advice.
