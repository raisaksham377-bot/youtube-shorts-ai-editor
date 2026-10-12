// REFERENCE COMPOSITION (not auto-registered). To use or preview it, copy this folder into
// remotion/src/shots/<your-video>/ and run `cd remotion && npm run gen`. Imports assume that
// location. See examples/README.md.
import React from 'react';
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Brain, Lightbulb, AlertTriangle, XCircle, PauseCircle, EyeOff, Frown, Eye, TrendingUp, Wind, Scale, MessageCircle, Wrench, Send } from 'lucide-react';
import { COLORS, EASINGS, GRADIENT } from '../../brand';
import { FONT_BODY, FONT_DISPLAY, FONT_MONO } from '../../fonts';
import { CLAMP, TopCard, WarmGradientBg, WordCaptionOverlay, CaptionWord } from '../../lib/kit';
import { CursorPointer, sampleCursor, CursorKey } from '../../lib/screencast';
// Path (relative to media/) of YOUR face footage, transcoded comp-native (1080x960 or 1080x1920, 30fps, H.264).
// See docs/SHORTS-FORMAT.md. This file is not shipped in the repo.
const FOOTAGE = 'projects/my-short/master-comp-native.mp4';

// ---- bespoke motion-graphic scenes (per beat, not generic text cards) -------
// Real animated concept graphics for the highest-impact beats, per explicit
// direction: "go big" rather than a text card for every beat. Local `frame` /
// `holdFrames` match TopCard's own convention (frame 0 = this card's window
// start; fades over the first/last ~10 frames).

const DANGER_CHIP = '#4A1420';

const BrainStat: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = interpolate(frame, [0, 10, holdFrames - 10, holdFrames], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const brainScale = interpolate(frame, [0, 14], [0.8, 1], { ...CLAMP, easing: EASINGS.overshoot });
  const ringProgress = interpolate(frame, [10, 50], [0, 0.95], { ...CLAMP, easing: EASINGS.easeOut });
  const bulbOp = interpolate(frame, [55, 68], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const bulbScale = interpolate(frame, [55, 68], [0.6, 1], { ...CLAMP, easing: EASINGS.overshoot });
  const bulbPulse = 1 + 0.06 * Math.sin((frame - 55) / 6);
  const SIZE = 360, R = 140, C = 2 * Math.PI * R;

  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 29, letterSpacing: 3, color: COLORS.muted, marginBottom: 24 }}>THE SUBCONSCIOUS</div>
      <div style={{ position: 'relative', width: SIZE, height: SIZE, transform: `scale(${brainScale})` }}>
        <svg width={SIZE} height={SIZE} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={18} />
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke={COLORS.accent} strokeWidth={18} strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - ringProgress)} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Brain size={150} color={COLORS.accent} strokeWidth={1.6} />
        </div>
        <div style={{ position: 'absolute', right: -30, top: -30, opacity: bulbOp, transform: `scale(${bulbScale * bulbPulse})` }}>
          <Lightbulb size={92} color={COLORS.warn} fill={`${COLORS.warn}44`} strokeWidth={1.8} />
        </div>
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 88, color: COLORS.accent, marginTop: 28 }}>95%</div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 36, color: COLORS.muted, marginTop: 8 }}>of your actions</div>
    </AbsoluteFill>
  );
};

const REJECT_TALLY_COUNT = 24; // visual tally, not literal 150 -- avoids clutter
const RejectionTally: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = interpolate(frame, [0, 10, holdFrames - 10, holdFrames], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const count = Math.round(interpolate(frame, [8, 55], [0, 150], { ...CLAMP, easing: EASINGS.easeOut }));

  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 29, letterSpacing: 3, color: COLORS.muted, marginBottom: 22 }}>THE PATTERN</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', width: 520, justifyContent: 'center', gap: 12, marginBottom: 26 }}>
        {Array.from({ length: REJECT_TALLY_COUNT }).map((_, i) => {
          const at = 8 + i * 1.6;
          const iop = interpolate(frame, [at, at + 6], [0, 1], { ...CLAMP });
          const isc = interpolate(frame, [at, at + 6], [0.4, 1], { ...CLAMP, easing: EASINGS.overshoot });
          return <XCircle key={i} size={40} color={COLORS.danger} strokeWidth={2.4} style={{ opacity: iop, transform: `scale(${isc})` }} />;
        })}
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 130, color: COLORS.accent }}>{count}</div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 32, color: COLORS.muted, marginTop: 10 }}>rejections &rarr; one predictive model</div>
    </AbsoluteFill>
  );
};

const DangerPulse: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = interpolate(frame, [0, 8, holdFrames - 8, holdFrames], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const iconScale = interpolate(frame, [0, 10], [0.7, 1], { ...CLAMP, easing: EASINGS.overshoot });
  const pulse = 1 + 0.05 * Math.sin(frame / 5);

  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ transform: `scale(${iconScale * pulse})`, marginBottom: 30 }}>
        <AlertTriangle size={220} color={COLORS.danger} strokeWidth={1.5} fill={`${COLORS.danger}22`} />
      </div>
      <div style={{ background: DANGER_CHIP, border: '2px solid rgba(255,255,255,0.18)', borderRadius: 18, padding: '16px 36px' }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 68, color: '#FFFFFF' }}>Apply = danger.</span>
      </div>
    </AbsoluteFill>
  );
};

