import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Reveal} from '../Reveal';
import {SceneFrame} from '../SceneFrame';
import {prog} from '../../lib/motion';
import {colors, fontFamily, mono, redGlow} from '../../lib/theme';
import type {DeadlockCard, DeadlockContent, DeadlockRow} from '../../data/types';

const Row: React.FC<{row: DeadlockRow}> = ({row}) => {
  const c = row.tone === 'yes' ? colors.center : row.tone === 'no' ? colors.veto : colors.muted;
  return (
    <Reveal at={row.at} y={10} style={{display: 'flex', alignItems: 'center', gap: 22, height: 90}}>
      <span
        style={{
          width: 56,
          height: 56,
          borderRadius: 56,
          background: row.tone === 'dim' ? 'rgba(0,0,0,0.05)' : `${c}22`,
          color: c,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fontFamily.sans,
          fontWeight: 600,
          fontSize: 30,
        }}
      >
        {row.tone === 'yes' ? '✓' : row.tone === 'no' ? '✕' : '–'}
      </span>
      <span
        style={{
          fontFamily: fontFamily.sans,
          fontWeight: 500,
          fontSize: 52,
          letterSpacing: '-0.01em',
          color: row.tone === 'dim' ? colors.muted : colors.ink,
        }}
      >
        {row.text}
      </span>
    </Reveal>
  );
};

const PartyCard: React.FC<{card: DeadlockCard}> = ({card}) => (
  <Reveal at={card.at} y={26}>
    <div className="glass" style={{padding: '28px 38px 14px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6}}>
        <span style={{width: 16, height: 16, borderRadius: 16, background: card.accent === 'center' ? colors.center : colors.parl}} />
        <span style={mono(28, {fontWeight: 500, color: colors.muted})}>{card.party}</span>
      </div>
      {card.rows.map((r) => (
        <Row key={r.text} row={r} />
      ))}
    </div>
  </Reveal>
);

const Attempts: React.FC<{content: DeadlockContent['attempts']; glideAt: number}> = ({content, glideAt}) => {
  const f = useCurrentFrame();
  const glide = 1 - prog(f, glideAt - 6, 34); // starts vertically centred, glides up
  return (
    <div style={{display: 'flex', gap: 12, marginBottom: 34, transform: `translateY(${glide * 340}px)`}}>
      {content.items.map((it, i) => {
        const p = prog(f, content.at + i * 8, 20);
        const color = it.tone === 'no' ? colors.veto : it.tone === 'pending' ? colors.parl : colors.mutedSoft;
        const pulse = it.tone === 'pending' ? 0.75 + 0.25 * Math.sin(f / 10) : 1;
        return (
          <div
            key={it.label}
            className="glass"
            style={{
              flex: 1,
              borderRadius: 20,
              padding: '22px 18px 24px',
              opacity: p * pulse * (it.tone === 'dim' ? 0.6 : 1),
              transform: `translateY(${(1 - p) * 14}px)`,
            }}
          >
            <div style={mono(22, {color: colors.muted})}>{it.label}</div>
            <div style={{...mono(it.value.length > 3 ? 27 : 48, {fontWeight: 500, color}), marginTop: 18, lineHeight: 1.1}}>{it.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export const DeadlockMatrix: React.FC<{content: DeadlockContent}> = ({content}) => {
  const f = useCurrentFrame();
  const dash = prog(f, content.tension.lineAt, 26);
  const pulse = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <SceneFrame>
      <Attempts content={content.attempts} glideAt={content.cards[0].at} />
      <Reveal at={content.docPillAt} y={12} style={{alignSelf: 'flex-start', marginBottom: 24}}>
        <div className="glass" style={{...mono(30, {fontWeight: 500, color: colors.ink}), borderRadius: 99, padding: '14px 30px'}}>
          ▤ {content.docPill}
        </div>
      </Reveal>

      <PartyCard card={content.cards[0]} />

      <div style={{position: 'relative', height: 130}}>
        <svg width={200} height={130} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <path
            d="M60,0 C 60,36 20,34 20,65 C 20,96 60,94 60,130"
            fill="none"
            stroke={colors.veto}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="8 10"
            strokeDashoffset={-f * 1.4}
            opacity={dash}
          />
          <circle cx={20} cy={65} r={7 + 12 * pulse} fill={colors.veto} opacity={0.12 * dash} />
          <circle cx={20} cy={65} r={7} fill={colors.veto} opacity={dash} />
        </svg>
        <div
          className="glass"
          style={{
            position: 'absolute',
            left: 96,
            top: 38,
            borderRadius: 99,
            padding: '10px 28px',
            opacity: prog(f, content.tension.chipAt, 18),
            boxShadow: redGlow,
            ...mono(30, {fontWeight: 500, color: colors.veto}),
          }}
        >
          {content.tension.label}
        </div>
      </div>

      <PartyCard card={content.cards[1]} />
    </SceneFrame>
  );
};
