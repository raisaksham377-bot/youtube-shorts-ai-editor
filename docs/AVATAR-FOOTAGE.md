# Using AI-avatar footage as your talking head

Both reference Shorts in this repo were built from **AI-avatar footage** (a script read by an avatar), not a camera. The pipeline
does not care where the face comes from, but avatar exports have quirks. This page is what we hit, measured, and the checks that
would have saved us time.

> Everything about third-party plans, prices and limits below was observed in **September 2026** on a free HeyGen account and a free
> OpenArt account. These change. Treat the numbers as an example of the order of magnitude, and confirm on the vendor's pages.

## 1. Inspect the export before you build anything

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of csv=p=0 avatar.mp4
ffmpeg -ss 10 -i avatar.mp4 -frames:v 1 frame.png          # then open frame.png and LOOK
python tools/find_content_box.py avatar.mp4 --at 10         # is the picture padded or letterboxed inside the frame?
```

Look for three things: **padding bars** (the real picture is smaller than the canvas), a **watermark** (even a faint tiled one), and
the **face size** (a face that fills only a quarter of a 720-wide frame will be upscaled a lot).

## 2. Case study: two exports from the same tool

| | Short #1 (`job-search-tips`) | Short #2 (`outreach-pitch`) |
|---|---|---|
| Canvas | 720 × 1280 | 720 × 1280 |
| Picture | full-bleed close-up, face fills the frame | a 16:9 picture (about 720 × 405) centred in the canvas, padding above and below |
| Watermark | none | a tiled logo across the **whole canvas**, including over the face and shirt |
| Export | clean | free tier |
| Strategy | offset crop (`CROP_OFFSET`), see [SHORTS-FORMAT](SHORTS-FORMAT.md) A | **pre-crop** to a watermark-free window, see [SHORTS-FORMAT](SHORTS-FORMAT.md) B |

### What we tried to remove the watermark

- **Re-exporting without it.** Not possible on the free plan.
- **Reversing it with a levels adjustment** (`colorlevels`, assuming a uniform translucent grey overlay). It did not work. On the
  light wall the logo faded, but on the dark shirt it got *more* visible: a stretch amplifies every difference equally and cannot
  cancel an overlay whose effect differs per pixel colour. Do not bother.
- **Covering it with graphics.** Not viable here: the watermark ran across the face footage itself, which has to stay uncovered.

### What worked: crop to where the watermark is not

The tiles sit on a regular grid, so there are gaps. We measured the picture's bounding box, then searched for a window that avoids
every tile.

1. `find_content_box.py` located the real picture: rows 437–842 of the 1280-tall canvas (about 437 rows of padding above and below).
2. The tiles were found by inspecting frames. In the rows we could measure cleanly, the gap between two tile columns was only about
   178 px wide, so the safe window had to be small.
3. We tested candidate windows **at the final output scale**, not as small thumbnails. A crop that looked clean as a 280 × 250
   thumbnail leaked watermark fragments at the corners once scaled up about 3.9× to 1080 × 960. A 5 px sliver becomes 19 px.
4. The window that held up across 18 sampled timestamps, in native coordinates: `crop=180:160:270:518`. It is **9:8**, the
   aspect of the 1080 × 960 window, so nothing is stretched, scaled with `lanczos`.

```bash
ffmpeg -i master.mp4 \
  -vf "crop=180:160:270:518,scale=1080:960:flags=lanczos,eq=brightness=0.02:contrast=1.06:saturation=1.08,vignette=PI/5,fps=30" \
  -c:v libx264 -pix_fmt yuv420p -c:a copy media/projects/video-1/master-comp-native.mp4
```

The `eq` and `vignette` are a light grade (a touch brighter, soft dark corners) that also draws the eye to the face.

**The trade-off, honestly:** a 180 × 160 window out of a 720-wide frame, scaled to 1080 wide, is a 6× upscale. The face is soft. It
is fine for a Short on a phone, and it is the price of a free, watermarked source. A clean export or a real camera clip will look
sharper, and then you would use the offset crop and keep the whole shoulder line.

### The general lesson

> Validate a crop on **many frames, at the final scale**. Static camera or not, check the extremes of the script: mouth open
> widest, head turned, the longest word's caption.

## 3. Getting avatar footage: what we hit

We tried to generate a *new* avatar video from a still photo plus a script, using the connectors available to Claude:

| Route | Result |
|---|---|
| HeyGen "Video Agent" (prompt in, finished video out) | refused on the free plan: *"Video Agent isn't included in the free plan"* (HTTP 429, `quota_exceeded`) |
| HeyGen structured tools (`create_photo_avatar`, `create_video_from_image`) | rejected every call: they take a nested object for the image, and the tool bridge in our session delivered it as a string. Different field names did not change the error |
| OpenArt, lip-synced video (Seedance 2.5, audio element) | the free plan had **40 credits**. One 30-second clip costs **1,810 credits** at 480p, **3,905** at 720p, **9,625** at 1080p; the cheapest lip-sync-capable 5 s clip is **300** |

Two practical consequences:

- **Clip length caps the script.** Lip-sync models cap a clip at about 15–30 s, so a 4-minute script means 8–9 stitched clips and,
  at these prices, thousands of credits. Keep a Short script to about **150–230 words** (our avatar read 256 words in 112 s, about
  2.3 words per second).
- **Decide the source before you write a long script.**

Alternatives that came up in search results (**not tested by us**, check their current free tiers and watermark policy): D-ID,
Vidnoz, Synthesia, Colossyan, ImagineArt. D-ID is the one purpose-built for "photo in, talking video out".

Your own camera remains the best source: free, sharp, and nothing to crop around.

## 4. Checklist for avatar footage

- [ ] `ffprobe` size and a viewed frame at several timestamps
- [ ] `find_content_box.py`: padded or full-bleed?
- [ ] watermark? If yes, find a clean window and test it at the final scale on 15+ timestamps
- [ ] script length fits (about 150–230 words for 60–90 s)
- [ ] comp-native transcode, then continue at [PIPELINE.md](PIPELINE.md) step 1
