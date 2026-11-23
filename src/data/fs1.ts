import {fs1Timing as T} from './timing.fs.generated';
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
      {t: 'bigtext', text: 'ENSAMMA', sub: 'OBEGRÄNSAD VINST PÅ SKOLPENG', at: loc(0, A.enda), size: 200},
      {t: 'checklist', rows: [
        {text: 'PRIVATA AKTIEBOLAG', sub: 'DRIVER SKOLOR', state: 'yes', at: loc(0, A.privata)},
        {text: 'OBEGRÄNSAD VINST', sub: 'ENDA LANDET I PRINCIP', state: 'unknown', at: loc(0, A.obegransad)},
        {text: 'SKATTEFINANSIERADE SKOLOR', state: 'yes', at: loc(0, A.skattefin)},
      ]},
    ]},
  },
  {
    key: 'skolpeng', from: starts[1], duration: dur(1), source: 'KÄLLA: RIKSDAGEN • SKOLVERKET', chrome: true,
    body: {type: 'stack', gap: 30, widgets: [
      {t: 'bigtext', text: '1992', sub: 'FRITT SKOLVAL + SKOLPENG', at: loc(1, A.n1992), size: 190},
      {t: 'fusion', height: 600,
        inputs: [{label: 'SKATTEPENGAR', at: loc(1, A.skolval)}, {label: 'FRITT VAL', at: loc(1, A.skolpeng)}],
        hub: {label: 'ELEV', at: loc(1, A.pengarna)}, linksAt: loc(1, A.pengarna),
        outputs: [{label: 'KOMMUNEN', at: loc(1, A.kommunen)}, {label: 'PRIVAT', at: loc(1, A.aktor - 0.4)}],
        footnote: {text: 'PENGEN FÖLJER ELEVEN', at: loc(1, A.eleven)}},
    ]},
  },
  {
    key: 'for', from: starts[2], duration: dur(2), source: 'KÄLLA: FÖRESPRÅKARNA', chrome: true,
    body: {type: 'stack', gap: 40, widgets: [
      {t: 'bigtext', text: 'FÖRDELAR', sub: 'ENLIGT FÖRESPRÅKARNA', at: loc(2, A.forespraks), size: 190},
      {t: 'checklist', rows: [
        {text: 'VALFRIHET', state: 'yes', at: loc(2, A.valfrihet)},
        {text: 'HÖGRE KVALITET', sub: 'GENOM KONKURRENS', state: 'yes', at: loc(2, A.kvaliteten)},
        {text: 'AVLASTAR KOMMUNERNA', state: 'yes', at: loc(2, A.avlastar)},
      ]},
    ]},
  },
  {
    key: 'emot', from: starts[3], duration: dur(3), source: 'KÄLLA: KRITIKERNA', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'KRITIKEN', sub: 'ENLIGT KRITIKERNA', at: loc(3, A.kritiker), size: 190},
      {t: 'checklist', rows: [
        {text: 'BETYGSINFLATION', state: 'no', at: loc(3, A.betygsinflation)},
        {text: 'STÖRRE SEGREGATION', state: 'no', at: loc(3, A.segregation)},
        {text: 'PENGAR TILL AKTIEÄGARE', sub: 'ISTÄLLET FÖR FLER LÄRARE', state: 'no', at: loc(3, A.skattepengar)},
      ]},
    ]},
  },
  {
    key: 'riksdag', from: starts[4], duration: dur(4), source: 'KÄLLA: RIKSDAGEN • OPINIONSMÄTNINGAR', chrome: true,
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'cards', cards: [
        {kicker: 'EN STOR MAJORITET AV VÄLJARNA', title: 'Vill begränsa vinster', at: loc(4, A.majoritet), tag: 'MÄTNING EFTER MÄTNING'},
        {kicker: 'RIKSDAGEN', title: 'Har inte enats', at: loc(4, A.riksdagen), tag: 'LAGEN ÄR OFÖRÄNDRAD'},
      ]},
    ]},
  },
  {
    key: 'fraga', from: starts[5], duration: dur(5), source: 'KÄLLA: RIKSDAGEN', chrome: true,
    body: {type: 'binary', question: 'Förbjuda vinster i skolan?', questionAt: loc(5, A.dags), options: ['FÖRBJUD', 'SOM DET ÄR'],
      optionsAt: loc(5, A.forbjuda - 0.2), switchAt: loc(5, A.eller, 0), save: {text: 'SPARA', at: loc(5, A.bast + 0.8)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['1992', 'SKOLPENG', 'KRITIK', 'FÖRBUD?'],
  unlockAt: [starts[1] + 12, gf(A.pengarna), gf(A.kritiker), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.enda)), 'thud', 0.9);
add(L(0, loc(0, A.privata)), 'pop', 0.9);
add(L(0, loc(0, A.obegransad)), 'pop', 0.9);
add(L(0, loc(0, A.skattefin)), 'pop', 0.9);
add(L(1, loc(1, A.n1992)), 'thud', 0.8);
add(L(1, loc(1, A.skolval)), 'pop_hi', 0.9);
add(L(1, loc(1, A.skolpeng)), 'pop_hi', 0.9);
add(L(1, loc(1, A.pengarna)), 'pop_hi', 0.9);
add(L(1, loc(1, A.kommunen)), 'pop_hi', 0.9);
add(L(1, loc(1, A.pengarna)), 'swish', 1);
add(L(2, loc(2, A.forespraks)), 'thud', 0.8);
add(L(2, loc(2, A.valfrihet)), 'chime', 0.7);
add(L(2, loc(2, A.kvaliteten)), 'chime', 0.7);
add(L(2, loc(2, A.avlastar)), 'chime', 0.7);
add(L(3, loc(3, A.kritiker)), 'thud', 0.8);
add(L(3, loc(3, A.betygsinflation)), 'err', 0.9);
add(L(3, loc(3, A.segregation)), 'err', 0.9);
add(L(3, loc(3, A.skattepengar)), 'err', 0.9);
add(L(4, loc(4, A.majoritet)), 'pop', 1);
add(L(4, loc(4, A.riksdagen)), 'pop', 1);
add(L(5, loc(5, A.dags)), 'whoosh', 0.8);
add(L(5, loc(5, A.forbjuda)), 'pop_hi', 1);
add(L(5, loc(5, A.eller)), 'flip', 1);
sfx.sort((a, b) => a.at - b.at);

export const fs1: Episode2 = {
  meta: {id: 'sverige-friskolor', tag: 'SVERIGE • FRISKOLOR', fps: FPS, width: 1080, height: 1920},
  audioFile: 'fs1.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const fs1Duration = total;
