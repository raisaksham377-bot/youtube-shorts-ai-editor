# Examples

Worked examples to read before you build your own. Claude reads them too when it builds a Short.

| Folder | What it is |
|---|---|
| [`shorts/job-search-tips/`](shorts/job-search-tips/) | a **70 s** reference Short: job-search psychology tips, full-bleed avatar footage, offset crop, 14 beats |
| [`shorts/outreach-pitch/`](shorts/outreach-pitch/) | a **107 s** reference Short: a cold-outreach pitch, watermarked and letterboxed avatar footage, pre-crop, 18 beats, 24 sound cues, music bed and final mix |
| [`shorts/building-blocks/`](shorts/building-blocks/) | small footage-independent pieces: a proof-of-concept split frame, caption demos, a statement-card template, two hand-built LinkedIn mockups |
| [`thumbnails/`](thumbnails/) | upstream's proven thumbnail prompt recipes (long-form), referenced by the `/thumbnail` skill |

> In code comments, `video-4` means `job-search-tips` and `video-5` means `outreach-pitch` (the project numbers they had while being made).

**Both reference reels pre-date the real-assets policy.** Their top halves are icon-style and hand-built beats. They are examples of
the *structure* (beat scheduler, crop, captions, sync to words, sound plan), not of the finished B-roll standard. Rebuilding one with
real photos and page captures is the suggested first exercise ([PROMPTS.md](../docs/PROMPTS.md)).

## What each reel folder contains

```
FullReel.tsx            the composition: scenes, beat schedule, words, face footage box, captions
work/cuts.json          the cut (a single keep span for an avatar read)
work/edited-transcript.json   word times in ms, the spine every beat is synced to
work/sfx-plan.json      the sound design cue sheet
work/keyterms.txt       names given to the transcriber
README.md               what was done, and what to learn from it
```

Not included, on purpose: the footage, rendered videos, raw transcripts and real-page captures.

## Preview a reference reel without any footage

The reels expect your face footage at `media/projects/my-short/master-comp-native.mp4`. Make a stand-in (a test pattern plus a tone):

```bash
mkdir -p media/projects/my-short
ffmpeg -f lavfi -i "testsrc2=size=1080x960:rate=30" -f lavfi -i "sine=frequency=220:sample_rate=48000" \
       -t 110 -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest media/projects/my-short/master-comp-native.mp4
```

Then copy a reel into the Remotion shots folder, register it, and open Studio:

```bash
cp -r examples/shorts/outreach-pitch remotion/src/shots/outreach-pitch      # Windows: Copy-Item -Recurse
cd remotion && npm run gen && npm run studio                                 # open "ExampleShortPitch"
```

The imports in each file assume exactly that location (`remotion/src/shots/<name>/`). `job-search-tips` expects the stand-in at the
same path (it also works with a full 1080 × 1920 clip, since it uses the offset-crop approach). Remember to delete the copied folder (or
keep it out of commits) when you are done.
