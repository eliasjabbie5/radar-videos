import {dy1Timing as T} from './timing.dy.generated';
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
      {t: 'bigtext', text: 'MATPRISER', sub: 'SKÖT I HÖJDEN · GÅR INTE NER', at: loc(0, A.matpriserna), size: 170},
      {t: 'checklist', rows: [
        {text: 'PRISERNA SKÖT I HÖJDEN', state: 'no', at: loc(0, A.hojden)},
        {text: 'GÅR KNAPPT NER IGEN', state: 'no', at: loc(0, A.ner)},
        {text: 'ORSAKEN', sub: 'SÅ ÄR MATMARKNADEN UPPBYGGD', state: 'unknown', at: loc(0, A.uppbyggd - 0.4)},
      ]},
    ]},
  },
  {
    key: 'tre', from: starts[1], duration: dur(1), source: 'KÄLLA: KONKURRENSVERKET', chrome: true,
    body: {type: 'stack', gap: 28, widgets: [
      {t: 'bigtext', text: '3 AKTÖRER', sub: 'NÄSTAN HELA DAGLIGVARUHANDELN', at: loc(1, A.tre), size: 150},
      {t: 'columns3', cols: [
        {title: 'ICA', text: 'Omkring hälften av all mat', tone: 'blue', at: loc(1, A.ica)},
        {title: 'AXFOOD', text: 'Stor kedja', tone: 'ink', at: loc(1, A.axfood)},
        {title: 'COOP', text: 'Stor kedja', tone: 'ink', at: loc(1, A.coop)},
      ]},
      {t: 'ring', value: 50, label: 'av all mat säljs av ICA', sub: 'OMKRING', at: loc(1, A.halften), dur: 30, tone: 'blue'},
    ]},
  },
  {
    key: 'ica', from: starts[2], duration: dur(2), source: 'KÄLLA: ICA GRUPPEN • KONKURRENSVERKET', chrome: true,
    body: {type: 'stack', gap: 30, widgets: [
      {t: 'fusion', height: 680,
        inputs: [{label: 'HANDLARE 1', at: loc(2, A.unik)}, {label: 'HANDLARE 2', at: loc(2, A.unik + 0.4)}, {label: 'HANDLARE 3', at: loc(2, A.handlare)}],
        hub: {label: 'ICA', at: loc(2, A.icagruppen)}, linksAt: loc(2, A.gemensamt),
        outputs: [{label: 'INKÖP', at: loc(2, A.gemensamt + 0.6)}],
        footnote: {text: 'VARJE BUTIK ÄGS AV EN EGEN HANDLARE', at: loc(2, A.handlare)}},
    ]},
  },
  {
    key: 'priser', from: starts[3], duration: dur(3), source: 'KÄLLA: KONKURRENSVERKET', chrome: true,
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'timeline', nodes: [
        {label: 'KOSTNADER UPP', sub: 'INFLATION OCH ELPRISER', at: loc(3, A.inflationen)},
        {label: 'PRISERNA UPP', sub: 'SNABBT UT MOT KUND', at: loc(3, A.hoja), tone: 'blue'},
        {label: 'KOSTNADER NER', sub: 'PRISERNA FÖLJER INTE', at: loc(3, A.planade), tone: 'red'},
      ], chips: [
        {text: 'FÖR LITE KONKURRENS', at: loc(3, A.konkurrens), tone: 'muted'},
        {text: 'REKORDVINSTER', at: loc(3, A.rekordvinster), tone: 'red'},
      ]},
      {t: 'bigtext', text: 'REKORDVINSTER', sub: 'HOS MÅNGA HANDLARE', at: loc(3, A.rekordvinster), size: 120},
    ]},
  },
  {
    key: 'konkverket', from: starts[4], duration: dur(4), source: 'KÄLLA: KONKURRENSVERKET', chrome: true,
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'cards', cards: [{kicker: 'KONKURRENSVERKET', title: 'Brist på konkurrens', at: loc(4, A.konkverket), tag: 'PEKAR UT DET SOM ETT STORT PROBLEM'}]},
    ]},
  },
  {
    key: 'fraga', from: starts[5], duration: dur(5), source: 'KÄLLA: KONKURRENSVERKET', chrome: true,
    body: {type: 'binary', question: 'Bryta upp matjättarna?', questionAt: loc(5, A.borde), options: ['STATEN', 'KUNDERNA'],
      optionsAt: loc(5, A.bryta - 0.2), switchAt: loc(5, A.eller, 0), save: {text: 'SPARA', at: loc(5, A.butikEnd)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['3 AKTÖRER', 'ICA ~50 %', 'REKORDVINST', 'BRYTA UPP?'],
  unlockAt: [starts[1] + 12, gf(A.halften), gf(A.rekordvinster), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.matpriserna)), 'thud', 0.9);
add(L(0, loc(0, A.hojden)), 'err', 0.8);
add(L(0, loc(0, A.ner)), 'err', 0.8);
add(L(0, loc(0, A.uppbyggd)), 'pop', 0.8);
add(L(1, loc(1, A.tre)), 'thud', 0.8);
add(L(1, loc(1, A.ica)), 'pop_hi', 0.9);
add(L(1, loc(1, A.axfood)), 'pop_hi', 0.9);
add(L(1, loc(1, A.coop)), 'pop_hi', 0.9);
add(L(1, loc(1, A.halften)), 'count_short', 0.8);
add(L(2, loc(2, A.unik)), 'pop_hi', 0.9);
add(L(2, loc(2, A.handlare)), 'pop_hi', 0.9);
add(L(2, loc(2, A.gemensamt)), 'swish', 1);
add(L(2, loc(2, A.icagruppen)), 'thud', 0.8);
add(L(2, loc(2, A.gemensamt)), 'pop', 0.9);
add(L(3, loc(3, A.inflationen)), 'pop', 0.9);
add(L(3, loc(3, A.hoja)), 'pop', 0.9);
add(L(3, loc(3, A.planade)), 'err', 0.9);
add(L(3, loc(3, A.rekordvinster)), 'warn', 0.8);
add(L(3, loc(3, A.rekordvinster)), 'thud', 0.7);
add(L(4, loc(4, A.konkverket)), 'pop', 1);
add(L(5, loc(5, A.borde)), 'whoosh', 0.8);
add(L(5, loc(5, A.bryta)), 'pop_hi', 1);
add(L(5, loc(5, A.eller)), 'flip', 1);
sfx.sort((a, b) => a.at - b.at);

export const dy1: Episode2 = {
  meta: {id: 'sverige-matpriser', tag: 'SVERIGE • MATPRISER', fps: FPS, width: 1080, height: 1920},
  audioFile: 'dy1.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const dy1Duration = total;
