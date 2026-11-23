import type {Caption} from '@remotion/captions';

export type SceneKey = 'coldOpen' | 'voteTrack' | 'deadlock' | 'dotGrid' | 'outro';

export interface SceneTiming {
  key: SceneKey;
  /** First frame of the scene on the master timeline. */
  from: number;
  duration: number;
  /** Voiceover script for this scene. */
  voiceover: string;
  /** Micro-source footer text. null = no footer. */
  source: string | null;
  /** Progress step highlighted in the top anchor (1–4). null = chrome hidden. */
  step: number | null;
}

/* All `*At` values are LOCAL frames inside the scene (derived from voiceover timing). */

export interface ColdOpenContent {
  days: number;
  label: string;
  pill: string;
  dateLeft: string;
  dateRight: string;
  countStart: number;
  countEnd: number;
  labelAt: number;
  pillAt: number;
}

export interface VoteCard {
  n: string;
  label: string;
  state: 'result' | 'pending' | 'dim';
  result?: string;
  stampAt?: number;
  at: number;
}
export interface VoteTrackContent {
  status: string;
  statusAt: number;
  chips: {text: string; at: number}[];
  timeline: {from: string; to: string; at: number; dur: number};
  cards: VoteCard[];
}

export interface DeadlockRow {
  tone: 'yes' | 'no' | 'dim';
  text: string;
  at: number;
}
export interface DeadlockCard {
  party: string;
  accent: 'center' | 'parl';
  at: number;
  rows: DeadlockRow[];
}
export interface DeadlockContent {
  attempts: {at: number; items: {label: string; value: string; tone: 'no' | 'pending' | 'dim'}[]};
  docPill: string;
  docPillAt: number;
  cards: [DeadlockCard, DeadlockCard];
  tension: {label: string; lineAt: number; chipAt: number};
}

export interface DotGridContent {
  totalSeats: number;
  threshold: number;
  introAt: number;
  subtitle: string;
  rightBlock: {seats: number; label: string; at: number; dur: number};
  left: {seats: number; label: string; at: number; dur: number};
  thresholdLabel: string;
  doneLabel: string;
  gaugeAt: number;
  fellAt: number;
}

export interface OutroContent {
  timeline: {from: string; to: string; label: string; at: number; dur: number};
  question: string;
  questionAt: number;
  options: [string, string];
  optionsAt: number;
  /** frame when the highlight switches from option 1 to option 2 */
  switchAt: number;
  teaser: string;
  teaserAt: number;
}

export type SfxName =
  | 'whoosh' | 'swish' | 'pop' | 'pop_hi' | 'tick' | 'tick_soft' | 'thud' | 'stamp'
  | 'chime' | 'ping' | 'err' | 'warn' | 'count' | 'count_short' | 'fill_blue' | 'fill_red' | 'riser'
  | 'unlock' | 'lock' | 'flip';

/** A sound effect on the master timeline. */
export interface SfxEvent {
  /** Global frame where the sound starts. */
  at: number;
  name: SfxName;
  /** Gain multiplier on top of the sound's default level (1 = default). */
  volume?: number;
  /** Cut the sound after this many frames (for stretchy sounds like tick-trains). */
  duration?: number;
}

export interface Episode {
  meta: {id: string; tag: string; fps: number; width: number; height: number};
  /** File inside /public. Optional at render time — missing file = silent render. */
  audioFile: string;
  /** Optional word-timestamp JSON in /public that overrides `captions`. */
  captionsFile: string;
  /** Cross-fade length between scenes (frames). */
  transitionFrames: number;
  /** Frames of silence/hold after the voiceover ends. */
  scenes: SceneTiming[];
  content: {
    coldOpen: ColdOpenContent;
    voteTrack: VoteTrackContent;
    deadlock: DeadlockContent;
    dotGrid: DotGridContent;
    outro: OutroContent;
  };
  /** Word-level timings (generated from the voiceover). */
  captions: Caption[];
  /** Sound effects, in public/sfx/*.wav (see scripts/sfx/make_sfx.py). */
  sfx: SfxEvent[];
}
