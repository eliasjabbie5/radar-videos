import {val2Timing as T} from './timing.val.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.3;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
// [0]hook [1]red lines [2]total packages [3]strategy [4]cliff
const startSecs = [T.sceneStarts[0], T.sceneStarts[1], T.sceneStarts[2], T.sceneStarts[3], T.sceneStarts[4]];
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
      gap: 26,
      widgets: [
        {t: 'bigtext', text: 'REGERING?', sub: 'SAKNAS FORTFARANDE', at: loc(0, A.saknar - 0.3), size: 140},
        {
          t: 'fusion',
          height: 640,
          inputs: [
            {label: 'SOCIALDEM.', at: loc(0, A.saknar)},
            {label: 'MODERATERNA', at: loc(0, A.regering + 0.4)},
            {label: 'VÄNSTERP.', at: loc(0, A.regering + 0.9)},
            {label: 'MILJÖP.', at: loc(0, A.regering + 1.4)},
          ],
          hub: {label: 'CENTERN', at: loc(0, A.cp - 0.4)},
          linksAt: loc(0, A.pilar),
          outputs: [{label: 'REGERING?', at: loc(0, A.cp), dashed: true}],
          footnote: {text: 'ALLA PILAR PEKAR MOT ETT PARTI', at: loc(0, A.parti)},
        },
      ],
    },
  },
  {
    key: 'linjer',
    from: starts[1],
    duration: dur(1),
    source: 'KÄLLA: CENTERPARTIET • PARTIERNAS UTTALANDEN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {t: 'cards', cards: [{kicker: 'CENTERPARTIETS LEDARE', title: 'Thand Ringqvist', at: loc(1, A.partiledaren), tag: 'TVÅ STENHÅRDA RÖDA LINJER'}]},
        {
          t: 'checklist',
          rows: [
            {text: 'INGEN REGERING MED SD', sub: 'RÖD LINJE 1', state: 'no', at: loc(1, A.vagrar)},
            {text: 'INGA V-MINISTRAR', sub: 'RÖD LINJE 2', state: 'no', at: loc(1, A.nej)},
          ],
        },
      ],
    },
  },
  {
    key: 'totalpaket',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: CENTERPARTIET • PARTIERNAS UTTALANDEN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {
          t: 'timeline',
          nodes: [
            {label: 'BÖRJAN NOV', sub: 'KRAV PÅ TOTALPAKET', at: loc(2, A.borjan)},
            {label: '15 NOV', sub: 'VÄLJER S FÖRSLAG', at: loc(2, A.n15), tone: 'blue'},
          ],
          chips: [
            {text: 'ULF KRISTERSSON', at: loc(2, A.kristersson)},
            {text: 'MAGDALENA ANDERSSON', at: loc(2, A.andersson)},
            {text: 'FÄRDIGA TOTALPAKET', at: loc(2, A.totalpaket), tone: 'muted'},
          ],
        },
        {t: 'bigtext', text: '15 NOV', sub: 'CENTERN GÅR VIDARE MED S FÖRSLAG', at: loc(2, A.n15), size: 180},
      ],
    },
  },
  {
    key: 'strategi',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: CENTERPARTIET • KRITIKER',
    chrome: true,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {
          t: 'versus',
          left: {title: 'CENTERPARTIET', tone: 'blue', at: loc(3, A.enligt), rows: [{text: 'Bred och stabil mittenpolitik', at: loc(3, A.mitten - 0.7)}]},
          right: {title: 'KRITIKER', tone: 'red', at: loc(3, A.kritiker), rows: [{text: 'Dubbla krav gör det omöjligt', at: loc(3, A.omojlig - 0.7)}]},
        },
        {t: 'bigtext', text: '2 KRAV', sub: 'INGEN SD · INGEN V I REGERINGEN', at: loc(3, A.kritiker + 0.9), size: 170},
      ],
    },
  },
  {
    key: 'cliff',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: PARTIERNAS UTTALANDEN',
    chrome: false,
    body: {type: 'cliff', pulseAt: 0, card: {title: 'DEL 3 · KROCKEN', sub: 'NÄSTA VIDEO', at: loc(4, A.nasta)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['CENTERN', '2 LINJER', '15 NOV', 'V-KROCKEN?'],
  unlockAt: [starts[1] + 12, gf(A.regeringen), gf(A.n15), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
// hook
add(10, 'pop');
[A.saknar, A.regering + 0.4, A.regering + 0.9, A.regering + 1.4].forEach((a) => add(L(0, loc(0, a)), 'pop_hi', 0.9));
add(L(0, loc(0, A.pilar)), 'swish');
add(L(0, loc(0, A.cp - 0.4)), 'thud', 0.8);
add(L(0, loc(0, A.cp)), 'warn', 0.8);
// red lines
add(L(1, loc(1, A.partiledaren)), 'pop');
add(L(1, loc(1, A.vagrar)), 'err', 0.9);
add(L(1, loc(1, A.nej)), 'err', 0.9);
// total packages
add(L(2, loc(2, A.borjan)), 'pop');
[A.kristersson, A.andersson, A.totalpaket].forEach((a) => add(L(2, loc(2, a)), 'pop_hi', 0.9));
add(L(2, loc(2, A.n15)), 'pop');
add(L(2, loc(2, A.n15)), 'thud', 0.8);
// strategy
add(L(3, loc(3, A.enligt)), 'pop');
add(L(3, loc(3, A.kritiker)), 'pop');
add(L(3, loc(3, A.kritiker + 0.9)), 'thud', 0.7);
// cliff
add(L(4, loc(4, A.nasta)), 'pop_hi');
add(L(4, loc(4, A.nasta)) + 8, 'lock');
sfx.sort((a, b) => a.at - b.at);

export const val2: Episode2 = {
  meta: {id: 'valet-del-2', tag: 'VALET 2026 • DEL 2/4', fps: FPS, width: 1080, height: 1920},
  audioFile: 'val2.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const val2Duration = total;
