import type {Caption} from '@remotion/captions';
import type {SfxEvent} from './types';

export type Tone = 'ink' | 'red' | 'green' | 'blue' | 'muted';

/* ───────── widgets (all `at` values are LOCAL frames inside the scene) ───────── */
export interface FusionW {
  t: 'fusion';
  inputs: {label: string; at: number}[];
  hub: {label: string; at: number};
  outputs: {label: string; at: number; dashed?: boolean}[];
  linksAt: number;
  footnote?: {text: string; at: number};
  height?: number;
}
export interface CardsW {
  t: 'cards';
  cards: {
    kicker: string;
    title: string;
    at: number;
    value?: {prefix?: string; text?: string; to?: number; suffix?: string; at: number; dur?: number};
    tag?: string;
    stamp?: {text: string; at: number};
  }[];
}
export interface CounterW {
  t: 'counter';
  label: string;
  to: number;
  at: number;
  dur: number;
  tone?: Tone;
  grid?: {n: number; label: string; at: number; dur: number};
}
export interface ChecklistW {
  t: 'checklist';
  rows: {text: string; sub?: string; state: 'yes' | 'unknown' | 'no'; at: number; stamp?: {text: string; at: number}}[];
}
export interface VersusCol {
  title: string;
  tone: Tone;
  at: number;
  rows: {text: string; at: number}[];
}
export interface VersusW {
  t: 'versus';
  left: VersusCol;
  right: VersusCol;
  stamp?: {text: string; at: number};
}
export interface TimelineW {
  t: 'timeline';
  nodes: {label: string; sub?: string; at: number; tone?: Tone}[];
  chips?: {text: string; at: number; tone?: Tone}[];
  stamp?: {text: string; at: number};
}
export interface StaffW {
  t: 'staff';
  title: string;
  at: number;
  people: {n: number; at: number; dur: number; label: string};
  week: {filled: number; at: number; label: string};
}
export interface BarsW {
  t: 'bars';
  title: string;
  rows: {label: string; n: number; at: number; dur: number; tone?: Tone}[];
}
export interface Columns3W {
  t: 'columns3';
  cols: {title: string; text: string; tone: Tone; at: number}[];
}
export interface BigTextW {
  t: 'bigtext';
  text: string;
  sub?: string;
  at: number;
  size?: number;
}
export interface DotsW {
  t: 'dots';
  title: string;
  at: number;
  total: number;
  cols: number;
  size: number;
  gap: number;
  /** groups fill the grid in order; each counts up from `at` over `dur` frames */
  groups: {label: string; n: number; tone: Tone; at: number; dur: number}[];
  mark?: {index: number; label: string; at: number};
}
export interface MapW {
  t: 'map';
  /** equirectangular viewport in degrees (lat0 = south edge, lat1 = north edge) */
  view: {lon0: number; lon1: number; lat0: number; lat1: number};
  height?: number;
  /** horizontal squash (cos latitude) used to derive the height from the view */
  squash?: number;
  /** dot columns across the map (density) */
  dots?: number;
  at: number;
  title?: string;
  markers: {label: string; lon: number; lat: number; at: number; tone?: Tone; side?: 'l' | 'r' | 't' | 'b'}[];
  routes?: {from: number; to: number; at: number; dur?: number; tone?: Tone; dashed?: boolean; label?: string; curve?: number}[];
  stamp?: {text: string; at: number; tone?: Tone};
}
export interface SwedenW {
  t: 'sweden';
  at: number;
  /** electricity flow arrow north -> south */
  flow?: {at: number; dur?: number; label?: string};
  /** zone index 0..3 (SE1..SE4, schematic latitude bands) coloured with the card's tone when the card appears */
  side: {zones?: number[]; big: string; text: string; sub?: string; tone: Tone; at: number}[];
}
export interface RingW {
  t: 'ring';
  value: number;
  suffix?: string;
  label: string;
  sub?: string;
  at: number;
  dur: number;
  tone?: Tone;
  stamp?: {text: string; at: number; tone?: Tone};
}
export interface ChipW {
  t: 'chip';
  label: string;
  sub?: string;
  at: number;
  tags?: {text: string; at: number; tone?: Tone}[];
}
export type Widget = SwedenW | MapW | RingW | ChipW | DotsW | FusionW | CardsW | CounterW | ChecklistW | VersusW | TimelineW | StaffW | BarsW | Columns3W | BigTextW;

/* ───────── scenes ───────── */
export type SceneBody =
  | {type: 'hookTiles'; tiles: {label: string; sub: string; at: number; locked?: boolean}[]; headline: {text: string; at: number}}
  | {type: 'redacted'; kicker: string; before: string; secret: string; revealAt: number; stamp: {text: string; at: number}; meta: string[]; metaAt: number}
  | {type: 'stack'; widgets: Widget[]; gap?: number; align?: 'center' | 'start'}
  | {type: 'binary'; question: string; questionAt: number; options: [string, string]; optionsAt: number; switchAt: number; save?: {text: string; at: number}; teaser?: {text: string; at: number}}
  | {type: 'cliff'; pulseAt: number; card: {title: string; sub: string; at: number}};

export interface Scene2 {
  key: string;
  from: number;
  duration: number;
  source: string | null;
  /** show the Mystery Chain + footer on this scene */
  chrome: boolean;
  body: SceneBody;
}

export interface Episode2 {
  meta: {id: string; tag: string; fps: number; width: number; height: number};
  audioFile: string;
  transitionFrames: number;
  chain: {labels: [string, string, string, string]; /** global frame each box unlocks; null = stays locked */ unlockAt: (number | null)[]};
  scenes: Scene2[];
  captions: Caption[];
  sfx: SfxEvent[];
}
