// REFERENCE COMPOSITION (not auto-registered). To use or preview it, copy this folder into
// remotion/src/shots/<your-video>/ and run `cd remotion && npm run gen`. Imports assume that
// location. See examples/README.md.
import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_DISPLAY, FONT_BODY, FONT_MONO } from '../../fonts';
import { BrandBg } from '../../lib/kit';

// =============================================================================
// ProofSplitFrame — proof-of-concept for the bottom-video / top-graphics
// vertical reel layout. Validates three unproven things at once:
//   1. OffthreadVideo UNMUTED, carrying real audio through Remotion's renderer
//      (every prior OffthreadVideo shot in this repo is muted B-roll).
//   2. Cropping/positioning a video into a sub-region (bottom half) instead of
//      the full-bleed 100%/100% pattern every existing shot uses.
//   3. A/V sync end to end on a real render, not a generated clip.
//
// Source: media/projects/my-short/proof-slice.mp4 — a 10s slice of raw HeyGen
// footage (videos/video-4/heygen-raw.mp4, 32.0-42.0s), transcoded comp-native
// (1080x1920, 30fps CFR, 8-bit H.264) per clean-cut's OffthreadVideo-decoder
// note. The source subject sits in the TOP ~50% of frame (hair to mid-chest),
// so the crop keeps the video's top half, not a naive bottom-half crop.
//
// Top graphic is a STATIC placeholder (no cue timing yet) — this shot is only
// proving the split-frame mechanics, not the real cue list.
// =============================================================================
export const compositionConfig = {
  id: 'ProofSplitFrame',
  durationInSeconds: 10,
  fps: 30,
  width: 1080,
  height: 1920,
};

const ProofSplitFrame: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <BrandBg glow={COLORS.accent} />

      {/* top half: static placeholder graphic (0 - 960) */}
      <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', padding: '0 80px' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 24, letterSpacing: 3, color: COLORS.muted, marginBottom: 24, textAlign: 'center' }}>
          PROOF TEST
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 60, lineHeight: 1.2, color: COLORS.ink, textAlign: 'center', margin: 0 }}>
          Top graphics render <span style={{ color: COLORS.accent }}>here</span>.
        </h1>
      </AbsoluteFill>

      {/* bottom half: real HeyGen footage, cropped to the face/shoulders band
          and unmuted for real audio. Offset measured with a drawgrid overlay
          on the source: hair-top ~200px, eyes ~600px, shoulders ~1000px (of
          1920) — so the display window is [140, 1100], not [0, 960]. */}
      <div style={{ position: 'absolute', left: 0, top: 960, width: 1080, height: 960, overflow: 'hidden' }}>
        <OffthreadVideo
          src={staticFile('projects/my-short/proof-slice.mp4')}
          style={{ position: 'absolute', top: -140, left: 0, width: 1080, height: 1920 }}
        />
      </div>
    </AbsoluteFill>
  );
};
export default ProofSplitFrame;
