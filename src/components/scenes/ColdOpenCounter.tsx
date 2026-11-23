import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Reveal} from '../Reveal';
import {EASE_COUNT, prog} from '../../lib/motion';
import {colors, fontFamily, mono, redGlow, SAFE} from '../../lib/theme';
import type {ColdOpenContent} from '../../data/types';

const CX = 438;
const CY = 330;

export const ColdOpenCounter: React.FC<{content: ColdOpenContent}> = ({content}) => {
  const f = useCurrentFrame();
  const n = Math.round(
    interpolate(f, [content.countStart, content.countEnd], [0, content.days], {
      easing: EASE_COUNT,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const done = f >= content.countEnd;
  const sweep = done ? Math.floor((f - content.countEnd) / 2.2) : -1;
  const ripple = prog(f, content.countEnd, 34);
  const pill = prog(f, content.pillAt, 22);

  const ticks = Array.from({length: 70}, (_, i) => {
    const a = (i / 70) * Math.PI * 2 - Math.PI / 2;
    let stroke = i < n ? colors.ink : 'rgba(20,22,27,0.14)';
    let w = 3.5;
    let r1 = 330;
    if (!done && i === n - 1) {
      stroke = colors.veto;
      w = 5;
      r1 = 318;
    }
    if (done) {
      const d = (((sweep - i) % 70) + 70) % 70;
      if (d < 9) {
        stroke = `rgba(239,68,68,${1 - d / 9})`;
        w = 4.5;
        r1 = 322;
      } else stroke = colors.ink;
    }
    return (
      <line
        key={i}
        x1={CX + Math.cos(a) * r1}
        y1={CY + Math.sin(a) * r1}
        x2={CX + Math.cos(a) * 372}
        y2={CY + Math.sin(a) * 372}
        stroke={stroke}
        strokeWidth={w}
        strokeLinecap="round"
        opacity={prog(f, i * 0.12, 12)}
      />
    );
  });

  return (
    <AbsoluteFill>
      <Reveal
        at={0}
        style={{
          position: 'absolute',
          top: 120,
          left: SAFE.left,
          right: SAFE.right,
          display: 'flex',
          justifyContent: 'space-between',
          ...mono(26, {color: colors.muted}),
        }}
      >
        <span>{content.dateLeft}</span>
        <span>{content.dateRight}</span>
      </Reveal>

      <svg width={876} height={760} style={{position: 'absolute', top: 270, left: SAFE.left, overflow: 'visible'}}>
        {ticks}
        <circle cx={CX} cy={CY} r={372 + 70 * ripple} fill="none" stroke={colors.ink} strokeWidth={1.5} opacity={done ? (1 - ripple) * 0.35 : 0} />
      </svg>

      <div style={{position: 'absolute', top: 270 + CY - 190, left: SAFE.left, width: 2 * CX, textAlign: 'center'}}>
        <div
          style={{
            fontFamily: fontFamily.display,
            fontWeight: 600,
            fontSize: 380,
            lineHeight: 1,
            letterSpacing: '-0.05em',
            color: colors.ink,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {String(n).padStart(2, '0').split('').map((d, i) => (
            <span key={i} style={{display: 'inline-block', width: '0.56em'}}>
              {d}
            </span>
          ))}
        </div>
      </div>

      <Reveal
        at={content.labelAt}
        y={12}
        style={{position: 'absolute', top: 1060, left: SAFE.left, width: 876, textAlign: 'center', ...mono(38, {fontWeight: 500, color: colors.ink})}}
      >
        {content.label}
      </Reveal>

      <div style={{position: 'absolute', top: 1150, left: SAFE.left, width: 876, display: 'flex', justifyContent: 'center'}}>
        <div
          className="glass"
          style={{
            borderRadius: 99,
            padding: '24px 42px',
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            opacity: pill,
            transform: `translateY(${(1 - pill) * 16}px)`,
            boxShadow: redGlow,
          }}
        >
          <span style={{display: 'flex', gap: 9}}>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 18,
                  background: i < 2 ? colors.ink : 'transparent',
                  border: `2px solid ${colors.ink}`,
                  opacity: i < 2 ? 1 : 0.4,
                }}
              />
            ))}
          </span>
          <span style={mono(36, {fontWeight: 500, color: colors.ink})}>{content.pill}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
