import {ec3Timing as T} from './timing.ec.generated';
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
      {t: 'bigtext', text: 'KIRUNA', sub: 'EUROPAS STÖRSTA KÄNDA FYNDIGHET AV SÄLLSYNTA METALLER', at: loc(0, A.kiruna), size: 190},
      {t: 'map', title: 'SÄLLSYNTA JORDARTSMETALLER', view: {lon0: -12, lon1: 42, lat0: 35, lat1: 72}, squash: 0.8, dots: 80, at: loc(0, A.kiruna),
        markers: [{label: 'KIRUNA', lon: 20.2, lat: 67.85, at: loc(0, A.kiruna + 0.2), tone: 'green', side: 'l'}]},
    ]},
  },
  {
    key: 'avgorande', from: starts[1], duration: dur(1), source: 'KÄLLA: EU-KOMMISSIONEN • LKAB', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'AVGÖRANDE', sub: 'FÖR DEN GRÖNA OMSTÄLLNINGEN', at: loc(1, A.metallerna), size: 190},
      {t: 'checklist', rows: [
        {text: 'ELBILAR', sub: 'KRÄVER SÄLLSYNTA METALLER', state: 'yes', at: loc(1, A.elbilar)},
        {text: 'VINDKRAFTVERK', sub: 'KRÄVER SÄLLSYNTA METALLER', state: 'yes', at: loc(1, A.vindkraftverk)},
        {text: 'MODERN FÖRSVARSTEKNIK', sub: 'KRÄVER SÄLLSYNTA METALLER', state: 'yes', at: loc(1, A.forsvarsteknik - 0.3)},
      ]},
    ]},
  },
  {
    key: 'kina', from: starts[2], duration: dur(2), source: 'KÄLLA: EU-KOMMISSIONEN', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'KINA', sub: 'KONTROLLERAR NÄSTAN HELA VÄRLDSMARKNADEN', at: loc(2, A.kina - 0.4), size: 220},
      {t: 'versus',
        left: {title: 'EUROPA', tone: 'blue', at: loc(2, A.beroende - 0.5), rows: [{text: 'Extremt beroende', at: loc(2, A.beroende)}]},
        right: {title: 'KINA', tone: 'ink', at: loc(2, A.kina), rows: [{text: 'Kontrollerar marknaden', at: loc(2, A.varldsmarknaden - 0.8)}]}},
    ]},
  },
  {
    key: 'fyndet', from: starts[3], duration: dur(3), source: 'KÄLLA: LKAB • EU-KOMMISSIONEN', chrome: true,
    body: {type: 'stack', gap: 30, widgets: [
      {t: 'map', title: 'KIRUNA → EUROPA', view: {lon0: -12, lon1: 42, lat0: 35, lat1: 72}, squash: 0.8, dots: 80, at: loc(3, A.fyndet),
        markers: [
          {label: 'KIRUNA', lon: 20.2, lat: 67.85, at: loc(3, A.fyndet), tone: 'green', side: 'l'},
          {label: 'EUROPA', lon: 9.5, lat: 49.5, at: loc(3, A.ravaruleverantor - 0.3), tone: 'blue', side: 'b'},
        ],
        routes: [{from: 0, to: 1, at: loc(3, A.ravaruleverantor), dur: 50, tone: 'green', dashed: true, label: 'RÅVAROR'}]},
      {t: 'checklist', rows: [{text: 'MINSKAR BEROENDET AV KINA', sub: 'KRAFTIGT', state: 'yes', at: loc(3, A.minska)}]},
    ]},
  },
  {
    key: 'hake', from: starts[4], duration: dur(4), source: 'KÄLLA: BERGSSTATEN • LKAB', chrome: true,
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'bigtext', text: '10–15 ÅR', sub: 'FÖR ATT ÖPPNA EN NY GRUVA I SVERIGE', at: loc(4, A.tio - 0.4), size: 200},
      {t: 'timeline', nodes: [
        {label: 'TILLSTÅND', sub: 'MILJÖTILLSTÅND KRÄVS', at: loc(4, A.miljotillstand)},
        {label: 'RENNÄRING', sub: 'KONFLIKTER ATT HANTERA', at: loc(4, A.rennaringen), tone: 'blue'},
        {label: 'NY GRUVA', sub: 'TAR OFTA 10–15 ÅR', at: loc(4, A.gruva), tone: 'red'},
      ]},
    ]},
  },
  {
    key: 'fraga', from: starts[5], duration: dur(5), source: 'KÄLLA: BERGSSTATEN', chrome: true,
    body: {type: 'binary', question: 'Snabbare gruvtillstånd?', questionAt: loc(5, A.borde), options: ['SNABBARE', 'MILJÖSKYDD'],
      optionsAt: loc(5, A.snabba - 0.2), switchAt: loc(5, A.eller, 0), save: {text: 'SPARA', at: loc(5, A.viktigareEnd)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['KIRUNA', 'GRÖN TEKNIK', 'KINA', 'TILLSTÅND?'],
  unlockAt: [starts[1] + 12, gf(A.elbilar), gf(A.kina), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.kiruna)), 'thud', 0.9);
add(L(0, loc(0, A.kiruna)), 'pop', 0.9);
add(L(1, loc(1, A.metallerna)), 'thud', 0.8);
add(L(1, loc(1, A.elbilar)), 'pop_hi', 0.9);
add(L(1, loc(1, A.vindkraftverk)), 'pop_hi', 0.9);
add(L(1, loc(1, A.forsvarsteknik)), 'pop_hi', 0.9);
add(L(2, loc(2, A.kina)), 'thud', 0.8);
add(L(2, loc(2, A.beroende)), 'pop', 0.9);
add(L(3, loc(3, A.fyndet)), 'pop', 0.9);
add(L(3, loc(3, A.ravaruleverantor)), 'pop', 0.9);
add(L(3, loc(3, A.ravaruleverantor)), 'swish', 1);
add(L(3, loc(3, A.minska)), 'chime', 0.8);
add(L(4, loc(4, A.tio)), 'thud', 0.8);
add(L(4, loc(4, A.miljotillstand)), 'pop', 0.9);
add(L(4, loc(4, A.rennaringen)), 'pop', 0.9);
add(L(4, loc(4, A.gruva)), 'warn', 0.8);
add(L(5, loc(5, A.borde)), 'whoosh', 0.8);
add(L(5, loc(5, A.snabba)), 'pop_hi', 1);
add(L(5, loc(5, A.eller)), 'flip', 1);
sfx.sort((a, b) => a.at - b.at);

export const ec3: Episode2 = {
  meta: {id: 'sverige-kiruna', tag: 'SVERIGE • KIRUNA', fps: FPS, width: 1080, height: 1920},
  audioFile: 'ec3.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const ec3Duration = total;
