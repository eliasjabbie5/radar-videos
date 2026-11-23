import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {Reveal} from '../Reveal';
import {EASE_COUNT, lin, prog} from '../../lib/motion';
import {buildHemicycle} from '../../lib/hemicycle';
import {colors, fontFamily, mono, redGlow, SAFE} from '../../lib/theme';
import type {DotGridContent} from '../../data/types';
import {AbsoluteFill, interpolate} from 'remotion';

const W = 876;

export const RiksdagDotGrid: React.FC<{content: DotGridContent}> = ({content}) => {
  const f = useCurrentFrame();
  const {totalSeats, threshold, rightBlock, left} = content;
  const seats = useMemo(() => buildHemicycle(totalSeats), [totalSeats]);

  const blue = Math.floor(lin(f, rightBlock.at, rightBlock.dur) * rightBlock.seats);
  const red = Math.floor(lin(f, left.at, left.dur) * left.seats);
  const count = blue + red;
  const fell = count >= threshold;
  const banner = prog(f, content.fellAt, 16);

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 200, left: SAFE.left, width: W, textAlign: 'center'}}>
        <div
          style={{
            fontFamily: fontFamily.display,
            fontWeight: 600,
            fontSize: 250,
            lineHeight: 1,
            letterSpacing: '-0.05em',
            color: fell ? colors.veto : colors.ink,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {String(count).padStart(3, '0').split('').map((d, i) => (
            <span key={i} style={{display: 'inline-block', width: '0.56em'}}>
              {d}
            </span>
          ))}
        </div>
        <div style={mono(30, {color: fell ? colors.veto : colors.muted, fontWeight: 500, marginTop: -4})}>{content.subtitle}</div>
      </div>

      <svg width={W} height={500} style={{position: 'absolute', top: 580, left: SAFE.left, overflow: 'visible'}}>
        {seats.map((s, i) => {
          const isB = i < rightBlock.seats;
          const isR = i >= totalSeats - left.seats;
          let lit = 0;
          let c: string = colors.parl;
          if (isB) lit = prog(f, rightBlock.at + (i / rightBlock.seats) * rightBlock.dur, 10);
          if (isR) {
            lit = prog(f, left.at + ((totalSeats - 1 - i) / left.seats) * left.dur, 10);
            c = colors.veto;
          }
          const intro = prog(f, content.introAt + (s.a / Math.PI) * 24, 20);
          return (
            <g key={i} opacity={intro}>
              <circle cx={W / 2 + s.x} cy={470 + s.y} r={9.5} fill="rgba(20,22,27,0.10)" />
              {lit > 0 && <circle cx={W / 2 + s.x} cy={470 + s.y} r={9.5} fill={c} opacity={lit} />}
            </g>
          );
        })}
      </svg>

      {/* seat counter in the hollow of the hemicycle */}
      <div style={{position: 'absolute', top: 912, left: SAFE.left, width: W, textAlign: 'center', opacity: prog(f, content.introAt, 20)}}>
        <div style={{fontFamily: fontFamily.display, fontWeight: 600, fontSize: 104, lineHeight: 1, letterSpacing: '-0.04em', color: colors.ink}}>
          {Math.round(
            interpolate(f, [content.introAt, content.introAt + 40], [0, totalSeats], {
              easing: EASE_COUNT,
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          )}
        </div>
        <div style={mono(26, {color: colors.muted, fontWeight: 500, marginTop: 4})}>LEDAMÖTER</div>
      </div>

      <div style={{position: 'absolute', top: 1110, left: SAFE.left, width: W, opacity: prog(f, content.gaugeAt, 20)}}>
        <div className="glass" style={{borderRadius: 99, padding: 10}}>
          <div style={{position: 'relative', height: 24, borderRadius: 24, background: colors.track}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 24, width: `${(Math.min(count, rightBlock.seats) / totalSeats) * 100}%`, background: colors.parl}} />
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${(rightBlock.seats / totalSeats) * 100}%`,
                borderRadius: 24,
                width: `${(Math.max(0, count - rightBlock.seats) / totalSeats) * 100}%`,
                background: colors.veto,
              }}
            />
            <div style={{position: 'absolute', top: -12, bottom: -12, left: `${(threshold / totalSeats) * 100}%`, width: 3, borderRadius: 3, background: fell ? colors.veto : colors.ink}} />
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 22}}>
          <span
            className="glass"
            style={{
              ...mono(34, {fontWeight: 500, color: fell && banner > 0.01 ? colors.veto : colors.ink}),
              borderRadius: 99,
              padding: '12px 32px',
              boxShadow: fell && banner > 0.01 ? redGlow : undefined,
              transform: `scale(${banner > 0.01 ? 1.12 - 0.12 * banner : 1})`,
            }}
          >
            {banner > 0.01 ? content.doneLabel : content.thresholdLabel}
          </span>
        </div>
      </div>

      <Reveal
        at={rightBlock.at - 4}
        y={8}
        style={{position: 'absolute', top: 1320, left: SAFE.left, width: W, display: 'flex', justifyContent: 'center', gap: 40, ...mono(30, {fontWeight: 500, color: colors.ink})}}
      >
        <span>
          <span style={{color: colors.parl}}>●</span> {rightBlock.label}
        </span>
        <span style={{opacity: prog(f, left.at, 14)}}>
          <span style={{color: colors.veto}}>●</span> {left.label}
        </span>
      </Reveal>
    </AbsoluteFill>
  );
};
