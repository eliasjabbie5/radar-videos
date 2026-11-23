import {gt1Timing as T} from './timing.gt.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.5;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
const startSecs = T.sceneStarts;
const starts = startSecs.map((s) => Math.round(s * FPS));
const gf = (sec: number) => Math.round(sec * FPS);
const loc = (i: number, sec: number, lead = 3) => Math.max(0, Math.round(sec * FPS) - starts[i] - lead);
const dur = (i: number) => (i + 1 < starts.length ? starts[i + 1] : total) - starts[i];

const scenes: Scene2[] = [
  {
    key: 'hook', from: starts[0], duration: dur(0), source: null, chrome: false,
    body: {type: 'stack', gap: 30, widgets: [
      {t: 'bigtext', text: '3,8 MDR $', sub: 'PÅ BARA 24 TIMMAR • GTA 6', at: loc(0, A.mdr - 0.3), size: 190},
      {t: 'counter', label: 'TIMMAR', to: 24, at: loc(0, A.tjugofyra), dur: 40, tone: 'green', grid: {n: 24, label: 'FÖRSTA DYGNET', at: loc(0, A.tjugofyra), dur: 60}},
    ]},
  },
  {
    key: 'bio', from: starts[1], duration: dur(1), source: 'KÄLLA: ROCKSTAR • TAKE-TWO', chrome: true,
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'versus',
        left: {title: 'GTA 6', tone: 'green', at: loc(1, A.betyder), rows: [{text: '24 timmar', at: loc(1, A.tvspel)}, {text: '≈ 3,8 mdr $', at: loc(1, A.tvspel + 0.6)}]},
        right: {title: 'PÅ BIO', tone: 'blue', at: loc(1, A.avatar - 0.4), rows: [{text: 'Avatar', at: loc(1, A.avatar)}, {text: 'Endgame', at: loc(1, A.endgame)}]},
        stamp: {text: 'ETT SPEL', at: loc(1, A.bio)}},
      {t: 'bigtext', text: 'MER PENGAR', sub: 'PÅ EN DAG ÄN HELA BIOTIDEN', at: loc(1, A.bio - 0.5), size: 130},
    ]},
  },
  {
    key: 'maktskifte', from: starts[2], duration: dur(2), source: 'KÄLLA: BRANSCHDATA', chrome: true,
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'bigtext', text: 'MAKTSKIFTE', sub: 'I UNDERHÅLLNINGSBRANSCHEN', at: loc(2, A.maktskifte - 0.3), size: 170},
      {t: 'columns3', cols: [
        {title: 'HOLLYWOOD', text: 'FILM', tone: 'blue', at: loc(2, A.hollywood - 0.2)},
        {title: 'MUSIK', text: 'MUSIKBRANSCHEN', tone: 'blue', at: loc(2, A.musikbranschen - 0.2)},
        {title: 'SPEL', text: 'VUXIT OM BÅDA', tone: 'green', at: loc(2, A.tillsammans - 0.4)},
      ]},
    ]},
  },
  {
    key: 'gta5', from: starts[3], duration: dur(3), source: 'KÄLLA: ROCKSTAR • TAKE-TWO', chrome: true,
    body: {type: 'stack', gap: 30, widgets: [
      {t: 'dots', title: '1 PRICK = 200 MILJONER DOLLAR', at: loc(3, A.gta5), total: 23, cols: 12, size: 60, gap: 12,
        groups: [
          {label: 'GTA 5 • 2013 • 800 M$', n: 4, tone: 'blue', at: loc(3, A.n800), dur: 24},
          {label: 'GTA 6 • 2026 • 3,8 MDR $', n: 19, tone: 'green', at: loc(3, A.tretton), dur: 60},
        ]},
      {t: 'bigtext', text: '≈ 5X', sub: 'NÄSTAN FEMDUBBLAT PÅ 13 ÅR', at: loc(3, A.femdubblats - 0.4), size: 220},
    ]},
  },
  {
    key: 'allt', from: starts[4], duration: dur(4), source: null, chrome: true,
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'bigtext', text: 'ETT ENDA SPEL', sub: 'KAN PÅVERKA HELA VÄRLDEN', at: loc(4, A.forsta), size: 130},
      {t: 'checklist', rows: [
        {text: 'BÖRSKURSER', sub: 'KAN FLYTTAS', state: 'yes', at: loc(4, A.borskurser)},
        {text: 'PRODUKTIVITET PÅ JOBBET', sub: 'KAN SJUNKA', state: 'yes', at: loc(4, A.produktiviteten)},
        {text: 'VÄRLDENS UPPMÄRKSAMHET', sub: 'DOMINERAS SAMTIDIGT', state: 'yes', at: loc(4, A.uppmarksamhet)},
      ]},
    ]},
  },
];

const chain: Episode2['chain'] = {
  labels: ['3,8 MDR $', 'JÄMFÖRT BIO', '5X GTA 5', 'VÄRLDEN'],
  unlockAt: [starts[1] + 12, gf(A.avatar), gf(A.femdubblats), null],
};

const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.mdr)), 'thud', 0.9);
add(L(0, loc(0, A.tjugofyra)), 'count', 0.9);
add(L(1, loc(1, A.tvspel)), 'pop', 0.9);
add(L(1, loc(1, A.avatar)), 'pop_hi', 0.9);
add(L(1, loc(1, A.endgame)), 'pop_hi', 0.9);
add(L(1, loc(1, A.bio)), 'stamp', 0.9);
add(L(2, loc(2, A.maktskifte)), 'thud', 0.8);
add(L(2, loc(2, A.hollywood)), 'pop', 0.9);
add(L(2, loc(2, A.musikbranschen)), 'pop', 0.9);
add(L(2, loc(2, A.tillsammans)), 'chime', 0.8);
add(L(3, loc(3, A.n800)), 'pop', 0.9);
add(L(3, loc(3, A.tretton)), 'fill_blue', 0.8);
add(L(3, loc(3, A.femdubblats)), 'thud', 0.9);
add(L(4, loc(4, A.borskurser)), 'pop_hi', 0.9);
add(L(4, loc(4, A.produktiviteten)), 'pop_hi', 0.9);
add(L(4, loc(4, A.uppmarksamhet)), 'pop_hi', 0.9);
sfx.sort((a, b) => a.at - b.at);

export const gt1: Episode2 = {
  meta: {id: 'gta6-pengar', tag: 'GTA 6 • REKORD', fps: FPS, width: 1080, height: 1920},
  audioFile: 'gt1.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const gt1Duration = total;
