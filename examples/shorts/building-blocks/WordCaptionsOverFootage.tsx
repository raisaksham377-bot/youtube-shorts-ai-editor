// REFERENCE COMPOSITION (not auto-registered). To use or preview it, copy this folder into
// remotion/src/shots/<your-video>/ and run `cd remotion && npm run gen`. Imports assume that
// location. See examples/README.md.
import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { FONT_MONO } from '../../fonts';
import { WordCaptionOverlay } from '../../lib/kit';

// =============================================================================
// WordCaptionsOverFootage — composites the WordCaptions overlay directly over
// REAL video-4 footage, so the caption treatment can be judged against the
// actual face/background instead of the flat brand-bg standalone proof
// (WordCaptions.tsx). Same word data, same real timestamps, same visual
// treatment — this file only adds the video layer underneath.
//
// Source: media/projects/my-short/hook-line-slice.mp4 — a 4.0s slice of the
// REAL final master (videos/video-4/output/master-natural-h264.mp4), trimmed
// starting at 0.256s (word 0's exact onset in edited-transcript.json, so this
// clip's frame 0 = "If"'s real onset with zero offset math), transcoded
// comp-native (1080x1920, 30fps CFR, 8-bit H.264) per the same recipe already
// proven on the ProofSplitFrame test clip. Unmuted — real audio, so lip-sync
// against the captions is actually checkable, not just visual timing.
// =============================================================================
export const compositionConfig = {
  id: 'WordCaptionsOverFootage',
  durationInSeconds: 4,
  fps: 30,
  width: 1080,
  height: 1920,
};

// Same words/timestamps as WordCaptions.tsx (real hook line, real ms from
// videos/video-4/work/edited-transcript.json, relative to word 0's onset).
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

const WordCaptionsOverFootage: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_MONO }}>
    <OffthreadVideo
      src={staticFile('projects/my-short/hook-line-slice.mp4')}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
    <WordCaptionOverlay words={WORDS} />
  </AbsoluteFill>
);
export default WordCaptionsOverFootage;
