import type {Scene2} from '../data/types2';

/** Word-level timing for one part (produced by scripts/job/timing.py). Times in seconds. */
export interface JobTiming {
  AUDIO_SECONDS: number;
  /** Start second of each scene (scene 0 starts at 0). */
  sceneStarts: number[];
  /** `scene` is 1-based (matches the scene order in the spec). */
  words: {scene: number; text: string; s: number; e: number}[];
}

/**
 * A scene as an AI writes it. Identical to Scene2 except that every animation time (`at`, `questionAt`, ...)
 * may be a word reference string instead of a frame number:
 *
 *   "@elbilar"        start of the first word "elbilar" in THIS scene (3 frames early)
 *   "@elbilar#2"      second occurrence
 *   "@2:elbilar"      first occurrence in scene 2
 *   "@elbilar+0.4"    0.4 s later  ("-0.3" = earlier)
 *   "@elbilar!"       END of the word, no lead (stamps, save buttons)
 *   "@^"  / "@$"      start of the first / end of the last word in the scene
 *   a plain number    local frame, used as is
 */
export type JobScene = Omit<Scene2, 'from' | 'duration'>;

export interface JobSpec {
  id: string;
  tag: string;
  /** Path under public/, e.g. "jobs/abc/part1.mp3". */
  audioFile: string;
  chain: {
    labels: [string, string, string, string];
    /** Word refs ("@3:elbilar" = scene 3), "$N" = scene N start + 12 frames, or null = stays locked. */
    unlockAt: (string | number | null)[];
  };
  scenes: JobScene[];
}

export interface Job {
  spec: JobSpec;
  timing: JobTiming;
}
