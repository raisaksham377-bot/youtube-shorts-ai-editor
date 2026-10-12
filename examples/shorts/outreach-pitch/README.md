# Reference Short #2: a cold-outreach pitch (about 107 s)

A personal pitch for an operations-manager role at a robotics-data company: the problem the company has, what the candidate has
built, and a closing ask. It is the longer, more complete of the two references, and the one that went all the way through
`/assemble`.

| | |
|---|---|
| Composition | `ExampleShortPitch` · 1080 × 1920 · 30 fps · 107.47 s |
| Footage | AI-avatar read, 256 words in 112 s (about 2.3 words per second), **free-tier export** |
| The problem | the picture is 16:9 and **letterboxed** inside a 9:16 canvas, with a **tiled watermark** across the whole frame |
| Face strategy | **pre-crop** to a watermark-free 9:8 window, scaled to exactly 1080 × 960, see [AVATAR-FOOTAGE](../../../docs/AVATAR-FOOTAGE.md) |
| Beats | 18 bespoke scenes (intro, stats, chain, shield, globe with location chips, checklist, call to action) plus one text card |
| Sound | 24 cues, two layered "hero" moments (a riser into an impact; a riser into a send sound) |
| Music + mix | `tech-pulse` bed (an `ambient-pad` version was also auditioned), loudness-normalised to about −14.3 LUFS at −1.5 dBTP |

## What to learn from it

- **The watermark crop**, from measurement to a window that survives the final scale: the clearest worked example of "validate on many
  frames at the output size".
- **Beats mapped to a script word by word.** `work/edited-transcript.json` has all 256 word times; the schedule in `FullReel.tsx`
  turns them into frames. Long sentences are split across two beats.
- **A sound plan that follows the house taste**: a click on each *enumerated* country, two layered hero moments, silence elsewhere. Read
  `work/sfx-plan.json` next to the composition.
- **Verification by numbers**: the hero cues raised the local peak from about −7 dB to −0.6 dB; the final mix measured −14.2 LUFS.
- **A reproducible capture spec**: `work/capture-spec.json` shows how real pages of the target company were captured.

## Files

`FullReel.tsx` · `work/cuts.json` · `work/edited-transcript.json` · `work/sfx-plan.json` · `work/keyterms.txt` ·
`work/capture-spec.json`.

## Honest notes

- The B-roll in the delivered video is icon-style. The real-asset capture (the company's real site and job posting) was done
  *afterwards* to prove the workflow, and was not re-applied to this reel. The captured images are not shipped (third-party content).
- This is a real pitch addressed to a specific company. It is included for structure and sync, not as a template to copy. Replace
  the script with your own.
- Because the face is a 6× upscale of a small window, it is soft. That is the cost of a free, watermarked source.
