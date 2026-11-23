import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Reveal} from '../components/Reveal';
import {EASE_COUNT, lin, prog} from '../lib/motion';
import {colors, fontFamily, mono, redGlow} from '../lib/theme';
import type {
  BarsW,
  BigTextW,
  CardsW,
  ChecklistW,
  ChipW,
  MapW,
  RingW,
  SwedenW,
  Columns3W,
  CounterW,
  DotsW,
  FusionW,
  StaffW,
  TimelineW,
  VersusW,
  Widget,
} from '../data/types2';
import {Icon, Person, StampBox, W, toneColor} from './ui';
import {LAND_CELL, LAND_LAT0, LAND_LON0, LAND_ROWS} from '../data/landmask';
import {SE_CELL, SE_LAT0, SE_LON0, SE_ROWS} from '../data/swedenmask';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const countTo = (f: number, at: number, dur: number, to: number) =>
  Math.round(interpolate(f, [at, at + dur], [0, to], {easing: EASE_COUNT, ...clamp}));
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/* ───────── Fusion: many sources → one hub → profile/graph ───────── */
const bez = (p0: number[], p1: number[], p2: number[], p3: number[], t: number) => {
  const u = 1 - t;
  return [
    u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
    u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1],
  ];
};

export const Fusion: React.FC<{w: FusionW}> = ({w}) => {
  const f = useCurrentFrame();
  const H = w.height ?? 640;
  const n = w.inputs.length;
  const gap = 18;
  const chipW = (W - (n - 1) * gap) / n;
  const hub = {x: W / 2, y: 330};
  const R = 96;
  const outs = w.outputs;
  const m = outs.length;
  const outY = H - 56;
  const hubP = prog(f, w.hub.at, 24);
  const pulse = 1 + 0.035 * Math.sin(f / 7) * hubP;

  return (
    <div style={{position: 'relative', width: W, height: H}}>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {w.inputs.map((c, i) => {
          const x = i * (chipW + gap) + chipW / 2;
          const p0 = [x, 80];
          const p3 = [hub.x + (x - hub.x) * 0.12, hub.y - R];
          const p1 = [x, 190];
          const p2 = [hub.x + (x - hub.x) * 0.4, hub.y - R - 60];
          const len = 380;
          const lp = prog(f, w.linksAt + i * 7, 28);
          const t = (((f - (w.linksAt + i * 7 + 24)) % 36) + 36) % 36 / 36;
          const dot = bez(p0, p1, p2, p3, t);
          return (
            <g key={c.label}>
              <path
                d={`M${p0[0]},${p0[1]} C${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`}
                fill="none"
                stroke="rgba(20,22,27,0.35)"
                strokeWidth={2.5}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - lp)}
              />
              {lp > 0.98 && <circle cx={dot[0]} cy={dot[1]} r={6} fill={colors.parl} />}
            </g>
          );
        })}
        {outs.map((o, i) => {
          const x = (W * (i + 0.5)) / m;
          const lp = prog(f, w.linksAt + 26 + i * 8, 26);
          const len = 300;
          return (
            <path
              key={o.label}
              d={`M${hub.x},${hub.y + R} C${hub.x},${hub.y + R + 60} ${x},${outY - 120} ${x},${outY - 40}`}
              fill="none"
              stroke={o.dashed ? 'rgba(239,68,68,0.7)' : 'rgba(20,22,27,0.35)'}
              strokeWidth={2.5}
              strokeDasharray={o.dashed ? '9 9' : len}
              strokeDashoffset={o.dashed ? -f * 1.2 : len * (1 - lp)}
              opacity={o.dashed ? lp : 1}
            />
          );
        })}
        {m > 1 &&
          outs.slice(0, -1).map((_, i) => {
            const x1 = (W * (i + 0.5)) / m + 90;
            const x2 = (W * (i + 1.5)) / m - 90;
            const lp = prog(f, w.linksAt + 60 + i * 10, 22);
            return <line key={i} x1={x1} y1={outY} x2={x1 + (x2 - x1) * lp} y2={outY} stroke={colors.parl} strokeWidth={3} />;
          })}
      </svg>

      {w.inputs.map((c, i) => (
        <Reveal
          key={c.label}
          at={c.at}
          y={-14}
          style={{position: 'absolute', left: i * (chipW + gap), top: 0, width: chipW}}
        >
          <div className="glass" style={{...mono(22, {fontWeight: 500, color: colors.ink}), borderRadius: 18, padding: '20px 8px', textAlign: 'center', height: 80}}>
            {c.label}
          </div>
        </Reveal>
      ))}

      <div
        style={{
          position: 'absolute',
          left: hub.x - R,
          top: hub.y - R,
          width: R * 2,
          height: R * 2,
          borderRadius: R,
          background: colors.ink,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...mono(26, {fontWeight: 500, color: '#fff'}),
          opacity: hubP,
          transform: `scale(${(0.8 + 0.2 * hubP) * pulse})`,
          boxShadow: `0 0 0 ${10 + 8 * Math.sin(f / 9)}px rgba(20,22,27,0.07)`,
        }}
      >
        {w.hub.label}
      </div>

      {outs.map((o, i) => {
        const x = (W * (i + 0.5)) / m;
        const p = prog(f, o.at, 22);
        return (
          <div
            key={o.label}
            className="glass"
            style={{
              ...mono(26, {fontWeight: 500, color: o.dashed ? colors.veto : colors.ink}),
              position: 'absolute',
              left: x - 95,
              top: outY - 38,
              width: 190,
              height: 76,
              borderRadius: 99,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: p,
              transform: `translateY(${(1 - p) * 14}px)`,
              border: o.dashed ? '2px dashed rgba(239,68,68,0.7)' : undefined,
              boxShadow: o.dashed ? redGlow : undefined,
            }}
          >
            {o.label}
          </div>
        );
      })}
      {w.footnote && (
        <Reveal at={w.footnote.at} y={8} style={{position: 'absolute', left: 0, width: W, top: H - 4, textAlign: 'center', ...mono(24, {color: colors.muted})}}>
          {w.footnote.text}
        </Reveal>
      )}
    </div>
  );
};

