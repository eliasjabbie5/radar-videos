import React from 'react';
import {useCurrentFrame} from 'remotion';
import {lerp, prog} from '../../lib/motion';
import {colors, mono, SAFE} from '../../lib/theme';
import type {Episode} from '../../data/types';

const STEPS = [1, 2, 3, 4];
const T = 18;
const stepTarget = (n: number, active: number) => (n < active ? 0.35 : n === active ? 1 : 0.15);

/** Top anchor + micro-source footer. Visible for scenes that define a `step`. */
export const Chrome: React.FC<{episode: Episode}> = ({episode}) => {
  const frame = useCurrentFrame();
  const chromeScenes = episode.scenes.filter((s) => s.step !== null);
  if (chromeScenes.length === 0) return null;

  const master = prog(frame, chromeScenes[0].from, T);
  let k = 0;
  chromeScenes.forEach((s, i) => {
    if (frame >= s.from) k = i;
  });
  const cur = chromeScenes[k];
  const prev = chromeScenes[Math.max(0, k - 1)];
  const blend = k === 0 ? 1 : prog(frame, cur.from, T);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: SAFE.top,
          left: SAFE.left,
          right: SAFE.right,
          opacity: master,
          transform: `translateY(${(1 - master) * -10}px)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span className="glass" style={{...mono(24, {fontWeight: 500, color: colors.ink}), borderRadius: 99, padding: '10px 24px'}}>
          {episode.meta.tag}
        </span>
        <span style={{display: 'flex', gap: 10, alignItems: 'center'}}>
          {STEPS.map((n) => {
            const o = lerp(stepTarget(n, prev.step ?? 1), stepTarget(n, cur.step ?? 1), blend);
            const w = lerp(n === (prev.step ?? 1) ? 58 : 14, n === (cur.step ?? 1) ? 58 : 14, blend);
            return <span key={n} style={{width: w, height: 14, borderRadius: 14, background: colors.ink, opacity: o}} />;
          })}
        </span>
      </div>

      <div style={{position: 'absolute', bottom: SAFE.bottom + 10, left: SAFE.left, right: SAFE.right, height: 30}}>
        {episode.scenes.map((s) => {
          if (!s.source) return null;
          const o = prog(frame, s.from, T) * (1 - prog(frame, s.from + s.duration, T));
          return (
            <div key={s.key} style={{position: 'absolute', left: 0, whiteSpace: 'nowrap', opacity: o, ...mono(23, {color: colors.muted})}}>
              {s.source}
            </div>
          );
        })}
      </div>
    </>
  );
};
