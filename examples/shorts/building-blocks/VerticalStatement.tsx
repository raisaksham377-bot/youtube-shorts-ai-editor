// REFERENCE COMPOSITION (not auto-registered). To use or preview it, copy this folder into
// remotion/src/shots/<your-video>/ and run `cd remotion && npm run gen`. Imports assume that
// location. See examples/README.md.
import React from 'react';
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import { COLORS, EASINGS, GRADIENT } from '../../brand';
import { FONT_DISPLAY, FONT_BODY, FONT_MONO } from '../../fonts';
import { BrandBg, useRise, CLAMP } from '../../lib/kit';

// =============================================================================
// VerticalStatement — the 1080x1920 counterpart to example/BigStatement's
// kicker + headline + accent-word pattern (brand.md §7: Reels/Shorts/LinkedIn
// feed, not YouTube landscape). Reference/template shot for the short-vertical
// group: type scale and spacing are retuned for a 1080px-wide canvas, not a
// shrink of the 1920px numbers. Placeholder copy — swap per real short.
//
// Top/bottom padding below keep clear of real platform UI overlap per brand.md
// §7: ~top 12.5% (handle/follow button), ~bottom 20% (caption stack/UI rail).
// =============================================================================
export const compositionConfig = {
  id: 'VerticalStatement',
  durationInSeconds: 6,
  fps: 30,
  width: 1080,
  height: 1920,
};

const KICKER = 'THE TAKEAWAY';
const HEADLINE_PRE = "The real blocker isn’t your resume, it’s your ";
const HEADLINE_ACCENT = 'strategy';

const VerticalStatement: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = useRise();
  const barX = interpolate(frame, [26, 46], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <BrandBg glow={COLORS.accent} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '240px 80px 380px' }}>
        <div style={{ ...rise(2, 16), fontFamily: FONT_MONO, fontSize: 25, letterSpacing: 3, color: COLORS.muted, marginBottom: 30, textAlign: 'center' }}>
          {KICKER}
        </div>

        <h1 style={{ ...rise(8, 22), fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 80, lineHeight: 1.16, color: COLORS.ink, textAlign: 'center', margin: 0 }}>
          {HEADLINE_PRE}
          <span style={{ color: COLORS.accent }}>{HEADLINE_ACCENT}</span>.
        </h1>

        <div style={{ width: 220, height: 7, borderRadius: 999, background: COLORS.line, overflow: 'hidden', marginTop: 46 }}>
          <div style={{ height: '100%', width: '100%', borderRadius: 999, background: GRADIENT, transform: `scaleX(${barX})`, transformOrigin: 'left' }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export default VerticalStatement;
