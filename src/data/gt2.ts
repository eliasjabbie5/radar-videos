import {gt2Timing as T} from './timing.gt.generated';
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
      {t: 'bigtext', text: 'ORKANEN', sub: 'SÅ STORT ÄR GTA 6', at: loc(0, A.hur), size: 200},
      {t: 'chip', label: 'GTA 6', sub: '19 NOV 2026', at: loc(0, A.resten), tags: [
        {text: 'HELA BRANSCHEN', at: loc(0, A.slappdatumet), tone: 'blue'},
        {text: 'ANNALKANDE ORKAN', at: loc(0, A.orkan - 0.4), tone: 'red'},
      ]},
    ]},
  },
  {
    key: 'uppskjutet', from: starts[1], duration: dur(1), source: 'KÄLLA: ROCKSTAR • TAKE-TWO', chrome: true,
    body: {type: 'stack', gap: 30, widgets: [
      {t: 'timeline', nodes: [
        {label: 'HÖSTEN 2025', sub: 'ORIGINALDATUM', at: loc(1, A.hosten)},
        {label: 'MAJ 2026', sub: 'UPPSKJUTET', at: loc(1, A.maj), tone: 'blue'},
        {label: '19 NOV 2026', sub: 'UPPSKJUTET IGEN', at: loc(1, A.n19), tone: 'red'},
      ], chips: [{text: 'TVÅ UPPSKJUTNINGAR', at: loc(1, A.tva), tone: 'red'}]},
      {t: 'ring', value: 10, suffix: '%', label: 'Take-Twos aktie ned', sub: 'OMKRING • ÖVER EN NATT', at: loc(1, A.tio - 0.3), dur: 30, tone: 'red', stamp: {text: 'FÖLL', at: loc(1, A.natt)}},
    ]},
  },
  {
    key: 'panik', from: starts[2], duration: dur(2), source: 'KÄLLA: BRANSCHANALYS', chrome: true,
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'bigtext', text: 'PANIK', sub: 'HOS KONKURRENTERNA', at: loc(2, A.paniken), size: 220},
      {t: 'cards', cards: [{kicker: 'PROJEKT FÖR ÖVER', title: 'EN MILJARD KR', at: loc(2, A.miljard), tag: 'GISSAR GTA 6:S DATUM I MÅNADER'}]},
      {t: 'checklist', rows: [
        {text: 'INGEN SLÄPPER SAMMA KVARTAL', sub: 'GTA SUGER UPP TID + PENGAR', state: 'no', at: loc(2, A.ingen)},
      ]},
    ]},
  },
  {
    key: 'scheman', from: starts[3], duration: dur(3), source: null, chrome: true,
    body: {type: 'stack', gap: 30, widgets: [
      {t: 'bigtext', text: 'OMPLANERAR', sub: 'FÖR ATT INTE BLI BEGRAVDA', at: loc(3, A.kasta - 0.3), size: 125},
      {t: 'fusion', height: 600,
        inputs: [{label: 'ROCKSTAR FLYTTAR', at: loc(3, A.flyttade)}],
        hub: {label: 'KALENDERN', at: loc(3, A.flyttade + 0.5)}, linksAt: loc(3, A.kasta),
        outputs: [{label: 'SCHEMAN OM', at: loc(3, A.scheman)}, {label: 'BEGRAVDA?', at: loc(3, A.begravda), dashed: true}]},
    ]},
  },
  {
    key: 'aldrig', from: starts[4], duration: dur(4), source: null, chrome: true,
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'bigtext', text: 'ALDRIG FÖRR', sub: 'ETT SPEL STYR HELA KALENDERN', at: loc(4, A.aldrig), size: 170},
      {t: 'cards', cards: [{kicker: 'GLOBAL INDUSTRI', title: 'Imponerande – eller för beroende?', at: loc(4, A.imponerande - 0.4), tag: 'BEROENDE AV JÄTTARNA', stamp: {text: 'FRÅGAN', at: loc(4, A.jattarna)}}]},
    ]},
  },
  {
    key: 'fraga', from: starts[5], duration: dur(5), source: null, chrome: true,
    body: {type: 'binary', question: 'Film eller spel?', questionAt: loc(5, A.fragan), options: ['FILM', 'SPEL'],
      optionsAt: loc(5, A.film - 0.2), switchAt: loc(5, A.eller, 0), save: {text: 'SPARA', at: loc(5, A.kulturformEnd)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['DATUM', 'AKTIEN', 'PANIK', 'FILM VS SPEL'],
  unlockAt: [starts[1] + 12, gf(A.tio), gf(A.paniken), null],
};

const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.hur)), 'thud', 0.9);
add(L(0, loc(0, A.resten)), 'pop', 0.9);
add(L(0, loc(0, A.orkan)), 'warn', 0.8);
add(L(1, loc(1, A.hosten)), 'pop', 0.9);
add(L(1, loc(1, A.maj)), 'pop', 0.9);
add(L(1, loc(1, A.n19)), 'pop', 0.9);
add(L(1, loc(1, A.tva)), 'warn', 0.8);
add(L(1, loc(1, A.tio)), 'fill_red', 0.9);
add(L(1, loc(1, A.natt)), 'stamp', 0.9);
add(L(2, loc(2, A.paniken)), 'thud', 0.9);
add(L(2, loc(2, A.miljard)), 'pop', 0.9);
add(L(2, loc(2, A.ingen)), 'err', 0.8);
add(L(3, loc(3, A.flyttade)), 'pop', 0.9);
add(L(3, loc(3, A.kasta)), 'swish', 1);
add(L(3, loc(3, A.scheman)), 'pop', 0.9);
add(L(3, loc(3, A.begravda)), 'warn', 0.8);
add(L(4, loc(4, A.aldrig)), 'thud', 0.8);
add(L(4, loc(4, A.imponerande)), 'pop', 0.9);
add(L(4, loc(4, A.jattarna)), 'stamp', 0.8);
add(L(5, loc(5, A.fragan)), 'whoosh', 0.8);
add(L(5, loc(5, A.film)), 'pop_hi', 1);
add(L(5, loc(5, A.eller)), 'flip', 1);
sfx.sort((a, b) => a.at - b.at);

export const gt2: Episode2 = {
  meta: {id: 'gta6-datum', tag: 'GTA 6 • DATUM', fps: FPS, width: 1080, height: 1920},
  audioFile: 'gt2.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const gt2Duration = total;
