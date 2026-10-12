// REFERENCE COMPOSITION (not auto-registered). To use or preview it, copy this folder into
// remotion/src/shots/<your-video>/ and run `cd remotion && npm run gen`. Imports assume that
// location. See examples/README.md.
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { EASINGS } from '../../brand';
import { FONT_DISPLAY, FONT_BODY } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CursorPointer, sampleCursor, CursorKey } from '../../lib/screencast';

// =============================================================================
// LinkedInApply — proof shot for the "fake LinkedIn UI + clicking cursor"
// moment. Native mobile-app look (status bar, no browser chrome/URL bar/tabs)
// per the call that this is a vertical phone video, not a desktop clone —
// WebBrowserFrame is deliberately NOT used here.
//
// Reuses CursorPointer/sampleCursor/CursorKey from lib/screencast.tsx (now
// exported for this purpose) instead of Screencast's full multi-page wrapper,
// since this beat is one static card + one click, not a walkthrough.
//
// Real UI realism (make-tsx P6): LinkedIn's actual brand blue (#0A66C2) is
// used for the Apply button, not the channel's navy brand accent. The company
// on the card is a generic placeholder, not a real company's logo/listing.
//
// Cursor coordinates are fractions of the FULL CANVAS (there's no browser
// "viewport" region here the way Screencast has one).
// =============================================================================
export const compositionConfig = {
  id: 'LinkedInApply',
  durationInSeconds: 5,
  fps: 30,
  width: 1080,
  height: 1920,
};

const LI = {
  pageBg: '#F4F2EE',
  card: '#FFFFFF',
  text: '#1D1D1D',
  textMuted: '#666666',
  line: '#E4E1DC',
  blue: '#0A66C2',
  blueDark: '#004182',
};

const CARD = { x: 48, y: 260, w: 984, h: 640 };
const BTN = { x: CARD.x + 40, y: CARD.y + 500, w: 260, h: 72 };
const BTN_CENTER = { x: (BTN.x + BTN.w / 2) / 1080, y: (BTN.y + BTN.h / 2) / 1920 };

const CURSOR_KEYS: CursorKey[] = [
  { frame: 6, x: 0.22, y: 0.86 },
  { frame: 60, x: BTN_CENTER.x, y: BTN_CENTER.y },
];
const CLICK_AT = 66;

const LinkedInApply: React.FC = () => {
  const frame = useCurrentFrame();
  const cur = sampleCursor(frame, CURSOR_KEYS);
  const press = frame < CLICK_AT - 4 || frame > CLICK_AT + 8
    ? 1
    : interpolate(frame, [CLICK_AT - 4, CLICK_AT, CLICK_AT + 8], [1, 0.82, 1], { ...CLAMP });

  const rippleOn = frame >= CLICK_AT && frame <= CLICK_AT + 18;
  const rippleScale = interpolate(frame, [CLICK_AT, CLICK_AT + 18], [0, 2.2], { ...CLAMP, easing: EASINGS.easeOut });
  const rippleOp = interpolate(frame, [CLICK_AT, CLICK_AT + 18], [0.5, 0], { ...CLAMP });

  const applied = frame >= CLICK_AT;
  const appliedOp = interpolate(frame, [CLICK_AT, CLICK_AT + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, background: LI.pageBg }}>
      {/* status bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px', background: LI.pageBg }}>
        <span style={{ fontSize: 26, fontWeight: 600, color: LI.text }}>9:41</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 26, height: 18, border: `2px solid ${LI.text}`, borderRadius: 3, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 2, left: 2, bottom: 2, width: '70%', background: LI.text, borderRadius: 1 }} />
          </div>
        </div>
      </div>

      {/* app top bar: search pill + profile dot (no URL bar / tabs — native app chrome) */}
      <div style={{ position: 'absolute', top: 64, left: 0, width: 1080, height: 108, background: LI.card, borderBottom: `1px solid ${LI.line}`, display: 'flex', alignItems: 'center', padding: '0 32px', gap: 20 }}>
        <div style={{ flex: 1, height: 60, background: LI.pageBg, borderRadius: 999, display: 'flex', alignItems: 'center', padding: '0 26px' }}>
          <span style={{ fontSize: 26, color: LI.textMuted }}>Search jobs</span>
        </div>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#DCE6F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24, color: LI.blueDark }}>
          S
        </div>
      </div>

      {/* job card */}
      <div style={{ position: 'absolute', left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, background: LI.card, borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', padding: 40 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ width: 88, height: 88, borderRadius: 14, background: '#EEF3F8', border: `1px solid ${LI.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 40, color: LI.blueDark, flexShrink: 0 }}>
            N
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 40, color: LI.text, lineHeight: 1.2 }}>
              Senior Product Marketer
            </div>
            <div style={{ fontSize: 28, color: LI.textMuted, marginTop: 8 }}>
              Northwind Digital · Remote
            </div>
            <div style={{ fontSize: 24, color: LI.textMuted, marginTop: 6 }}>
              2h ago · Be an early applicant
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: 40, right: 40, top: 460, height: 1, background: LI.line }} />

        {/* absolutely positioned (not flex-flow) so BTN.x/y above is exactly
            where this renders — the cursor math depends on that being exact */}
        <div style={{ position: 'absolute', left: 40, top: 500, display: 'flex', gap: 20 }}>
          <div style={{
            position: 'relative', width: BTN.w, height: BTN.h, borderRadius: 999,
            background: applied ? '#DCE6F1' : LI.blue, display: 'flex', alignItems: 'center',
            justifyContent: 'center', transform: `scale(${press})`,
          }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 28, color: applied ? LI.blueDark : '#FFFFFF', opacity: applied ? appliedOp : 1 }}>
              {applied ? 'Applied ✓' : 'Apply'}
            </span>
            {!applied && (
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 28, color: '#FFFFFF', position: 'absolute', opacity: 1 - appliedOp }}>
                Apply
              </span>
            )}
          </div>
          <div style={{ width: 180, height: BTN.h, borderRadius: 999, border: `2px solid ${LI.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 28, color: LI.blue }}>Save</span>
          </div>
        </div>
      </div>

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
export default LinkedInApply;
