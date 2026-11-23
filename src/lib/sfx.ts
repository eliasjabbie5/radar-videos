import type {SfxName} from '../data/types';

/**
 * Default level (linear gain) and length of each sound in public/sfx.
 * Levels are tuned so cues sit roughly 10–20 dB under the voice, like the reference videos.
 */
/**
 * Global trim applied to every sound effect on top of the per-sound gains below.
 * Videos rendered up to and including USA 2026 del 1-3 used 1.0 and were judged a little loud;
 * everything new uses 0.65 (about -3.7 dB). Lower it further if the voice still feels crowded.
 */
export const SFX_MASTER = 0.65;

export const SFX_LIBRARY: Record<SfxName, {gain: number; seconds: number}> = {
  whoosh: {gain: 0.2, seconds: 0.7},
  swish: {gain: 0.12, seconds: 0.45},
  pop: {gain: 0.16, seconds: 0.14},
  pop_hi: {gain: 0.14, seconds: 0.12},
  tick: {gain: 0.11, seconds: 0.03},
  tick_soft: {gain: 0.22, seconds: 0.03},
  thud: {gain: 0.26, seconds: 0.55},
  stamp: {gain: 0.28, seconds: 0.6},
  chime: {gain: 0.17, seconds: 0.8},
  ping: {gain: 0.17, seconds: 0.9},
  err: {gain: 0.14, seconds: 0.34},
  warn: {gain: 0.17, seconds: 0.6},
  count: {gain: 0.11, seconds: 1.3},
  count_short: {gain: 0.1, seconds: 1.5},
  fill_blue: {gain: 0.1, seconds: 3.1},
  fill_red: {gain: 0.14, seconds: 1.0},
  riser: {gain: 0.1, seconds: 1.4},
  unlock: {gain: 0.2, seconds: 0.55},
  lock: {gain: 0.2, seconds: 0.4},
  flip: {gain: 0.14, seconds: 0.3},
};
