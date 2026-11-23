import {Easing, interpolate} from 'remotion';

/** Heavy editorial easing — no springs, no bounce. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
/** Gentler in-out curve for counters so numbers don't race then crawl. */
export const EASE_COUNT = Easing.bezier(0.45, 0, 0.2, 1);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0 → 1 eased progress starting at `start`, lasting `dur` frames. */
export const prog = (frame: number, start: number, dur = 24): number =>
  interpolate(frame, [start, start + dur], [0, 1], {easing: EASE, ...clamp});

/** 0 → 1 linear progress. */
export const lin = (frame: number, start: number, dur: number): number =>
  interpolate(frame, [start, start + dur], [0, 1], clamp);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
