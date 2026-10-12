// REFERENCE COMPOSITION (not auto-registered). To use or preview it, copy this folder into
// remotion/src/shots/<your-video>/ and run `cd remotion && npm run gen`. Imports assume that
// location. See examples/README.md.
import React from 'react';
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import {
  Cpu, DollarSign, Database, Clock, Link2, Users, Shield, Globe, MapPin,
  Wrench, BookOpen, PenLine, Repeat, CheckCircle2, XCircle, Send, Building2,
  ArrowRight,
} from 'lucide-react';
import { COLORS, EASINGS, GRADIENT } from '../../brand';
import { FONT_BODY, FONT_DISPLAY, FONT_MONO } from '../../fonts';
import { CLAMP, TopCard, BrandBg, WordCaptionOverlay, CaptionWord } from '../../lib/kit';
// Path (relative to media/) of YOUR face footage, pre-cropped to exactly 1080x960 (the bottom half).
// See docs/SHORTS-FORMAT.md. This file is not shipped in the repo.
const FOOTAGE = 'projects/my-short/master-comp-native.mp4';

// ---- bespoke motion-graphic scenes (per beat) -------------------------------
// Local `frame`/`holdFrames` convention (frame 0 = this card's window start),
// matching TopCard's own convention. house fade: [0,10,hold-10,hold]->[0,1,1,0].
const fadeOp = (frame: number, hold: number) =>
  interpolate(frame, [0, 10, hold - 10, hold], [0, 1, 1, 0], { ...CLAMP, easing: EASINGS.easeOut });

const DANGER_CHIP = '#4A1420';

