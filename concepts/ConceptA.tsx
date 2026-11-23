import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {loadFont as serif} from '@remotion/google-fonts/Newsreader';
import {loadFont as sans} from '@remotion/google-fonts/HankenGrotesk';
import {loadFont as mono} from '@remotion/google-fonts/IBMPlexMono';
import {Caption, G, GridSvg, Phases, R, countTo, gridGeom, gridState, lin, prog} from './kit';

const S = serif('normal', {weights: ['400', '500'], subsets: ['latin', 'latin-ext']}).fontFamily;
const SI = serif('italic', {weights: ['400'], subsets: ['latin', 'latin-ext']}).fontFamily;
const H = sans('normal', {weights: ['400', '500', '600'], subsets: ['latin', 'latin-ext']}).fontFamily;
const M = mono('normal', {weights: ['400', '500'], subsets: ['latin', 'latin-ext']}).fontFamily;

const INK = '#111111';
const RED = '#D3262E';
const BLUE = '#2B63B5';
const GREEN = '#1E8E5A';
const GREY = '#E4E4E0';
const MUTE = '#6E6E6A';

const mono_ = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: M,
  fontSize: size,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  ...extra,
});

const Masthead: React.FC<{step: number}> = ({step}) => (
  <div style={{position: 'absolute', top: 84, left: 64, right: 140}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
      <span style={mono_(20, {fontWeight: 500, color: INK})}>VALET 2026 • DEL 1/4</span>
      <span style={{display: 'flex', gap: 26}}>
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            style={mono_(22, {
              fontWeight: 500,
              color: INK,
              opacity: n < step ? 0.4 : n === step ? 1 : 0.25,
              borderBottom: n === step ? `2px solid ${INK}` : '2px solid transparent',
            })}
          >
            {n}
          </span>
        ))}
      </span>
    </div>
    <div style={{marginTop: 16, height: 3, background: INK}} />
    <div style={{marginTop: 4, height: 1, background: INK}} />
  </div>
);

const Source: React.FC<{t: string}> = ({t}) => (
  <div style={{position: 'absolute', left: 64, bottom: 250, ...mono_(18, {color: MUTE})}}>{t}</div>
);

