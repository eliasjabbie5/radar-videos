import {ec1Timing as T} from './timing.ec.generated';
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
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'bigtext', text: '10 MILJONER', sub: 'INVÅNARE · ETT LITET LAND', at: loc(0, A.n10), size: 170},
      {t: 'checklist', rows: [
        {text: 'SPOTIFY', sub: 'SVENSK TECHJÄTTE', state: 'yes', at: loc(0, A.spotify)},
        {text: 'KLARNA', sub: 'SVENSK TECHJÄTTE', state: 'yes', at: loc(0, A.klarna)},
        {text: 'MINECRAFT', sub: 'SVENSK TECHJÄTTE', state: 'yes', at: loc(0, A.minecraft - 0.3)},
      ]},
    ]},
  },
  {
    key: 'hempc', from: starts[1], duration: dur(1), source: 'KÄLLA: RIKSDAGEN • SKATTEVERKET', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'HEM-PC', sub: 'SKATTEREFORM I SLUTET AV 90-TALET', at: loc(1, A.skattereform), size: 220},
      {t: 'cards', cards: [{kicker: 'EN OVÄNTAD SKATTEREFORM', title: 'Hem-PC-reformen', at: loc(1, A.hempc - 0.4)}]},
    ]},
  },
  {
    key: 'uppkopplade', from: starts[2], duration: dur(2), source: 'KÄLLA: RIKSDAGEN • SKATTEVERKET', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'UPPKOPPLAD', sub: 'EN HEL GENERATION', at: loc(2, A.generation - 0.4), size: 160},
      {t: 'checklist', rows: [
        {text: 'BILLIGT ATT HYRA DATOR', sub: 'VIA JOBBET', state: 'yes', at: loc(2, A.billigt)},
        {text: 'SNABBT BREDBAND', sub: 'LÅNGT FÖRE RESTEN AV VÄRLDEN', state: 'yes', at: loc(2, A.bredband)},
        {text: 'UPPKOPPLADE POJKRUM', sub: 'EN GENERATION VÄXTE UPP ONLINE', state: 'yes', at: loc(2, A.pojkrum - 0.5)},
      ]},
    ]},
  },
  {
    key: 'receptet', from: starts[3], duration: dur(3), source: 'KÄLLA: RIKSDAGEN • VINNOVA', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: '+ + +', sub: 'RECEPTET', at: loc(3, A.universitet - 0.4), size: 190},
      {t: 'columns3', cols: [
        {title: 'GRATIS', text: 'Universitet', tone: 'blue', at: loc(3, A.universitet)},
        {title: 'SKYDDSNÄT', text: 'Mindre farligt att starta företag', tone: 'green', at: loc(3, A.skyddsnat)},
        {title: 'LITEN MARKNAD', text: 'Tänker globalt från dag ett', tone: 'ink', at: loc(3, A.hemmamarknad)},
      ]},
    ]},
  },
  {
    key: 'stockholm', from: starts[4], duration: dur(4), source: 'KÄLLA: SIFFROR FRÅN TECHBRANSCHEN', chrome: true,
    body: {type: 'stack', gap: 28, widgets: [
      {t: 'bigtext', text: 'STOCKHOLM', sub: 'FLER MILJARDBOLAG PER CAPITA ÄN NÄSTAN ALLA STÄDER', at: loc(4, A.stockholm), size: 150},
      {t: 'map', title: 'STOCKHOLM ↔ SILICON VALLEY', view: {lon0: -135, lon1: 35, lat0: 22, lat1: 68}, squash: 0.8, dots: 92, at: loc(4, A.stockholm),
        markers: [
          {label: 'SILICON VALLEY', lon: -122.0, lat: 37.4, at: loc(4, A.valley - 0.4), tone: 'ink', side: 'r'},
          {label: 'STOCKHOLM', lon: 18.1, lat: 59.3, at: loc(4, A.stockholm + 0.2), tone: 'blue', side: 'b'},
        ],
        routes: [{from: 0, to: 1, at: loc(4, A.miljardbolag), dur: 50, tone: 'blue', dashed: true, label: 'MILJARDBOLAG'}]},
    ]},
  },
  {
    key: 'fraga', from: starts[5], duration: dur(5), source: 'KÄLLA: SIFFROR FRÅN TECHBRANSCHEN', chrome: true,
    body: {type: 'binary', question: 'Behåller Sverige försprånget?', questionAt: loc(5, A.fragan), options: ['BEHÅLLER', 'HINNS IKAPP'],
      optionsAt: loc(5, A.behalla - 0.2), switchAt: loc(5, A.eller, 0), save: {text: 'SPARA', at: loc(5, A.ikappEnd)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['HEM-PC', 'UPPKOPPLAD', 'RECEPTET', 'AI-ERAN?'],
  unlockAt: [gf(A.hempc), gf(A.generation), gf(A.globalt + 0.8), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.n10)), 'thud', 0.9);
add(L(0, loc(0, A.spotify)), 'pop', 0.9);
add(L(0, loc(0, A.klarna)), 'pop', 0.9);
add(L(0, loc(0, A.minecraft)), 'pop', 0.9);
add(L(1, loc(1, A.skattereform)), 'thud', 0.8);
add(L(1, loc(1, A.hempc)), 'pop', 0.9);
add(L(2, loc(2, A.generation)), 'thud', 0.7);
add(L(2, loc(2, A.billigt)), 'pop_hi', 0.9);
add(L(2, loc(2, A.bredband)), 'pop_hi', 0.9);
add(L(2, loc(2, A.pojkrum)), 'pop_hi', 0.9);
add(L(3, loc(3, A.universitet)), 'thud', 0.7);
add(L(3, loc(3, A.universitet)), 'pop_hi', 0.9);
add(L(3, loc(3, A.skyddsnat)), 'pop_hi', 0.9);
add(L(3, loc(3, A.hemmamarknad)), 'pop_hi', 0.9);
add(L(4, loc(4, A.stockholm)), 'thud', 0.8);
add(L(4, loc(4, A.valley)), 'pop', 0.9);
add(L(4, loc(4, A.miljardbolag)), 'swish', 1);
add(L(5, loc(5, A.fragan)), 'whoosh', 0.8);
add(L(5, loc(5, A.behalla)), 'pop_hi', 1);
add(L(5, loc(5, A.eller)), 'flip', 1);
sfx.sort((a, b) => a.at - b.at);

export const ec1: Episode2 = {
  meta: {id: 'sverige-tech', tag: 'SVERIGE • TECH', fps: FPS, width: 1080, height: 1920},
  audioFile: 'ec1.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const ec1Duration = total;
