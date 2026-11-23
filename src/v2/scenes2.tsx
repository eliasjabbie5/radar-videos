import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Reveal} from '../components/Reveal';
import {prog} from '../lib/motion';
import {APP, colors, CONTENT, fontFamily, mono, redGlow} from '../lib/theme';
import type {Episode2, SceneBody} from '../data/types2';
import {StampBox, W} from './ui';
import {renderWidget} from './widgets';

const Frame: React.FC<{top: number; children: React.ReactNode; align?: 'center' | 'start'}> = ({top, children, align = 'center'}) => (
  <AbsoluteFill
    style={{
      paddingLeft: APP.left,
      paddingRight: APP.right,
      paddingTop: top,
      paddingBottom: CONTENT.bottom,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: align === 'center' ? 'center' : 'flex-start',
      alignItems: 'flex-start',
    }}
  >
    <div style={{transform: `scale(${APP.scale})`, transformOrigin: 'left center', width: W, flex: 'none'}}>{children}</div>
  </AbsoluteFill>
);

/* ───────── hook tiles: four big words stamp in ───────── */
const HookTiles: React.FC<{b: Extract<SceneBody, {type: 'hookTiles'}>}> = ({b}) => {
  const f = useCurrentFrame();
  const head = prog(f, b.headline.at, 24);
  return (
    <AbsoluteFill style={{paddingLeft: APP.left, paddingRight: APP.right, paddingTop: 280}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 20, width: W, transform: `scale(${APP.scale})`, transformOrigin: 'left top'}}>
        {b.tiles.map((t) => {
          const p = prog(f, t.at, 20);
          const pulse = t.locked ? 0.75 + 0.25 * Math.sin(f / 9) : 1;
          return (
            <div
              key={t.label}
              className="glass"
              style={{
                height: 208,
                padding: '0 44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: p * pulse,
                transform: `translateX(${(1 - p) * -90}px)`,
                border: t.locked ? '2px dashed rgba(20,22,27,0.3)' : undefined,
                boxShadow: t.locked ? 'none' : undefined,
                background: t.locked ? 'rgba(20,22,27,0.03)' : undefined,
              }}
            >
              <span style={{fontFamily: fontFamily.display, fontWeight: 600, fontSize: 128, letterSpacing: '-0.045em', color: t.locked ? colors.muted : colors.ink}}>
                {t.label}
              </span>
              <span style={{...mono(28, {fontWeight: 500, color: t.locked ? colors.veto : colors.muted}), textAlign: 'right', maxWidth: 260, lineHeight: 1.25}}>
                {t.locked ? '🔒 ' : ''}
                {t.sub}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: APP.left, width: W * APP.scale, top: 1190, textAlign: 'center', opacity: head, transform: `scale(${0.92 + 0.08 * head})`}}>
        <div style={mono(30, {color: colors.muted, fontWeight: 500})}>ETT FÖRETAG</div>
        <div style={{fontFamily: fontFamily.display, fontWeight: 600, fontSize: 170, letterSpacing: '-0.05em', color: colors.ink, lineHeight: 1}}>{b.headline.text}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── redacted document ───────── */
const Redacted: React.FC<{b: Extract<SceneBody, {type: 'redacted'}>}> = ({b}) => {
  const f = useCurrentFrame();
  const reveal = prog(f, b.revealAt, 20);
  const stamp = prog(f, b.stamp.at, 20);
  return (
    <Frame top={280}>
      <Reveal at={0} y={30} style={{width: W}}>
        <div className="glass" style={{padding: '36px 40px 44px', position: 'relative', borderRadius: 24}}>
          <div style={{display: 'flex', justifyContent: 'space-between', ...mono(24, {color: colors.muted, fontWeight: 500})}}>
            <span>{b.kicker}</span>
            <span>NOV 2025</span>
          </div>
          <div style={{height: 2, background: colors.ink, margin: '18px 0 22px'}} />
          {b.meta.map((m, i) => (
            <Reveal key={m} at={b.metaAt + i * 5} y={8} style={mono(24, {color: colors.ink, padding: '6px 0'})}>
              {m}
            </Reveal>
          ))}
          <div style={{marginTop: 26}}>
            {[0.92, 0.7, 0.84].map((w, i) => (
              <div key={i} style={{height: 14, width: `${w * 100}%`, borderRadius: 7, background: colors.track, marginBottom: 14}} />
            ))}
          </div>
          <div style={{fontFamily: fontFamily.sans, fontWeight: 500, fontSize: 54, lineHeight: 1.22, letterSpacing: '-0.015em', color: colors.ink, marginTop: 28}}>
            <Reveal at={10} y={10}>
              “{b.before}
            </Reveal>
            <div style={{position: 'relative', display: 'inline-block', marginTop: 10}}>
              <span style={{fontFamily: fontFamily.display, fontWeight: 600, fontSize: 130, letterSpacing: '-0.04em', color: colors.veto, lineHeight: 1.05}}>{b.secret}</span>
              <span style={{position: 'absolute', left: 0, top: 6, bottom: 6, width: `${(1 - reveal) * 100}%`, background: colors.ink, borderRadius: 6}} />
              <span style={{fontSize: 54, color: colors.ink}}>.”</span>
            </div>
          </div>
          <div style={{marginTop: 30}}>
            {[0.88, 0.62].map((w, i) => (
              <div key={i} style={{height: 14, width: `${w * 100}%`, borderRadius: 7, background: colors.track, marginBottom: 14}} />
            ))}
          </div>
          <div style={{position: 'absolute', right: 30, bottom: -26}}>
            <StampBox text={b.stamp.text} p={stamp} size={28} style={{boxShadow: stamp > 0.5 ? redGlow : undefined, background: '#fff'}} />
          </div>
        </div>
      </Reveal>
    </Frame>
  );
};

/* ───────── stack of widgets ───────── */
const Stack: React.FC<{b: Extract<SceneBody, {type: 'stack'}>; top: number}> = ({b, top}) => (
  <Frame top={top} align={b.align ?? 'center'}>
    <div style={{display: 'flex', flexDirection: 'column', gap: b.gap ?? 34, width: W}}>{b.widgets.map((w, i) => renderWidget(w, i))}</div>
  </Frame>
);

/* ───────── binary question ───────── */
const Pill: React.FC<{text: string; accent: string; active: boolean; at: number}> = ({text, accent, active, at}) => {
  const f = useCurrentFrame();
  const a = prog(f, at, 16);
  const hi = active ? 0.6 + 0.4 * Math.sin(f / 9) : 0;
  return (
    <div
      className="glass"
      style={{
        ...mono(38, {fontWeight: 500, color: colors.ink}),
        flex: 1,
        borderRadius: 99,
        padding: '32px 0',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        gap: 14,
        opacity: a * (active ? 1 : 0.7),
        transform: `scale(${active ? 1.03 : 1})`,
        boxShadow: active ? `0 16px 44px ${accent}33, 0 0 0 ${1.5 + hi}px ${accent}` : undefined,
      }}
    >
      <span style={{color: colors.muted}}>[</span>
      {text}
      <span style={{color: colors.muted}}>]</span>
    </div>
  );
};
const Binary: React.FC<{b: Extract<SceneBody, {type: 'binary'}>}> = ({b}) => {
  const f = useCurrentFrame();
  const second = f >= b.switchAt;
  return (
    <Frame top={280}>
      <Reveal at={b.questionAt} dur={44} y={28} style={{width: W}}>
        <div style={{fontFamily: fontFamily.display, fontWeight: 600, fontSize: 124, lineHeight: 1.0, letterSpacing: '-0.045em', color: colors.ink}}>{b.question}</div>
      </Reveal>
      <div style={{display: 'flex', gap: 24, marginTop: 64, width: W}}>
        <Pill text={b.options[0]} accent={colors.center} active={f >= b.optionsAt && !second} at={b.optionsAt} />
        <Pill text={b.options[1]} accent={colors.veto} active={second} at={b.optionsAt + 6} />
      </div>
      {b.save && (
        <Reveal at={b.save.at} y={10} style={{marginTop: 54}}>
          <span className="glass" style={{...mono(28, {fontWeight: 500, color: colors.ink}), borderRadius: 99, padding: '14px 30px', display: 'inline-block'}}>
            🔖 {b.save.text}
          </span>
        </Reveal>
      )}
      {b.teaser && (
        <Reveal at={b.teaser.at} y={10} style={{marginTop: 34}}>
          <div style={mono(26, {color: colors.muted, fontWeight: 500})}>{b.teaser.text}</div>
        </Reveal>
      )}
    </Frame>
  );
};

/* ───────── cliffhanger: the whole chain, last box locked ───────── */
const Cliff: React.FC<{b: Extract<SceneBody, {type: 'cliff'}>; episode: Episode2; from: number}> = ({b, episode, from}) => {
  const f = useCurrentFrame();
  const gf = from + f;
  return (
    <Frame top={300}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, width: W}}>
        {episode.chain.labels.map((label, i) => {
          const u = episode.chain.unlockAt[i];
          const open = u !== null && gf >= u;
          const last = u === null;
          const pulse = last ? 0.55 + 0.45 * Math.sin(f / 8) : 1;
          const p = prog(f, 6 + i * 6, 18);
          return (
            <div
              key={label}
              className="glass"
              style={{
                height: 132,
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                padding: '0 38px',
                opacity: p,
                transform: `translateY(${(1 - p) * 18}px)`,
                border: last ? `2px dashed rgba(239,68,68,${0.35 + 0.4 * pulse})` : undefined,
                boxShadow: last ? redGlow : undefined,
              }}
            >
              <span style={mono(28, {color: colors.muted, fontWeight: 500, width: 44})}>0{i + 1}</span>
              <span style={{flex: 1, fontFamily: fontFamily.display, fontWeight: 600, fontSize: 70, letterSpacing: '-0.035em', color: last ? colors.veto : colors.ink}}>
                {open || last ? label : '?'}
              </span>
              <span style={{fontSize: 44, opacity: last ? pulse : 1}}>{open ? '✓' : '🔒'}</span>
            </div>
          );
        })}
      </div>
      <Reveal at={b.card.at} y={26} style={{width: W, marginTop: 40}}>
        <div className="glass" style={{padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={mono(32, {fontWeight: 500, color: colors.ink})}>{b.card.title}</span>
          <span style={mono(22, {color: colors.muted, fontWeight: 500})}>{b.card.sub} →</span>
        </div>
      </Reveal>
    </Frame>
  );
};

export const renderScene2 = (body: SceneBody, ep: Episode2, from: number, chrome: boolean): React.ReactNode => {
  const top = chrome ? 470 : 280;
  switch (body.type) {
    case 'hookTiles': return <HookTiles b={body} />;
    case 'redacted': return <Redacted b={body} />;
    case 'stack': return <Stack b={body} top={top} />;
    case 'binary': return <Binary b={body} />;
    case 'cliff': return <Cliff b={body} episode={ep} from={from} />;
  }
};
