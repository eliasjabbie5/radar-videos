import React from 'react';
import {useCurrentFrame} from 'remotion';
import {lerp, prog} from '../lib/motion';
import {APP, colors, fontFamily, mono} from '../lib/theme';
import type {Episode2} from '../data/types2';

const T = 18;

/** Top anchor: series tag + the "Mystery Chain" of four boxes that unlock as the voice reveals each step. */
export const ChainChrome: React.FC<{episode: Episode2}> = ({episode}) => {
  const frame = useCurrentFrame();
  const chromeScenes = episode.scenes.filter((s) => s.chrome);
  if (!chromeScenes.length) return null;
  const master = prog(frame, chromeScenes[0].from, T);
  const labels = episode.chain.labels;
  const CW = 1080 - APP.left - APP.right;
  const BW = (CW - 3 * 30) / 4;

  return (
    <>
      <div style={{position: 'absolute', top: APP.top, left: APP.left, right: APP.right, opacity: master, transform: `translateY(${(1 - master) * -10}px)`}}>
        <span className="glass" style={{...mono(24, {fontWeight: 500, color: colors.ink}), borderRadius: 99, padding: '10px 24px', display: 'inline-block'}}>
          {episode.meta.tag}
        </span>
        <div style={{display: 'flex', alignItems: 'center', gap: 0, marginTop: 20}}>
          {labels.map((label, i) => {
            const u = episode.chain.unlockAt[i];
            const lockedFinal = u === null;
            const p = u === null ? 0 : prog(frame, u, 16);
            const prevDone = i === 0 || (episode.chain.unlockAt[i - 1] !== null && frame >= (episode.chain.unlockAt[i - 1] as number));
            const pulse = lockedFinal && prevDone ? 0.5 + 0.5 * Math.sin(frame / 8) : 0;
            const ring = u !== null && frame >= u && frame < u + 24 ? (1 - (frame - u) / 24) : 0;
            return (
              <React.Fragment key={label}>
                <div
                  className="glass"
                  style={{
                    width: BW,
                    height: 86,
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '0 6px',
                    border: lockedFinal && prevDone ? `2px dashed rgba(239,68,68,${0.35 + 0.45 * pulse})` : undefined,
                    boxShadow: ring > 0 ? `0 0 0 ${ring * 12}px rgba(23,178,106,${0.18 * ring}), 0 18px 48px rgba(30,45,90,0.12)` : undefined,
                    transform: `scaleX(${p > 0 && p < 1 ? lerp(0.6, 1, p) : 1})`,
                  }}
                >
                  {p > 0.4 ? (
                    <span style={{...mono(label.length > 11 ? 19 : 22, {fontWeight: 500, color: colors.ink}), textAlign: 'center', lineHeight: 1.15, opacity: Math.min(1, (p - 0.4) / 0.6)}}>
                      <span style={{color: colors.center}}>● </span>
                      {label}
                    </span>
                  ) : (
                    <span style={{...mono(30, {fontWeight: 500, color: lockedFinal && prevDone ? colors.veto : colors.muted})}}>🔒&nbsp;?</span>
                  )}
                </div>
                {i < 3 && <span style={{width: 30, textAlign: 'center', fontFamily: fontFamily.mono, fontSize: 24, color: colors.muted}}>→</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={{position: 'absolute', bottom: APP.bottom + 10, left: APP.left, right: APP.right, height: 30}}>
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
