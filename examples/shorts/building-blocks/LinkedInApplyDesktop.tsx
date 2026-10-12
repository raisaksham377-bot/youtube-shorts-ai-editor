// REFERENCE COMPOSITION (not auto-registered). To use or preview it, copy this folder into
// remotion/src/shots/<your-video>/ and run `cd remotion && npm run gen`. Imports assume that
// location. See examples/README.md.
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_DISPLAY, FONT_BODY } from '../../fonts';
import { WebBrowserFrame } from '../../lib/browser';
import { CLAMP } from '../../lib/kit';
import { CursorPointer, sampleCursor, CursorKey } from '../../lib/screencast';

// =============================================================================
// LinkedInApplyDesktop — replaces LinkedInApply (mobile) for the "Micro-actions"
// cutaway per explicit redirect: a real laptop with LinkedIn open, not a phone
// UI. Real browser chrome via WebBrowserFrame (tabs, URL bar), wrapped in a
// simple laptop bezel + base so it reads as "a laptop," not a floating window.
// LinkedIn's real desktop terminology ("Easy Apply") per make-tsx's real-UI-
// realism convention. Cursor mechanic reused from screencast.tsx, same as the
// mobile version.
// =============================================================================
export const compositionConfig = {
  id: 'LinkedInApplyDesktop',
  durationInSeconds: 5,
  fps: 30,
  width: 1080,
  height: 1920,
};

const LI = {
  pageBg: '#FFFFFF',
  headerBg: '#FFFFFF',
  border: '#E4E1DC',
  text: '#1D1D1D',
  textMuted: '#666666',
  blue: '#0A66C2',
  blueDark: '#004182',
  room: '#1B1E24',
  bezel: '#0C0D10',
  deck: '#15171B',
};

const BOX = { x: 60, y: 300, w: 960, h: 600 };
const UI_SCALE = 1.25;
const CHROME_H = (46 + 56) * UI_SCALE; // WebBrowserFrame's tab+nav height at this uiScale
const PAGE = { x: BOX.x, y: BOX.y + CHROME_H, w: BOX.w, h: BOX.h - CHROME_H };

const BTN = { x: PAGE.x + 48, y: PAGE.y + 210, w: 200, h: 60 };
const BTN_CENTER = { x: (BTN.x + BTN.w / 2) / 1080, y: (BTN.y + BTN.h / 2) / 1920 };

const CURSOR_KEYS: CursorKey[] = [
  { frame: 6, x: 0.72, y: 0.5 },
  { frame: 60, x: BTN_CENTER.x, y: BTN_CENTER.y },
];
const CLICK_AT = 66;

const LinkedInLogo: React.FC = () => (
  <div style={{ width: 34, height: 34, borderRadius: 6, background: LI.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20, color: '#FFFFFF' }}>
    in
  </div>
);

