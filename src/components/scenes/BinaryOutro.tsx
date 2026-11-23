import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Reveal} from '../Reveal';
import {prog} from '../../lib/motion';
import {colors, fontFamily, mono, redGlow, SAFE} from '../../lib/theme';
import type {OutroContent} from '../../data/types';

const Pill: React.FC<{text: string; accent: string; active: boolean; at: number}> = ({text, accent, active, at}) => {
  const f = useCurrentFrame();
  const a = prog(f, at, 16);
  const hi = active ? 0.6 + 0.4 * Math.sin(f / 9) : 0;
  return (
    <div
      className="glass"
      style={{
        ...mono(36, {fontWeight: 500, color: colors.ink}),
        flex: 1,
        borderRadius: 99,
        padding: '30px 0',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        gap: 14,
        opacity: a * (active ? 1 : 0.7),
        transform: `scale(${active ? 1.03 : 1})`,
        boxShadow: active
          ? `0 16px 44px ${accent}33, 0 0 0 ${1.5 + hi}px ${accent}`
          : undefined,
      }}
    >
      <span style={{color: colors.muted}}>[</span>
      {text}
      <span style={{color: colors.muted}}>]</span>
    </div>
  );
};

export const BinaryOutro: React.FC<{content: OutroContent}> = ({content}) => {
  const f = useCurrentFrame();
  const fill = prog(f, content.timeline.at, content.timeline.dur);
  const flag = prog(f, content.timeline.at + content.timeline.dur, 16);
  const second = f >= content.switchAt;
  return (
    <AbsoluteFill style={{paddingLeft: SAFE.left, paddingRight: SAFE.right}}>
      {/* deadline timeline */}
      <Reveal at={content.timeline.at} y={20} style={{marginTop: 250}}>
        <div className="glass" style={{padding: '32px 40px 36px'}}>
          <div style={{...mono(32, {fontWeight: 500, color: colors.ink}), textAlign: 'center', marginBottom: 26}}>
            {content.timeline.label}
          </div>
          <div style={{position: 'relative', height: 14, borderRadius: 14, background: colors.track}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, borderRadius: 14, background: colors.ink}} />
            <div
              style={{
                position: 'absolute',
                left: `${fill * 100}%`,
                top: -8,
                width: 30,
                height: 30,
                marginLeft: -15,
                borderRadius: 30,
                background: flag > 0.5 ? colors.veto : colors.ink,
                boxShadow: flag > 0.5 ? `0 0 0 ${6 + 6 * Math.sin(f / 8)}px rgba(239,68,68,0.2)` : undefined,
              }}
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, ...mono(26, {color: colors.muted})}}>
            <span>{content.timeline.from}</span>
            <span style={{color: flag > 0.5 ? colors.veto : colors.muted}}>{content.timeline.to}</span>
          </div>
        </div>
      </Reveal>

      <Reveal at={content.questionAt} dur={44} y={28} style={{marginTop: 80}}>
        <div
          style={{
            fontFamily: fontFamily.display,
            fontWeight: 600,
            fontSize: 134,
            lineHeight: 1,
            letterSpacing: '-0.045em',
            color: colors.ink,
          }}
        >
          {content.question}
        </div>
      </Reveal>

      <div style={{display: 'flex', gap: 24, marginTop: 70}}>
        <Pill text={content.options[0]} accent={colors.center} active={f >= content.optionsAt && !second} at={content.optionsAt} />
        <Pill text={content.options[1]} accent={colors.veto} active={second} at={content.optionsAt + 6} />
      </div>

      <Reveal at={content.teaserAt} y={10} style={{marginTop: 70}}>
        <div style={mono(26, {color: colors.muted, fontWeight: 500})}>{content.teaser}</div>
      </Reveal>
    </AbsoluteFill>
  );
};
