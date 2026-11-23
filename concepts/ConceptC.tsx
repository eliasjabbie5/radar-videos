import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {loadFont as brico} from '@remotion/google-fonts/BricolageGrotesque';
import {loadFont as dmsans} from '@remotion/google-fonts/DMSans';
import {loadFont as dmmono} from '@remotion/google-fonts/DMMono';
import {Caption, Phases, R, countTo, lin, prog} from './kit';

const D = brico('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin', 'latin-ext']}).fontFamily;
const B = dmsans('normal', {weights: ['400', '500', '600'], subsets: ['latin', 'latin-ext']}).fontFamily;
const M = dmmono('normal', {weights: ['400', '500'], subsets: ['latin', 'latin-ext']}).fontFamily;

const INK = '#14161B';
const MUTE = '#7B8190';
const RED = '#EF4444';
const BLUE = '#3B7BEA';
const GREEN = '#17B26A';

const mono = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: M,
  fontSize: size,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  ...extra,
});

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.95)',
  boxShadow: '0 18px 48px rgba(30,45,90,0.12), 0 0 0 1px rgba(20,30,60,0.10)',
  borderRadius: 28,
};

const Orbs: React.FC = () => {
  const f = useCurrentFrame();
  const o = (x: number, y: number, s: number, c: string, ph: number): React.CSSProperties => ({
    position: 'absolute',
    left: x + Math.sin(f / 70 + ph) * 60,
    top: y + Math.cos(f / 85 + ph) * 70,
    width: s,
    height: s,
    borderRadius: s,
    background: `radial-gradient(circle, ${c} 0%, rgba(255,255,255,0) 68%)`,
    filter: 'blur(10px)',
  });
  return (
    <AbsoluteFill style={{background: '#FFFFFF'}}>
      <div style={o(-250, 120, 900, 'rgba(120,170,255,0.38)', 0)} />
      <div style={o(520, 700, 900, 'rgba(255,140,150,0.28)', 2)} />
      <div style={o(-200, 1250, 900, 'rgba(110,220,180,0.30)', 4)} />
    </AbsoluteFill>
  );
};

