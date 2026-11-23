import type {Caption} from '@remotion/captions';
import type {SceneTiming} from '../data/types';

/**
 * Spreads each scene's voiceover words across its duration, weighted by word
 * length. A stand-in until real word timestamps (public/captions.json) exist.
 */
export const placeholderCaptions = (scenes: SceneTiming[], fps: number): Caption[] => {
  const out: Caption[] = [];
  for (const scene of scenes) {
    const words = scene.voiceover.split(/\s+/).filter(Boolean);
    const startMs = ((scene.from + 8) / fps) * 1000;
    const endMs = ((scene.from + scene.duration - 14) / fps) * 1000;
    const weights = words.map((w) => w.length + (/[.,–]$/.test(w) ? 3 : 0) + 2);
    const total = weights.reduce((a, b) => a + b, 0);
    let cursor = startMs;
    words.forEach((word, i) => {
      const span = ((endMs - startMs) * weights[i]) / total;
      out.push({
        text: i === 0 && out.length === 0 ? word : ` ${word}`,
        startMs: Math.round(cursor),
        endMs: Math.round(cursor + span),
        timestampMs: Math.round(cursor + span / 2),
        confidence: null,
      });
      cursor += span;
    });
  }
  return out;
};
