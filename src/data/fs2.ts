import {fs2Timing as T} from './timing.fs.generated';
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
      {t: 'bigtext', text: '800 000', sub: 'PERSONER I BOSTADSKÖ · STOCKHOLM', at: loc(0, A.n800), size: 210},
      {t: 'cards', cards: [{kicker: 'HYRESRÄTT I INNERSTAN', title: '15–20 års väntan', at: loc(0, A.hyresratt), tag: 'KÖTID'}]},
      {t: 'bigtext', text: 'SÖNDER', sub: 'SYSTEMET HAR GÅTT SÖNDER', at: loc(0, A.sonder), size: 150},
    ]},
  },
  {
    key: 'bruksvarde', from: starts[1], duration: dur(1), source: 'KÄLLA: HYRESGÄSTFÖRENINGEN • RIKSDAGEN', chrome: true,
    body: {type: 'stack', gap: 30, widgets: [
      {t: 'bigtext', text: 'INTE UTBUD', sub: 'OCH EFTERFRÅGAN', at: loc(1, A.hyrorna), size: 150},
      {t: 'fusion', height: 620,
        inputs: [{label: 'HYRESGÄSTF.', at: loc(1, A.hyresgast)}, {label: 'FASTIGHETSÄG.', at: loc(1, A.fastighets)}],
        hub: {label: 'HYRAN', at: loc(1, A.bruksvarde)}, linksAt: loc(1, A.hyresgast + 0.3),
        outputs: [{label: 'BRUKSVÄRDE', at: loc(1, A.bruksvarde)}],
        footnote: {text: 'FÖRHANDLAS · INTE UTBUD OCH EFTERFRÅGAN', at: loc(1, A.forhandlar)}},
    ]},
  },
  {
    key: 'kontrakt', from: starts[2], duration: dur(2), source: 'KÄLLA: HYRESGÄSTFÖRENINGEN • RIKSDAGEN', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'BAKSIDAN', sub: 'NÄSTAN INGEN FLYTTAR', at: loc(2, A.baksidan), size: 170},
      {t: 'versus',
        left: {title: 'MED KONTRAKT', tone: 'green', at: loc(2, A.nere - 0.6), rows: [{text: 'Låg hyra', at: loc(2, A.nere)}, {text: 'Ingen flyttar', at: loc(2, A.flyttar)}]},
        right: {title: 'UTAN KONTRAKT', tone: 'red', at: loc(2, A.byggs - 0.4), rows: [{text: 'För få nya hyresrätter', at: loc(2, A.hyresratter - 0.6)}]}},
    ]},
  },
  {
    key: 'obalans', from: starts[3], duration: dur(3), source: 'KÄLLA: BOSTADSMARKNADEN', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'OBALANS', sub: 'EN MARKNAD UTAN BALANS', at: loc(3, A.obalans - 0.4), size: 170},
      {t: 'columns3', cols: [
        {title: 'KÖ', text: '20 års kötid', tone: 'ink', at: loc(3, A.kotid)},
        {title: 'ANDRAHAND', text: 'Dyr andrahandsmarknad', tone: 'blue', at: loc(3, A.andrahand)},
        {title: 'SVARTMARKNAD', text: 'Kontrakt för hundratusentals kronor', tone: 'red', at: loc(3, A.svartmarknad)},
      ]},
    ]},
  },
  {
    key: 'dynamit', from: starts[4], duration: dur(4), source: 'KÄLLA: RIKSDAGEN • MEDIERNA', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'DYNAMIT', sub: 'POLITISKT', at: loc(4, A.dynamit - 0.2), size: 210},
      {t: 'timeline', nodes: [
        {label: 'MARKNADSHYROR', sub: 'EKONOMERNAS FÖRSLAG', at: loc(4, A.marknadshyror), tone: 'blue'},
        {label: '2021', sub: 'REGERINGEN FALLER', at: loc(4, A.n2021), tone: 'red'},
      ]},
    ]},
  },
  {
    key: 'fraga', from: starts[5], duration: dur(5), source: 'KÄLLA: RIKSDAGEN', chrome: true,
    body: {type: 'binary', question: 'Vad är minst dåligt?', questionAt: loc(5, A.minst), options: ['20 ÅRS KÖ', 'HÖGRE HYROR'],
      optionsAt: loc(5, A.kotid6 - 0.2), switchAt: loc(5, A.hogre - 0.1, 0), save: {text: 'SPARA', at: loc(5, A.hyrorEnd)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['800 000', 'BRUKSVÄRDE', 'OBALANS', 'VAL?'],
  unlockAt: [starts[1] + 12, gf(A.bruksvarde), gf(A.obalans), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.n800)), 'thud', 0.9);
add(L(0, loc(0, A.hyresratt)), 'pop', 0.9);
add(L(0, loc(0, A.sonder)), 'thud', 0.7);
add(L(1, loc(1, A.hyrorna)), 'thud', 0.8);
add(L(1, loc(1, A.hyresgast)), 'pop_hi', 0.9);
add(L(1, loc(1, A.fastighets)), 'pop_hi', 0.9);
add(L(1, loc(1, A.hyresgast)), 'swish', 1);
add(L(1, loc(1, A.bruksvarde)), 'pop', 0.9);
add(L(2, loc(2, A.baksidan)), 'thud', 0.8);
add(L(2, loc(2, A.nere)), 'pop', 0.9);
add(L(2, loc(2, A.flyttar)), 'pop', 0.9);
add(L(2, loc(2, A.byggs)), 'err', 0.9);
add(L(3, loc(3, A.obalans)), 'thud', 0.8);
add(L(3, loc(3, A.kotid)), 'pop_hi', 0.9);
add(L(3, loc(3, A.andrahand)), 'pop_hi', 0.9);
add(L(3, loc(3, A.svartmarknad)), 'err', 0.9);
add(L(4, loc(4, A.dynamit)), 'thud', 0.8);
add(L(4, loc(4, A.marknadshyror)), 'pop', 0.9);
add(L(4, loc(4, A.n2021)), 'warn', 0.8);
add(L(5, loc(5, A.minst)), 'whoosh', 0.8);
add(L(5, loc(5, A.kotid6)), 'pop_hi', 1);
add(L(5, loc(5, A.hogre)), 'flip', 1);
sfx.sort((a, b) => a.at - b.at);

export const fs2: Episode2 = {
  meta: {id: 'sverige-bostadsko', tag: 'SVERIGE • BOSTADSKÖN', fps: FPS, width: 1080, height: 1920},
  audioFile: 'fs2.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const fs2Duration = total;