const Chrome: React.FC<{step: number}> = ({step}) => (
  <div style={{position: 'absolute', top: 84, left: 64, right: 140, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
    <span style={{...glass, borderRadius: 99, padding: '10px 22px', ...mono(24, {fontWeight: 500, color: INK})}}>VALET 2026 • DEL 1/4</span>
    <span style={{display: 'flex', gap: 10, alignItems: 'center'}}>
      {[1, 2, 3, 4].map((n) => (
        <span key={n} style={{width: n === step ? 58 : 14, height: 14, borderRadius: 14, background: INK, opacity: n < step ? 0.35 : n === step ? 1 : 0.15}} />
      ))}
    </span>
  </div>
);
const Source: React.FC<{t: string}> = ({t}) => (
  <div style={{position: 'absolute', left: 64, bottom: 250, ...mono(23, {color: MUTE})}}>{t}</div>
);

/* ───────── 1 · Cold open: ring dial ───────── */
const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const n = countTo(f, 8, 62, 70);
  const pill = prog(f, 90, 20);
  const cx = 438;
  const cy = 330;
  const ticks = Array.from({length: 70}, (_, i) => {
    const a = (i / 70) * Math.PI * 2 - Math.PI / 2;
    const lit = i < n;
    const head = i === n - 1;
    const r1 = head ? 318 : 330;
    const r2 = 372;
    return (
      <line key={i} x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1} x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2} stroke={head ? RED : lit ? INK : 'rgba(20,22,27,0.14)'} strokeWidth={head ? 5 : 3.5} strokeLinecap="round" opacity={prog(f, i * 0.4, 12)} />
    );
  });
  return (
    <AbsoluteFill>
      <R at={0} style={{position: 'absolute', top: 120, left: 64, right: 140, display: 'flex', justifyContent: 'space-between', ...mono(26, {color: MUTE})}}>
        <span>Riksdagen • Stockholm</span><span>22 nov 2026</span>
      </R>
      <svg width={876} height={760} style={{position: 'absolute', top: 270, left: 64, overflow: 'visible'}}>{ticks}</svg>
      <div style={{position: 'absolute', top: 270 + cy - 190, left: 64, width: 2 * cx, textAlign: 'center'}}>
        <div style={{fontFamily: D, fontWeight: 600, fontSize: 380, lineHeight: 1, letterSpacing: '-0.05em', color: INK, display: 'flex', justifyContent: 'center'}}>
          {String(n).padStart(2, '0').split('').map((d, i) => (
            <span key={i} style={{display: 'inline-block', width: '0.56em'}}>{d}</span>
          ))}
        </div>
      </div>
      <R at={64} y={12} style={{position: 'absolute', top: 1060, left: 64, width: 876, textAlign: 'center', ...mono(38, {fontWeight: 500, color: INK})}}>
        Dagar utan regering
      </R>
      <div style={{position: 'absolute', top: 1150, left: 64, width: 876, display: 'flex', justifyContent: 'center'}}>
        <div style={{...glass, borderRadius: 99, padding: '22px 40px', display: 'flex', alignItems: 'center', gap: 20, opacity: pill, transform: `translateY(${(1 - pill) * 16}px)`, boxShadow: '0 20px 60px rgba(239,68,68,0.18), 0 0 0 1.5px rgba(239,68,68,0.55)'}}>
          <span style={{display: 'flex', gap: 8}}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={{width: 16, height: 16, borderRadius: 16, background: i < 2 ? INK : 'transparent', border: `2px solid ${INK}`, opacity: i < 2 ? 1 : 0.4}} />
            ))}
          </span>
          <span style={mono(36, {fontWeight: 500, color: INK})}>2 av 4 försök kvar</span>
        </div>
      </div>
      <Caption text="Och nu har landet bara två chanser kvar innan ett extraval blir verklighet." active={Math.floor(lin(f, 60, 56) * 12)} font={B} color={INK} muted="#9AA1AF" size={46} />
    </AbsoluteFill>
  );
};

