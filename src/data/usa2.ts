import {usa2Timing as T} from './timing.usa.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.4;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
// [0]hook [1]house [2]npr [3]senate [4]turnout [5]trump [6]question
const startSecs = [T.sceneStarts[0], T.sceneStarts[1], A.npr - 0.4, T.sceneStarts[2], T.sceneStarts[3], T.sceneStarts[4], T.sceneStarts[5]];
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
      gap: 40,
      widgets: [
        {t: 'bigtext', text: 'TEXAS', sub: '1994 → 2026', at: 4, size: 240},
        {
          t: 'timeline',
          nodes: [
            {label: '1994', sub: 'SENAST DEMOKRATERNA VANN', at: loc(0, A.n1994)},
            {label: '2026', sub: 'DEMOKRATERNA VINNER', at: loc(0, A.vann), tone: 'blue'},
          ],
          stamp: {text: 'FÖRSTA SEDAN 1994', at: loc(0, A.texas)},
        },
      ],
    },
  },
  {
    key: 'huset',
    from: starts[1],
    duration: dur(1),
    source: 'KÄLLA: NPR • YAHOO NEWS',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {
          t: 'dots',
          title: 'REPRESENTANTHUSET · 435 PLATSER',
          at: loc(1, A.begynnelse),
          total: 435,
          cols: 29,
          size: 22,
          gap: 8,
          groups: [
            {label: 'DEMOKRATER FÖRE', n: 215, tone: 'blue', at: loc(1, A.natten + 0.4), dur: 30},
            {label: 'NYA PLATSER', n: 45, tone: 'green', at: loc(1, A.n260), dur: 34},
            {label: 'REPUBLIKANER', n: 175, tone: 'ink', at: loc(1, A.n260 + 0.4), dur: 30},
          ],
          mark: {index: 217, label: 'MAJORITET = 218', at: loc(1, A.huset)},
        },
        {t: 'bigtext', text: 'UPP TILL 260', sub: 'SISTA LOPPEN INTE AVGJORDA', at: loc(1, A.n260), size: 120},
      ],
    },
  },
  {
    key: 'npr',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: NPR',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {
          t: 'cards',
          cards: [
            {kicker: 'ENLIGT NPR', title: 'Största segern för något parti', at: loc(2, A.npr)},
            {kicker: 'SENAST SÅ STORT', title: 'För 50 år sedan', at: loc(2, A.n50 - 0.2)},
          ],
        },
      ],
    },
  },
  {
    key: 'senaten',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: NPR • YAHOO NEWS',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {
          t: 'dots',
          title: 'SENATEN · 100 PLATSER',
          at: loc(3, A.senaten),
          total: 100,
          cols: 20,
          size: 36,
          gap: 8,
          groups: [
            {label: 'DEMOKRATER FÖRE', n: 47, tone: 'blue', at: loc(3, A.senaten + 0.3), dur: 24},
            {label: 'VÄNDA', n: 9, tone: 'green', at: loc(3, A.nio), dur: 24},
            {label: 'REPUBLIKANER', n: 44, tone: 'ink', at: loc(3, A.nio + 0.4), dur: 26},
          ],
        },
        {
          t: 'columns3',
          cols: [
            {title: 'OHIO', text: 'Vände till demokraterna', tone: 'green', at: loc(3, A.ohio)},
            {title: 'IOWA', text: 'Vände till demokraterna', tone: 'green', at: loc(3, A.iowa)},
            {title: 'N. CAROLINA', text: 'Vände till demokraterna', tone: 'green', at: loc(3, A.carolina - 0.3)},
          ],
        },
      ],
    },
  },
  {
    key: 'valdeltagande',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: CFR',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {t: 'counter', label: 'MILJONER RÖSTADE', to: 123, at: loc(4, A.n123), dur: 40, tone: 'ink'},
        {
          t: 'cards',
          cards: [
            {
              kicker: 'ENLIGT PRELIMINÄRA SIFFROR',
              title: 'Näst högsta sedan 1914',
              at: loc(4, A.valdeltagandet),
              tag: 'MELLANÅRSVAL · PRELIMINÄRT',
            },
          ],
        },
      ],
    },
  },
  {
    key: 'trump',
    from: starts[5],
    duration: dur(5),
    source: 'KÄLLA: NPR • CNBC',
    chrome: true,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {
          t: 'versus',
          left: {title: 'TRUMP SA', tone: 'ink', at: loc(5, A.donald), rows: [{text: 'Inte en folkomröstning om honom', at: loc(5, A.folkomrostning)}]},
          right: {title: 'MÄTNINGEN', tone: 'red', at: loc(5, A.samtidigt), rows: [{text: 'Stöd: 37 procent', at: loc(5, A.n37)}]},
        },
        {t: 'counter', label: '% STÖD', to: 37, at: loc(5, A.n37), dur: 24, tone: 'ink'},
      ],
    },
  },
  {
    key: 'fraga',
    from: starts[6],
    duration: dur(6),
    source: 'KÄLLA: NPR • CNN',
    chrome: true,
    body: {
      type: 'binary',
      question: 'Straff eller mönster?',
      questionAt: loc(6, A.fragan),
      options: ['STRAFF', 'MÖNSTER'],
      optionsAt: loc(6, A.straff - 0.2),
      switchAt: loc(6, A.eller, 0),
      teaser: {text: 'NÄSTA: DEL 3 · FRAMTIDEN', at: loc(6, A.monstret + 0.5)},
    },
  },
];

