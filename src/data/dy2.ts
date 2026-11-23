import {dy2Timing as T} from './timing.dy.generated';
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
      {t: 'bigtext', text: '10 SEK', sub: 'SÅ SNABBT HITTAR VEM SOM HELST ALLT OM DIG', at: loc(0, A.tio), size: 220},
      {t: 'versus',
        left: {title: 'DE FLESTA LÄNDER', tone: 'blue', at: loc(0, A.flesta), rows: [{text: 'Adress, ålder och inkomst är privat', at: loc(0, A.hemadress)}]},
        right: {title: 'SVERIGE', tone: 'ink', at: loc(0, A.sverige), rows: [{text: 'Googla fram allt på tio sekunder', at: loc(0, A.googla)}]}},
    ]},
  },
  {
    key: 'princip', from: starts[1], duration: dur(1), source: 'KÄLLA: TRYCKFRIHETSFÖRORDNINGEN', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: '1766', sub: 'OFFENTLIGHETSPRINCIPEN', at: loc(1, A.n1766), size: 220},
      {t: 'timeline', nodes: [
        {label: '1766', sub: 'SVENSK GRUNDLAG', at: loc(1, A.n1766)},
        {label: 'RÄTT ATT SE', sub: 'MYNDIGHETERNAS HANDLINGAR', at: loc(1, A.medborgare), tone: 'blue'},
        {label: 'SYFTE', sub: 'GRANSKA MAKTEN · STOPPA KORRUPTION', at: loc(1, A.granska), tone: 'green'},
      ]},
    ]},
  },
  {
    key: 'sajter', from: starts[2], duration: dur(2), source: 'KÄLLA: INTEGRITETSSKYDDSMYNDIGHETEN • MEDIERNA', chrome: true,
    body: {type: 'stack', gap: 30, widgets: [
      {t: 'fusion', height: 560,
        inputs: [{label: 'REGISTER', at: loc(2, A.dammsuga)}, {label: 'UTGIVNINGSB.', at: loc(2, A.utgivningsbevis)}],
        hub: {label: 'SAJTER', at: loc(2, A.mrkoll)}, linksAt: loc(2, A.utgivningsbevis),
        outputs: [{label: 'ONLINE', at: loc(2, A.natet - 0.4)}],
        footnote: {text: 'MRKOLL · RATSIT', at: loc(2, A.mrkoll)}},
      {t: 'checklist', rows: [
        {text: 'LÄTT FÖR BEDRAGARE', sub: 'ATT HITTA RÄTT DÖRR', state: 'no', at: loc(2, A.bedragare)},
        {text: 'LÄTT FÖR KRIMINELLA', state: 'no', at: loc(2, A.kriminella)},
      ]},
    ]},
  },
  {
    key: 'krock', from: starts[3], duration: dur(3), source: 'KÄLLA: REGERINGEN • EU', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'KROCK', sub: 'GAMMAL LAG MOT NY INTEGRITET', at: loc(3, A.krockar), size: 220},
      {t: 'versus',
        left: {title: 'SVENSK GRUNDLAG', tone: 'ink', at: loc(3, A.krockar - 0.2), rows: [{text: 'Offentlighetsprincipen', at: loc(3, A.krockar)}]},
        right: {title: 'EU', tone: 'blue', at: loc(3, A.integritetsregler - 0.6), rows: [{text: 'Hårda integritetsregler', at: loc(3, A.integritetsregler - 0.3)}]},
        stamp: {text: 'REGERINGEN VILL STRAMA ÅT', at: loc(3, A.sajterna)}},
    ]},
  },
  {
    key: 'fraga', from: starts[4], duration: dur(4), source: 'KÄLLA: REGERINGEN', chrome: true,
    body: {type: 'binary', question: 'Låsa in personuppgifterna?', questionAt: loc(4, A.borde), options: ['LÅS IN', 'ÖPPENHET'],
      optionsAt: loc(4, A.laser - 0.2), switchAt: loc(4, A.eller, 0), save: {text: 'SPARA', at: loc(4, A.prisetEnd)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['10 SEKUNDER', '1766', 'SAJTERNA', 'LÅSA IN?'],
  unlockAt: [starts[1] + 12, gf(A.n1766), gf(A.mrkoll), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.tio)), 'thud', 0.9);
add(L(0, loc(0, A.flesta)), 'pop', 0.9);
add(L(0, loc(0, A.sverige)), 'pop', 0.9);
add(L(0, loc(0, A.googla)), 'warn', 0.8);
add(L(1, loc(1, A.n1766)), 'thud', 0.8);
add(L(1, loc(1, A.medborgare)), 'pop', 0.9);
add(L(1, loc(1, A.granska)), 'pop', 0.9);
add(L(2, loc(2, A.dammsuga)), 'pop_hi', 0.9);
add(L(2, loc(2, A.utgivningsbevis)), 'pop_hi', 0.9);
add(L(2, loc(2, A.utgivningsbevis)), 'swish', 1);
add(L(2, loc(2, A.mrkoll)), 'thud', 0.8);
add(L(2, loc(2, A.bedragare)), 'err', 0.9);
add(L(2, loc(2, A.kriminella)), 'err', 0.9);
add(L(3, loc(3, A.krockar)), 'thud', 0.8);
add(L(3, loc(3, A.integritetsregler)), 'pop', 0.9);
add(L(3, loc(3, A.sajterna)), 'stamp', 1);
add(L(4, loc(4, A.borde)), 'whoosh', 0.8);
add(L(4, loc(4, A.laser)), 'pop_hi', 1);
add(L(4, loc(4, A.eller)), 'flip', 1);
sfx.sort((a, b) => a.at - b.at);

export const dy2: Episode2 = {
  meta: {id: 'sverige-offentlighet', tag: 'SVERIGE • PERSONUPPGIFTER', fps: FPS, width: 1080, height: 1920},
  audioFile: 'dy2.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const dy2Duration = total;
