import {sv3Timing as T} from './timing.sv.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.5;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
// [0]hook [1]1992 [2]investors [3]exporters vs households [4]euro waiting room [5]question
const startSecs = [T.sceneStarts[0], T.sceneStarts[1], T.sceneStarts[2], T.sceneStarts[3], T.sceneStarts[4], T.sceneStarts[5]];
const starts = startSecs.map((s) => Math.round(s * FPS));
const gf = (sec: number) => Math.round(sec * FPS);
const loc = (i: number, sec: number, lead = 3) => Math.max(0, Math.round(sec * FPS) - starts[i] - lead);
const dur = (i: number) => (i + 1 < starts.length ? starts[i + 1] : total) - starts[i];

const scenes: Scene2[] = [
  {
    key: 'hook',
    from: starts[0],
    duration: dur(0),
    source: null,
    chrome: false,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {t: 'cards', cards: [{kicker: 'SEMESTER I EUROPA', title: 'Brutalt dyrt', at: loc(0, A.brutalt), tag: 'DE SENASTE ÅREN'}]},
        {
          t: 'versus',
          left: {title: 'PRISERNA', tone: 'ink', at: loc(0, A.priserna - 0.2), rows: [{text: 'Har stigit', at: loc(0, A.priserna)}]},
          right: {title: 'KRONAN', tone: 'red', at: loc(0, A.kronan - 0.4), rows: [{text: 'Har tappat kraft', at: loc(0, A.tappat - 0.3)}]},
        },
        {t: 'bigtext', text: 'KRONAN', sub: 'HAR TAPPAT KRAFT', at: loc(0, A.kronan), size: 210},
      ],
    },
  },
  {
    key: 'rorlig',
    from: starts[1],
    duration: dur(1),
    source: 'KÄLLA: RIKSBANKEN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 36,
      widgets: [
        {t: 'bigtext', text: '1992', sub: 'SVERIGE FÅR RÖRLIG VÄXELKURS', at: loc(1, A.n1992), size: 220},
        {
          t: 'columns3',
          cols: [
            {title: '1992', text: 'Rörlig växelkurs', tone: 'blue', at: loc(1, A.rorlig)},
            {title: 'LITEN', text: 'En liten valuta', tone: 'ink', at: loc(1, A.liten)},
            {title: 'EXPORT', text: 'Ett litet exportberoende land', tone: 'ink', at: loc(1, A.export)},
          ],
        },
      ],
    },
  },
  {
    key: 'investerare',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: RIKSBANKEN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 38,
      widgets: [
        {t: 'bigtext', text: 'SÄLJER', sub: 'INTERNATIONELLA INVESTERARE', at: loc(2, A.investerare), size: 190},
        {
          t: 'versus',
          left: {title: 'SMÅ VALUTOR', tone: 'red', at: loc(2, A.saljer), rows: [{text: 'Kronan', at: loc(2, A.valutor)}, {text: 'Säljs av investerare', at: loc(2, A.valutor + 0.4)}]},
          right: {title: 'JÄTTAR', tone: 'blue', at: loc(2, A.flyttar), rows: [{text: 'Dollarn', at: loc(2, A.dollarn)}, {text: 'Euron', at: loc(2, A.euron - 0.1)}]},
          stamp: {text: 'OROLIGT I VÄRLDEN', at: loc(2, A.oroligt + 0.2)},
        },
      ],
    },
  },
  {
    key: 'exportHushall',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: RIKSBANKEN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 36,
      widgets: [
        {t: 'bigtext', text: 'SVAG KRONA', sub: 'BRA FÖR EXPORT · DYRT FÖR HUSHÅLL', at: loc(3, A.svag), size: 150},
        {
          t: 'versus',
          left: {
            title: 'EXPORTFÖRETAG',
            tone: 'green',
            at: loc(3, A.exportforetag),
            rows: [{text: 'Ofta bra', at: loc(3, A.svag + 0.2)}, {text: 'Varor billigare utomlands', at: loc(3, A.billigare)}],
          },
          right: {
            title: 'HUSHÅLL',
            tone: 'red',
            at: loc(3, A.hushall - 0.3),
            rows: [{text: 'Dyrare resor', at: loc(3, A.resor)}, {text: 'Dyrare teknik', at: loc(3, A.teknik)}, {text: 'Dyrare mat', at: loc(3, A.mat - 0.5)}],
          },
        },
      ],
    },
  },
  {
    key: 'euro',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: RIKSDAGEN • RIKSBANKEN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 38,
      widgets: [
        {
          t: 'timeline',
          nodes: [
            {label: 'EU-AVTAL', sub: 'SKRIVIT UNDER: EURON EN DAG', at: loc(4, A.egentligen)},
            {label: '2003', sub: 'FOLKOMRÖSTNING', at: loc(4, A.n2003), tone: 'blue'},
            {label: 'IDAG', sub: 'FORTFARANDE UTANFÖR', at: loc(4, A.utanfor), tone: 'red'},
          ],
        },
        {t: 'checklist', rows: [{text: 'POLITIKERNA LÅTER BLI', sub: 'ATT GÅ MED I EURO-VÄNTRUMMET', state: 'no', at: loc(4, A.vantrum - 1.4)}]},
      ],
    },
  },
  {
    key: 'fraga',
    from: starts[5],
    duration: dur(5),
    source: 'KÄLLA: RIKSBANKEN',
    chrome: true,
    body: {
      type: 'binary',
      question: 'Euro eller krona?',
      questionAt: loc(5, A.fragan),
      options: ['EURO', 'KRONA'],
      optionsAt: loc(5, A.svag6),
      switchAt: loc(5, A.euron6 - 0.1, 0),
      save: {text: 'SPARA', at: loc(5, A.euron6End)},
    },
  },
];