/* ───────── 1 · Cold open ───────── */
const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const n = countTo(f, 8, 62, 70);
  const cols = 14;
  return (
    <AbsoluteFill>
      <R at={0} style={{position: 'absolute', top: 120, left: 64, right: 140}}>
        <div style={{display: 'flex', justifyContent: 'space-between', ...mono_(20, {color: MUTE})}}>
          <span>RIKSDAGEN • STOCKHOLM</span>
          <span>22 NOV 2026</span>
        </div>
        <div style={{marginTop: 14, height: 3, background: INK}} />
        <div style={{marginTop: 4, height: 1, background: INK}} />
      </R>

      {/* day grid: 70 squares light up with the counter */}
      <div style={{position: 'absolute', top: 270, left: 64, display: 'grid', gridTemplateColumns: `repeat(${cols}, 54px)`, gap: 8}}>
        {Array.from({length: 70}, (_, i) => {
          const lit = i < n;
          const head = i === n - 1 && n < 70;
          return (
            <div
              key={i}
              style={{
                width: 54,
                height: 54,
                background: head ? RED : lit ? INK : 'transparent',
                border: `1px solid ${lit ? INK : '#CFCFCB'}`,
                opacity: prog(f, i * 0.35, 14),
              }}
            />
          );
        })}
      </div>

      <div style={{position: 'absolute', top: 640, left: 64, right: 140, textAlign: 'center'}}>
        <div style={{fontFamily: S, fontSize: 520, lineHeight: 0.85, letterSpacing: '-0.045em', color: INK, display: 'flex', justifyContent: 'center'}}>
          {String(n).padStart(2, '0').split('').map((d, i) => (
            <span key={i} style={{display: 'inline-block', width: '0.5em'}}>{d}</span>
          ))}
        </div>
      </div>

      <R at={62} y={12} style={{position: 'absolute', top: 1130, left: 64, right: 140, display: 'flex', alignItems: 'center', gap: 24}}>
        <div style={{flex: 1, height: 1, background: INK}} />
        <span style={mono_(30, {fontWeight: 500, color: INK})}>DAGAR UTAN REGERING</span>
        <div style={{flex: 1, height: 1, background: INK}} />
      </R>

      {/* four attempts */}
      <div style={{position: 'absolute', top: 1226, left: 64, right: 140, display: 'flex', alignItems: 'center', gap: 16}}>
        <span style={mono_(20, {color: MUTE, marginRight: 10})}>FÖRSÖK</span>
        {[0, 1, 2, 3].map((i) => {
          const used = i < 2;
          const p = prog(f, 76 + i * 5, 16);
          return (
            <div
              key={i}
              style={{
                width: 70,
                height: 70,
                border: `1.5px solid ${INK}`,
                background: used ? INK : 'transparent',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: M,
                fontSize: 28,
                opacity: p,
                transform: `scale(${0.9 + 0.1 * p})`,
              }}
            >
              {used ? '✕' : <span style={{color: INK, opacity: 0.35}}>{i + 1}</span>}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1340,
          left: 64,
          opacity: prog(f, 90, 18),
          transform: `rotate(-3deg) scale(${1.12 - 0.12 * prog(f, 90, 18)})`,
          transformOrigin: 'left center',
          border: `2.5px solid ${RED}`,
          color: RED,
          padding: '12px 26px',
          ...mono_(32, {fontWeight: 500}),
        }}
      >
        2 AV 4 FÖRSÖK KVAR
      </div>
      <Caption text="Och nu har landet bara två chanser kvar innan ett extraval blir verklighet." active={Math.floor(lin(f, 60, 56) * 12)} font={H} color={INK} muted="#B0B0AB" />
    </AbsoluteFill>
  );
};

/* ───────── 2 · Deadlock ───────── */
const Row: React.FC<{tone: 'yes' | 'no' | 'dim'; text: string; at: number}> = ({tone, text, at}) => {
  const c = tone === 'yes' ? GREEN : tone === 'no' ? RED : MUTE;
  return (
    <R at={at} y={10} style={{display: "flex", alignItems: "center", gap: 22, height: 76}}>
      <span style={{width: 44, height: 44, borderRadius: 44, border: `1.5px solid ${c}`, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: H, fontWeight: 600, fontSize: 24}}>
        {tone === 'yes' ? '✓' : tone === 'no' ? '✕' : '–'}
      </span>
      <span style={{fontFamily: H, fontWeight: 500, fontSize: 40, color: tone === 'dim' ? MUTE : INK}}>{text}</span>
    </R>
  );
};
const Party: React.FC<{name: string; dot: string; at: number; children: React.ReactNode}> = ({name, dot, at, children}) => (
  <R at={at} y={22} style={{borderTop: `4px solid ${INK}`, paddingTop: 16}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6}}>
      <span style={{width: 12, height: 12, borderRadius: 12, background: dot}} />
      <span style={mono_(24, {fontWeight: 500, color: INK})}>{name}</span>
    </div>
    {children}
  </R>
);
const Deadlock: React.FC = () => {
  const f = useCurrentFrame();
  const line = prog(f, 62, 24);
  const pulse = 0.5 + 0.5 * Math.sin(f / 7);
  return (
    <AbsoluteFill>
      <Masthead step={2} />
      <div style={{position: 'absolute', top: 150, right: 140, fontFamily: S, fontSize: 520, lineHeight: 1, letterSpacing: '-0.05em', color: INK, opacity: 0.05 * prog(f, 0, 30)}}>135</div>

      <R at={4} style={{position: 'absolute', top: 214, left: 64}}>
        <div style={mono_(24, {fontWeight: 500, border: `1.5px solid ${INK}`, padding: '10px 20px'})}>▤ S-PAKETET • 135 PUNKTER</div>
      </R>

      <div style={{position: 'absolute', top: 330, left: 64, right: 140}}>
        <Party name="CENTERPARTIET" dot={GREEN} at={10}>
          <Row tone="yes" text="Går vidare med S" at={34} />
          <Row tone="no" text="Inga V-ministrar" at={50} />
        </Party>

        <div style={{position: 'relative', height: 150}}>
          <svg width={200} height={150} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            <line x1={22} y1={0} x2={22} y2={150 * line} stroke={RED} strokeWidth={2} />
            <path d="M12,34 L22,52 L32,34" fill="none" stroke={RED} strokeWidth={2} opacity={line} />
            <path d="M12,116 L22,98 L32,116" fill="none" stroke={RED} strokeWidth={2} opacity={line} />
            <circle cx={22} cy={75} r={8 + 10 * pulse} fill="none" stroke={RED} strokeWidth={1} opacity={(1 - pulse) * line} />
            <circle cx={22} cy={75} r={5} fill={RED} opacity={line} />
          </svg>
          <div style={{position: 'absolute', left: 60, top: 54, opacity: prog(f, 76, 18), ...mono_(26, {fontWeight: 500, color: RED})}}>
            LÅSNING <span style={{fontFamily: SI, textTransform: 'none', letterSpacing: 0, color: MUTE, fontSize: 30}}> — C mot V</span>
          </div>
        </div>

        <Party name="VÄNSTERPARTIET" dot={BLUE} at={30}>
          <Row tone="no" text="Kräver ministerposter" at={80} />
          <Row tone="dim" text="Stöd ej säkrat" at={92} />
        </Party>
      </div>

      {/* attempt timeline */}
      <R at={20} style={{position: 'absolute', top: 1180, left: 64, right: 140}}>
        <div style={{height: 1, background: INK, marginBottom: 22}} />
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          {[['01', 'ANDERSSON', 'NEJ'], ['02', 'THAND RINGQVIST', 'NEJ'], ['03', '?', ''], ['04', 'EXTRAVAL', '']].map(([n, l, r], i) => (
            <div key={n} style={{opacity: i === 3 ? 0.35 : 1, width: 200}}>
              <div style={mono_(18, {color: MUTE})}>{n}</div>
              <div style={{fontFamily: i === 2 ? SI : S, fontSize: i === 2 ? 52 : 30, color: i === 2 ? RED : INK, marginTop: 4, lineHeight: 1.1}}>{l}</div>
              {r && <div style={mono_(18, {color: RED, marginTop: 6, fontWeight: 500})}>{r}</div>}
            </div>
          ))}
        </div>
      </R>
      <Source t="KÄLLA: SVT NYHETER / AFTONBLADET" />
      <Caption text="Vänsterpartiet å sin sida kräver egna ministerposter." active={Math.floor(lin(f, 70, 40) * 7)} font={H} color={INK} muted="#B0B0AB" />
    </AbsoluteFill>
  );
};