// ---- "Not the bottleneck" -- SLAM chip + capital chip, both crossed out -----
const NotBottleneckScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const items = [
    { icon: <Cpu size={54} color={COLORS.muted} strokeWidth={1.7} />, label: 'SLAM models', at: 6 },
    { icon: <DollarSign size={54} color={COLORS.muted} strokeWidth={1.7} />, label: 'More capital', at: 26 },
  ];
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.muted, marginBottom: 30 }}>NOT YOUR BOTTLENECK</div>
      <div style={{ display: 'flex', gap: 28 }}>
        {items.map((it) => {
          const s = interpolate(frame, [it.at, it.at + 12], [0.7, 1], { ...CLAMP, easing: EASINGS.overshoot });
          const xOp = interpolate(frame, [it.at + 14, it.at + 24], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
          return (
            <div key={it.label} style={{ position: 'relative', width: 220, height: 200, background: COLORS.cream, border: `2px solid ${COLORS.line}`, borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, transform: `scale(${s})` }}>
              {it.icon}
              <span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 24, color: COLORS.ink, textAlign: 'center', padding: '0 12px' }}>{it.label}</span>
              <XCircle size={64} color={COLORS.danger} strokeWidth={2.2} style={{ position: 'absolute', opacity: xOp, background: COLORS.paper, borderRadius: '50%' }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---- "1 hour of bad data -> weeks of retraining" -- clock ticking up -------
const DataCostScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const iconScale = interpolate(frame, [0, 14], [0.7, 1], { ...CLAMP, easing: EASINGS.overshoot });
  const spin = interpolate(frame, [10, 60], [0, 200], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.danger, marginBottom: 26 }}>UNUSABLE CAPTURE</div>
      <div style={{ position: 'relative', width: 260, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${iconScale})` }}>
        <svg width={260} height={260} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
          <circle cx={130} cy={130} r={104} fill="none" stroke="rgba(179,63,82,0.18)" strokeWidth={14} />
          <circle cx={130} cy={130} r={104} fill="none" stroke={COLORS.danger} strokeWidth={14} strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 104} strokeDashoffset={2 * Math.PI * 104 * (1 - Math.min(spin, 100) / 100)} />
        </svg>
        <Clock size={118} color={COLORS.danger} strokeWidth={1.5} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 66, color: COLORS.ink, marginTop: 26, textAlign: 'center' }}>
        1 hour <span style={{ color: COLORS.muted, fontSize: 44 }}>on the floor</span>
      </div>
    </AbsoluteFill>
  );
};

const WeeksRetrainScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const count = Math.round(interpolate(frame, [8, 55], [0, 3], { ...CLAMP, easing: EASINGS.easeOut }));
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.muted, marginBottom: 26 }}>YOUR ML PIPELINE PAYS</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 150, color: COLORS.danger }}>{count}+</span>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 56, color: COLORS.ink }}>weeks</span>
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 32, color: COLORS.muted, marginTop: 14 }}>of retraining, downstream</div>
    </AbsoluteFill>
  );
};

// ---- "value chain of physical AI dies at ground-level capture" -- chain ----
const ChainScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const breakAt = 34;
  const gap = interpolate(frame, [breakAt, breakAt + 16], [0, 46], { ...CLAMP, easing: EASINGS.easeOut });
  const linkScale = interpolate(frame, [0, 14], [0.75, 1], { ...CLAMP, easing: EASINGS.overshoot });
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.muted, marginBottom: 30 }}>THE VALUE CHAIN</div>
      <div style={{ display: 'flex', alignItems: 'center', transform: `scale(${linkScale})` }}>
        <Link2 size={90} color={COLORS.accent} strokeWidth={1.6} />
        <div style={{ width: gap }} />
        <Link2 size={90} color={frame > breakAt ? COLORS.danger : COLORS.accent} strokeWidth={1.6} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 60, color: COLORS.ink, marginTop: 32, textAlign: 'center', padding: '0 60px' }}>
        Dies at <span style={{ color: COLORS.danger }}>ground-level</span> capture
      </div>
    </AbsoluteFill>
  );
};

// ---- "hiring 20 ops managers at once" -- a 20-dot grid filling in ----------
const TwentyHiresScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.muted, marginBottom: 10 }}>RIGHT NOW, YOU'RE HIRING</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 150, color: COLORS.accent, lineHeight: 1 }}>20</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10, width: 420, marginTop: 22, marginBottom: 22 }}>
        {Array.from({ length: 20 }).map((_, i) => {
          const at = 10 + i * 2.2;
          const s = interpolate(frame, [at, at + 8], [0, 1], { ...CLAMP, easing: EASINGS.overshoot });
          return <Users key={i} size={32} color={COLORS.accent2} strokeWidth={1.8} style={{ transform: `scale(${s})`, opacity: s }} />;
        })}
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: COLORS.muted, textAlign: 'center' }}>not just filling seats</div>
    </AbsoluteFill>
  );
};

// ---- "betting 20 untrained people protect your data supply chain" -- shield
const ShieldScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const pulse = 1 + 0.05 * Math.sin(frame / 6);
  const crackOp = interpolate(frame, [24, 40], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.warn, marginBottom: 26 }}>HIGH STAKES</div>
      <div style={{ position: 'relative', transform: `scale(${pulse})` }}>
        <Shield size={190} color={COLORS.warn} strokeWidth={1.4} fill={`${COLORS.warn}18`} />
        <div style={{ position: 'absolute', top: 30, left: 92, width: 4, height: 130, background: DANGER_CHIP, opacity: crackOp, transform: 'rotate(8deg)' }} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 56, color: COLORS.ink, marginTop: 28, textAlign: 'center', padding: '0 60px' }}>
        The most expensive part of your <span style={{ color: COLORS.warn }}>data supply chain</span>
      </div>
    </AbsoluteFill>
  );
};

// ---- "I've built field operations from scratch" -- building blocks stack --
const FieldOpsScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const rows = [0, 1, 2];
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.signal, marginBottom: 30 }}>FROM SCRATCH</div>
      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 10 }}>
        {rows.map((r) => {
          const at = 8 + r * 14;
          const y = interpolate(frame, [at, at + 14], [40, 0], { ...CLAMP, easing: EASINGS.overshoot });
          const rOp = interpolate(frame, [at, at + 12], [0, 1], { ...CLAMP });
          return (
            <div key={r} style={{ width: 300 - r * 10, height: 46, borderRadius: 10, background: COLORS.accent2, opacity: rOp, transform: `translateY(${y}px)`, marginLeft: r * 5 }} />
          );
        })}
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 62, color: COLORS.ink, marginTop: 30, textAlign: 'center' }}>Field operations</div>
    </AbsoluteFill>
  );
};

// ---- "5 countries: Dubai, UK, Ireland, India" -- globe + dropping pins -----
const GlobeScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const globeScale = interpolate(frame, [0, 16], [0.8, 1], { ...CLAMP, easing: EASINGS.overshoot });
  const spin = (frame * 0.6) % 360;
  const places = ['Dubai', 'UK', 'Ireland', 'India'];
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.muted, marginBottom: 20 }}>5 COUNTRIES</div>
      <div style={{ position: 'relative', width: 220, height: 220, transform: `scale(${globeScale})` }}>
        <Globe size={220} color={COLORS.accent} strokeWidth={1.2} style={{ transform: `rotate(${spin}deg)` }} />
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 26, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 640 }}>
        {places.map((p, i) => {
          const at = 20 + i * 16;
          const pop = interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.overshoot });
          return (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${COLORS.accent}14`, border: `1px solid ${COLORS.accent}44`, borderRadius: 999, padding: '10px 20px', transform: `scale(${pop})`, opacity: pop }}>
              <MapPin size={22} color={COLORS.accent} strokeWidth={2} />
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 26, color: COLORS.ink }}>{p}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---- "50+ site operations in a single quarter" -----------------------------
const FiftyOpsScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const count = Math.round(interpolate(frame, [8, 55], [0, 50], { ...CLAMP, easing: EASINGS.easeOut }));
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.muted, marginBottom: 10 }}>ONE SINGLE QUARTER</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 168, color: COLORS.accent, lineHeight: 1 }}>{count}+</div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 34, color: COLORS.muted, marginTop: 14 }}>site operations run</div>
    </AbsoluteFill>
  );
};

