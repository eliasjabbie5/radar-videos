import React from 'react';
import {colors, fontFamily, mono} from '../lib/theme';
import type {Tone} from '../data/types2';

export const W = 876;
export const toneColor = (t?: Tone): string =>
  ({ink: colors.ink, red: colors.veto, green: colors.center, blue: colors.parl, muted: colors.muted}[t ?? 'ink']);

/** rounded stamp (NEJ-style) */
export const StampBox: React.FC<{text: string; p: number; size?: number; tone?: Tone; style?: React.CSSProperties}> = ({
  text,
  p,
  size = 34,
  tone = 'red',
  style,
}) => {
  const c = toneColor(tone);
  return (
    <div
      style={{
        ...mono(size, {fontWeight: 500, color: c}),
        border: `2px solid ${c}`,
        background: `${c}17`,
        borderRadius: 14,
        padding: '8px 22px',
        opacity: p,
        transform: `rotate(-3deg) scale(${1.15 - 0.15 * p})`,
        display: 'inline-block',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const Icon: React.FC<{state: 'yes' | 'unknown' | 'no'; size?: number}> = ({state, size = 56}) => {
  const c = state === 'yes' ? colors.center : state === 'no' ? colors.veto : colors.parl;
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: size,
        background: `${c}22`,
        color: c,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fontFamily.sans,
        fontWeight: 600,
        fontSize: size * 0.54,
        flexShrink: 0,
      }}
    >
      {state === 'yes' ? '✓' : state === 'no' ? '✕' : '?'}
    </span>
  );
};

/** tiny person glyph */
export const Person: React.FC<{size: number; color: string; opacity?: number}> = ({size, color, opacity = 1}) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 40 46" style={{opacity}}>
    <circle cx="20" cy="12" r="9" fill={color} />
    <path d="M3 44 C3 30 11 24 20 24 C29 24 37 30 37 44 Z" fill={color} />
  </svg>
);
