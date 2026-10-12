// REFERENCE COMPOSITION (not auto-registered). To use or preview it, copy this folder into
// remotion/src/shots/<your-video>/ and run `cd remotion && npm run gen`. Imports assume that
// location. See examples/README.md.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { BrandBg, WordCaptionOverlay } from '../../lib/kit';

// =============================================================================
// WordCaptions — proof shot for brand.md §7's short-form caption rule:
// word-by-word bold captions, ONE active word at a time, popping in exactly on
// its edited-transcript.json timestamp, replacing the previous word. Real
// words from video-4's actual script (videos/video-4/work/edited-transcript.json,
// words 0-12: "If you're job hunting and feeling paralyzed, this video will
// save you months"), not placeholder text.
//
// Positioned in the lower-middle band, above where brand.md's bottom
// platform-UI-reserved zone (~18-22%) sits — this is where the overlay
// actually lands once composited over the real bottom-half video later.
// Standalone proof here (brand background, not yet composited over footage),
// same pattern as VerticalStatement/LinkedInApply's proof shots.
//
// This is a SEPARATE overlay layer from the top-half statement-card graphics
// (brand.md §7): captions track speech continuously, statement cards mark
// specific beats. Not a replacement for each other.
// =============================================================================
export const compositionConfig = {
  id: 'WordCaptions',
  durationInSeconds: 4,
  fps: 30,
  width: 1080,
  height: 1920,
};

// {text, startMs, endMs} relative to the first word's onset (real word 0 starts
// at 256ms in edited-transcript.json; every other word's ms below is offset by
// that same 256ms so this clip's frame 0 = the first word's real onset).
const WORDS = [
  { text: 'If', startMs: 0, endMs: 80 },
  { text: "you're", startMs: 80, endMs: 224 },
  { text: 'job', startMs: 241, endMs: 561 },
  { text: 'hunting', startMs: 561, endMs: 770 },
  { text: 'and', startMs: 818, endMs: 898 },
  { text: 'feeling', startMs: 898, endMs: 1106 },
  { text: 'paralyzed,', startMs: 1138, endMs: 1748 },
  { text: 'this', startMs: 2084, endMs: 2245 },
  { text: 'video', startMs: 2245, endMs: 2565 },
  { text: 'will', startMs: 2645, endMs: 2742 },
  { text: 'save', startMs: 2742, endMs: 2950 },
  { text: 'you', startMs: 2966, endMs: 3030 },
  { text: 'months', startMs: 3062, endMs: 3463 },
];

const WordCaptions: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_MONO }}>
    <BrandBg glow={COLORS.accent} />
    <WordCaptionOverlay words={WORDS} />
  </AbsoluteFill>
);
export default WordCaptions;
