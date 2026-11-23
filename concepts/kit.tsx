import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame} from 'remotion';

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_C = Easing.bezier(0.45, 0, 0.2, 1);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const prog = (f: number, s: number, d = 24) =>
  interpolate(f, [s, s + d], [0, 1], {easing: EASE, ...cl});
export const lin = (f: number, s: number, d: number) => interpolate(f, [s, s + d], [0, 1], cl);
export const countTo = (f: number, s: number, d: number, to: number) =>
  Math.round(interpolate(f, [s, s + d], [0, to], {easing: EASE_C, ...cl}));

export const PHASE = 120; // 4 s per style frame
export const X = 12;
export const CONCEPT_FRAMES = PHASE * 3;

const Fade: React.FC<{last: boolean; children: React.ReactNode}> = ({last, children}) => {
  const f = useCurrentFrame();
  const o = prog(f, 0, X) * (last ? 1 : 1 - prog(f, PHASE, X));
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

/** Three 4 s "style frames" cross-faded: cold open · deadlock · dot grid. */
export const Phases: React.FC<{bg: React.ReactNode; parts: [React.ReactNode, React.ReactNode, React.ReactNode]}> = ({
  bg,
  parts,
}) => (
  <AbsoluteFill>
    {bg}
    {parts.map((p, i) => (
      <Sequence key={i} from={i * PHASE} durationInFrames={PHASE + (i < 2 ? X : 0)}>
        <Fade last={i === 2}>{p}</Fade>
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const R: React.FC<{
  at: number;
  y?: number;
  x?: number;
  dur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at, y = 20, x = 0, dur = 24, style, children}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  return (
    <div style={{opacity: p, transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px)`, ...style}}>
      {children}
    </div>
  );
};

/* ───────── shared dot-grid maths (349 seats, 25 × 14, column-major) ───────── */
export const G = {total: 349, thr: 175, right: 173, left: 24, rows: 14, pitch: 35, top: 64};
export const gridState = (f: number, rightAt: number, rightDur: number, leftAt: number, leftDur: number) => {
  const blue = Math.floor(lin(f, rightAt, rightDur) * G.right);
  const red = Math.floor(lin(f, leftAt, leftDur) * G.left);
  const count = blue + red;
  const crossF = leftAt + (leftDur * (G.thr - G.right)) / G.left;
  return {count, fell: count >= G.thr, crossF};
};

export const GridSvg: React.FC<{
  f: number;
  at: {grid: number; line: number; right: number; rightDur: number; left: number; leftDur: number};
  pal: {base: string; right: string; left: string; line: string; fell: string};
  shape?: 'circle' | 'square';
  r?: number;
  fell: boolean;
  lineWidth?: number;
}> = ({f, at, pal, shape = 'circle', r = 8.5, fell, lineWidth = 1.5}) => {
  const {rows, pitch, top, total, right, left, thr} = G;
  const cols = Math.ceil(total / rows);
  const w = cols * pitch;
  const h = rows * pitch;
  const tCol = Math.floor(thr / rows);
  const tRow = thr % rows;
  const xR = (tCol + 1) * pitch;
  const xL = tCol * pitch;
  const yJog = top + tRow * pitch;
  const path = `M${xR},${top - 14} V${yJog} H${xL} V${top + h + 12}`;
  const len = 2 * h + 80;
  const lp = prog(f, at.line, 36);
  const dots = Array.from({length: total}, (_, i) => {
    const cx = Math.floor(i / rows) * pitch + pitch / 2;
    const cy = top + (i % rows) * pitch + pitch / 2;
    const isB = i < right;
    const isR = !isB && i < right + left;
    let lit = 0;
    if (isB) lit = prog(f, at.right + (i / right) * at.rightDur, 10);
    if (isR) lit = prog(f, at.left + ((i - right) / left) * at.leftDur, 10);
    const intro = prog(f, at.grid + Math.floor(i / rows) * 1.1, 18);
    const draw = (fill: string, o: number) =>
      shape === 'circle' ? (
        <circle cx={cx} cy={cy} r={r} fill={fill} opacity={o} />
      ) : (
        <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={fill} opacity={o} />
      );
    return (
      <g key={i} opacity={intro}>
        {draw(pal.base, 1)}
        {lit > 0 && draw(isB ? pal.right : pal.left, lit)}
      </g>
    );
  });
  return (
    <svg width={w} height={h + top + 20} style={{overflow: 'visible'}}>
      {dots}
      <path
        d={path}
        fill="none"
        stroke={fell ? pal.fell : pal.line}
        strokeWidth={lineWidth}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - lp)}
      />
    </svg>
  );
};
export const gridGeom = () => {
  const cols = Math.ceil(G.total / G.rows);
  const xR = (Math.floor(G.thr / G.rows) + 1) * G.pitch;
  return {w: cols * G.pitch, h: G.rows * G.pitch + G.top + 20, xR};
};

export const Caption: React.FC<{text: string; active: number; font: string; color: string; muted: string; weight?: number; shadow?: string; size?: number}> = ({
  text,
  active,
  font,
  color,
  muted,
  weight = 500,
  shadow,
  size = 38,
}) => {
  const words = text.split(' ');
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        right: 140,
        bottom: 302,
        textAlign: 'center',
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.3,
        textShadow: shadow,
      }}
    >
      {words.map((w, i) => (
        <span key={i} style={{color: i === active ? color : i < active ? color : muted, opacity: i < active ? 0.8 : 1}}>
          {w}{' '}
        </span>
      ))}
    </div>
  );
};
