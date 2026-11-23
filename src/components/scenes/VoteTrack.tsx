import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Reveal} from '../Reveal';
import {SceneFrame} from '../SceneFrame';
import {prog} from '../../lib/motion';
import {colors, fontFamily, mono} from '../../lib/theme';
import type {VoteCard, VoteTrackContent} from '../../data/types';

const Stamp: React.FC<{text: string; at: number}> = ({text, at}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 20);
  return (
    <div
      style={{
        ...mono(38, {fontWeight: 500, color: colors.veto}),
        border: '2px solid rgba(239,68,68,0.7)',
        background: 'rgba(239,68,68,0.09)',
        borderRadius: 14,
        padding: '10px 26px',
        opacity: p,
        transform: `rotate(-3deg) scale(${1.15 - 0.15 * p})`,
      }}
    >
      {text}
    </div>
  );
};

const Card: React.FC<{card: VoteCard}> = ({card}) => {
  const f = useCurrentFrame();
  const pending = card.state === 'pending';
  const pulse = pending ? 0.78 + 0.22 * Math.sin(f / 12) : 1;
  const muted = card.state !== 'result';
  return (
    <Reveal at={card.at} y={26}>
      <div
        className="glass"
        style={{
          height: 150,
          display: 'flex',
          alignItems: 'center',
          padding: '0 38px',
          gap: 28,
          opacity: (card.state === 'dim' ? 0.5 : 1) * pulse,
          boxShadow: pending
            ? '0 18px 48px rgba(59,123,234,0.16), 0 0 0 1.5px rgba(59,123,234,0.45)'
            : undefined,
        }}
      >
        <span style={mono(30, {color: colors.muted, width: 56})}>{card.n}</span>
        <span
          style={{
            flex: 1,
            fontFamily: fontFamily.display,
            fontWeight: 500,
            fontSize: card.label === '?' ? 90 : 56,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: muted ? colors.muted : colors.ink,
          }}
        >
          {card.label}
        </span>
        {card.state === 'result' && card.result && card.stampAt !== undefined && (
          <Stamp text={card.result} at={card.stampAt} />
        )}
        {pending && <span style={mono(26, {color: colors.parl, fontWeight: 500})}>NÄSTA</span>}
      </div>
    </Reveal>
  );
};

export const VoteTrack: React.FC<{content: VoteTrackContent}> = ({content}) => {
  const f = useCurrentFrame();
  const fill = prog(f, content.timeline.at, content.timeline.dur);
  const glide = 1 - prog(f, content.cards[0].at - 6, 34); // 1 → 0
  return (
    <SceneFrame>
      <Reveal at={content.statusAt} y={22}>
        <div className="glass" style={{padding: '34px 40px 30px', marginBottom: 40, transform: `translateY(${glide * 350}px)`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 16,
                background: colors.parl,
                boxShadow: `0 0 0 ${6 + 5 * Math.sin(f / 10)}px rgba(59,123,234,0.16)`,
              }}
            />
            <span style={mono(30, {fontWeight: 500, color: colors.ink})}>{content.status}</span>
          </div>

          <div style={{display: 'flex', gap: 14, marginTop: 24, minHeight: 58}}>
            {content.chips.map((c) => (
              <Reveal key={c.text} at={c.at} y={10}>
                <span
                  style={{
                    ...mono(24, {fontWeight: 500, color: colors.ink}),
                    display: 'inline-block',
                    padding: '12px 22px',
                    borderRadius: 99,
                    background: 'rgba(20,22,27,0.05)',
                  }}
                >
                  {c.text}
                </span>
              </Reveal>
            ))}
          </div>

          <div style={{marginTop: 26, opacity: prog(f, content.timeline.at - 6, 16)}}>
            <div style={{display: 'flex', justifyContent: 'space-between', ...mono(24, {color: colors.muted})}}>
              <span>{content.timeline.from}</span>
              <span>{content.timeline.to}</span>
            </div>
            <div style={{position: 'relative', height: 10, borderRadius: 10, background: colors.track, marginTop: 12}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, borderRadius: 10, background: colors.ink}} />
              <div
                style={{
                  position: 'absolute',
                  left: `${fill * 100}%`,
                  top: -7,
                  width: 24,
                  height: 24,
                  marginLeft: -12,
                  borderRadius: 24,
                  background: colors.veto,
                  boxShadow: '0 0 0 5px rgba(239,68,68,0.18)',
                }}
              />
            </div>
          </div>
        </div>
      </Reveal>

      <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
        {content.cards.map((c) => (
          <Card key={c.n} card={c} />
        ))}
      </div>
    </SceneFrame>
  );
};