/* ───────── 2 · Deadlock ───────── */
const Row: React.FC<{tone: 'yes' | 'no' | 'dim'; text: string; at: number}> = ({tone, text, at}) => {
  const c = tone === 'yes' ? GREEN : tone === 'no' ? RED : MUTE;
  return (
    <R at={at} y={10} style={{display: 'flex', alignItems: 'center', gap: 20, height: 92}}>
      <span style={{width: 56, height: 56, borderRadius: 56, background: tone === 'dim' ? 'rgba(0,0,0,0.05)' : `${c}22`, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: B, fontWeight: 600, fontSize: 30}}>
        {tone === 'yes' ? '✓' : tone === 'no' ? '✕' : '–'}
      </span>
      <span style={{fontFamily: B, fontWeight: 500, fontSize: 52, color: tone === 'dim' ? MUTE : INK}}>{text}</span>
    </R>
  );
};
const Deadlock: React.FC = () => {
  const f = useCurrentFrame();
  const dash = prog(f, 62, 26);
  const pulse = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <Chrome step={2} />
      <R at={4} style={{position: 'absolute', top: 214, left: 64, ...glass, borderRadius: 99, padding: '14px 30px', ...mono(30, {fontWeight: 500, color: INK})}}>
        ▤ S-paketet • 135 punkter
      </R>
      <div style={{position: 'absolute', top: 310, left: 64, right: 140}}>
        <R at={10} y={26} style={{...glass, padding: '30px 38px 14px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8}}>
            <span style={{width: 16, height: 16, borderRadius: 16, background: GREEN}} />
            <span style={mono(28, {color: MUTE, fontWeight: 500})}>Centerpartiet</span>
          </div>
          <Row tone="yes" text="Går vidare med S" at={34} />
          <Row tone="no" text="Inga V-ministrar" at={50} />
        </R>

        <div style={{position: 'relative', height: 140}}>
          <svg width={200} height={140} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            <path d="M60,0 C 60,40 20,40 20,70 C 20,100 60,100 60,140" fill="none" stroke={RED} strokeWidth={3} strokeLinecap="round" strokeDasharray="8 10" strokeDashoffset={-f * 1.4} opacity={dash} />
            <circle cx={20} cy={70} r={7 + 12 * pulse} fill={RED} opacity={0.12 * dash} />
            <circle cx={20} cy={70} r={7} fill={RED} opacity={dash} />
          </svg>
          <div style={{position: 'absolute', left: 90, top: 40, ...glass, borderRadius: 99, padding: '10px 28px', opacity: prog(f, 76, 18), boxShadow: '0 12px 30px rgba(239,68,68,0.18), 0 0 0 1.5px rgba(239,68,68,0.5)', ...mono(30, {fontWeight: 500, color: RED})}}>
            Låsning
          </div>
        </div>

        <R at={30} y={26} style={{...glass, padding: '30px 38px 14px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8}}>
            <span style={{width: 16, height: 16, borderRadius: 16, background: BLUE}} />
            <span style={mono(28, {color: MUTE, fontWeight: 500})}>Vänsterpartiet</span>
          </div>
          <Row tone="no" text="Kräver ministerposter" at={80} />
          <Row tone="dim" text="Stöd ej säkrat" at={92} />
        </R>
      </div>

      <R at={24} style={{position: 'absolute', top: 1230, left: 64, right: 140, display: 'flex', gap: 14}}>
        {[['1', 'Andersson', 'Nej', RED], ['2', 'Thand Ringqvist', 'Nej', RED], ['3', 'Nästa', '?', BLUE], ['4', 'Extraval', '', MUTE]].map(([n, l, r, c], i) => (
          <div key={n} style={{...glass, flex: 1, borderRadius: 20, padding: '18px 18px', opacity: i === 3 ? 0.55 : 1}}>
            <div style={mono(21, {color: MUTE})}>Försök {n}</div>
            <div style={{fontFamily: B, fontWeight: 600, fontSize: 32, color: INK, marginTop: 6, lineHeight: 1.15}}>{l}</div>
            {r && <div style={mono(26, {color: c as string, marginTop: 8, fontWeight: 500})}>{r}</div>}
          </div>
        ))}
      </R>
      <Source t="KÄLLA: SVT NYHETER / AFTONBLADET" />
      <Caption text="Vänsterpartiet å sin sida kräver egna ministerposter." active={Math.floor(lin(f, 70, 40) * 7)} font={B} color={INK} muted="#9AA1AF" size={46} />
    </AbsoluteFill>
  );
};

/* ───────── 3 · Hemicycle ───────── */
const useSeats = () =>
  useMemo(() => {
    const rows = 9;
    const r0 = 190;
    const r1 = 420;
    const radii = Array.from({length: rows}, (_, i) => r0 + ((r1 - r0) * i) / (rows - 1));
    const sum = radii.reduce((a, b) => a + b, 0);
    const counts = radii.map((r) => Math.round((349 * r) / sum));
    counts[rows - 1] += 349 - counts.reduce((a, b) => a + b, 0);
    const seats: {x: number; y: number; a: number}[] = [];
    radii.forEach((r, ri) => {
      const n = counts[ri];
      for (let j = 0; j < n; j++) {
        const a = Math.PI - (j * Math.PI) / (n - 1); // π (left) → 0 (right)
        seats.push({x: Math.cos(a) * r, y: -Math.sin(a) * r, a});
      }
    });
    seats.sort((p, q) => p.a - q.a); // rightmost first
    return seats;
  }, []);

const Hemicycle: React.FC = () => {
  const f = useCurrentFrame();
  const seats = useSeats();
  const rP = lin(f, 40, 44);
  const lP = lin(f, 88, 18);
  const blue = Math.floor(rP * 173);
  const red = Math.floor(lP * 24);
  const count = blue + red;
  const fell = count >= 175;
  const crossF = 88 + (18 * 2) / 24;
  const fellP = prog(f, crossF, 16);
  const W = 876;
  const cx = W / 2;
  const cy = 470;
  return (
    <AbsoluteFill>
      <Chrome step={3} />
      <div style={{position: 'absolute', top: 200, left: 64, width: W, textAlign: 'center'}}>
        <div style={{fontFamily: D, fontWeight: 600, fontSize: 250, lineHeight: 1, letterSpacing: '-0.05em', color: fell ? RED : INK, display: 'flex', justifyContent: 'center'}}>
          {String(count).padStart(3, '0').split('').map((d, i) => (
            <span key={i} style={{display: 'inline-block', width: '0.56em'}}>{d}</span>
          ))}
        </div>
        <div style={mono(30, {color: fell ? RED : MUTE, fontWeight: 500, marginTop: -6})}>Nej-röster av 175 som krävs</div>
      </div>

      <svg width={W} height={500} style={{position: 'absolute', top: 560, left: 64, overflow: 'visible'}}>
        {seats.map((s, i) => {
          const isB = i < 173;
          const isR = i >= 349 - 24;
          let lit = 0;
          let c = BLUE;
          if (isB) lit = prog(f, 40 + (i / 173) * 44, 10);
          if (isR) {
            lit = prog(f, 88 + ((349 - 1 - i) / 24) * 18, 10);
            c = RED;
          }
          const intro = prog(f, (s.a / Math.PI) * 20, 20);
          return (
            <g key={i} opacity={intro}>
              <circle cx={cx + s.x} cy={cy + s.y} r={9.5} fill="rgba(20,22,27,0.10)" />
              {lit > 0 && <circle cx={cx + s.x} cy={cy + s.y} r={9.5} fill={c} opacity={lit} />}
            </g>
          );
        })}
      </svg>

      <div style={{position: 'absolute', top: 1090, left: 64, width: W, opacity: prog(f, 30, 20)}}>
        <div style={{...glass, borderRadius: 99, padding: 10}}>
          <div style={{position: 'relative', height: 22, borderRadius: 22, background: 'rgba(20,22,27,0.07)'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 22, width: `${(Math.min(count, 173) / 349) * 100}%`, background: BLUE}} />
            <div style={{position: 'absolute', top: 0, bottom: 0, left: `${(173 / 349) * 100}%`, borderRadius: 22, width: `${(Math.max(0, count - 173) / 349) * 100}%`, background: RED}} />
            <div style={{position: 'absolute', top: -12, bottom: -12, left: `${(175 / 349) * 100}%`, width: 3, borderRadius: 3, background: fell ? RED : INK}} />
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
          <span style={{...glass, borderRadius: 99, padding: '10px 28px', opacity: 1, ...mono(32, {fontWeight: 500, color: fell ? RED : INK}), boxShadow: fell ? '0 12px 30px rgba(239,68,68,0.2), 0 0 0 1.5px rgba(239,68,68,0.55)' : glass.boxShadow, transform: `scale(${fell ? 1.1 - 0.1 * fellP : 1})`}}>
            {fell ? 'Fälld' : '175 nej = fälld'}
          </span>
        </div>
      </div>

      <R at={44} y={8} style={{position: 'absolute', top: 1270, left: 64, width: W, display: 'flex', justifyContent: 'center', gap: 40, ...mono(30, {fontWeight: 500, color: INK})}}>
        <span><span style={{color: BLUE}}>●</span> Högerblocket: 173</span>
        <span style={{opacity: prog(f, 86, 14)}}><span style={{color: RED}}>●</span> + Vänsterpartiet</span>
      </R>
      <Source t="REGERINGSFORMEN 6 KAP. • 349 MANDAT" />
      <Caption text="Så om Vänsterpartiet trycker på nej-knappen faller allt direkt." active={Math.floor(lin(f, 60, 50) * 10)} font={B} color={INK} muted="#9AA1AF" size={46} />
    </AbsoluteFill>
  );
};

export const ConceptC: React.FC = () => (
  <Phases bg={<AbsoluteFill style={{background: '#FFFFFF'}} />} parts={[<ColdOpen key="a" />, <Deadlock key="b" />, <Hemicycle key="c" />]} />
);