const chain: Episode2['chain'] = {
  labels: ['1992', 'SÄLJS', 'DYRARE', 'EURO?'],
  unlockAt: [gf(A.n1992), gf(A.saljer), gf(A.resor), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.brutalt)), 'pop');
add(L(0, loc(0, A.priserna)), 'pop');
add(L(0, loc(0, A.tappat - 0.3)), 'err', 0.9);
add(L(0, loc(0, A.kronan)), 'thud', 0.8);
add(L(1, loc(1, A.n1992)), 'thud', 0.8);
[A.rorlig, A.liten, A.export].forEach((a) => add(L(1, loc(1, a)), 'pop'));
add(L(2, loc(2, A.investerare)), 'thud', 0.8);
add(L(2, loc(2, A.oroligt + 0.2)), 'warn', 0.8);
[A.saljer, A.flyttar].forEach((a) => add(L(2, loc(2, a)), 'pop'));
[A.valutor, A.dollarn, A.euron - 0.1].forEach((a) => add(L(2, loc(2, a)), 'pop_hi', 0.9));
add(L(3, loc(3, A.svag)), 'thud', 0.8);
[A.exportforetag, A.billigare].forEach((a) => add(L(3, loc(3, a)), 'chime', 0.7));
[A.resor, A.teknik, A.mat - 0.5].forEach((a) => add(L(3, loc(3, a)), 'err', 0.8));
[A.egentligen, A.n2003].forEach((a) => add(L(4, loc(4, a)), 'pop'));
add(L(4, loc(4, A.utanfor)), 'warn', 0.8);
add(L(4, loc(4, A.vantrum - 1.4)), 'err', 0.9);
add(L(5, loc(5, A.fragan)), 'whoosh', 0.8);
add(L(5, loc(5, A.svag6)), 'pop_hi');
add(L(5, loc(5, A.svag6)) + 6, 'pop_hi', 0.9);
add(L(5, loc(5, A.euron6 - 0.1, 0)), 'flip');
add(L(5, loc(5, A.euron6End)), 'pop');
sfx.sort((a, b) => a.at - b.at);

export const sv3: Episode2 = {
  meta: {id: 'sverige-kronan', tag: 'SVERIGE • KRONAN', fps: FPS, width: 1080, height: 1920},
  audioFile: 'sv3.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const sv3Duration = total;