// ---- "managed C-level stakeholders without escalating" ---------------------
const NoEscalationScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const s = interpolate(frame, [0, 14], [0.75, 1], { ...CLAMP, easing: EASINGS.overshoot });
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.muted, marginBottom: 26 }}>C-LEVEL STAKEHOLDERS</div>
      <div style={{ transform: `scale(${s})`, marginBottom: 6 }}>
        <Building2 size={140} color={COLORS.accent} strokeWidth={1.4} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, background: `${COLORS.signal}16`, border: `1px solid ${COLORS.signal}55`, borderRadius: 999, padding: '14px 30px' }}>
        <CheckCircle2 size={30} color={COLORS.signal} strokeWidth={2.2} />
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 34, color: COLORS.signal }}>Zero escalations</span>
      </div>
    </AbsoluteFill>
  );
};

// ---- "built 4 operational systems from zero infrastructure" ---------------
const FourSystemsScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const labels = ['Intake', 'QA', 'Escalation', 'Handoff'];
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.muted, marginBottom: 10 }}>FROM ZERO INFRASTRUCTURE</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 130, color: COLORS.accent, lineHeight: 1, marginBottom: 20 }}>4</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {labels.map((l, i) => {
          const at = 14 + i * 12;
          const s = interpolate(frame, [at, at + 12], [0.7, 1], { ...CLAMP, easing: EASINGS.overshoot });
          const lop = interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP });
          return (
            <div key={l} style={{ width: 190, height: 76, borderRadius: 14, background: COLORS.cream, border: `1px solid ${COLORS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`, opacity: lop }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 26, color: COLORS.ink }}>{l}</span>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: COLORS.muted, marginTop: 22 }}>operational systems</div>
    </AbsoluteFill>
  );
};

