import type React from 'react';
export const colors = {
  canvas: '#FFFFFF',
  ink: '#14161B',
  muted: '#6B7280',
  mutedSoft: '#9AA1AF',
  veto: '#EF4444',
  parl: '#3B7BEA',
  center: '#17B26A',
  track: 'rgba(20,22,27,0.08)',
} as const;

/** TikTok / Reels safe zones (px on a 1080x1920 canvas). */
export const SAFE = {left: 64, right: 140, bottom: 240, top: 84} as const;

/**
 * Measured on a real phone (TikTok, tall screen): the video is cropped ~46 px each side, the status bar +
 * 'Find related content' search bar cover the top ~230 px, the action buttons sit at x>900 (below y~940)
 * and the username/description cover the bottom ~220 px. v2 episodes use these.
 */
export const APP = {left: 90, right: 185, top: 250, bottom: 260, scale: 0.92} as const;

/** Content area (below the top anchor, above captions + footer). */
export const CONTENT = {top: 190, bottom: 440} as const;

export const fontFamily = {
  display: '"Bricolage Grotesque", system-ui, sans-serif',
  sans: '"DM Sans", system-ui, sans-serif',
  mono: '"DM Mono", ui-monospace, monospace',
} as const;

/** Uppercase, tracked-out mono — tags, counters, sources. */
export const mono = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: fontFamily.mono,
  fontSize: size,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  ...extra,
});

/** Soft red glow used on "alert" glass pills. */
export const redGlow = '0 14px 36px rgba(239,68,68,0.18), 0 0 0 1.5px rgba(239,68,68,0.55)';