/* ───────── Cards: fact cards with big value ───────── */
export const Cards: React.FC<{w: CardsW}> = ({w}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 26, width: W}}>
      {w.cards.map((c) => {
        const v = c.value;
        const num = v?.to !== undefined ? countTo(f, v.at, v.dur ?? 30, v.to) : undefined;
        return (
          <Reveal key={c.title} at={c.at} y={30}>
            <div className="glass" style={{padding: '30px 38px 32px', position: 'relative'}}>
              <div style={mono(24, {color: colors.muted, fontWeight: 500})}>{c.kicker}</div>
              <div style={{fontFamily: fontFamily.display, fontWeight: 600, fontSize: 84, letterSpacing: '-0.035em', lineHeight: 1.05, color: colors.ink, marginTop: 8}}>
                {c.title}
              </div>
              {v && (
                <div style={{fontFamily: fontFamily.display, fontWeight: 600, fontSize: 76, letterSpacing: '-0.03em', color: colors.parl, opacity: prog(f, v.at, 16), marginTop: 4}}>
                  {v.prefix}
                  {num !== undefined ? fmt(num) : v.text}
                  {v.suffix}
                </div>
              )}
              {c.tag && <div style={{...mono(24, {fontWeight: 500, color: colors.muted}), marginTop: 14, maxWidth: 560}}>{c.tag}</div>}
              {c.stamp && (
                <StampBox
                  text={c.stamp.text}
                  p={prog(f, c.stamp.at, 20)}
                  size={26}
                  style={{position: 'absolute', right: 28, top: 162}}
                />
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
};

/* ───────── Counter (+ optional day grid) ───────── */
export const Counter: React.FC<{w: CounterW}> = ({w}) => {
  const f = useCurrentFrame();
  const n = countTo(f, w.at, w.dur, w.to);
  const c = toneColor(w.tone);
  const g = w.grid;
  const lit = g ? countTo(f, g.at, g.dur, g.n) : 0;
  return (
    <Reveal at={w.at - 4} y={20} style={{width: W}}>
      <div className="glass" style={{padding: '30px 38px 34px'}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 24}}>
          <span style={{fontFamily: fontFamily.display, fontWeight: 600, fontSize: 190, letterSpacing: '-0.05em', lineHeight: 0.95, color: c}}>{fmt(n)}</span>
          <span style={{...mono(34, {fontWeight: 500, color: colors.ink}), paddingBottom: 18}}>{w.label}</span>
        </div>
        {g && (
          <div style={{marginTop: 26}}>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
              {Array.from({length: g.n}, (_, i) => (
                <span
                  key={i}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: i < lit ? colors.ink : colors.track,
                    outline: i === lit - 1 && lit < g.n ? `3px solid ${colors.veto}` : undefined,
                  }}
                />
              ))}
            </div>
            <div style={{...mono(26, {color: colors.muted, fontWeight: 500}), marginTop: 14}}>
              DAG {Math.max(lit, 0)} / {g.n} · {g.label}
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
};

/* ───────── Checklist ───────── */
export const Checklist: React.FC<{w: ChecklistW}> = ({w}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 18, width: W}}>
      {w.rows.map((r) => (
        <Reveal key={r.text} at={r.at} y={14}>
          <div className="glass" style={{display: 'flex', alignItems: 'center', gap: 22, padding: '22px 30px', position: 'relative', minHeight: 112}}>
            <Icon state={r.state} size={62} />
            <div style={{flex: 1}}>
              <div style={{fontFamily: fontFamily.sans, fontWeight: 500, fontSize: 42, letterSpacing: '-0.01em', color: colors.ink, lineHeight: 1.15}}>{r.text}</div>
              {r.sub && <div style={{...mono(22, {color: colors.muted}), marginTop: 6}}>{r.sub}</div>}
            </div>
            {r.stamp && <StampBox text={r.stamp.text} p={prog(f, r.stamp.at, 20)} size={26} />}
          </div>
        </Reveal>
      ))}
    </div>
  );
};

/* ───────── Versus (two columns) ───────── */
export const Versus: React.FC<{w: VersusW}> = ({w}) => {
  const f = useCurrentFrame();
  const col = (c: VersusW['left']) => (
    <Reveal at={c.at} y={26} style={{flex: 1}}>
      <div className="glass" style={{padding: '26px 26px 20px', height: '100%'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
          <span style={{width: 16, height: 16, borderRadius: 16, background: toneColor(c.tone)}} />
          <span style={mono(26, {fontWeight: 500, color: toneColor(c.tone)})}>{c.title}</span>
        </div>
        {c.rows.map((r) => (
          <Reveal key={r.text} at={r.at} y={10} style={{fontFamily: fontFamily.sans, fontWeight: 500, fontSize: 38, lineHeight: 1.2, color: colors.ink, padding: '12px 0', borderTop: '1px solid rgba(20,22,27,0.08)'}}>
            {r.text}
          </Reveal>
        ))}
      </div>
    </Reveal>
  );
  return (
    <div style={{width: W, position: 'relative'}}>
      <div style={{display: 'flex', gap: 22, alignItems: 'stretch'}}>
        {col(w.left)}
        {col(w.right)}
      </div>
      {w.stamp && (
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 26}}>
          <StampBox text={w.stamp.text} p={prog(f, w.stamp.at, 20)} size={32} />
        </div>
      )}
    </div>
  );
};

/* ───────── Timeline ───────── */
export const Timeline: React.FC<{w: TimelineW}> = ({w}) => {
  const f = useCurrentFrame();
  const n = w.nodes.length;
  const last = w.nodes[n - 1].at;
  const line = prog(f, w.nodes[0].at, Math.max(20, last - w.nodes[0].at + 10));
  return (
    <div style={{width: W}}>
      <div className="glass" style={{padding: '34px 30px 30px', position: 'relative'}}>
        <div style={{position: 'relative', height: 14, marginBottom: 20}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 4, height: 6, borderRadius: 6, background: colors.track}} />
          <div style={{position: 'absolute', left: 0, top: 4, height: 6, borderRadius: 6, width: `${line * 100}%`, background: colors.ink}} />
          {w.nodes.map((nd, i) => {
            const x = n === 1 ? 0 : (i / (n - 1)) * 100;
            const p = prog(f, nd.at, 16);
            return (
              <span
                key={nd.label}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: -6,
                  width: 26,
                  height: 26,
                  marginLeft: i === n - 1 ? -26 : i === 0 ? 0 : -13,
                  borderRadius: 26,
                  background: toneColor(nd.tone ?? 'ink'),
                  boxShadow: `0 0 0 ${6 * p}px ${toneColor(nd.tone ?? 'ink')}22`,
                  transform: `scale(${p})`,
                }}
              />
            );
          })}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 16}}>
          {w.nodes.map((nd, i) => (
            <Reveal key={nd.label} at={nd.at + 4} y={10} style={{flex: 1, textAlign: i === 0 ? 'left' : i === n - 1 ? 'right' : 'center'}}>
              <div style={mono(26, {fontWeight: 500, color: toneColor(nd.tone ?? 'ink')})}>{nd.label}</div>
              {nd.sub && <div style={{fontFamily: fontFamily.sans, fontSize: 30, color: colors.muted, marginTop: 6, lineHeight: 1.2}}>{nd.sub}</div>}
            </Reveal>
          ))}
        </div>
        {w.stamp && (
          <StampBox text={w.stamp.text} p={prog(f, w.stamp.at, 20)} size={26} style={{position: 'absolute', right: 26, bottom: -22}} />
        )}
      </div>
      {w.chips && (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 30}}>
          {w.chips.map((c) => (
            <Reveal key={c.text} at={c.at} y={10}>
              <span style={{...mono(24, {fontWeight: 500, color: toneColor(c.tone ?? 'ink')}), display: 'inline-block', padding: '12px 22px', borderRadius: 99, background: `${toneColor(c.tone ?? 'ink')}12`}}>
                {c.text}
              </span>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
};

/* ───────── Staff: people + working-week ───────── */
export const Staff: React.FC<{w: StaffW}> = ({w}) => {
  const f = useCurrentFrame();
  const lit = countTo(f, w.people.at, w.people.dur, w.people.n);
  const days = ['MÅN', 'TIS', 'ONS', 'TOR', 'FRE'];
  return (
    <Reveal at={w.at} y={24} style={{width: W}}>
      <div className="glass" style={{padding: '28px 34px 30px'}}>
        <div style={mono(26, {fontWeight: 500, color: colors.muted})}>{w.title}</div>
        <div style={{display: 'flex', gap: 14, marginTop: 20}}>
          {Array.from({length: w.people.n}, (_, i) => (
            <Person key={i} size={64} color={i < lit ? colors.ink : 'rgba(20,22,27,0.14)'} />
          ))}
        </div>
        <div style={{...mono(30, {fontWeight: 500, color: colors.ink}), marginTop: 12}}>≥ {w.people.n} {w.people.label}</div>
        <div style={{display: 'flex', gap: 12, marginTop: 26}}>
          {days.map((d, i) => {
            const on = i < w.week.filled;
            const p = prog(f, w.week.at + i * 6, 14);
            return (
              <div
                key={d}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '16px 0',
                  borderRadius: 14,
                  ...mono(24, {fontWeight: 500, color: on ? '#fff' : colors.muted}),
                  background: on ? colors.ink : colors.track,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 10}px)`,
                }}
              >
                {d}
              </div>
            );
          })}
        </div>
        <div style={{...mono(26, {fontWeight: 500, color: colors.ink}), marginTop: 14, opacity: prog(f, w.week.at + 18, 14)}}>{w.week.label}</div>
      </div>
    </Reveal>
  );
};

/* ───────── Bars: dot rows that grow ───────── */
export const Bars: React.FC<{w: BarsW}> = ({w}) => {
  const f = useCurrentFrame();
  return (
    <div className="glass" style={{width: W, padding: '26px 34px 28px'}}>
      <div style={{...mono(24, {fontWeight: 500, color: colors.muted}), marginBottom: 18}}>{w.title}</div>
      {w.rows.map((r) => {
        const lit = countTo(f, r.at, r.dur, r.n);
        const dots = Array.from({length: r.n});
        return (
          <Reveal key={r.label} at={r.at - 6} y={10} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14}}>
            <span style={{...mono(28, {fontWeight: 500, color: colors.ink}), width: 92}}>{r.label}</span>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, flex: 1}}>
              {dots.map((_, i) => (
                <span key={i} style={{width: 20, height: 20, borderRadius: 20, background: i < lit ? toneColor(r.tone ?? 'ink') : colors.track}} />
              ))}
            </div>
            <span style={mono(32, {fontWeight: 500, color: toneColor(r.tone ?? 'ink')})}>{lit}</span>
          </Reveal>
        );
      })}
    </div>
  );
};

/* ───────── Columns3 ───────── */
export const Columns3: React.FC<{w: Columns3W}> = ({w}) => (
  <div style={{display: 'flex', gap: 16, width: W}}>
    {w.cols.map((c) => (
      <Reveal key={c.title} at={c.at} y={26} style={{flex: 1}}>
        <div className="glass" style={{padding: '24px 20px 26px', height: 330, borderRadius: 24}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <span style={{width: 14, height: 14, borderRadius: 14, background: toneColor(c.tone)}} />
            <span style={mono(22, {fontWeight: 500, color: toneColor(c.tone)})}>{c.title}</span>
          </div>
          <div style={{fontFamily: fontFamily.sans, fontWeight: 500, fontSize: 34, lineHeight: 1.2, color: colors.ink, marginTop: 20}}>{c.text}</div>
        </div>
      </Reveal>
    ))}
  </div>
);

/* ───────── BigText ───────── */
export const BigText: React.FC<{w: BigTextW}> = ({w}) => (
  <Reveal at={w.at} y={20} style={{width: W, textAlign: 'center'}}>
    <div style={{fontFamily: fontFamily.display, fontWeight: 600, fontSize: w.size ?? 110, letterSpacing: '-0.04em', color: colors.ink, lineHeight: 1}}>{w.text}</div>
    {w.sub && <div style={{...mono(28, {color: colors.muted, fontWeight: 500}), marginTop: 12}}>{w.sub}</div>}
  </Reveal>
);

/* ───────── Dots: seat grid (parliament / senate) with threshold ring ───────── */
export const Dots: React.FC<{w: DotsW}> = ({w}) => {
  const f = useCurrentFrame();
  const lits = w.groups.map((g) => countTo(f, g.at, g.dur, g.n));
  const offs: number[] = [];
  w.groups.reduce((a, g) => (offs.push(a), a + g.n), 0);
  const dotColor = (i: number) => {
    for (let g = 0; g < w.groups.length; g++) {
      if (i >= offs[g] && i < offs[g] + w.groups[g].n) return i - offs[g] < lits[g] ? toneColor(w.groups[g].tone) : colors.track;
    }
    return colors.track;
  };
  const m = w.mark;
  const mp = m ? prog(f, m.at, 16) : 0;
  return (
    <Reveal at={w.at - 4} y={20} style={{width: W}}>
      <div className="glass" style={{padding: '26px 34px 28px'}}>
        <div style={{...mono(24, {fontWeight: 500, color: colors.muted}), marginBottom: 18}}>{w.title}</div>
        <div style={{display: 'grid', gridTemplateColumns: `repeat(${w.cols}, ${w.size}px)`, gap: w.gap, justifyContent: 'center'}}>
          {Array.from({length: w.total}, (_, i) => (
            <span
              key={i}
              style={{
                width: w.size,
                height: w.size,
                borderRadius: w.size,
                background: dotColor(i),
                outline: m && i === m.index ? `${4 * mp}px solid ${colors.ink}` : undefined,
                outlineOffset: 2,
                transform: m && i === m.index ? `scale(${1 + 0.5 * mp})` : undefined,
                position: 'relative',
                zIndex: m && i === m.index ? 2 : 0,
              }}
            />
          ))}
        </div>
        {m && (
          <div style={{...mono(26, {fontWeight: 500, color: colors.ink}), marginTop: 18, opacity: mp}}>
            ◎ {m.label}
          </div>
        )}
        <div style={{display: 'flex', gap: 14, marginTop: 20}}>
          {w.groups.map((g, i) => (
            <div key={g.label} style={{flex: 1, minWidth: 0}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <span style={{width: 16, height: 16, borderRadius: 16, background: toneColor(g.tone)}} />
                <span style={{fontFamily: fontFamily.display, fontWeight: 600, fontSize: 60, letterSpacing: '-0.04em', lineHeight: 1, color: toneColor(g.tone)}}>{lits[i]}</span>
              </div>
              <div style={{...mono(19, {color: colors.muted, fontWeight: 500}), marginTop: 6, lineHeight: 1.2}}>{g.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
};

/* ───────── GeoMap: dot-matrix land map with markers and animated routes ───────── */
const isLand = (lon: number, lat: number) => {
  const c = Math.floor((lon - LAND_LON0) / LAND_CELL);
  const r = Math.floor((LAND_LAT0 - lat) / LAND_CELL);
  return LAND_ROWS[r]?.[c] === '1';
};
export const GeoMap: React.FC<{w: MapW}> = ({w}) => {
  const f = useCurrentFrame();
  const {lon0, lon1, lat0, lat1} = w.view;
  const WIDTH = W;
  const H = w.height ?? Math.round((WIDTH * (lat1 - lat0)) / ((lon1 - lon0) * (w.squash ?? 1)));
  const cols = w.dots ?? 78;
  const px = WIDTH / cols;
  const rowsN = Math.round(H / px);
  const proj = (lon: number, lat: number): [number, number] => [((lon - lon0) / (lon1 - lon0)) * WIDTH, ((lat1 - lat) / (lat1 - lat0)) * H];
  const dotsPath = useMemo(() => {
    let d = '';
    for (let j = 0; j < rowsN; j++) {
      const lat = lat1 - ((j + 0.5) / rowsN) * (lat1 - lat0);
      for (let i = 0; i < cols; i++) {
        const lon = lon0 + ((i + 0.5) / cols) * (lon1 - lon0);
        if (isLand(lon, lat)) d += `M${(i + 0.5) * px} ${(j + 0.5) * (H / rowsN)}h0`;
      }
    }
    return d;
  }, [lon0, lon1, lat0, lat1, cols, rowsN, px, H]);
  const mk = w.markers.map((m) => ({...m, p: proj(m.lon, m.lat)}));
  const appear = prog(f, w.at - 4, 18);
  return (
    <Reveal at={w.at - 4} y={20} style={{width: W}}>
      <div className="glass" style={{position: 'relative', width: W, height: H + (w.title ? 56 : 0), overflow: 'hidden'}}>
        {w.title && <div style={{...mono(22, {fontWeight: 500, color: colors.muted}), padding: '20px 30px 0'}}>{w.title}</div>}
        <div style={{position: 'absolute', left: 0, top: w.title ? 56 : 0, width: WIDTH, height: H}}>
          <svg width={WIDTH} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <path d={dotsPath} stroke={colors.ink} strokeOpacity={0.2 * appear} strokeWidth={px * 0.5} strokeLinecap="round" fill="none" />
            {(w.routes ?? []).map((r, i) => {
              const a = mk[r.from].p, b = mk[r.to].p;
              const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
              const dx = b[0] - a[0], dy = b[1] - a[1];
              const dist = Math.hypot(dx, dy);
              const k = (r.curve ?? 0.22) * dist;
              const cx = mx - (dy / dist) * k, cy = my + (dx / dist) * k - Math.abs(k) * 0.2;
              const d = `M${a[0]} ${a[1]} Q${cx} ${cy} ${b[0]} ${b[1]}`;
              const p = prog(f, r.at, r.dur ?? 34);
              const col = toneColor(r.tone ?? 'blue');
              const id = `m${w.at}_${i}_${lon0}`;
              const t = p;
              const px_ = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * cx + t * t * b[0];
              const py_ = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * cy + t * t * b[1];
              const lx = 0.25 * a[0] + 0.5 * cx + 0.25 * b[0], ly = 0.25 * a[1] + 0.5 * cy + 0.25 * b[1];
              return (
                <g key={i}>
                  {r.dashed ? (
                    <>
                      <mask id={id}>
                        <path d={d} stroke="#fff" strokeWidth={10} fill="none" pathLength={1} strokeDasharray={`${p} 1`} />
                      </mask>
                      <path d={d} stroke={col} strokeWidth={6} fill="none" strokeDasharray="16 12" strokeLinecap="round" mask={`url(#${id})`} />
                    </>
                  ) : (
                    <path d={d} stroke={col} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
                  )}
                  {p > 0 && p < 1 && <circle cx={px_} cy={py_} r={9} fill={col} />}
                  {r.label && p > 0.6 && (
                    <foreignObject x={lx - 150} y={ly - 40} width={300} height={32} style={{overflow: 'visible'}}>
                      <div style={{textAlign: 'center', opacity: prog(f, r.at + 16, 14)}}>
                        <span style={{...mono(20, {fontWeight: 500, color: col}), background: 'rgba(255,255,255,0.92)', padding: '3px 10px', borderRadius: 99}}>{r.label}</span>
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
            {mk.map((m) => {
              const mp = prog(f, m.at, 14);
              const col = toneColor(m.tone ?? 'ink');
              const pulse = 0.5 + 0.5 * Math.sin(f / 8);
              return (
                <g key={m.label} opacity={mp}>
                  <circle cx={m.p[0]} cy={m.p[1]} r={16 + 8 * pulse} fill={col} opacity={0.14} />
                  <circle cx={m.p[0]} cy={m.p[1]} r={11} fill={col} stroke="#fff" strokeWidth={3} />
                </g>
              );
            })}
          </svg>
          {mk.map((m) => {
            const mp = prog(f, m.at + 3, 14);
            const side = m.side ?? 'r';
            const style: React.CSSProperties =
              side === 'r' ? {left: m.p[0] + 20, top: m.p[1] - 15} : side === 'l' ? {right: WIDTH - m.p[0] + 20, top: m.p[1] - 15} : side === 't' ? {left: m.p[0], top: m.p[1] - 52, transform: 'translateX(-50%)'} : {left: m.p[0], top: m.p[1] + 18, transform: 'translateX(-50%)'};
            return (
              <div key={m.label} style={{position: 'absolute', opacity: mp, whiteSpace: 'nowrap', ...style}}>
                <span style={{...mono(22, {fontWeight: 500, color: colors.ink}), background: 'rgba(255,255,255,0.92)', padding: '4px 12px', borderRadius: 99, boxShadow: '0 4px 14px rgba(20,22,27,0.08)'}}>{m.label}</span>
              </div>
            );
          })}
          {w.stamp && (
            <div style={{position: 'absolute', right: 24, bottom: 20}}>
              <StampBox text={w.stamp.text} p={prog(f, w.stamp.at, 20)} size={26} tone={w.stamp.tone ?? 'red'} />
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
};

/* ───────── Ring: donut percentage ───────── */
export const Ring: React.FC<{w: RingW}> = ({w}) => {
  const f = useCurrentFrame();
  const n = countTo(f, w.at, w.dur, w.value);
  const frac = Math.min(1, Math.max(0, interpolate(f, [w.at, w.at + w.dur], [0, w.value / 100], {easing: EASE_COUNT, ...clamp})));
  const R = 150, C = 2 * Math.PI * R;
  const col = toneColor(w.tone ?? 'blue');
  return (
    <Reveal at={w.at - 4} y={20} style={{width: W}}>
      <div className="glass" style={{padding: '34px 40px', display: 'flex', alignItems: 'center', gap: 36, position: 'relative'}}>
        <svg width={360} height={360} viewBox="0 0 360 360" style={{flex: 'none'}}>
          <circle cx={180} cy={180} r={R} fill="none" stroke={colors.track} strokeWidth={46} />
          <circle cx={180} cy={180} r={R} fill="none" stroke={col} strokeWidth={46} strokeLinecap="round" strokeDasharray={`${C * frac} ${C}`} transform="rotate(-90 180 180)" />
          <text x={180} y={170} textAnchor="middle" style={{fontFamily: fontFamily.display, fontWeight: 600, fontSize: 90, letterSpacing: '-0.04em'}} fill={colors.ink}>
            {n}
            {w.suffix ?? ' %'}
          </text>
          <text x={180} y={225} textAnchor="middle" style={mono(22, {fontWeight: 500, color: colors.muted})} fill={colors.muted}>
            {w.sub ?? ''}
          </text>
        </svg>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontFamily: fontFamily.display, fontWeight: 600, fontSize: 64, letterSpacing: '-0.03em', lineHeight: 1.05, color: colors.ink}}>{w.label}</div>
        </div>
        {w.stamp && <StampBox text={w.stamp.text} p={prog(f, w.stamp.at, 20)} size={28} tone={w.stamp.tone ?? 'red'} style={{position: 'absolute', right: 28, bottom: -22}} />}
      </div>
    </Reveal>
  );
};

/* ───────── Chip: an object — stylised processor with tags ───────── */
export const Chip: React.FC<{w: ChipW}> = ({w}) => {
  const f = useCurrentFrame();
  const pins = Array.from({length: 7});
  return (
    <Reveal at={w.at - 4} y={24} style={{width: W}}>
      <div className="glass" style={{padding: '34px 40px', display: 'flex', alignItems: 'center', gap: 34}}>
        <svg width={300} height={300} viewBox="0 0 300 300" style={{flex: 'none'}}>
          {pins.map((_, i) => {
            const o = 48 + i * 34;
            return (
              <g key={i} stroke={colors.ink} strokeWidth={7} strokeLinecap="round" opacity={0.85}>
                <line x1={o} y1={14} x2={o} y2={52} />
                <line x1={o} y1={248} x2={o} y2={286} />
                <line x1={14} y1={o} x2={52} y2={o} />
                <line x1={248} y1={o} x2={286} y2={o} />
              </g>
            );
          })}
          <rect x={50} y={50} width={200} height={200} rx={28} fill="#fff" stroke={colors.ink} strokeWidth={8} />
          <rect x={80} y={80} width={140} height={140} rx={14} fill={colors.track} />
          <text x={150} y={158} textAnchor="middle" style={{fontFamily: fontFamily.display, fontWeight: 700, fontSize: w.label.length > 4 ? 34 : 56, letterSpacing: '-0.03em'}} fill={colors.ink}>
            {w.label}
          </text>
          <text x={150} y={190} textAnchor="middle" style={mono(16, {fontWeight: 500})} fill={colors.muted}>
            {w.sub ?? ''}
          </text>
          <circle cx={92} cy={92} r={5 + 2 * Math.sin(f / 6)} fill={colors.center} />
        </svg>
        <div style={{display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start'}}>
          {(w.tags ?? []).map((t) => (
            <Reveal key={t.text} at={t.at} y={10}>
              <span style={{...mono(24, {fontWeight: 500, color: toneColor(t.tone ?? 'ink')}), display: 'inline-block', padding: '12px 22px', borderRadius: 99, background: `${toneColor(t.tone ?? 'ink')}12`}}>{t.text}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </Reveal>
  );
};

/* ───────── SwedenMap: dot map of Sweden with (schematic) electricity price zones ───────── */
const seLand = (lon: number, lat: number) => SE_ROWS[Math.floor((SE_LAT0 - lat) / SE_CELL)]?.[Math.floor((lon - SE_LON0) / SE_CELL)] === '1';
const zoneOf = (lat: number) => (lat > 65.3 ? 0 : lat > 61.0 ? 1 : lat > 57.2 ? 2 : 3);
const CITIES = [
  {name: 'LULEÅ', lon: 22.15, lat: 65.58, z: 0, side: 'l'},
  {name: 'SUNDSVALL', lon: 17.31, lat: 62.39, z: 1, side: 'r'},
  {name: 'STOCKHOLM', lon: 18.07, lat: 59.33, z: 2, side: 'r'},
  {name: 'MALMÖ', lon: 13.0, lat: 55.6, z: 3, side: 'r'},
];
export const SwedenMap: React.FC<{w: SwedenW}> = ({w}) => {
  const f = useCurrentFrame();
  const MW = 372, lon0 = 10.9, lon1 = 24.3, lat0 = 55.2, lat1 = 69.2, squash = 0.47;
  const H = Math.round((MW * (lat1 - lat0)) / ((lon1 - lon0) * squash));
  const cols = 36, px = MW / cols, rowsN = Math.round(H / px);
  const proj = (lon: number, lat: number): [number, number] => [((lon - lon0) / (lon1 - lon0)) * MW, ((lat1 - lat) / (lat1 - lat0)) * H];
  const paths = useMemo(() => {
    const ps = ['', '', '', ''];
    for (let j = 0; j < rowsN; j++) {
      const lat = lat1 - ((j + 0.5) / rowsN) * (lat1 - lat0);
      for (let i = 0; i < cols; i++) {
        const lon = lon0 + ((i + 0.5) / cols) * (lon1 - lon0);
        if (seLand(lon, lat)) ps[zoneOf(lat)] += `M${(i + 0.5) * px} ${(j + 0.5) * (H / rowsN)}h0`;
      }
    }
    return ps;
  }, [rowsN, px, H]);
  const zoneAt = (z: number) => {
    const items = w.side.filter((s) => s.zones?.includes(z));
    return items.length ? Math.min(...items.map((s) => s.at)) : null;
  };
  const zoneTone = (z: number) => {
    const it = w.side.find((s) => s.zones?.includes(z));
    return it ? toneColor(it.tone) : colors.ink;
  };
  const appear = prog(f, w.at - 4, 18);
  let flow = null as React.ReactNode;
  if (w.flow) {
    const a = proj(17.6, 67.2), b = proj(15.2, 57.2);
    const cx = a[0] + 70, cy = (a[1] + b[1]) / 2;
    const d = `M${a[0]} ${a[1]} Q${cx} ${cy} ${b[0]} ${b[1]}`;
    const p = prog(f, w.flow.at, w.flow.dur ?? 50);
    const t = p;
    const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * cx + t * t * b[0];
    const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * cy + t * t * b[1];
    const id = `sf${w.at}`;
    flow = (
      <>
        <mask id={id}>
          <path d={d} stroke="#fff" strokeWidth={14} fill="none" pathLength={1} strokeDasharray={`${p} 1`} />
        </mask>
        <path d={d} stroke={colors.parl} strokeWidth={8} fill="none" strokeDasharray="18 12" strokeLinecap="round" mask={`url(#${id})`} />
        {p > 0 && p < 1 && <circle cx={x} cy={y} r={11} fill={colors.parl} />}
        {p > 0.95 && <path d={`M${b[0] - 16} ${b[1] - 20} L${b[0]} ${b[1] + 4} L${b[0] + 16} ${b[1] - 20}`} stroke={colors.parl} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      </>
    );
  }
  return (
    <Reveal at={w.at - 4} y={20} style={{width: W}}>
      <div className="glass" style={{display: 'flex', gap: 22, padding: 24, width: W, alignItems: 'stretch'}}>
        <div style={{position: 'relative', width: MW, height: H, flex: 'none'}}>
          <svg width={MW} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            {paths.map((d, z) => (
              <g key={z}>
                <path d={d} stroke={colors.ink} strokeOpacity={0.16 * appear} strokeWidth={px * 0.62} strokeLinecap="round" fill="none" />
                {zoneAt(z) !== null && <path d={d} stroke={zoneTone(z)} strokeOpacity={prog(f, zoneAt(z) as number, 18)} strokeWidth={px * 0.66} strokeLinecap="round" fill="none" />}
              </g>
            ))}
            {flow}
            {CITIES.map((c) => {
              const za = zoneAt(c.z);
              if (za === null) return null;
              const [x, y] = proj(c.lon, c.lat);
              const o = prog(f, za + 6, 14);
              return (
                <g key={c.name} opacity={o}>
                  <circle cx={x} cy={y} r={7} fill={colors.ink} stroke="#fff" strokeWidth={3} />
                </g>
              );
            })}
          </svg>
          {CITIES.map((c) => {
            const za = zoneAt(c.z);
            if (za === null) return null;
            const [x, y] = proj(c.lon, c.lat);
            const o = prog(f, za + 8, 14);
            const style: React.CSSProperties = c.side === 'l' ? {right: MW - x + 14, top: y - 14} : {left: x + 14, top: y - 14};
            return (
              <div key={c.name} style={{position: 'absolute', opacity: o, whiteSpace: 'nowrap', ...style}}>
                <span style={mono(19, {fontWeight: 500, color: colors.ink})}>{c.name}</span>
              </div>
            );
          })}
          {w.flow?.label && (
            <div style={{position: 'absolute', left: 6, top: H * 0.36, opacity: prog(f, w.flow.at + 18, 14)}}>
              <span style={{...mono(20, {fontWeight: 500, color: colors.parl}), background: 'rgba(255,255,255,0.92)', padding: '4px 12px', borderRadius: 99}}>{w.flow.label}</span>
            </div>
          )}
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: 14, minWidth: 0}}>
          {w.side.map((s) => (
            <Reveal key={s.big} at={s.at} y={14}>
              <div style={{background: `${toneColor(s.tone)}10`, borderRadius: 22, padding: '18px 22px', borderLeft: `8px solid ${toneColor(s.tone)}`}}>
                <div style={{fontFamily: fontFamily.display, fontWeight: 600, fontSize: 60, letterSpacing: '-0.035em', lineHeight: 1, color: toneColor(s.tone)}}>{s.big}</div>
                <div style={{...mono(22, {fontWeight: 500, color: colors.ink}), marginTop: 8, lineHeight: 1.2}}>{s.text}</div>
                {s.sub && <div style={{fontFamily: fontFamily.sans, fontSize: 26, color: colors.muted, marginTop: 6, lineHeight: 1.2}}>{s.sub}</div>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Reveal>
  );
};

export const renderWidget = (w: Widget, key: number): React.ReactNode => {
  switch (w.t) {
    case 'sweden': return <SwedenMap key={key} w={w} />;
    case 'map': return <GeoMap key={key} w={w} />;
    case 'ring': return <Ring key={key} w={w} />;
    case 'chip': return <Chip key={key} w={w} />;
    case 'dots': return <Dots key={key} w={w} />;
    case 'fusion': return <Fusion key={key} w={w} />;
    case 'cards': return <Cards key={key} w={w} />;
    case 'counter': return <Counter key={key} w={w} />;
    case 'checklist': return <Checklist key={key} w={w} />;
    case 'versus': return <Versus key={key} w={w} />;
    case 'timeline': return <Timeline key={key} w={w} />;
    case 'staff': return <Staff key={key} w={w} />;
    case 'bars': return <Bars key={key} w={w} />;
    case 'columns3': return <Columns3 key={key} w={w} />;
    case 'bigtext': return <BigText key={key} w={w} />;
  }
};
