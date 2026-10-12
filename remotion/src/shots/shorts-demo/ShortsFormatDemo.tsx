import React from 'react';
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { BrandBg, CLAMP, RealPhotoKenBurns, TopCard, WordCaptionOverlay, CaptionWord } from '../../lib/kit';

// =============================================================================
// ShortsFormatDemo — the split-frame Short format, self-contained (no footage needed).
//
//   top half  (0-960)     B-roll beats, swapped by a beat schedule (CARDS below)
//   bottom half (960-1920) YOU — here a placeholder, in a real Short your cropped face footage
//   captions               one active word at a time, always on top
//
// Open it with `cd remotion && npm run studio` -> "ShortsFormatDemo". Then read
// docs/SHORTS-FORMAT.md and the reference reels in examples/shorts/ to see how a real one is built.
// =============================================================================
export const compositionConfig = {
  id: 'ShortsFormatDemo',
  durationInSeconds: 12,
  fps: 30,
  width: 1080,
  height: 1920,
};

// Word timings in ms. A real Short takes these from work/edited-transcript.json (never hand-typed).
const SCRIPT =
  'This is the split frame Short format. The top half is your B-roll. The bottom half is you. Captions follow every single word.';
const WORDS: CaptionWord[] = SCRIPT.split(' ').map((text, i) => ({
  text,
  startMs: 400 + i * 380,
  endMs: 400 + i * 380 + 340,
}));

// The bottom half: a stand-in for your face footage (comp-native, cropped to 1080x960).
const FacePlaceholder: React.FC = () => {
  const frame = useCurrentFrame();
  const breathe = 1 + 0.008 * Math.sin(frame / 14);
  return (
    <div style={{ position: 'absolute', left: 0, top: 960, width: 1080, height: 960, overflow: 'hidden', background: `linear-gradient(180deg, ${COLORS.d800}, ${COLORS.d900})` }}>
      <div style={{ position: 'absolute', left: '50%', top: 150, width: 320, height: 360, borderRadius: '50%', background: '#2c3647', transform: `translateX(-50%) scale(${breathe})` }} />
      <div style={{ position: 'absolute', left: '50%', top: 500, width: 780, height: 640, borderRadius: '390px 390px 0 0', background: '#232b39', transform: 'translateX(-50%)' }} />
      <div style={{ position: 'absolute', top: 40, left: 0, right: 0, textAlign: 'center', fontFamily: FONT_MONO, fontSize: 30, letterSpacing: 3, color: COLORS.d400 }}>
        YOUR FACE FOOTAGE · 1080 × 960
      </div>
    </div>
  );
};

type Card =
  | { startFrame: number; endFrame: number; kind: 'text'; kicker?: string; headline: string; accentWord?: string; sub?: string; tone?: 'default' | 'positive' }
  | { startFrame: number; endFrame: number; kind: 'photo' };

// Beat schedule: frame windows on the global timeline. Real Shorts derive every window from word times.
const CARDS: Card[] = [
  { startFrame: 0, endFrame: 100, kind: 'text', kicker: 'THE FORMAT', headline: 'Half B-roll. Half you.', accentWord: 'B-roll', sub: 'your face never leaves the screen' },
  { startFrame: 100, endFrame: 230, kind: 'photo' },
  { startFrame: 230, endFrame: 330, kind: 'text', kicker: 'WORD BY WORD', headline: 'Captions follow every word', accentWord: 'every word' },
  { startFrame: 330, endFrame: 360, kind: 'text', headline: 'Your turn.', tone: 'positive' },
];

// A real-asset beat: a REAL photo / screenshot with a slow Ken Burns push (brand.md §6).
const PhotoBeat: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const chip = interpolate(frame, [22, 36], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const op = interpolate(frame, [0, 10, holdFrames - 10, holdFrames], [0, 1, 1, 0], { ...CLAMP });
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <RealPhotoKenBurns
        src={staticFile('library/placeholders/real-photo-placeholder.png')}
        frame={frame}
        holdFrames={holdFrames}
        boxW={800}
        boxH={640}
        focal={{ x: 0.5, y: 0.45 }}
      />
      <div style={{ marginTop: 34, opacity: chip, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 32, color: COLORS.muted }}>
        swap in a <span style={{ color: COLORS.accent }}>real</span> photo or screenshot
      </div>
    </AbsoluteFill>
  );
};

const ShortsFormatDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const card = CARDS.find((c) => frame >= c.startFrame && frame < c.endFrame);
  const local = card ? frame - card.startFrame : 0;
  const hold = card ? card.endFrame - card.startFrame : 0;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <BrandBg glow={COLORS.accent} />
      <FacePlaceholder />
      {card && card.kind === 'photo' && <PhotoBeat frame={local} holdFrames={hold} />}
      {card && card.kind === 'text' && (
        <TopCard frame={local} holdFrames={hold} kicker={card.kicker} headline={card.headline} accentWord={card.accentWord} sub={card.sub} tone={card.tone} />
      )}
      <WordCaptionOverlay words={WORDS} />
    </AbsoluteFill>
  );
};
export default ShortsFormatDemo;
