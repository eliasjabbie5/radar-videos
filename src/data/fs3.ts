import {fs3Timing as T} from './timing.fs.generated';
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
      {t: 'bigtext', text: 'SNUS', sub: 'LAGLIGT I SVERIGE · FÖRBJUDET I RESTEN AV EU', at: loc(0, A.snus - 0.2), size: 190},
      {t: 'map', title: 'SNUSFÖRBUDET I EU', view: {lon0: -12, lon1: 32, lat0: 35, lat1: 66}, squash: 0.8, dots: 80, at: loc(0, A.svenskar),
        markers: [
          {label: 'SVERIGE', lon: 18.1, lat: 59.3, at: loc(0, A.snus), tone: 'green', side: 'r'},
          {label: 'FRANKRIKE', lon: 2.4, lat: 46.6, at: loc(0, A.totalforbjudet - 0.3), tone: 'red', side: 'b'},
          {label: 'TYSKLAND', lon: 10.0, lat: 51.0, at: loc(0, A.totalforbjudet), tone: 'red', side: 't'},
          {label: 'SPANIEN', lon: -3.7, lat: 40.2, at: loc(0, A.totalforbjudet + 0.3), tone: 'red', side: 'b'},
        ],
        stamp: {text: 'FÖRBJUDET I EU', at: loc(0, A.eu - 0.2), tone: 'red'}},
    ]},
  },
  {
    key: 'historik', from: starts[1], duration: dur(1), source: 'KÄLLA: EU-KOMMISSIONEN • RIKSDAGEN', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'FÖRBUD', sub: '1992 · HÄLSORISKERNA', at: loc(1, A.n1992), size: 200},
      {t: 'timeline', nodes: [
        {label: '1992', sub: 'EU FÖRBJUDER SNUS', at: loc(1, A.forbjod)},
        {label: '1995', sub: 'SVERIGE GÅR MED', at: loc(1, A.n1995), tone: 'blue'},
        {label: 'KNÄCKFRÅGA', sub: 'SNUSET', at: loc(1, A.knackfraga - 0.6), tone: 'red'},
      ]},
    ]},
  },
  {
    key: 'undantag', from: starts[2], duration: dur(2), source: 'KÄLLA: EU-KOMMISSIONEN • RIKSDAGEN', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'UNDANTAG', sub: 'PERMANENT · FÖRHANDLAT FRAM', at: loc(2, A.forhandla), size: 190},
      {t: 'versus',
        left: {title: 'BRUNT SNUS', tone: 'green', at: loc(2, A.brunt - 0.4), rows: [{text: 'Får säljas i Sverige', at: loc(2, A.brunt)}]},
        right: {title: 'EXPORT', tone: 'red', at: loc(2, A.aldrig - 0.4), rows: [{text: 'Aldrig till andra EU-länder', at: loc(2, A.aldrig)}]}},
    ]},
  },
  {
    key: 'vittsnus', from: starts[3], duration: dur(3), source: 'KÄLLA: EU-KOMMISSIONEN', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'VITT SNUS', sub: 'NIKOTINPÅSAR UTAN TOBAK', at: loc(3, A.vitt), size: 180},
      {t: 'checklist', rows: [
        {text: 'INGEN TOBAK', sub: 'HAMNADE I EN JURIDISK GRÅZON', state: 'unknown', at: loc(3, A.tobak)},
        {text: 'EXPLODERADE I EUROPA', sub: 'SNABB UTBREDNING', state: 'yes', at: loc(3, A.exploderade)},
      ]},
    ]},
  },
  {
    key: 'striden', from: starts[4], duration: dur(4), source: 'KÄLLA: EU-KOMMISSIONEN • FOLKHÄLSOMYNDIGHETEN', chrome: true,
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'versus',
        left: {title: 'FLERA EU-LÄNDER', tone: 'red', at: loc(4, A.flera), rows: [
          {text: 'Vill förbjuda eller reglera vitt snus', at: loc(4, A.forbjuda)}, {text: 'Stoppa unga från nikotin', at: loc(4, A.unga)}]},
        right: {title: 'SVERIGE', tone: 'blue', at: loc(4, A.samtidigt), rows: [{text: 'Snuset: huvudorsak till färre rökare', at: loc(4, A.huvudorsak)}]}},
      {t: 'bigtext', text: 'LÄGST', sub: 'ANDEL RÖKARE I HELA EU · SVERIGE', at: loc(4, A.lagst), size: 190},
    ]},
  },
  {
    key: 'fraga', from: starts[5], duration: dur(5), source: 'KÄLLA: EU-KOMMISSIONEN', chrome: true,
    body: {type: 'binary', question: 'Ska EU bestämma om snus?', questionAt: loc(5, A.borde), options: ['SLUTA', 'SÄTT GRÄNSER'],
      optionsAt: loc(5, A.sluta - 0.2), switchAt: loc(5, A.eller, 0), save: {text: 'SPARA', at: loc(5, A.granserEnd)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['FÖRBJUDET', '1995', 'UNDANTAG', 'VITT SNUS?'],
  unlockAt: [starts[1] + 12, gf(A.n1995), gf(A.undantag), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.snus)), 'thud', 0.9);
add(L(0, loc(0, A.svenskar)), 'pop', 0.9);
add(L(0, loc(0, A.totalforbjudet)), 'pop_hi', 0.8);
add(L(0, loc(0, A.eu)), 'warn', 0.8);
add(L(1, loc(1, A.n1992)), 'thud', 0.8);
add(L(1, loc(1, A.forbjod)), 'pop', 0.9);
add(L(1, loc(1, A.n1995)), 'pop', 0.9);
add(L(1, loc(1, A.knackfraga)), 'warn', 0.8);
add(L(2, loc(2, A.forhandla)), 'thud', 0.8);
add(L(2, loc(2, A.brunt)), 'pop', 0.9);
add(L(2, loc(2, A.aldrig)), 'err', 0.9);
add(L(3, loc(3, A.vitt)), 'thud', 0.8);
add(L(3, loc(3, A.tobak)), 'pop', 0.9);
add(L(3, loc(3, A.exploderade)), 'chime', 0.7);
add(L(4, loc(4, A.flera)), 'pop', 0.9);
add(L(4, loc(4, A.forbjuda)), 'err', 0.8);
add(L(4, loc(4, A.unga)), 'pop_hi', 0.9);
add(L(4, loc(4, A.samtidigt)), 'pop_hi', 0.9);
add(L(4, loc(4, A.lagst)), 'thud', 0.8);
add(L(5, loc(5, A.borde)), 'whoosh', 0.8);
add(L(5, loc(5, A.sluta)), 'pop_hi', 1);
add(L(5, loc(5, A.eller)), 'flip', 1);
sfx.sort((a, b) => a.at - b.at);

export const fs3: Episode2 = {
  meta: {id: 'sverige-snus', tag: 'SVERIGE • SNUSET', fps: FPS, width: 1080, height: 1920},
  audioFile: 'fs3.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const fs3Duration = total;