// ---- "I don't wait for a playbook, I write it." -- pen writing a line -----
const PlaybookScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const bookScale = interpolate(frame, [0, 14], [0.75, 1], { ...CLAMP, easing: EASINGS.overshoot });
  const lineW = interpolate(frame, [16, 50], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const penX = interpolate(frame, [16, 50], [0, 200], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.muted, marginBottom: 26 }}>NEW ENVIRONMENT</div>
      <div style={{ position: 'relative', transform: `scale(${bookScale})` }}>
        <BookOpen size={160} color={COLORS.accent} strokeWidth={1.3} />
      </div>
      <div style={{ position: 'relative', width: 220, height: 6, background: COLORS.line, borderRadius: 4, marginTop: 30, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${lineW * 100}%`, background: COLORS.accent, borderRadius: 4 }} />
        <PenLine size={30} color={COLORS.ink} strokeWidth={2} style={{ position: 'absolute', top: -22, left: penX, transform: 'rotate(20deg)' }} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 62, color: COLORS.ink, marginTop: 40, textAlign: 'center' }}>
        I <span style={{ color: COLORS.accent }}>write</span> the playbook
      </div>
    </AbsoluteFill>
  );
};

// ---- "the next person can run it without calling me" -- handoff arrow -----
const HandoffScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const arrowX = interpolate(frame, [10, 40], [0, 90], { ...CLAMP, easing: EASINGS.easeOut });
  const arrowOp = interpolate(frame, [10, 22], [0, 1], { ...CLAMP });
  const p2Scale = interpolate(frame, [38, 50], [0.7, 1], { ...CLAMP, easing: EASINGS.overshoot });
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.muted, marginBottom: 30 }}>BUILT TO OUTLAST ME</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Users size={90} color={COLORS.accent} strokeWidth={1.5} />
        <ArrowRight size={54} color={COLORS.accent2} strokeWidth={2.2} style={{ transform: `translateX(${arrowX}px)`, opacity: arrowOp }} />
        <Users size={90} color={COLORS.signal} strokeWidth={1.5} style={{ transform: `scale(${p2Scale})` }} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 56, color: COLORS.ink, marginTop: 34, textAlign: 'center', padding: '0 60px' }}>
        Runs it <span style={{ color: COLORS.signal }}>without calling me</span>
      </div>
    </AbsoluteFill>
  );
};

// ---- "not just someone who shows up and follows protocol" -- crossed card -
const NotJustScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const xOp = interpolate(frame, [18, 30], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.muted, marginBottom: 26 }}>NOT WHAT YOU NEED</div>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: COLORS.cream, border: `1px solid ${COLORS.line}`, borderRadius: 18, padding: '22px 34px' }}>
          <Repeat size={54} color={COLORS.muted} strokeWidth={1.8} />
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 34, color: COLORS.muted }}>Shows up. Follows protocol.</span>
        </div>
        <XCircle size={70} color={COLORS.danger} strokeWidth={2.2} style={{ position: 'absolute', top: -20, right: -20, opacity: xOp, background: COLORS.paper, borderRadius: '50%' }} />
      </div>
    </AbsoluteFill>
  );
};

// ---- "builds the protocol, trains others on it" -- 2-step checklist -------
const ChecklistScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const items = ['Builds the protocol', 'Trains others on it'];
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.signal, marginBottom: 30 }}>WHAT YOU NEED</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {items.map((it, i) => {
          const at = 8 + i * 26;
          const rop = interpolate(frame, [at, at + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
          const rx = interpolate(frame, [at, at + 12], [-30, 0], { ...CLAMP, easing: EASINGS.easeOut });
          return (
            <div key={it} style={{ display: 'flex', alignItems: 'center', gap: 20, opacity: rop, transform: `translateX(${rx}px)`, background: `${COLORS.signal}14`, border: `1px solid ${COLORS.signal}44`, borderRadius: 16, padding: '18px 30px' }}>
              <CheckCircle2 size={40} color={COLORS.signal} strokeWidth={2.2} />
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 34, color: COLORS.ink }}>{it}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---- "SF team never has to question what came off the floor" --------------
const DataCleanScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const s = interpolate(frame, [0, 16], [0.75, 1], { ...CLAMP, easing: EASINGS.overshoot });
  const checkOp = interpolate(frame, [20, 32], [0, 1], { ...CLAMP });
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.muted, marginBottom: 26 }}>DATA YOUR SF TEAM TRUSTS</div>
      <div style={{ position: 'relative', transform: `scale(${s})` }}>
        <Database size={140} color={COLORS.accent} strokeWidth={1.4} />
        <CheckCircle2 size={56} color={COLORS.signal} strokeWidth={2.4} style={{ position: 'absolute', bottom: -8, right: -12, opacity: checkOp, background: COLORS.paper, borderRadius: '50%' }} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 52, color: COLORS.ink, marginTop: 30, textAlign: 'center', padding: '0 70px' }}>
        Never questions what <span style={{ color: COLORS.accent }}>came off the floor</span>
      </div>
    </AbsoluteFill>
  );
};

// ---- intro: "Human Archive" wordmark reveal --------------------------------
const IntroScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const y = interpolate(frame, [0, 16], [24, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const barW = interpolate(frame, [18, 40], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op, transform: `translateY(${y}px)`, padding: '0 60px' }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.muted, marginBottom: 22, textAlign: 'center' }}>A NOTE FOR</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Building2 size={54} color={COLORS.accent} strokeWidth={1.6} />
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 78, color: COLORS.ink, margin: 0, textAlign: 'center' }}>
          Human <span style={{ color: COLORS.accent }}>Archive</span>
        </h1>
      </div>
      <div style={{ width: 260, height: 8, borderRadius: 999, background: COLORS.line, overflow: 'hidden', marginTop: 30 }}>
        <div style={{ height: '100%', width: '100%', borderRadius: 999, background: GRADIENT, transform: `scaleX(${barW})`, transformOrigin: 'left' }} />
      </div>
    </AbsoluteFill>
  );
};

// ---- CTA: "15 minutes to walk you through it" ------------------------------
const CtaScene: React.FC<{ frame: number; holdFrames: number }> = ({ frame, holdFrames }) => {
  const op = fadeOp(frame, holdFrames);
  const sendScale = interpolate(frame, [0, 14], [0.6, 1], { ...CLAMP, easing: EASINGS.overshoot });
  const sendFloat = interpolate(frame, [8, 30], [0, -10], { ...CLAMP, easing: EASINGS.easeOut });
  const glowOp = interpolate(frame, [8, 22], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <AbsoluteFill style={{ height: 960, alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: 3, color: COLORS.signal, marginBottom: 20 }}>YOUR TURN</div>
      <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${sendScale}) translateY(${sendFloat}px)` }}>
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.signal}33, transparent 70%)`, opacity: glowOp }} />
        <Send size={120} color={COLORS.signal} strokeWidth={1.5} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 80, color: COLORS.ink, marginTop: 26, textAlign: 'center' }}>
        <span style={{ color: COLORS.signal }}>15 minutes</span>
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 32, color: COLORS.muted, marginTop: 10, textAlign: 'center', padding: '0 70px' }}>to walk you through it, Human Archive</div>
    </AbsoluteFill>
  );
};

// =============================================================================
// FullReel — video-5's vertical reel: a cold-outreach pitch to "Human Archive"
// for an Ops Manager role. Bottom half: real HeyGen avatar footage, already
// pre-cropped + color-graded to media/projects/video-5/master-comp-native.mp4
// (1080x960, watermark-safe crop — see the project's work notes: the raw
// HeyGen export carried a tiled trial watermark across the whole frame, so the
// footage is cropped tight to a watermark-free eyes-to-collar window instead
// of the usual full-bleed offset trick). Top half: bespoke motion-graphic
// beats timed to edited-transcript.json. Word-by-word captions run throughout.
// =============================================================================
export const compositionConfig = {
  id: 'ExampleShortPitch',
  durationInSeconds: 107.4667,
  fps: 30,
  width: 1080,
  height: 1920,
};

const WORDS: CaptionWord[] = [
  { text: "Hi,", startMs: 256, endMs: 465 },
  { text: "I'm", startMs: 899, endMs: 1075 },
  { text: "Saksham.", startMs: 1075, endMs: 1686 },
  { text: "Here's", startMs: 2183, endMs: 2520 },
  { text: "something", startMs: 2520, endMs: 2938 },
  { text: "most", startMs: 3083, endMs: 3468 },
  { text: "candidates", startMs: 3468, endMs: 4110 },
  { text: "applying", startMs: 4190, endMs: 4736 },
  { text: "to", startMs: 4849, endMs: 4977 },
  { text: "Human", startMs: 4993, endMs: 5298 },
  { text: "Archive", startMs: 5395, endMs: 5941 },
  { text: "probably", startMs: 6117, endMs: 6744 },
  { text: "haven't", startMs: 6760, endMs: 7081 },
  { text: "noticed.", startMs: 7097, endMs: 7755 },
  { text: "Your", startMs: 8141, endMs: 8333 },
  { text: "real", startMs: 8462, endMs: 8831 },
  { text: "bottleneck", startMs: 8847, endMs: 9521 },
  { text: "isn't", startMs: 9730, endMs: 10148 },
  { text: "building", startMs: 10148, endMs: 10453 },
  { text: "better", startMs: 10613, endMs: 10870 },
  { text: "SLAM", startMs: 10870, endMs: 11224 },
  { text: "models", startMs: 11288, endMs: 11721 },
  { text: "or", startMs: 12219, endMs: 12267 },
  { text: "raising", startMs: 12540, endMs: 12845 },
  { text: "more", startMs: 12958, endMs: 13199 },
  { text: "capital.", startMs: 13199, endMs: 13648 },
  { text: "It's", startMs: 14146, endMs: 14323 },
  { text: "the", startMs: 14323, endMs: 14403 },
  { text: "fact", startMs: 14403, endMs: 14965 },
  { text: "that", startMs: 14965, endMs: 15077 },
  { text: "every", startMs: 15270, endMs: 15495 },
  { text: "hour", startMs: 15752, endMs: 16041 },
  { text: "of", startMs: 16153, endMs: 16298 },
  { text: "unusable", startMs: 16394, endMs: 17117 },
  { text: "deployment", startMs: 17117, endMs: 17679 },
  { text: "data", startMs: 17759, endMs: 18176 },
  { text: "collected", startMs: 18417, endMs: 19027 },
  { text: "on", startMs: 19124, endMs: 19204 },
  { text: "a", startMs: 19204, endMs: 19220 },
  { text: "factory", startMs: 19220, endMs: 19750 },
  { text: "floor", startMs: 19782, endMs: 20135 },
  { text: "costs", startMs: 20569, endMs: 21035 },
  { text: "your", startMs: 21147, endMs: 21340 },
  { text: "ML", startMs: 21532, endMs: 21741 },
  { text: "pipeline", startMs: 21853, endMs: 22399 },
  { text: "weeks", startMs: 22753, endMs: 23218 },
  { text: "of", startMs: 23299, endMs: 23363 },
  { text: "retraining", startMs: 23459, endMs: 23989 },
  { text: "downstream.", startMs: 24037, endMs: 24808 },
  { text: "The", startMs: 25226, endMs: 25322 },
  { text: "entire", startMs: 25322, endMs: 25820 },
  { text: "value", startMs: 25884, endMs: 26285 },
  { text: "chain", startMs: 26285, endMs: 26574 },
  { text: "of", startMs: 26751, endMs: 26815 },
  { text: "physical", startMs: 26912, endMs: 27313 },
  { text: "AI", startMs: 27393, endMs: 27682 },
  { text: "starts", startMs: 28052, endMs: 28581 },
  { text: "and", startMs: 28854, endMs: 28919 },
  { text: "dies", startMs: 29015, endMs: 29464 },
  { text: "at", startMs: 29641, endMs: 29786 },
  { text: "ground-level", startMs: 29818, endMs: 30524 },
  { text: "capture", startMs: 30540, endMs: 31006 },
  { text: "quality.", startMs: 31006, endMs: 31439 },
  { text: "And", startMs: 31825, endMs: 31889 },
  { text: "right", startMs: 32049, endMs: 32258 },
  { text: "now,", startMs: 32306, endMs: 32419 },
  { text: "you're", startMs: 32948, endMs: 33093 },
  { text: "hiring", startMs: 33173, endMs: 33542 },
  { text: "20", startMs: 33655, endMs: 33928 },
  { text: "ops", startMs: 34056, endMs: 34297 },
  { text: "managers", startMs: 34297, endMs: 34795 },
  { text: "at", startMs: 34795, endMs: 34891 },
  { text: "once,", startMs: 34939, endMs: 35389 },
  { text: "which", startMs: 35758, endMs: 35886 },
  { text: "means", startMs: 35983, endMs: 36240 },
  { text: "you're", startMs: 36400, endMs: 36593 },
  { text: "not", startMs: 36593, endMs: 36834 },
  { text: "just", startMs: 36882, endMs: 37187 },
  { text: "filling", startMs: 37187, endMs: 37412 },
  { text: "seats.", startMs: 37460, endMs: 37893 },
  { text: "You're", startMs: 38311, endMs: 38552 },
  { text: "betting", startMs: 38568, endMs: 38841 },
  { text: "that", startMs: 38953, endMs: 39065 },
  { text: "20", startMs: 39130, endMs: 39419 },
  { text: "people", startMs: 39515, endMs: 40029 },
  { text: "you've", startMs: 40077, endMs: 40253 },
  { text: "never", startMs: 40253, endMs: 40575 },
  { text: "trained", startMs: 40575, endMs: 40896 },
  { text: "before", startMs: 40896, endMs: 41329 },
  { text: "will", startMs: 41618, endMs: 41731 },
  { text: "protect", startMs: 41779, endMs: 42276 },
  { text: "the", startMs: 42325, endMs: 42373 },
  { text: "most", startMs: 42405, endMs: 42758 },
  { text: "expensive", startMs: 42758, endMs: 43320 },
  { text: "part", startMs: 43384, endMs: 43786 },
  { text: "of", startMs: 43786, endMs: 43866 },
  { text: "your", startMs: 43866, endMs: 43978 },
  { text: "data", startMs: 44026, endMs: 44219 },
  { text: "supply", startMs: 44267, endMs: 44733 },
  { text: "chain", startMs: 44733, endMs: 44958 },
  { text: "from", startMs: 45455, endMs: 45568 },
  { text: "day", startMs: 45632, endMs: 45857 },
  { text: "one.", startMs: 45873, endMs: 46081 },
  { text: "That's", startMs: 46499, endMs: 46820 },
  { text: "where", startMs: 46820, endMs: 46948 },
  { text: "I", startMs: 46997, endMs: 47157 },
  { text: "come", startMs: 47157, endMs: 47286 },
  { text: "in.", startMs: 47382, endMs: 47430 },
  { text: "I've", startMs: 47944, endMs: 48201 },
  { text: "built", startMs: 48201, endMs: 48490 },
  { text: "field", startMs: 48522, endMs: 48827 },
  { text: "operations", startMs: 48907, endMs: 49565 },
  { text: "from", startMs: 49630, endMs: 49742 },
  { text: "scratch", startMs: 49806, endMs: 50368 },
  { text: "across", startMs: 50689, endMs: 50962 },
  { text: "5", startMs: 51171, endMs: 51460 },
  { text: "countries:", startMs: 51492, endMs: 51942 },
  { text: "Dubai,", startMs: 52520, endMs: 52808 },
  { text: "UK,", startMs: 53483, endMs: 53932 },
  { text: "Ireland,", startMs: 54366, endMs: 54910 },
  { text: "India,", startMs: 55183, endMs: 55744 },
  { text: "and", startMs: 56144, endMs: 56208 },
  { text: "across", startMs: 56240, endMs: 56577 },
  { text: "multiple", startMs: 56721, endMs: 57266 },
  { text: "cities", startMs: 57266, endMs: 57634 },
  { text: "in", startMs: 57730, endMs: 57778 },
  { text: "each.", startMs: 57826, endMs: 58115 },
  { text: "I've", startMs: 58612, endMs: 58772 },
  { text: "run", startMs: 58852, endMs: 59028 },
  { text: "50+", startMs: 59028, endMs: 59557 },
  { text: "site", startMs: 59733, endMs: 60214 },
  { text: "operations", startMs: 60294, endMs: 60967 },
  { text: "in", startMs: 60967, endMs: 61095 },
  { text: "a", startMs: 61095, endMs: 61127 },
  { text: "single", startMs: 61127, endMs: 61592 },
  { text: "quarter,", startMs: 61592, endMs: 62040 },
  { text: "managed", startMs: 62457, endMs: 62873 },
  { text: "C-level", startMs: 62873, endMs: 63434 },
  { text: "stakeholders", startMs: 63434, endMs: 64123 },
  { text: "without", startMs: 64219, endMs: 64604 },
  { text: "ever", startMs: 64780, endMs: 64972 },
  { text: "needing", startMs: 64972, endMs: 65325 },
  { text: "to", startMs: 65357, endMs: 65501 },
  { text: "escalate,", startMs: 65517, endMs: 66398 },
  { text: "and", startMs: 66542, endMs: 66607 },
  { text: "built", startMs: 66719, endMs: 66911 },
  { text: "4", startMs: 67023, endMs: 67392 },
  { text: "operational", startMs: 67664, endMs: 68337 },
  { text: "systems", startMs: 68337, endMs: 69010 },
  { text: "for", startMs: 69042, endMs: 69202 },
  { text: "a", startMs: 69202, endMs: 69346 },
  { text: "company", startMs: 69346, endMs: 69731 },
  { text: "that", startMs: 69843, endMs: 69971 },
  { text: "had", startMs: 69987, endMs: 70115 },
  { text: "zero", startMs: 70180, endMs: 70788 },
  { text: "process", startMs: 70788, endMs: 71445 },
  { text: "infrastructure", startMs: 71509, endMs: 72342 },
  { text: "when", startMs: 72711, endMs: 72775 },
  { text: "I", startMs: 72871, endMs: 72999 },
  { text: "walked", startMs: 73031, endMs: 73368 },
  { text: "in.", startMs: 73368, endMs: 73496 },
  { text: "Every", startMs: 73913, endMs: 74137 },
  { text: "time", startMs: 74153, endMs: 74377 },
  { text: "I", startMs: 74473, endMs: 74489 },
  { text: "enter", startMs: 74634, endMs: 74954 },
  { text: "a", startMs: 74954, endMs: 74986 },
  { text: "new", startMs: 74986, endMs: 75194 },
  { text: "environment,", startMs: 75210, endMs: 76092 },
  { text: "I", startMs: 76572, endMs: 76620 },
  { text: "don't", startMs: 76652, endMs: 76877 },
  { text: "wait", startMs: 76893, endMs: 77213 },
  { text: "for", startMs: 77213, endMs: 77373 },
  { text: "a", startMs: 77373, endMs: 77454 },
  { text: "playbook,", startMs: 77454, endMs: 78110 },
  { text: "I", startMs: 78575, endMs: 78623 },
  { text: "write", startMs: 78719, endMs: 79040 },
  { text: "it.", startMs: 79040, endMs: 79088 },
  { text: "And", startMs: 79601, endMs: 79681 },
  { text: "then", startMs: 79697, endMs: 79825 },
  { text: "I", startMs: 79841, endMs: 79873 },
  { text: "make", startMs: 79953, endMs: 80257 },
  { text: "sure", startMs: 80257, endMs: 80530 },
  { text: "the", startMs: 80658, endMs: 80738 },
  { text: "next", startMs: 80738, endMs: 81171 },
  { text: "person", startMs: 81219, endMs: 81748 },
  { text: "who", startMs: 81924, endMs: 81988 },
  { text: "comes", startMs: 82020, endMs: 82404 },
  { text: "after", startMs: 82404, endMs: 82677 },
  { text: "me", startMs: 82677, endMs: 82933 },
  { text: "can", startMs: 83286, endMs: 83511 },
  { text: "run", startMs: 83527, endMs: 83768 },
  { text: "it", startMs: 83768, endMs: 83960 },
  { text: "without", startMs: 84089, endMs: 84378 },
  { text: "calling", startMs: 84490, endMs: 84795 },
  { text: "me.", startMs: 84908, endMs: 85149 },
  { text: "You're", startMs: 85390, endMs: 85550 },
  { text: "not", startMs: 85550, endMs: 85775 },
  { text: "just", startMs: 85791, endMs: 85984 },
  { text: "looking", startMs: 86032, endMs: 86321 },
  { text: "for", startMs: 86353, endMs: 86466 },
  { text: "someone", startMs: 86466, endMs: 86964 },
  { text: "who", startMs: 87140, endMs: 87301 },
  { text: "shows", startMs: 87301, endMs: 87686 },
  { text: "up", startMs: 87783, endMs: 88040 },
  { text: "and", startMs: 88120, endMs: 88184 },
  { text: "follows", startMs: 88361, endMs: 88650 },
  { text: "protocol.", startMs: 88762, endMs: 89308 },
  { text: "You", startMs: 89710, endMs: 89870 },
  { text: "need", startMs: 89870, endMs: 90063 },
  { text: "someone", startMs: 90063, endMs: 90497 },
  { text: "who", startMs: 90593, endMs: 90754 },
  { text: "builds", startMs: 90850, endMs: 91219 },
  { text: "the", startMs: 91316, endMs: 91412 },
  { text: "protocol,", startMs: 91412, endMs: 91926 },
  { text: "trains", startMs: 92440, endMs: 92825 },
  { text: "others", startMs: 93002, endMs: 93227 },
  { text: "on", startMs: 93323, endMs: 93500 },
  { text: "it,", startMs: 93500, endMs: 93612 },
  { text: "and", startMs: 94142, endMs: 94206 },
  { text: "makes", startMs: 94303, endMs: 94544 },
  { text: "sure", startMs: 94544, endMs: 94897 },
  { text: "your", startMs: 94929, endMs: 95041 },
  { text: "deployment", startMs: 95106, endMs: 95668 },
  { text: "data", startMs: 95668, endMs: 95989 },
  { text: "is", startMs: 96150, endMs: 96246 },
  { text: "clean", startMs: 96374, endMs: 96599 },
  { text: "enough", startMs: 96696, endMs: 97017 },
  { text: "that", startMs: 97354, endMs: 97466 },
  { text: "your", startMs: 97499, endMs: 97756 },
  { text: "SF", startMs: 97756, endMs: 98093 },
  { text: "team", startMs: 98157, endMs: 98462 },
  { text: "never", startMs: 98815, endMs: 99169 },
  { text: "has", startMs: 99185, endMs: 99410 },
  { text: "to", startMs: 99442, endMs: 99602 },
  { text: "question", startMs: 99602, endMs: 100052 },
  { text: "what", startMs: 100309, endMs: 100486 },
  { text: "came", startMs: 100486, endMs: 100791 },
  { text: "off", startMs: 100791, endMs: 100967 },
  { text: "the", startMs: 100967, endMs: 101048 },
  { text: "floor.", startMs: 101128, endMs: 101449 },
  { text: "I'd", startMs: 101835, endMs: 102060 },
  { text: "love", startMs: 102092, endMs: 102316 },
  { text: "15", startMs: 102316, endMs: 102798 },
  { text: "minutes", startMs: 102798, endMs: 103280 },
  { text: "to", startMs: 103280, endMs: 103376 },
  { text: "walk", startMs: 103441, endMs: 103698 },
  { text: "you", startMs: 103698, endMs: 103842 },
  { text: "through", startMs: 103842, endMs: 104147 },
  { text: "exactly", startMs: 104581, endMs: 105271 },
  { text: "how", startMs: 105288, endMs: 105416 },
  { text: "I", startMs: 105464, endMs: 105496 },
  { text: "do", startMs: 105625, endMs: 105785 },
  { text: "that", startMs: 105785, endMs: 105978 },
  { text: "for", startMs: 106187, endMs: 106315 },
  { text: "Human", startMs: 106347, endMs: 106637 },
  { text: "Archive.", startMs: 106669, endMs: 107183 },
];

type Card = {
  startFrame: number;
  endFrame: number;
  kicker?: string;
  headline?: string;
  accentWord?: string;
  sub?: string;
  tone?: 'default' | 'danger' | 'signature' | 'positive';
  scene?: 'intro' | 'notBottleneck' | 'dataCost' | 'weeksRetrain' | 'chain' | 'twentyHires'
    | 'shield' | 'fieldOps' | 'globe' | 'fiftyOps' | 'noEscalation' | 'fourSystems'
    | 'playbook' | 'handoff' | 'notJust' | 'checklist' | 'dataClean' | 'cta';
};

// Every window derived from a real word's start/end time in WORDS above
// (frame = round(ms * 30 / 1000)). Statement cards paraphrase the script —
// WordCaptionOverlay already carries the verbatim words.
const CARDS: Card[] = [
  { startFrame: 0, endFrame: 240, scene: 'intro' },
  { startFrame: 260, endFrame: 415, scene: 'notBottleneck' },
  { startFrame: 470, endFrame: 604, scene: 'dataCost' },
  { startFrame: 604, endFrame: 744, scene: 'weeksRetrain' },
  { startFrame: 750, endFrame: 945, scene: 'chain' },
  { startFrame: 950, endFrame: 1140, scene: 'twentyHires' },
  { startFrame: 1145, endFrame: 1385, scene: 'shield' },
  { startFrame: 1390, endFrame: 1470, headline: "That's where I come in." },
  { startFrame: 1470, endFrame: 1521, scene: 'fieldOps' },
  { startFrame: 1521, endFrame: 1743, scene: 'globe' },
  { startFrame: 1755, endFrame: 1865, scene: 'fiftyOps' },
  { startFrame: 1870, endFrame: 1995, scene: 'noEscalation' },
  { startFrame: 1995, endFrame: 2210, scene: 'fourSystems' },
  { startFrame: 2215, endFrame: 2378, scene: 'playbook' },
  { startFrame: 2385, endFrame: 2558, scene: 'handoff' },
  { startFrame: 2562, endFrame: 2679, scene: 'notJust' },
  { startFrame: 2696, endFrame: 2808, scene: 'checklist' },
  { startFrame: 2829, endFrame: 3043, scene: 'dataClean' },
  { startFrame: 3050, endFrame: 3224, scene: 'cta' },
];

const FullReel: React.FC = () => {
  const frame = useCurrentFrame();
  const activeCard = CARDS.find((c) => frame >= c.startFrame && frame < c.endFrame);

  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <BrandBg glow={COLORS.accent} />

      {/* bottom half: real footage, already pre-cropped to a watermark-safe
          eyes-to-collar window and scaled to exactly fill this region --
          see media/projects/video-5/master-comp-native.mp4's provenance note
          above. No further offset/crop needed here. */}
      <div style={{ position: 'absolute', left: 0, top: 960, width: 1080, height: 960, overflow: 'hidden' }}>
        <OffthreadVideo
          src={staticFile(FOOTAGE)}
          style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: 960 }}
        />
      </div>

      {/* top half: bespoke motion-graphic scenes for the beats that have one,
          generic TopCard for the rest */}
      {activeCard && (() => {
        const localFrame = frame - activeCard.startFrame;
        const holdFrames = activeCard.endFrame - activeCard.startFrame;
        if (activeCard.scene === 'intro') return <IntroScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'notBottleneck') return <NotBottleneckScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'dataCost') return <DataCostScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'weeksRetrain') return <WeeksRetrainScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'chain') return <ChainScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'twentyHires') return <TwentyHiresScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'shield') return <ShieldScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'fieldOps') return <FieldOpsScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'globe') return <GlobeScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'fiftyOps') return <FiftyOpsScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'noEscalation') return <NoEscalationScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'fourSystems') return <FourSystemsScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'playbook') return <PlaybookScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'handoff') return <HandoffScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'notJust') return <NotJustScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'checklist') return <ChecklistScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'dataClean') return <DataCleanScene frame={localFrame} holdFrames={holdFrames} />;
        if (activeCard.scene === 'cta') return <CtaScene frame={localFrame} holdFrames={holdFrames} />;
        return (
          <TopCard
            frame={localFrame}
            holdFrames={holdFrames}
            kicker={activeCard.kicker}
            headline={activeCard.headline ?? ''}
            accentWord={activeCard.accentWord}
            sub={activeCard.sub}
            tone={activeCard.tone}
          />
        );
      })()}

      {/* captions over the bottom-half video -- stay on top throughout */}
      <WordCaptionOverlay words={WORDS} />
    </AbsoluteFill>
  );
};
export default FullReel;
