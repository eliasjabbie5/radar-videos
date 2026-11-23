import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {loadFont as grot} from '@remotion/google-fonts/FamiljenGrotesk';
import {loadFont as gmono} from '@remotion/google-fonts/GeistMono';
import {Caption, G, GridSvg, Phases, R, countTo, gridGeom, gridState, lin, prog} from './kit';

const D = grot('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin', 'latin-ext']}).fontFamily;
const M = gmono('normal', {weights: ['400', '500', '600'], subsets: ['latin']}).fontFamily;

const INK = '#0A0A0A';
const RED = '#E5242B';
const LINE = '#EDEDED';
const MUTE = '#7A7A7A';

const mono = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: M,
  fontSize: size,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  ...extra,
});

const GridPaper: React.FC = () => (
  <AbsoluteFill
    style={{
      background: '#FFFFFF',
      backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`,
      backgroundSize: '90px 90px',
      backgroundPosition: '24px 0',
    }}
  />
);

const Ticker: React.FC<{text: string; y: number; bg: string; fg: string; speed?: number; dir?: 1 | -1}> = ({text, y, bg, fg, speed = 5, dir = 1}) => {
  const f = useCurrentFrame();
  const unit = `${text}   ✕   `;
  const x = ((f * speed) % 900) * dir;
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, height: 52, background: bg, overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
      <div style={{whiteSpace: 'nowrap', transform: `translateX(${-x - (dir === 1 ? 0 : 900)}px)`, ...mono(22, {color: fg, fontWeight: 500})}}>
        {unit.repeat(8)}
      </div>
    </div>
  );
};

const Chrome: React.FC<{step: number}> = ({step}) => (
  <div style={{position: 'absolute', top: 84, left: 64, right: 140, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
    <span style={mono(20, {fontWeight: 600, background: INK, color: '#fff', padding: '9px 16px'})}>VALET 2026 • DEL 1/4</span>
    <span style={{display: 'flex', gap: 8}}>
      {[1, 2, 3, 4].map((n) => (
        <span
          key={n}
          style={mono(20, {
            fontWeight: 600,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: n === step ? INK : 'transparent',
            color: n === step ? '#fff' : INK,
            border: `1.5px solid ${INK}`,
            opacity: n < step ? 0.4 : n === step ? 1 : 0.25,
          })}
        >
          {n}
        </span>
      ))}
    </span>
  </div>
);
const Source: React.FC<{t: string}> = ({t}) => (
  <div style={{position: 'absolute', left: 64, bottom: 250, ...mono(18, {color: MUTE})}}>{t}</div>
);

/* ───────── 1 · Cold open ───────── */
const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const n = countTo(f, 6, 64, 70);
  const band = prog(f, 56, 22);
  const pill = prog(f, 90, 18);
  return (
    <AbsoluteFill>
      <Ticker text="INGEN REGERING • 70 DAGAR • ÖVERGÅNGSREGERING" y={84} bg={INK} fg="#fff" />
      <div style={{position: 'absolute', left: 14, top: 400, transformOrigin: 'left top', transform: 'rotate(-90deg) translateX(-100%)', ...mono(20, {color: MUTE})}}>RIKSDAGEN • 22 NOV 2026</div>

      <div style={{position: 'absolute', top: 190, left: 40, right: 100, fontFamily: D, fontWeight: 700, fontSize: 900, lineHeight: 0.8, letterSpacing: '-0.06em', color: INK, display: 'flex', justifyContent: 'center'}}>
        {String(n).padStart(2, '0').split('').map((d, i) => (
          <span key={i} style={{display: 'inline-block', width: '0.56em', textAlign: 'center'}}>{d}</span>
        ))}
      </div>

      <div style={{position: 'absolute', top: 960, left: 0, height: 130, width: `${band * 100}%`, background: RED, overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
        <span style={{marginLeft: 64, whiteSpace: 'nowrap', fontFamily: D, fontWeight: 700, fontSize: 76, letterSpacing: '-0.02em', color: '#fff', textTransform: 'uppercase'}}>Dagar utan regering</span>
      </div>

      <div style={{position: 'absolute', top: 1130, left: 64, right: 140, display: 'flex', gap: 12}}>
        {[0, 1, 2, 3].map((i) => {
          const used = i < 2;
          const p = prog(f, 72 + i * 5, 14);
          return (
            <div key={i} style={{flex: 1, height: 18, background: used ? INK : 'transparent', border: `1.5px solid ${INK}`, transform: `scaleX(${p})`, transformOrigin: 'left'}} />
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1170, left: 64, right: 140, display: 'flex', justifyContent: 'space-between', opacity: prog(f, 80, 16), ...mono(18, {color: MUTE})}}>
        <span>FÖRSÖK 1</span><span>2</span><span>3</span><span>4</span>
      </div>

      <div style={{position: 'absolute', top: 1250, left: 64, opacity: pill, transform: `translateX(${(1 - pill) * -30}px)`, background: '#fff', border: `3px solid ${RED}`, color: RED, padding: '16px 30px', ...mono(34, {fontWeight: 600})}}>
        2 AV 4 FÖRSÖK KVAR
      </div>
      <Caption text="Och nu har landet bara två chanser kvar innan ett extraval blir verklighet." active={Math.floor(lin(f, 60, 56) * 12)} font={D} color={INK} muted="#B5B5B5" weight={600} />
    </AbsoluteFill>
  );
};

/* ───────── 2 · Deadlock ───────── */
const Row: React.FC<{tone: 'yes' | 'no' | 'dim'; text: string; at: number; dark?: boolean}> = ({tone, text, at, dark}) => {
  const c = tone === 'yes' ? '#16A36A' : tone === 'no' ? RED : MUTE;
  return (
    <R at={at} x={-30} y={0} style={{display: 'flex', alignItems: 'center', gap: 22, height: 82}}>
      <span style={{width: 46, height: 46, background: tone === 'dim' ? 'transparent' : c, border: `2px solid ${c}`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D, fontWeight: 700, fontSize: 28}}>
        {tone === 'yes' ? '✓' : tone === 'no' ? '✕' : ''}
      </span>
      <span style={{fontFamily: D, fontWeight: 600, fontSize: 46, letterSpacing: '-0.01em', color: tone === 'dim' ? MUTE : dark ? '#fff' : INK}}>{text}</span>
    </R>
  );
};
const Deadlock: React.FC = () => {
  const f = useCurrentFrame();
  const wipe = prog(f, 66, 22);
  return (
    <AbsoluteFill>
      <Chrome step={2} />
      <R at={4} y={0} x={-40} style={{position: 'absolute', top: 170, left: 64, ...mono(26, {fontWeight: 600, background: RED, color: '#fff', padding: '10px 20px'})}}>
        S-PAKETET • 135 PUNKTER
      </R>

      <div style={{position: 'absolute', top: 262, left: 64, right: 140}}>
        <R at={8} y={30} style={{background: INK, padding: '26px 36px 12px'}}>
          <div style={mono(24, {fontWeight: 600, color: '#fff', opacity: 0.6})}>CENTERPARTIET</div>
          <Row tone="yes" text="Går vidare med S" at={30} dark />
          <Row tone="no" text="Inga V-ministrar" at={46} dark />
        </R>

        {/* clash band */}
        <div style={{position: 'relative', height: 120, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: 18, height: 84, width: `${wipe * 100}%`, background: RED, overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
            <div style={{whiteSpace: 'nowrap', transform: `translateX(${-((f * 7) % 520)}px)`, fontFamily: D, fontWeight: 700, fontSize: 52, color: '#fff', letterSpacing: '0.02em'}}>
              {'LÅSNING ✕ '.repeat(12)}
            </div>
          </div>
        </div>

        <R at={22} y={30} style={{border: `3px solid ${INK}`, background: '#fff', padding: '26px 36px 12px'}}>
          <div style={mono(24, {fontWeight: 600, color: MUTE})}>VÄNSTERPARTIET</div>
          <Row tone="no" text="Kräver ministerposter" at={76} />
          <Row tone="dim" text="Stöd ej säkrat" at={90} />
        </R>
      </div>

      <R at={24} y={0} style={{position: 'absolute', top: 1090, left: 64, right: 140, display: 'flex', gap: 10}}>
        {[['01', 'NEJ', INK], ['02', 'NEJ', INK], ['03', '?', RED], ['04', 'EXTRAVAL', '#C9C9C9']].map(([n, t, c], i) => (
          <div key={n} style={{flex: 1, border: `2px solid ${c}`, padding: '14px 14px 16px'}}>
            <div style={mono(16, {color: MUTE})}>{`FÖRSÖK ${n}`}</div>
            <div style={{fontFamily: D, fontWeight: 700, fontSize: i === 3 ? 28 : 44, color: c as string, marginTop: 6, letterSpacing: '-0.02em'}}>{t}</div>
          </div>
        ))}
      </R>
      <Source t="KÄLLA: SVT NYHETER / AFTONBLADET" />
      <Caption text="Vänsterpartiet å sin sida kräver egna ministerposter." active={Math.floor(lin(f, 70, 40) * 7)} font={D} color={INK} muted="#B5B5B5" weight={600} />
    </AbsoluteFill>
  );
};

/* ───────── 3 · Dot grid ───────── */
const Dots: React.FC = () => {
  const f = useCurrentFrame();
  const at = {grid: 0, line: 22, right: 44, rightDur: 40, left: 88, leftDur: 18};
  const st = gridState(f, at.right, at.rightDur, at.left, at.leftDur);
  const {w, h, xR} = gridGeom();
  const fellP = prog(f, st.crossF, 12);
  return (
    <AbsoluteFill>
      <Chrome step={3} />
      <div style={{position: 'absolute', top: 160, left: 54, right: 100, fontFamily: D, fontWeight: 700, fontSize: 420, lineHeight: 0.82, letterSpacing: '-0.06em', color: st.fell ? RED : INK, display: 'flex'}}>
        {String(st.count).padStart(3, '0').split('').map((d, i) => (
          <span key={i} style={{display: 'inline-block', width: '0.56em'}}>{d}</span>
        ))}
      </div>
      <div style={{position: 'absolute', top: 520, left: 64, right: 140, display: 'flex', justifyContent: 'space-between', ...mono(22, {fontWeight: 600})}}>
        <span>NEJ-RÖSTER</span>
        <span style={{color: st.fell ? RED : MUTE}}>AV {G.thr} KRÄVS</span>
      </div>
      <div style={{position: 'absolute', top: 556, left: 64, right: 140, height: 4, background: INK}} />

      <div style={{position: 'absolute', top: 570, left: 64, width: w, height: h}}>
        <GridSvg f={f} at={at} pal={{base: '#E2E2E2', right: INK, left: RED, line: INK, fell: RED}} shape="square" r={8.5} fell={st.fell} lineWidth={3} />
        <div style={{position: 'absolute', left: xR - 8, top: 0, transform: 'translateX(-100%)', whiteSpace: 'nowrap', opacity: prog(f, 38, 14), background: INK, color: '#fff', padding: '3px 12px', ...mono(20, {fontWeight: 600})}}>
          175 NEJ = FÄLLD
        </div>
        <div style={{position: 'absolute', left: xR + 12, top: 0, opacity: fellP, transform: `scale(${1.15 - 0.15 * fellP})`, transformOrigin: 'left center', background: RED, color: '#fff', padding: '3px 14px', ...mono(22, {fontWeight: 600})}}>
          FÄLLD
        </div>
      </div>

      <R at={44} y={0} x={-30} style={{position: 'absolute', top: 1260, left: 64, display: 'flex', gap: 14, alignItems: 'center'}}>
        <span style={{width: 22, height: 22, background: INK}} />
        <span style={mono(24, {fontWeight: 600})}>HÖGERBLOCKET: 173</span>
      </R>
      <R at={86} y={0} x={-30} style={{position: 'absolute', top: 1314, left: 64, display: 'flex', gap: 14, alignItems: 'center'}}>
        <span style={{width: 22, height: 22, background: RED}} />
        <span style={mono(24, {fontWeight: 600})}>+ VÄNSTERPARTIET</span>
      </R>
      <Ticker text="REGERINGSFORMEN 6 KAP. • 175 NEJ FÄLLER" y={1380} bg={RED} fg="#fff" dir={-1} speed={6} />
      <Source t="REGERINGSFORMEN 6 KAP. • 349 MANDAT" />
      <Caption text="Så om Vänsterpartiet trycker på nej-knappen faller allt direkt." active={Math.floor(lin(f, 60, 50) * 10)} font={D} color={INK} muted="#B5B5B5" weight={600} />
    </AbsoluteFill>
  );
};

export const ConceptB: React.FC = () => (
  <Phases bg={<GridPaper />} parts={[<ColdOpen key="a" />, <Deadlock key="b" />, <Dots key="c" />]} />
);