// ---- Paralysis / Avoidance / Guilt: a 3-icon staggered reveal -------------
const NegativeStack: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = interpolate(frame, [0, 10, holdFrames - 10, holdFrames], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const rows: { icon: React.ReactNode; label: string; at: number }[] = [
    { icon: <PauseCircle size={74} color={COLORS.danger} strokeWidth={1.8} />, label: 'Paralysis', at: 6 },
    { icon: <EyeOff size={74} color={COLORS.danger} strokeWidth={1.8} />, label: 'Avoidance', at: 24 },
    { icon: <Frown size={74} color={COLORS.danger} strokeWidth={1.8} />, label: 'Guilt', at: 42 },
  ];
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 29, letterSpacing: 3, color: COLORS.danger, marginBottom: 30 }}>THE RESULT</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {rows.map((r) => {
          const rop = interpolate(frame, [r.at, r.at + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
          const rx = interpolate(frame, [r.at, r.at + 10], [-30, 0], { ...CLAMP, easing: EASINGS.easeOut });
          return (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 26, opacity: rop, transform: `translateX(${rx}px)`, background: DANGER_CHIP, border: '2px solid rgba(255,255,255,0.18)', borderRadius: 18, padding: '16px 36px 16px 26px' }}>
              {r.icon}
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 52, color: '#FFFFFF' }}>{r.label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---- STEP 1: Awareness -- an eye opening in a spotlight --------------------
const AwarenessScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = interpolate(frame, [0, 10, holdFrames - 10, holdFrames], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const glowScale = interpolate(frame, [0, 20], [0.3, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const eyeOpen = interpolate(frame, [8, 22], [0.2, 1], { ...CLAMP, easing: EASINGS.overshoot });

  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 29, letterSpacing: 3, color: COLORS.muted, marginBottom: 26 }}>STEP 1</div>
      <div style={{ position: 'relative', width: 340, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.warn}55, transparent 70%)`, transform: `scale(${glowScale})` }} />
        <div style={{ transform: `scaleY(${eyeOpen})` }}>
          <Eye size={170} color={COLORS.accent} strokeWidth={1.5} />
        </div>
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 78, color: COLORS.accent, marginTop: 28 }}>Awareness</div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 34, color: COLORS.muted, marginTop: 10 }}>Name the resistance</div>
    </AbsoluteFill>
  );
};

// ---- STEP 3: Reframe rejection -- an X flips into an arrow -----------------
const ReframeScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = interpolate(frame, [0, 10, holdFrames - 10, holdFrames], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const flip = interpolate(frame, [10, 34], [0, 180], { ...CLAMP, easing: EASINGS.easeInOut });
  const showBack = flip > 90;

  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 29, letterSpacing: 3, color: COLORS.muted, marginBottom: 26 }}>STEP 3</div>
      <div style={{ width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `perspective(600px) rotateY(${flip}deg)` }}>
        <div style={{ transform: showBack ? 'scaleX(-1)' : 'none' }}>
          {showBack
            ? <TrendingUp size={160} color={COLORS.accent} strokeWidth={1.6} />
            : <XCircle size={160} color={COLORS.danger} strokeWidth={1.6} />}
        </div>
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 78, color: COLORS.ink, marginTop: 28, textAlign: 'center' }}>
        <span style={{ color: COLORS.accent }}>Reframe</span> rejection
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 34, color: COLORS.muted, marginTop: 10 }}>Data, not judgment</div>
    </AbsoluteFill>
  );
};

// ---- STEP 4: Calm your system -- a breathing circle ------------------------
const CalmScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = interpolate(frame, [0, 10, holdFrames - 10, holdFrames], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const breath = 0.75 + 0.25 * (0.5 - 0.5 * Math.cos((frame / 55) * Math.PI * 2));
  const label = Math.floor(frame / 27.5) % 2 === 0 ? 'Inhale' : 'Exhale';

  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 29, letterSpacing: 3, color: COLORS.muted, marginBottom: 26 }}>STEP 4</div>
      <div style={{ position: 'relative', width: 330, height: 330, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: 330, height: 330, borderRadius: '50%', border: `5px solid ${COLORS.accent}44`, transform: `scale(${breath})` }} />
        <div style={{ position: 'absolute', width: 330, height: 330, borderRadius: '50%', background: `${COLORS.accent}22`, transform: `scale(${breath * 0.7})` }} />
        <Wind size={130} color={COLORS.accent} strokeWidth={1.5} />
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 26, letterSpacing: 2, color: COLORS.muted, marginTop: 20 }}>{label}</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 66, color: COLORS.accent, marginTop: 10, textAlign: 'center' }}>Calm your system</div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 34, color: COLORS.muted, marginTop: 8 }}>2 minutes of deep breathing</div>
    </AbsoluteFill>
  );
};

// ---- STEP 5: Evidence > affirmations -- a scale tipping --------------------
const EvidenceScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = interpolate(frame, [0, 10, holdFrames - 10, holdFrames], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const tip = interpolate(frame, [8, 26], [0, -12], { ...CLAMP, easing: EASINGS.overshoot });

  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 29, letterSpacing: 3, color: COLORS.muted, marginBottom: 26 }}>STEP 5</div>
      <div style={{ transform: `rotate(${tip}deg)` }}>
        <Scale size={190} color={COLORS.accent} strokeWidth={1.4} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 74, color: COLORS.ink, marginTop: 30, textAlign: 'center' }}>
        <span style={{ color: COLORS.accent }}>Evidence</span> &gt; affirmations
      </div>
    </AbsoluteFill>
  );
};

// ---- CTA: a bouncing comment icon -------------------------------------------
const CtaScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = interpolate(frame, [0, 10, holdFrames - 10, holdFrames], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const bounce = Math.abs(Math.sin(frame / 12)) * 16;

  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 29, letterSpacing: 3, color: COLORS.signal, marginBottom: 24 }}>YOUR TURN</div>
      <div style={{ transform: `translateY(${-bounce}px)`, marginBottom: 8 }}>
        <MessageCircle size={190} color={COLORS.signal} strokeWidth={1.5} fill={`${COLORS.signal}22`} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 78, color: COLORS.signal, marginTop: 24, textAlign: 'center' }}>Drop a comment</div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 34, color: COLORS.muted, marginTop: 12, textAlign: 'center', maxWidth: 820 }}>What&apos;s one micro-action you&apos;ll take today?</div>
    </AbsoluteFill>
  );
};

// ---- transition: "5 ways to fix it" -- a wrench pop-in ---------------------
const FixIntroScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = interpolate(frame, [0, 6, holdFrames - 6, holdFrames], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const iconScale = interpolate(frame, [0, 12], [0.5, 1], { ...CLAMP, easing: EASINGS.overshoot });
  const iconRotate = interpolate(frame, [0, 12], [-30, 0], { ...CLAMP, easing: EASINGS.overshoot });

  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 29, letterSpacing: 3, color: COLORS.muted, marginBottom: 20 }}>THE FIX</div>
      <div style={{ transform: `scale(${iconScale}) rotate(${iconRotate}deg)`, marginBottom: 14 }}>
        <Wrench size={140} color={COLORS.accent} strokeWidth={1.6} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 76, textAlign: 'center', margin: 0, color: COLORS.ink }}>
        5 ways to <span style={{ color: COLORS.accent }}>fix</span> it
      </div>
    </AbsoluteFill>
  );
};

// ---- signature: "One application at a time." -- one app sent + gradient ---
const SignatureScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = interpolate(frame, [0, 10, holdFrames - 10, holdFrames], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const sendScale = interpolate(frame, [0, 14], [0.6, 1], { ...CLAMP, easing: EASINGS.overshoot });
  const sendFloat = interpolate(frame, [8, 30], [0, -10], { ...CLAMP, easing: EASINGS.easeOut });
  const glowOp = interpolate(frame, [8, 22], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const barW = interpolate(frame, [16, 34], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${sendScale}) translateY(${sendFloat}px)` }}>
        <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.accent}33, transparent 70%)`, opacity: glowOp }} />
        <Send size={140} color={COLORS.accent} strokeWidth={1.5} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 92, textAlign: 'center', margin: 0, marginTop: 28, color: COLORS.ink }}>
        <span style={{ color: COLORS.accent }}>One</span> application at a time.
      </div>
      <div style={{ width: 240, height: 8, borderRadius: 999, background: COLORS.line, overflow: 'hidden', marginTop: 36 }}>
        <div style={{ height: '100%', width: '100%', borderRadius: 999, background: GRADIENT, transform: `scaleX(${barW})`, transformOrigin: 'left' }} />
      </div>
    </AbsoluteFill>
  );
};

// ---- opening beat: "neuroscience researcher... brain rewires" -- an
// original brain + radiating energy graphic (not the reference photos --
// same idea, built from our own icon/animation system) -----------------------
const BrainResearchScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = interpolate(frame, [0, 10, holdFrames - 10, holdFrames], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const brainScale = interpolate(frame, [0, 16], [0.75, 1], { ...CLAMP, easing: EASINGS.overshoot });
  const rings = [0, 14, 28];

  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 29, letterSpacing: 3, color: COLORS.muted, marginBottom: 26 }}>THE RESEARCH</div>
      <div style={{ position: 'relative', width: 340, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${brainScale})` }}>
        {rings.map((delay) => {
          const t = ((frame - delay) % 90) / 90;
          const ringOp = frame < delay ? 0 : interpolate(t, [0, 0.15, 1], [0, 0.5, 0], { ...CLAMP });
          const ringScale = frame < delay ? 0.4 : interpolate(t, [0, 1], [0.4, 1.5], { ...CLAMP, easing: EASINGS.easeOut });
          return (
            <div key={delay} style={{
              position: 'absolute', width: 340, height: 340, borderRadius: '50%',
              border: `4px solid ${COLORS.accent}`, opacity: ringOp, transform: `scale(${ringScale})`,
            }} />
          );
        })}
        <Brain size={150} color={COLORS.accent} strokeWidth={1.5} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 68, color: COLORS.ink, marginTop: 30, textAlign: 'center' }}>
        Your <span style={{ color: COLORS.accent }}>brain</span> rewires itself
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 32, color: COLORS.muted, marginTop: 10 }}>under chronic stress</div>
    </AbsoluteFill>
  );
};

