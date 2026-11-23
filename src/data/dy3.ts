import {dy3Timing as T} from './timing.dy.generated';
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
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'ALLT YNGRE', sub: 'TONÅRINGAR UTFÖR DE GRÖVSTA BROTTEN', at: loc(0, A.yngre), size: 170},
      {t: 'cards', cards: [{kicker: 'SVARET LIGGER I', title: 'Hur lagen straffar unga', at: loc(0, A.svaret), tag: 'SVENSK STRAFFRÄTT'}]},
    ]},
  },
  {
    key: 'rabatt', from: starts[1], duration: dur(1), source: 'KÄLLA: BRÅ • REGERINGEN', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'RABATT', sub: 'UNGDOMSRABATT I DECENNIER', at: loc(1, A.decennier), size: 220},
      {t: 'checklist', rows: [
        {text: 'INTE FÄRDIGUTVECKLADE HJÄRNOR', sub: 'TANKEN BAKOM RABATTEN', state: 'unknown', at: loc(1, A.hjarnor)},
        {text: 'LÅNGA STRAFF → YRKESKRIMINELLA', sub: 'TANKEN BAKOM RABATTEN', state: 'unknown', at: loc(1, A.langa)},
      ]},
    ]},
  },
  {
    key: 'straff', from: starts[2], duration: dur(2), source: 'KÄLLA: BRÅ • REGERINGEN', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'cards', cards: [{kicker: 'UNDER 18 ÅR', title: 'Sluten ungdomsvård', at: loc(2, A.n18), tag: 'OFTAST BARA NÅGRA FÅ ÅR'}]},
      {t: 'bigtext', text: 'ÄVEN VID MORD', sub: 'KRAFTIGT SÄNKTA STRAFF', at: loc(2, A.mord - 0.6), size: 130},
    ]},
  },
  {
    key: 'gangen', from: starts[3], duration: dur(3), source: 'KÄLLA: POLISEN • BRÅ', chrome: true,
    body: {type: 'stack', gap: 30, widgets: [
      {t: 'bigtext', text: 'LUCKAN', sub: 'GÄNGEN SÅG SVAGHETEN I SYSTEMET', at: loc(3, A.luckan), size: 170},
      {t: 'fusion', height: 560,
        inputs: [{label: 'ÄLDRE LEDARE', at: loc(3, A.rekrytera)}, {label: 'KRYPT. APPAR', at: loc(3, A.appar)}],
        hub: {label: '14–15 ÅR', at: loc(3, A.n14)}, linksAt: loc(3, A.appar),
        outputs: [{label: 'BROTT', at: loc(3, A.ledare), dashed: true}],
        footnote: {text: 'MINIMAL RISK FÖR LEDARNA', at: loc(3, A.risk)}},
    ]},
  },
  {
    key: 'skarps', from: starts[4], duration: dur(4), source: 'KÄLLA: REGERINGEN', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'SKÄRPS', sub: 'STEG FÖR STEG', at: loc(4, A.skarps), size: 220},
      {t: 'checklist', rows: [
        {text: 'SLOPAD STRAFFRABATT', sub: 'FÖR UNGA VUXNA', state: 'yes', at: loc(4, A.slopad)},
        {text: 'NYA UNGDOMSFÄNGELSER', sub: 'PÅ VÄG', state: 'unknown', at: loc(4, A.ungdomsfangelser)},
      ]},
    ]},
  },
  {
    key: 'fraga', from: starts[5], duration: dur(5), source: 'KÄLLA: REGERINGEN', chrome: true,
    body: {type: 'binary', question: 'Hårdare straff eller annat?', questionAt: loc(5, A.ar), options: ['HÅRDARE', 'NÅGOT ANNAT'],
      optionsAt: loc(5, A.hardare - 0.2), switchAt: loc(5, A.eller, 0), save: {text: 'SPARA', at: loc(5, A.nyEnd)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['RABATT', 'LUCKAN', 'SKÄRPS', 'RÄTT VÄG?'],
  unlockAt: [gf(A.ungdomsrabatt), gf(A.luckan), gf(A.skarps), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.yngre)), 'thud', 0.9);
add(L(0, loc(0, A.svaret)), 'pop', 0.9);
add(L(1, loc(1, A.decennier)), 'thud', 0.8);
add(L(1, loc(1, A.hjarnor)), 'pop', 0.9);
add(L(1, loc(1, A.langa)), 'pop', 0.9);
add(L(2, loc(2, A.n18)), 'pop', 0.9);
add(L(2, loc(2, A.mord)), 'thud', 0.8);
add(L(3, loc(3, A.luckan)), 'thud', 0.8);
add(L(3, loc(3, A.rekrytera)), 'pop_hi', 0.9);
add(L(3, loc(3, A.appar)), 'pop_hi', 0.9);
add(L(3, loc(3, A.n14)), 'pop_hi', 0.9);
add(L(3, loc(3, A.appar)), 'swish', 1);
add(L(3, loc(3, A.risk)), 'warn', 0.8);
add(L(4, loc(4, A.skarps)), 'thud', 0.8);
add(L(4, loc(4, A.slopad)), 'chime', 0.7);
add(L(4, loc(4, A.ungdomsfangelser)), 'pop', 0.9);
add(L(5, loc(5, A.ar)), 'whoosh', 0.8);
add(L(5, loc(5, A.hardare)), 'pop_hi', 1);
add(L(5, loc(5, A.eller)), 'flip', 1);
sfx.sort((a, b) => a.at - b.at);

export const dy3: Episode2 = {
  meta: {id: 'sverige-ungdomsrabatt', tag: 'SVERIGE • UNGA OCH GÄNG', fps: FPS, width: 1080, height: 1920},
  audioFile: 'dy3.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const dy3Duration = total;
