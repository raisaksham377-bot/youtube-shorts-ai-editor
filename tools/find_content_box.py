#!/usr/bin/env python3
"""
find_content_box.py — find the real picture inside a padded / letterboxed frame.

Some talking-head exports (AI-avatar tools especially) deliver a 16:9 picture centred inside a 9:16
canvas, with plain padding above and below. Cropping blindly then wastes resolution or keeps the
padding. This tool measures where the real picture is.

It takes one frame (an image, or a video plus a timestamp), treats the colour at the top-centre as
the padding colour, and reports the bounding box of everything that differs from it.

Usage:
  python tools/find_content_box.py videos/video-1/avatar.mp4            # grabs a frame at 10 s
  python tools/find_content_box.py videos/video-1/avatar.mp4 --at 30
  python tools/find_content_box.py frame.png --thresh 60

Prints the box as x,y,w,h and as an ffmpeg crop filter. It does NOT find watermarks: a faint
overlay sits well below the threshold. Look at a few frames at the final scale (docs/AVATAR-FOOTAGE.md).

Needs Pillow (in requirements.txt) and ffmpeg on PATH when the input is a video.
"""
import argparse
import os
import subprocess
import sys
import tempfile

from PIL import Image

IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}


def grab_frame(video: str, t: float, out: str) -> None:
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-ss", str(t), "-i", video, "-frames:v", "1", out],
        check=True,
    )


def diff(a, b) -> int:
    return abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])


def main() -> None:
    ap = argparse.ArgumentParser(description="Find the content box inside a padded/letterboxed frame.")
    ap.add_argument("src", help="an image, or a video to grab a frame from")
    ap.add_argument("--at", type=float, default=10.0, help="timestamp in seconds when src is a video (default 10)")
    ap.add_argument("--thresh", type=int, default=90,
                    help="summed RGB difference from the padding colour that counts as content (default 90)")
    ap.add_argument("--stride", type=int, default=4, help="sample every Nth pixel for speed (default 4)")
    args = ap.parse_args()

    path = args.src
    tmp = None
    if os.path.splitext(path)[1].lower() not in IMAGE_EXT:
        tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
        tmp.close()
        try:
            grab_frame(path, args.at, tmp.name)
        except (subprocess.CalledProcessError, FileNotFoundError) as e:
            os.unlink(tmp.name)
            sys.exit(f"could not grab a frame with ffmpeg: {e}")
        path = tmp.name

    try:
        img = Image.open(path).convert("RGB")
        w, h = img.size
        px = img.load()
        bg = px[w // 2, min(5, h - 1)]  # padding colour: top-centre pixel
        s = max(1, args.stride)

        rows = [y for y in range(h) if any(diff(px[x, y], bg) > args.thresh for x in range(0, w, s))]
        if not rows:
            sys.exit("no content found: the frame looks uniform. Try a lower --thresh or another --at.")
        y0, y1 = rows[0], rows[-1]
        cols = [x for x in range(w) if any(diff(px[x, y], bg) > args.thresh for y in range(y0, y1 + 1, s))]
        x0, x1 = cols[0], cols[-1]
    finally:
        if tmp is not None and os.path.exists(tmp.name):
            os.unlink(tmp.name)

    bw, bh = x1 - x0 + 1, y1 - y0 + 1
    print(f"frame:        {w}x{h}   padding colour (top-centre): RGB{bg}")
    print(f"content box:  x={x0} y={y0} w={bw} h={bh}   (aspect {bw / bh:.3f})")
    print(f"ffmpeg:       crop={bw}:{bh}:{x0}:{y0}")
    if (bw, bh) == (w, h):
        print("note:         the content fills the frame; there is no padding to remove.")


if __name__ == "__main__":
    main()