const LinkedInApplyDesktop: React.FC = () => {
  const frame = useCurrentFrame();
  const cur = sampleCursor(frame, CURSOR_KEYS);
  const press = frame < CLICK_AT - 4 || frame > CLICK_AT + 8
    ? 1
    : interpolate(frame, [CLICK_AT - 4, CLICK_AT, CLICK_AT + 8], [1, 0.85, 1], { ...CLAMP });

  const rippleOn = frame >= CLICK_AT && frame <= CLICK_AT + 18;
  const rippleScale = interpolate(frame, [CLICK_AT, CLICK_AT + 18], [0, 2.2], { ...CLAMP, easing: EASINGS.easeOut });
  const rippleOp = interpolate(frame, [CLICK_AT, CLICK_AT + 18], [0.5, 0], { ...CLAMP });

  const applied = frame >= CLICK_AT;
  const appliedOp = interpolate(frame, [CLICK_AT, CLICK_AT + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, background: LI.room }}>
      {/* laptop bezel */}
      <div style={{ position: 'absolute', left: BOX.x - 28, top: BOX.y - 28, width: BOX.w + 56, height: BOX.h + 56, borderRadius: 22, background: LI.bezel, boxShadow: '0 30px 70px rgba(0,0,0,0.45)' }} />
      {/* laptop base/deck (trapezoid via clip-path) */}
      <div style={{
        position: 'absolute', left: BOX.x - 70, top: BOX.y + BOX.h + 28, width: BOX.w + 140, height: 40,
        background: LI.deck, borderRadius: '0 0 14px 14px',
        clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)',
      }} />
      <div style={{ position: 'absolute', left: BOX.x + BOX.w / 2 - 60, top: BOX.y + BOX.h + 10, width: 120, height: 8, borderRadius: 4, background: '#2A2D34' }} />

      <WebBrowserFrame
        url="linkedin.com/jobs/view/senior-product-marketer"
        tabTitle="Senior Product Marketer | LinkedIn"
        favicon={<LinkedInLogo />}
        box={BOX}
        uiScale={UI_SCALE}
        pageBg={LI.pageBg}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: PAGE.w, height: PAGE.h, background: LI.pageBg }}>
          {/* page header row */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: PAGE.w, height: 56, borderBottom: `1px solid ${LI.border}`, display: 'flex', alignItems: 'center', padding: '0 40px', gap: 16 }}>
            <LinkedInLogo />
            <div style={{ flex: 1, height: 30, background: '#F4F2EE', borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 14px' }}>
              <span style={{ fontSize: 15, color: LI.textMuted }}>Search jobs</span>
            </div>
          </div>

          {/* job title block */}
          <div style={{ position: 'absolute', left: 48, top: 84 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 32, color: LI.text }}>Senior Product Marketer</div>
            <div style={{ fontSize: 20, color: LI.textMuted, marginTop: 8 }}>Northwind Digital &middot; Remote</div>
            <div style={{ fontSize: 18, color: LI.textMuted, marginTop: 4 }}>2h ago &middot; Be an early applicant &middot; Over 100 clicks</div>
          </div>

          {/* absolutely positioned so BTN.x/y above is exactly where this renders */}
          <div style={{ position: 'absolute', left: 48, top: 210, display: 'flex', gap: 16 }}>
            <div
              style={{
                position: 'relative', width: BTN.w, height: BTN.h, borderRadius: 8,
                background: applied ? '#DCE6F1' : LI.blue, display: 'flex', alignItems: 'center',
                justifyContent: 'center', transform: `scale(${press})`,
              }}
            >
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, color: applied ? LI.blueDark : '#FFFFFF', opacity: applied ? appliedOp : 1 }}>
                {applied ? 'Applied ✓' : 'Easy Apply'}
              </span>
              {!applied && (
                <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, color: '#FFFFFF', position: 'absolute', opacity: 1 - appliedOp }}>
                  Easy Apply
                </span>
              )}
            </div>
            <div style={{ width: 140, height: BTN.h, borderRadius: 8, border: `2px solid ${LI.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, color: LI.blue }}>Save</span>
            </div>
          </div>

          <div style={{ position: 'absolute', left: 48, top: 320, right: 48, height: 1, background: LI.border }} />
          <div style={{ position: 'absolute', left: 48, top: 352, right: 48, fontSize: 18, lineHeight: 1.6, color: LI.text }}>
            We're looking for a Senior Product Marketer to own positioning, launches, and messaging across our product line.
          </div>
        </div>
      </WebBrowserFrame>

      {/* click ripple */}
      {rippleOn && (
        <div style={{
          position: 'absolute',
          left: BTN_CENTER.x * 1080, top: BTN_CENTER.y * 1920,
          width: 34, height: 34, marginLeft: -17, marginTop: -17,
          borderRadius: '50%', border: `2px solid ${LI.blue}`, opacity: rippleOp,
          transform: `scale(${rippleScale})`, pointerEvents: 'none',
        }} />
      )}

      {/* cursor */}
      <div style={{ position: 'absolute', left: cur.x * 1080, top: cur.y * 1920, transform: 'translate(-4px, -3px)' }}>
        <CursorPointer press={press} />
      </div>
    </AbsoluteFill>
  );
};
export default LinkedInApplyDesktop;
