# Building blocks

Small compositions from the early work on the Shorts format. Copy a file into `remotion/src/shots/<name>/` (the imports assume that
depth), run `cd remotion && npm run gen`, and open it in Studio.

| File | Composition id | What it shows |
|---|---|---|
| `ProofSplitFrame.tsx` | `ProofSplitFrame` | the proof of concept for the split frame: a top graphic over **unmuted** footage cropped into the bottom half (needs a slice at `media/projects/my-short/proof-slice.mp4`) |
| `WordCaptions.tsx` | `WordCaptions` | the word-by-word caption treatment on a plain background |
| `WordCaptionsOverFootage.tsx` | `WordCaptionsOverFootage` | the same captions over real footage, to judge legibility and the face-safe position (needs `hook-line-slice.mp4`) |
| `VerticalStatement.tsx` | `VerticalStatement` | a full-height statement-card template for vertical video |
| `LinkedInApply.tsx` | `LinkedInApply` | a hand-built phone-style "Easy Apply" mockup, 1080 × 1920 |
| `LinkedInApplyDesktop.tsx` | `LinkedInApplyDesktop` | a hand-built laptop with a browser window and an animated cursor |

The two LinkedIn files are **hand-drawn imitations**. They are kept as examples of the cursor and button-press animation. For real
product pages, capture the real thing instead ([REAL-ASSETS-BROLL](../../../docs/REAL-ASSETS-BROLL.md)).

Two of these need a short footage clip that is not shipped; use the stand-in recipe in [../../README.md](../../README.md).
