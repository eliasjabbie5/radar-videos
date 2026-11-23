import {gt3Timing as T} from './timing.gt.generated';
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
      {t: 'bigtext', text: '13 ÅR', sub: 'MELLAN DE TVÅ SENASTE GTA-SPELEN', at: loc(0, A.tretton - 0.4), size: 220},
      {t: 'dots', title: 'GTA-SPEL FRÅN ROCKSTAR', at: loc(0, A.mellan), total: 5, cols: 5, size: 120, gap: 18,
        groups: [
          {label: '2001–2008 • FYRA SPEL', n: 4, tone: 'blue', at: loc(0, A.fyra), dur: 40},
          {label: '2013–2026 • ETT SPEL', n: 1, tone: 'green', at: loc(0, A.enda), dur: 12},
        ]},
    ]},
  },
  {
    key: 'kostnad', from: starts[1], duration: dur(1), source: null, chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'EXPLODERAT', sub: 'DET FÖRSTA SKÄLET', at: loc(1, A.kostnaderna), size: 135},
      {t: 'checklist', rows: [
        {text: 'KOSTNADER', sub: 'EXPLODERAT', state: 'yes', at: loc(1, A.kostnaderna)},
        {text: 'KOMPLEXITET', sub: 'EXPLODERAT', state: 'yes', at: loc(1, A.komplexiteten)},
      ]},
    ]},
  },
  {
    key: 'budget', from: starts[2], duration: dur(2), source: 'KÄLLA: BRANSCHRYKTEN • ROCKSTAR', chrome: true,
    body: {type: 'stack', gap: 28, widgets: [
      {t: 'map', title: 'TUSENTALS UTVECKLARE ÖVER HELA VÄRLDEN', view: {lon0: -130, lon1: 10, lat0: 28, lat1: 62}, squash: 0.7, dots: 80, at: loc(2, A.utvecklare - 0.4),
        markers: [
          {label: 'EDINBURGH', lon: -3.2, lat: 55.95, at: loc(2, A.utvecklare), tone: 'blue', side: 't'},
          {label: 'NEW YORK', lon: -74, lat: 40.7, at: loc(2, A.utvecklare + 0.3), tone: 'blue', side: 'b'},
          {label: 'SAN DIEGO', lon: -117.2, lat: 32.7, at: loc(2, A.utvecklare + 0.6), tone: 'blue', side: 'r'},
          {label: 'TORONTO', lon: -79.4, lat: 43.7, at: loc(2, A.utvecklare + 0.9), tone: 'blue', side: 't'},
        ]},
      {t: 'cards', cards: [{kicker: 'BUDGET RYKTAS NÄRMA SIG', title: 'Mer än flera storfilmer', at: loc(2, A.budgetar),
        value: {prefix: '~', to: 2, suffix: ' MDR $', at: loc(2, A.tva), dur: 24}, tag: 'RYKTAS • EJ BEKRÄFTAT'}]},
    ]},
  },
  {
    key: 'online', from: starts[3], duration: dur(3), source: 'KÄLLA: TAKE-TWO', chrome: true,
    body: {type: 'stack', gap: 30, widgets: [
      {t: 'bigtext', text: 'REN EKONOMI', sub: 'DET ANDRA SKÄLET', at: loc(3, A.andra), size: 150},
      {t: 'fusion', height: 560,
        inputs: [{label: 'GTA ONLINE', at: loc(3, A.online)}],
        hub: {label: 'MDR $', at: loc(3, A.miljarder)}, linksAt: loc(3, A.miljarder + 0.4),
        outputs: [{label: 'TAKE-TWO', at: loc(3, A.taketwo)}, {label: 'INGET NYTT', at: loc(3, A.nytt), dashed: true}],
        footnote: {text: 'ROCKSTAR HADE INTE BRÅTTOM', at: loc(3, A.brattom - 0.6)}},
    ]},
  },
  {
    key: 'resultat', from: starts[4], duration: dur(4), source: null, chrome: true,
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'bigtext', text: '10+ ÅR', sub: 'ATT VÄNTA PÅ EN UPPFÖLJARE', at: loc(4, A.verklighet - 0.2), size: 210},
      {t: 'timeline', nodes: [
        {label: '2013', sub: 'GTA 5', at: loc(4, A.resultatet + 0.2)},
        {label: '13 ÅR', sub: 'VÄNTAN', at: loc(4, A.decennium), tone: 'red'},
        {label: '2026', sub: 'GTA 6', at: loc(4, A.uppfoljare - 0.4), tone: 'green'},
      ]},
    ]},
  },
  {
    key: 'fraga', from: starts[5], duration: dur(5), source: null, chrome: true,
    body: {type: 'binary', question: 'Värt 13 års väntan?', questionAt: loc(5, A.arq), options: ['VÄRT DET', 'FÖR LÄNGE'],
      optionsAt: loc(5, A.vantan), switchAt: loc(5, A.eller, 0), save: {text: 'SPARA', at: loc(5, A.arEnd)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['13 ÅR', 'KOSTNAD', 'GTA ONLINE', 'VÄRT?'],
  unlockAt: [starts[1] + 12, gf(A.utvecklare), gf(A.online), null],
};

const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.tretton)), 'thud', 0.9);
add(L(0, loc(0, A.fyra)), 'fill_blue', 0.8);
add(L(0, loc(0, A.enda)), 'pop_hi', 0.9);
add(L(1, loc(1, A.kostnaderna)), 'thud', 0.8);
add(L(1, loc(1, A.kostnaderna)), 'pop_hi', 0.9);
add(L(1, loc(1, A.komplexiteten)), 'pop_hi', 0.9);
add(L(2, loc(2, A.utvecklare)), 'pop', 0.9);
add(L(2, loc(2, A.budgetar)), 'pop', 0.9);
add(L(2, loc(2, A.tva)), 'count', 0.9);
add(L(3, loc(3, A.andra)), 'thud', 0.8);
add(L(3, loc(3, A.online)), 'pop', 0.9);
add(L(3, loc(3, A.miljarder)), 'swish', 1);
add(L(3, loc(3, A.taketwo)), 'pop', 0.9);
add(L(3, loc(3, A.nytt)), 'warn', 0.8);
add(L(4, loc(4, A.verklighet)), 'thud', 0.8);
add(L(4, loc(4, A.resultatet)), 'pop', 0.9);
add(L(4, loc(4, A.decennium)), 'warn', 0.8);
add(L(4, loc(4, A.uppfoljare)), 'chime', 0.8);
add(L(5, loc(5, A.arq)), 'whoosh', 0.8);
add(L(5, loc(5, A.vantan)), 'pop_hi', 1);
add(L(5, loc(5, A.eller)), 'flip', 1);
sfx.sort((a, b) => a.at - b.at);

export const gt3: Episode2 = {
  meta: {id: 'gta6-vantan', tag: 'GTA 6 • VÄNTAN', fps: FPS, width: 1080, height: 1920},
  audioFile: 'gt3.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const gt3Duration = total;