/* ───────── 3 · Dot grid ───────── */
const Dots: React.FC = () => {
  const f = useCurrentFrame();
  const at = {grid: 0, line: 22, right: 44, rightDur: 40, left: 88, leftDur: 18};
  const st = gridState(f, at.right, at.rightDur, at.left, at.leftDur);
  const {w, h, xR} = gridGeom();
  const fellP = prog(f, st.crossF, 14);
  const col = st.fell ? RED : INK;
  return (
    <AbsoluteFill>
      <Masthead step={3} />
      <div style={{position: 'absolute', top: 210, left: 64, right: 140, display: 'flex', alignItems: 'flex-end', gap: 26}}>
        <div style={{fontFamily: S, fontSize: 250, lineHeight: 0.85, letterSpacing: '-0.04em', color: col, display: 'flex'}}>
          {String(st.count).padStart(3, '0').split('').map((d, i) => (
            <span key={i} style={{display: 'inline-block', width: '0.5em', textAlign: 'center'}}>{d}</span>
          ))}
        </div>
        <div style={{paddingBottom: 16}}>
          <div style={mono_(22, {color: MUTE})}>NEJ-RÖSTER</div>
          <div style={mono_(22, {color: st.fell ? RED : MUTE, marginTop: 6, fontWeight: 500})}>AV {G.thr} KRÄVS</div>
        </div>
      </div>

      <div style={{position: 'absolute', top: 520, left: 64, width: w, height: h}}>
        <GridSvg f={f} at={at} pal={{base: GREY, right: BLUE, left: RED, line: INK, fell: RED}} fell={st.fell} r={9} lineWidth={2} />
        <div style={{position: 'absolute', left: xR - 6, top: 2, transform: 'translateX(-100%)', whiteSpace: 'nowrap', opacity: prog(f, 40, 16), ...mono_(21, {fontWeight: 500, color: st.fell ? RED : INK})}}>
          175 NEJ = FÄLLD
        </div>
        <div style={{position: 'absolute', left: xR + 14, top: 0, opacity: fellP, transform: `scale(${1.12 - 0.12 * fellP})`, transformOrigin: 'left center', border: `2px solid ${RED}`, color: RED, padding: '1px 12px', ...mono_(22, {fontWeight: 500})}}>
          FÄLLD
        </div>
      </div>

      {/* progress bar 0–349 */}
      <R at={30} style={{position: 'absolute', top: 1240, left: 64, width: w}}>
        <div style={{position: 'relative', height: 14, background: GREY}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(Math.min(st.count, 173) / G.total) * 100}%`, background: BLUE}} />
          <div style={{position: 'absolute', top: 0, bottom: 0, left: `${(173 / G.total) * 100}%`, width: `${(Math.max(0, st.count - 173) / G.total) * 100}%`, background: RED}} />
          <div style={{position: 'absolute', top: -8, bottom: -8, left: `${(G.thr / G.total) * 100}%`, width: 2, background: INK}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, ...mono_(18, {color: MUTE})}}>
          <span>0</span><span>175</span><span>349</span>
        </div>
      </R>

      <R at={50} y={8} style={{position: 'absolute', top: 1340, left: 64, display: 'flex', gap: 40}}>
        <span style={mono_(24, {fontWeight: 500})}><span style={{color: BLUE}}>●</span> HÖGERBLOCKET: 173</span>
        <span style={{...mono_(24, {fontWeight: 500}), opacity: prog(f, 84, 14)}}><span style={{color: RED}}>●</span> + VÄNSTERPARTIET</span>
      </R>
      <Source t="REGERINGSFORMEN 6 KAP. • 349 MANDAT" />
      <Caption text="Så om Vänsterpartiet trycker på nej-knappen faller allt direkt." active={Math.floor(lin(f, 60, 50) * 10)} font={H} color={INK} muted="#B0B0AB" />
    </AbsoluteFill>
  );
};

export const ConceptA: React.FC = () => (
  <Phases bg={<AbsoluteFill style={{background: '#FFFFFF'}} />} parts={[<ColdOpen key="a" />, <Deadlock key="b" />, <Dots key="c" />]} />
);