// ---- LinkedIn "Easy Apply" laptop mockup -- TOP-HALF ONLY -----------------
// Explicit redirect: the earlier version was a full-screen opaque cutaway
// that hid the face entirely. This scene follows the same top-half-only
// convention as every other bespoke scene above (height:960, driven by a
// local `frame`/`holdFrames` pair, not its own <Sequence>) so the real
// footage keeps playing in the bottom half underneath it, uninterrupted,
// both times this appears (intro + "Micro-actions"). Hand-built (not
// WebBrowserFrame, which drives its own entrance off the global frame count
// via useCurrentFrame() -- wrong here since this scene isn't Sequence-wrapped)
// at a smaller scale that fits inside the 960px-tall region with margin.
const LI2 = {
  pageBg: '#FFFFFF', border: '#E4E1DC', text: '#1D1D1D', textMuted: '#666666',
  blue: '#0A66C2', blueDark: '#004182', bezel: '#0C0D10', deck: '#15171B',
};
const LBOX = { x: 100, y: 60, w: 880, h: 560 };
const LCHROME_H = 78;
const LPAGE = { x: LBOX.x, y: LBOX.y + LCHROME_H, w: LBOX.w, h: LBOX.h - LCHROME_H };
const LBTN = { x: LPAGE.x + 40, y: LPAGE.y + 168, w: 168, h: 54 };
const LBTN_CENTER = { x: (LBTN.x + LBTN.w / 2) / 1080, y: (LBTN.y + LBTN.h / 2) / 960 };
const LCURSOR_KEYS: CursorKey[] = [
  { frame: 6, x: 0.74, y: 0.32 },
  { frame: 58, x: LBTN_CENTER.x, y: LBTN_CENTER.y },
];
const LCLICK_AT = 64;

const LinkedInTopScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = interpolate(frame, [0, 10, holdFrames - 10, holdFrames], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const cur = sampleCursor(frame, LCURSOR_KEYS);
  const press = frame < LCLICK_AT - 4 || frame > LCLICK_AT + 8
    ? 1
    : interpolate(frame, [LCLICK_AT - 4, LCLICK_AT, LCLICK_AT + 8], [1, 0.85, 1], { ...CLAMP });
  const rippleOn = frame >= LCLICK_AT && frame <= LCLICK_AT + 18;
  const rippleScale = interpolate(frame, [LCLICK_AT, LCLICK_AT + 18], [0, 2.2], { ...CLAMP, easing: EASINGS.easeOut });
  const rippleOp = interpolate(frame, [LCLICK_AT, LCLICK_AT + 18], [0.5, 0], { ...CLAMP });
  const applied = frame >= LCLICK_AT;
  const appliedOp = interpolate(frame, [LCLICK_AT, LCLICK_AT + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill style={{ height: 960, opacity: op }}>
      {/* laptop bezel */}
      <div style={{ position: 'absolute', left: LBOX.x - 24, top: LBOX.y - 24, width: LBOX.w + 48, height: LBOX.h + 48, borderRadius: 20, background: LI2.bezel, boxShadow: '0 22px 54px rgba(0,0,0,0.4)' }} />
      {/* screen */}
      <div style={{ position: 'absolute', left: LBOX.x, top: LBOX.y, width: LBOX.w, height: LBOX.h, borderRadius: 10, overflow: 'hidden', background: LI2.pageBg }}>
        {/* tab strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 38, background: '#dee1e6', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          <div style={{ marginLeft: 12, display: 'flex', alignItems: 'center', gap: 8, background: '#f7f8fa', borderRadius: '8px 8px 0 0', padding: '6px 16px' }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: LI2.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12, color: '#FFFFFF' }}>in</div>
            <span style={{ fontSize: 14, color: LI2.text }}>Senior Product Marketer</span>
          </div>
        </div>
        {/* nav bar */}
        <div style={{ position: 'absolute', top: 38, left: 0, right: 0, height: 40, background: '#f7f8fa', display: 'flex', alignItems: 'center', padding: '0 14px', borderBottom: `1px solid ${LI2.border}` }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#eff1f4', borderRadius: 999, padding: '7px 16px' }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: LI2.text }}>linkedin.com/jobs/view/senior-product-marketer</span>
          </div>
        </div>
        {/* page content */}
        <div style={{ position: 'absolute', left: 0, top: LCHROME_H, width: LPAGE.w, height: LPAGE.h }}>
          <div style={{ position: 'absolute', left: 40, top: 26 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 28, color: LI2.text }}>Senior Product Marketer</div>
            <div style={{ fontSize: 17, color: LI2.textMuted, marginTop: 6 }}>Northwind Digital &middot; Remote</div>
          </div>
          <div style={{ position: 'absolute', left: LBTN.x - LBOX.x, top: LBTN.y - LPAGE.y, display: 'flex', gap: 14 }}>
            <div style={{
              position: 'relative', width: LBTN.w, height: LBTN.h, borderRadius: 8,
              background: applied ? '#DCE6F1' : LI2.blue, display: 'flex', alignItems: 'center',
              justifyContent: 'center', transform: `scale(${press})`,
            }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20, color: applied ? LI2.blueDark : '#FFFFFF', opacity: applied ? appliedOp : 1 }}>
                {applied ? 'Applied ✓' : 'Easy Apply'}
              </span>
              {!applied && (
                <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20, color: '#FFFFFF', position: 'absolute', opacity: 1 - appliedOp }}>
                  Easy Apply
                </span>
              )}
            </div>
            <div style={{ width: 120, height: LBTN.h, borderRadius: 8, border: `2px solid ${LI2.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20, color: LI2.blue }}>Save</span>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 40, right: 40, top: 260, height: 1, background: LI2.border }} />
          <div style={{ position: 'absolute', left: 40, right: 40, top: 286, fontSize: 16, lineHeight: 1.55, color: LI2.text }}>
            We&apos;re looking for a Senior Product Marketer to own positioning, launches, and messaging across our product line.
          </div>
        </div>
      </div>
      {/* laptop base */}
      <div style={{ position: 'absolute', left: LBOX.x - 60, top: LBOX.y + LBOX.h + 24, width: LBOX.w + 120, height: 32, background: LI2.deck, borderRadius: '0 0 12px 12px', clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)' }} />

      {/* click ripple */}
      {rippleOn && (
        <div style={{
          position: 'absolute', left: LBTN_CENTER.x * 1080, top: LBTN_CENTER.y * 960,
          width: 30, height: 30, marginLeft: -15, marginTop: -15,
          borderRadius: '50%', border: `2px solid ${LI2.blue}`, opacity: rippleOp,
          transform: `scale(${rippleScale})`, pointerEvents: 'none',
        }} />
      )}
      {/* cursor */}
      <div style={{ position: 'absolute', left: cur.x * 1080, top: cur.y * 960, transform: 'translate(-4px, -3px)' }}>
        <CursorPointer press={press} />
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// FullReel — video-4's full ~70s vertical reel. Bottom half: real footage
// (media/projects/video-4/master-comp-native.mp4, the full clean-cut master
// transcoded comp-native 1080x1920@30, cropped with the face/shoulders offset
// proven on ProofSplitFrame — this is the same static-camera avatar take, so
// the same -140 offset applies throughout, spot-checked at render time).
// Top half: the cue-list statement cards below, timed to real transcript
// words. Word-by-word captions run the whole video over the bottom half.
//
// Cue list is my own read of the real script (videos/video-4/work/
// edited-transcript.json) — not collaboratively built beat-by-beat, per this
// pass's instruction to proceed to one checkpoint. Every window below is
// derived from a real word's start/end time, not estimated.
// =============================================================================
export const compositionConfig = {
  id: 'ExampleShortJobSearch',
  durationInSeconds: 69.8667,
  fps: 30,
  width: 1080,
  height: 1920,
};

const WORDS: CaptionWord[] = [
  { text: 'If', startMs: 256, endMs: 336 },
  { text: "you're", startMs: 336, endMs: 480 },
  { text: 'job', startMs: 497, endMs: 817 },
  { text: 'hunting', startMs: 817, endMs: 1026 },
  { text: 'and', startMs: 1074, endMs: 1154 },
  { text: 'feeling', startMs: 1154, endMs: 1362 },
  { text: 'paralyzed,', startMs: 1394, endMs: 2004 },
  { text: 'this', startMs: 2340, endMs: 2501 },
  { text: 'video', startMs: 2501, endMs: 2821 },
  { text: 'will', startMs: 2901, endMs: 2998 },
  { text: 'save', startMs: 2998, endMs: 3206 },
  { text: 'you', startMs: 3222, endMs: 3286 },
  { text: 'months', startMs: 3318, endMs: 3719 },
  { text: 'of', startMs: 3719, endMs: 3815 },
  { text: 'wasted', startMs: 3863, endMs: 4136 },
  { text: 'time.', startMs: 4184, endMs: 4521 },
  { text: 'Not', startMs: 4986, endMs: 5082 },
  { text: 'because', startMs: 5082, endMs: 5274 },
  { text: "I'll", startMs: 5274, endMs: 5418 },
  { text: 'tell', startMs: 5418, endMs: 5627 },
  { text: 'you', startMs: 5627, endMs: 5707 },
  { text: 'to', startMs: 5707, endMs: 5819 },
  { text: 'apply', startMs: 5819, endMs: 6124 },
  { text: 'more,', startMs: 6124, endMs: 6300 },
  { text: 'but', startMs: 6910, endMs: 7006 },
  { text: 'because', startMs: 7006, endMs: 7214 },
  { text: 'I', startMs: 7246, endMs: 7326 },
  { text: 'just', startMs: 7326, endMs: 7519 },
  { text: 'learned', startMs: 7551, endMs: 7727 },
  { text: 'something', startMs: 7727, endMs: 8016 },
  { text: 'from', startMs: 8112, endMs: 8208 },
  { text: 'a', startMs: 8208, endMs: 8224 },
  { text: 'neuroscience', startMs: 8224, endMs: 9010 },
  { text: 'researcher', startMs: 9010, endMs: 9395 },
  { text: 'in', startMs: 9411, endMs: 9459 },
  { text: 'Boston.', startMs: 9571, endMs: 9940 },
  { text: "He's", startMs: 10437, endMs: 10565 },
  { text: 'studying', startMs: 10565, endMs: 10902 },
  { text: 'how', startMs: 10998, endMs: 11094 },
  { text: 'the', startMs: 11094, endMs: 11222 },
  { text: 'brain', startMs: 11238, endMs: 11463 },
  { text: 'rewires', startMs: 11495, endMs: 11944 },
  { text: 'under', startMs: 12040, endMs: 12200 },
  { text: 'chronic', startMs: 12200, endMs: 12457 },
  { text: 'stress,', startMs: 12457, endMs: 12681 },
  { text: 'specifically', startMs: 12761, endMs: 13226 },
  { text: 'people', startMs: 13483, endMs: 13659 },
  { text: 'in', startMs: 13659, endMs: 13739 },
  { text: 'prolonged', startMs: 13739, endMs: 14124 },
  { text: 'job', startMs: 14124, endMs: 14317 },
  { text: 'search.', startMs: 14317, endMs: 14605 },
  { text: 'He', startMs: 15022, endMs: 15102 },
  { text: 'told', startMs: 15102, endMs: 15343 },
  { text: 'me,', startMs: 15343, endMs: 15503 },
  { text: 'after', startMs: 15888, endMs: 16112 },
  { text: '150', startMs: 16208, endMs: 16914 },
  { text: 'rejections,', startMs: 16946, endMs: 17475 },
  { text: 'your', startMs: 17731, endMs: 17828 },
  { text: 'brain', startMs: 17828, endMs: 18116 },
  { text: 'builds', startMs: 18148, endMs: 18405 },
  { text: 'a', startMs: 18405, endMs: 18469 },
  { text: 'predictive', startMs: 18469, endMs: 18918 },
  { text: 'model.', startMs: 18934, endMs: 19174 },
  { text: 'Apply', startMs: 19607, endMs: 19944 },
  { text: 'equals', startMs: 20136, endMs: 20441 },
  { text: 'danger.', startMs: 20473, endMs: 20890 },
  { text: 'Your', startMs: 21259, endMs: 21339 },
  { text: 'conscious', startMs: 21339, endMs: 21659 },
  { text: 'mind', startMs: 21675, endMs: 21932 },
  { text: 'says,', startMs: 21932, endMs: 22205 },
  { text: 'I', startMs: 22541, endMs: 22589 },
  { text: 'need', startMs: 22637, endMs: 23038 },
  { text: 'this', startMs: 23038, endMs: 23150 },
  { text: 'job.', startMs: 23199, endMs: 23583 },
  { text: 'Your', startMs: 23904, endMs: 23968 },
  { text: 'subconscious,', startMs: 23984, endMs: 24561 },
  { text: 'which', startMs: 24625, endMs: 24690 },
  { text: 'controls', startMs: 24722, endMs: 25090 },
  { text: '95%', startMs: 25122, endMs: 25700 },
  { text: 'of', startMs: 25940, endMs: 26004 },
  { text: 'your', startMs: 26004, endMs: 26116 },
  { text: 'actions,', startMs: 26149, endMs: 26501 },
  { text: 'screams,', startMs: 26742, endMs: 27223 },
  { text: 'last', startMs: 27527, endMs: 27784 },
  { text: '150', startMs: 27832, endMs: 28393 },
  { text: 'times,', startMs: 28393, endMs: 28730 },
  { text: 'this', startMs: 28970, endMs: 29115 },
  { text: 'hurt.', startMs: 29115, endMs: 29307 },
  { text: "Don't", startMs: 29580, endMs: 29756 },
  { text: 'do', startMs: 29756, endMs: 29836 },
  { text: 'it.', startMs: 29852, endMs: 29948 },
  { text: 'Result?', startMs: 30253, endMs: 30654 },
  { text: 'Paralysis.', startMs: 30959, endMs: 31488 },
  { text: 'Avoidance.', startMs: 31857, endMs: 32338 },
  { text: 'Guilt.', startMs: 32659, endMs: 32980 },
  { text: "It's", startMs: 33284, endMs: 33381 },
  { text: 'not', startMs: 33381, endMs: 33493 },
  { text: 'laziness.', startMs: 33541, endMs: 33910 },
  { text: "It's", startMs: 34279, endMs: 34407 },
  { text: 'your', startMs: 34407, endMs: 34471 },
  { text: 'nervous', startMs: 34503, endMs: 34792 },
  { text: 'system', startMs: 34808, endMs: 35049 },
  { text: 'protecting', startMs: 35049, endMs: 35450 },
  { text: 'you.', startMs: 35466, endMs: 35610 },
  { text: "Here's", startMs: 35931, endMs: 36091 },
  { text: 'how', startMs: 36091, endMs: 36123 },
  { text: 'to', startMs: 36187, endMs: 36268 },
  { text: 'fix', startMs: 36268, endMs: 36492 },
  { text: 'it.', startMs: 36492, endMs: 36588 },
  { text: '1.', startMs: 36973, endMs: 37198 },
  { text: 'Awareness.', startMs: 37535, endMs: 37920 },
  { text: 'Name', startMs: 38273, endMs: 38481 },
  { text: 'the', startMs: 38577, endMs: 38657 },
  { text: 'resistance.', startMs: 38657, endMs: 39155 },
  { text: 'Just', startMs: 39556, endMs: 39860 },
  { text: 'this', startMs: 39860, endMs: 40037 },
  { text: 'weakens', startMs: 40037, endMs: 40325 },
  { text: 'the', startMs: 40422, endMs: 40502 },
  { text: 'loop.', startMs: 40502, endMs: 40662 },
  { text: '2.', startMs: 41143, endMs: 41288 },
  { text: 'Micro-actions.', startMs: 41641, endMs: 42298 },
  { text: 'Stop', startMs: 42619, endMs: 42908 },
  { text: '50', startMs: 42924, endMs: 43132 },
  { text: 'applications', startMs: 43229, endMs: 43662 },
  { text: 'a', startMs: 43662, endMs: 43726 },
  { text: 'day.', startMs: 43726, endMs: 43806 },
  { text: 'Start', startMs: 44207, endMs: 44447 },
  { text: 'with', startMs: 44447, endMs: 44544 },
  { text: '1.', startMs: 44592, endMs: 44816 },
  { text: 'In', startMs: 45169, endMs: 45217 },
  { text: 'calm', startMs: 45314, endMs: 45570 },
  { text: 'state.', startMs: 45570, endMs: 45859 },
  { text: '3.', startMs: 46276, endMs: 46532 },
  { text: 'Reframe', startMs: 46853, endMs: 47254 },
  { text: 'rejection.', startMs: 47254, endMs: 47703 },
  { text: 'Every', startMs: 48120, endMs: 48265 },
  { text: 'rejection', startMs: 48297, endMs: 48746 },
  { text: 'equals', startMs: 48842, endMs: 49147 },
  { text: 'data', startMs: 49179, endMs: 49403 },
  { text: 'point,', startMs: 49403, endMs: 49612 },
  { text: 'not', startMs: 49804, endMs: 50045 },
  { text: 'judgment.', startMs: 50045, endMs: 50446 },
  { text: '4.', startMs: 50847, endMs: 51055 },
  { text: 'Calm', startMs: 51424, endMs: 51729 },
  { text: 'your', startMs: 51729, endMs: 51793 },
  { text: 'nervous', startMs: 51825, endMs: 52050 },
  { text: 'system.', startMs: 52050, endMs: 52306 },
  { text: '2', startMs: 52611, endMs: 52707 },
  { text: 'minutes', startMs: 52707, endMs: 52948 },
  { text: 'deep', startMs: 52948, endMs: 53108 },
  { text: 'breathing', startMs: 53108, endMs: 53333 },
  { text: 'before', startMs: 53349, endMs: 53606 },
  { text: 'applying.', startMs: 53654, endMs: 53958 },
  { text: '5.', startMs: 54311, endMs: 54600 },
  { text: 'Evidence', startMs: 54953, endMs: 55209 },
  { text: 'over', startMs: 55209, endMs: 55354 },
  { text: 'affirmations.', startMs: 55354, endMs: 55851 },
  { text: 'Your', startMs: 56140, endMs: 56188 },
  { text: 'subconscious', startMs: 56188, endMs: 56701 },
  { text: 'believes', startMs: 56701, endMs: 57006 },
  { text: 'what', startMs: 57022, endMs: 57118 },
  { text: 'you', startMs: 57118, endMs: 57262 },
  { text: 'do,', startMs: 57262, endMs: 57375 },
  { text: 'not', startMs: 57663, endMs: 57792 },
  { text: 'what', startMs: 57824, endMs: 57920 },
  { text: 'you', startMs: 57920, endMs: 58000 },
  { text: 'say.', startMs: 58000, endMs: 58193 },
  { text: 'Your', startMs: 58530, endMs: 58610 },
  { text: 'brain', startMs: 58642, endMs: 58964 },
  { text: "isn't", startMs: 58964, endMs: 59125 },
  { text: 'broken.', startMs: 59125, endMs: 59415 },
  { text: "It's", startMs: 59785, endMs: 59866 },
  { text: 'a', startMs: 59866, endMs: 59882 },
  { text: 'prediction', startMs: 59914, endMs: 60236 },
  { text: 'machine,', startMs: 60252, endMs: 60542 },
  { text: 'predicting', startMs: 60816, endMs: 61186 },
  { text: 'based', startMs: 61218, endMs: 61460 },
  { text: 'on', startMs: 61460, endMs: 61588 },
  { text: 'old', startMs: 61685, endMs: 61862 },
  { text: 'data.', startMs: 61862, endMs: 62200 },
  { text: 'Your', startMs: 62587, endMs: 62667 },
  { text: 'job?', startMs: 62667, endMs: 63005 },
  { text: 'Feed', startMs: 63391, endMs: 63552 },
  { text: 'it', startMs: 63552, endMs: 63617 },
  { text: 'new', startMs: 63617, endMs: 63778 },
  { text: 'data,', startMs: 63778, endMs: 64116 },
  { text: 'one', startMs: 64502, endMs: 64663 },
  { text: 'application', startMs: 64663, endMs: 65098 },
  { text: 'at', startMs: 65146, endMs: 65227 },
  { text: 'a', startMs: 65227, endMs: 65243 },
  { text: 'time.', startMs: 65243, endMs: 65581 },
  { text: 'If', startMs: 65967, endMs: 66032 },
  { text: 'this', startMs: 66048, endMs: 66193 },
  { text: 'resonates,', startMs: 66193, endMs: 66692 },
  { text: 'drop', startMs: 66998, endMs: 67191 },
  { text: 'a', startMs: 67191, endMs: 67239 },
  { text: 'comment.', startMs: 67239, endMs: 67626 },
  { text: "What's", startMs: 68060, endMs: 68237 },
  { text: 'one', startMs: 68286, endMs: 68414 },
  { text: 'micro-action', startMs: 68463, endMs: 69107 },
  { text: "you'll", startMs: 69107, endMs: 69252 },
  { text: 'take', startMs: 69252, endMs: 69413 },
  { text: 'today?', startMs: 69429, endMs: 69702 },
];

type Card = {
  startFrame: number;
  endFrame: number;
  kicker?: string;
  headline: string;
  accentWord?: string;
  sub?: string;
  tone?: 'default' | 'danger' | 'signature' | 'positive';
  // when set, render a bespoke motion-graphic scene instead of the generic
  // TopCard -- kicker/headline/sub/tone above are unused for these (the
  // scene component owns its own content) but kept for documentation.
  scene?: 'rejectionTally' | 'dangerPulse' | 'brainStat' | 'negativeStack' | 'fixIntro' | 'awareness' | 'reframe' | 'calm' | 'evidence' | 'signature' | 'cta' | 'brainResearch' | 'linkedin';
};

// Every window below is derived from a real word's start time in WORDS above
// (e.g. stat-150 starts a hair before "150" at 16208ms -> frame 486).
// Content paraphrases the script (statement cards summarize; WordCaptionOverlay
// already carries the verbatim words), per the make-tsx house convention.
// Color language: 'default' = navy accent (pattern/stat/step insight),
// 'danger' = negative-outcome cards, 'positive' = the CTA (signal green),
// 'signature' = the brand signoff callback.
const CARDS: Card[] = [
  // LinkedIn "Easy Apply" laptop mockup, top-half only -- real footage keeps
  // playing underneath in the bottom half throughout (see LinkedInTopScene).
  { startFrame: 0, endFrame: 120, headline: 'LinkedIn: Easy Apply (intro)', scene: 'linkedin' },
  { startFrame: 130, endFrame: 460, kicker: 'THE RESEARCH', headline: 'Your brain rewires itself', sub: 'under chronic stress', scene: 'brainResearch' },
  { startFrame: 482, endFrame: 587, kicker: 'THE PATTERN', headline: '150 rejections', sub: '→ one predictive model', scene: 'rejectionTally' },
  { startFrame: 587, endFrame: 636, headline: 'Apply = danger.', tone: 'danger', scene: 'dangerPulse' },
  { startFrame: 750, endFrame: 824, kicker: 'THE SUBCONSCIOUS', headline: '95%', sub: 'of your actions', scene: 'brainStat' },
  { startFrame: 905, endFrame: 996, kicker: 'THE RESULT', headline: 'Paralysis. Avoidance. Guilt.', tone: 'danger', scene: 'negativeStack' },
  { startFrame: 1076, endFrame: 1107, kicker: 'THE FIX', headline: '5 ways to fix it', accentWord: 'fix', scene: 'fixIntro' },
  { startFrame: 1107, endFrame: 1232, kicker: 'STEP 1', headline: 'Awareness', sub: 'Name the resistance', scene: 'awareness' },
  // STEP 2 ("Micro-actions") -- the same LinkedIn top-half mockup, second
  // appearance, over its own word window instead of a text card.
  { startFrame: 1232, endFrame: 1386, headline: 'LinkedIn: Easy Apply (micro-action)', scene: 'linkedin' },
  { startFrame: 1386, endFrame: 1523, kicker: 'STEP 3', headline: 'Reframe rejection', accentWord: 'Reframe', sub: 'Data, not judgment', scene: 'reframe' },
  { startFrame: 1523, endFrame: 1627, kicker: 'STEP 4', headline: 'Calm your system', accentWord: 'Calm', sub: '2 minutes of deep breathing', scene: 'calm' },
  { startFrame: 1627, endFrame: 1680, kicker: 'STEP 5', headline: 'Evidence > affirmations', accentWord: 'Evidence', scene: 'evidence' },
  { startFrame: 1932, endFrame: 1974, headline: 'One application at a time.', accentWord: 'One', tone: 'signature', scene: 'signature' },
  { startFrame: 1974, endFrame: 2094, kicker: 'YOUR TURN', headline: 'Drop a comment ⬇', sub: "What's one micro-action you'll take today?", tone: 'positive', scene: 'cta' },
];

const FullReel: React.FC = () => {
  const frame = useCurrentFrame();
  const activeCard = CARDS.find((c) => frame >= c.startFrame && frame < c.endFrame);

  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      {/* warm orange/yellow gradient + blocks behind the top-half cards -- per
          explicit request, a deviation from brand.md's navy palette (see
          WarmGradientBg's comment in lib/kit.tsx). Full canvas, but the video
          below fully occludes it in the bottom half. */}
      <WarmGradientBg />

      {/* bottom half: real footage, cropped to face/shoulders */}
      <div style={{ position: 'absolute', left: 0, top: 960, width: 1080, height: 960, overflow: 'hidden' }}>
        <OffthreadVideo
          src={staticFile(FOOTAGE)}
          style={{ position: 'absolute', top: -140, left: 0, width: 1080, height: 1920 }}
        />
      </div>

      {/* top half: cue-list statement cards -- bespoke motion-graphic scenes
          for the beats that have one, generic TopCard for the rest */}
      {activeCard && (() => {
        const localFrame = frame - activeCard.startFrame;
        const holdFrames = activeCard.endFrame - activeCard.startFrame;
        if (activeCard.scene === 'rejectionTally') return <RejectionTally frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'dangerPulse') return <DangerPulse frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'brainStat') return <BrainStat frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'negativeStack') return <NegativeStack frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'awareness') return <AwarenessScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'reframe') return <ReframeScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'calm') return <CalmScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'evidence') return <EvidenceScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'cta') return <CtaScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'fixIntro') return <FixIntroScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'signature') return <SignatureScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'brainResearch') return <BrainResearchScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'linkedin') return <LinkedInTopScene frame={localFrame} holdFrames={holdFrames} />;
        return (
          <TopCard
            frame={localFrame}
            holdFrames={holdFrames}
            kicker={activeCard.kicker}
            headline={activeCard.headline}
            accentWord={activeCard.accentWord}
            sub={activeCard.sub}
            tone={activeCard.tone}
          />
        );
      })()}

      {/* captions over the bottom-half video -- stay on top even during the
          cutaway above, since the narration keeps playing throughout */}
      <WordCaptionOverlay words={WORDS} />
    </AbsoluteFill>
  );
};
export default FullReel;
