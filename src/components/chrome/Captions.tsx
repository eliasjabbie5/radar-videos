import React, {useMemo} from 'react';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {APP, colors, fontFamily} from '../../lib/theme';

const HOLD_MS = 450;

/**
 * Quiet, editorial captions in the lower third. Phrase-level (never one huge
 * word), no bounce — the active word simply brightens.
 */
export const Captions: React.FC<{captions: Caption[]}> = ({captions}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;

  const {pages} = useMemo(
    () => createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 1700}),
    [captions],
  );

  let page = null as (typeof pages)[number] | null;
  for (const p of pages) if (p.startMs <= ms) page = p;
  if (!page) return null;
  const next = pages[pages.indexOf(page) + 1];
  const end = Math.min(page.startMs + page.durationMs + HOLD_MS, next ? next.startMs : Infinity);
  if (ms > end) return null;

  const fadeMs = 160;
  const opacity = Math.min(1, (ms - page.startMs) / fadeMs + 0.001, (end - ms) / fadeMs + 0.001);

  return (
    <div
      style={{
        position: 'absolute',
        left: APP.left,
        right: APP.right,
        bottom: APP.bottom + 70,
        textAlign: 'center',
        fontFamily: fontFamily.sans,
        fontWeight: 500,
        fontSize: 46,
        lineHeight: 1.28,
        letterSpacing: '-0.01em',
        opacity: Math.max(0, opacity),
              }}
    >
      {page.tokens.map((t, i) => {
        const active = ms >= t.fromMs && ms < t.toMs;
        const spoken = ms >= t.toMs;
        return (
          <span
            key={i}
            style={{color: active ? colors.ink : spoken ? 'rgba(20,22,27,0.82)' : colors.mutedSoft}}
          >
            {t.text}
          </span>
        );
      })}
    </div>
  );
};