const chain: Episode2['chain'] = {
  labels: ['TEXAS', 'HUSET ~260', 'SENATEN 56', 'STRAFF?'],
  unlockAt: [starts[1] + 12, gf(A.n260), gf(A.n56), null],
};

/* ───────── sound effects ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
// hook
add(10, 'thud', 0.8);
add(L(0, loc(0, A.n1994)), 'pop');
add(L(0, loc(0, A.vann)), 'pop');
add(L(0, loc(0, A.texas)), 'stamp');
// house
add(L(1, loc(1, A.begynnelse)), 'pop');
add(L(1, loc(1, A.natten + 0.4)), 'fill_blue', 0.7, 30);
add(L(1, loc(1, A.huset)), 'ping', 0.8);
add(L(1, loc(1, A.n260)), 'fill_blue', 0.7, 34);
add(L(1, loc(1, A.n260)), 'thud', 0.7);
// npr
add(L(2, loc(2, A.npr)), 'pop');
add(L(2, loc(2, A.n50 - 0.2)), 'pop');
// senate
add(L(3, loc(3, A.senaten)), 'pop');
add(L(3, loc(3, A.nio)), 'fill_blue', 0.7, 24);
[A.ohio, A.iowa, A.carolina - 0.3].forEach((a) => add(L(3, loc(3, a)), 'pop_hi', 0.9));
add(L(3, loc(3, A.n56)), 'chime', 0.8);
// turnout
add(L(4, loc(4, A.n123)), 'count_short', 0.8, 40);
add(L(4, loc(4, A.valdeltagandet)), 'pop');
// trump
[A.donald, A.samtidigt].forEach((a) => add(L(5, loc(5, a)), 'pop'));
add(L(5, loc(5, A.n37)), 'count_short', 0.8, 24);
add(L(5, loc(5, A.n37)), 'warn', 0.8);
// question
add(L(6, loc(6, A.fragan)), 'whoosh', 0.8);
add(L(6, loc(6, A.straff - 0.2)), 'pop_hi');
add(L(6, loc(6, A.straff - 0.2)) + 6, 'pop_hi', 0.9);
add(L(6, loc(6, A.eller, 0)), 'flip');
add(L(6, loc(6, A.monstret + 0.5)), 'pop');
sfx.sort((a, b) => a.at - b.at);

export const usa2: Episode2 = {
  meta: {id: 'usa-del-2', tag: 'USA 2026 • DEL 2/3', fps: FPS, width: 1080, height: 1920},
  audioFile: 'usa2.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const usa2Duration = total;
