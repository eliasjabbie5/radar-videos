import {usa3Timing as T} from './timing.usa.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.5;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
// [0]hook [1]power shift [2]veto maths [3]nominations [4]budget [5]question
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
      gap: 26,
      widgets: [
        {t: 'bigtext', text: 'VETO', sub: 'TRUMPS SISTA VAPEN', at: 6, size: 170},
        {
          t: 'dots',
          title: 'REPRESENTANTHUSET · 2/3 KRÄVS FÖR ATT KÖRA ÖVER',
          at: loc(0, A.vetot),
          total: 435,
          cols: 29,
          size: 22,
          gap: 8,
          groups: [
            {label: 'DEMOKRATER (UPP TILL)', n: 260, tone: 'blue', at: loc(0, A.saknar), dur: 40},
            {label: 'ÖVRIGA', n: 175, tone: 'ink', at: loc(0, A.saknar + 0.4), dur: 30},
          ],
          mark: {index: 289, label: 'KRÄVS: 290', at: loc(0, A.n30)},
        },
        {t: 'bigtext', text: '−30', sub: 'RÖSTER SAKNAS', at: loc(0, A.n30), size: 150},
      ],
    },
  },
  {
    key: 'makt',
    from: starts[1],
    duration: dur(1),
    source: 'KÄLLA: NPR • AXIOS',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {
          t: 'timeline',
          nodes: [
            {label: 'NU', sub: 'REPUBLIKANSK KONGRESS', at: loc(1, A.tredje - 0.2)},
            {label: '3 JAN', sub: 'DEMOKRATISK KONGRESS', at: loc(1, A.tredje + 0.2), tone: 'blue'},
          ],
          chips: [{text: 'JEFFRIES: DYRTIDEN FÖRST', at: loc(1, A.dyrtiden)}],
        },
        {
          t: 'checklist',
          rows: [
            {text: 'KALLA VITTNEN', state: 'yes', at: loc(1, A.vittnen)},
            {text: 'KRÄVA HANDLINGAR', state: 'yes', at: loc(1, A.handlingar)},
            {text: 'RIKSRÄTT', sub: 'JEFFRIES: VARKEN UTESLUTER ELLER LOVAR', state: 'unknown', at: loc(1, A.utesluter - 0.3)},
          ],
        },
      ],
    },
  },
  {
    key: 'veto',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: USA:S KONSTITUTION (ART. I §7)',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {
          t: 'cards',
          cards: [
            {
              kicker: 'HUSET · KRÄVS 290',
              title: 'Saknas ca 30',
              at: loc(2, A.n290),
              value: {prefix: 'Har ca ', to: 260, at: loc(2, A.n260), dur: 30},
            },
            {
              kicker: 'SENATEN · KRÄVS 67',
              title: 'Saknas 11',
              at: loc(2, A.n67),
              value: {prefix: 'Har ', to: 56, at: loc(2, A.n56), dur: 24},
            },
          ],
        },
      ],
    },
  },
  {
    key: 'utnamningar',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: NEWSWEEK',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {
          t: 'cards',
          cards: [
            {kicker: 'SENATEN HAR SISTA ORDET', title: 'Utnämningar', at: loc(3, A.senaten), tag: 'KRÄVER SENATENS GODKÄNNANDE'},
            {kicker: 'EN BEDÖMARE (NEWSWEEK)', title: 'Nästan inga på två år', at: loc(3, A.bedomare), tag: 'ENSKILD BEDÖMNING · INTE ETT FACIT'},
          ],
        },
      ],
    },
  },
  {
    key: 'budget',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: HOLLAND & KNIGHT • WILMERHALE',
    chrome: true,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {t: 'bigtext', text: '11 DEC', sub: 'TILLFÄLLIGA BUDGETEN GÅR UT', at: loc(4, A.elfte - 0.3), size: 200},
        {
          t: 'checklist',
          rows: [
            {text: 'TILLFÄLLIG BUDGET', sub: 'GÅR UT 11 DEC', state: 'unknown', at: loc(4, A.budget)},
            {text: 'ÖVERENSKOMMELSE', sub: 'LÅNGT IFRÅN, ENLIGT RAPPORTER', state: 'no', at: loc(4, A.overenskommelse - 0.6)},
          ],
        },
      ],
    },
  },
  {
    key: 'fraga',
    from: starts[5],
    duration: dur(5),
    source: 'KÄLLA: NPR • NEWSWEEK',
    chrome: true,
    body: {
      type: 'binary',
      question: 'Deal eller stillestånd?',
      questionAt: loc(5, A.fragan),
      options: ['DEAL', 'STILLESTÅND'],
      optionsAt: loc(5, A.deal - 0.2),
      switchAt: loc(5, A.eller, 0),
      save: {text: 'SPARA', at: loc(5, A.stillestand + 0.3)},
    },
  },
];

const chain: Episode2['chain'] = {
  labels: ['VETO', '3 JAN', '−30 / −11', 'DEAL?'],
  unlockAt: [starts[1] + 12, gf(A.tredje + 0.3), gf(A.n67), null],
};

/* ───────── sound effects ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
// hook
add(12, 'stamp', 0.9);
add(L(0, loc(0, A.saknar)), 'fill_blue', 0.7, 40);
add(L(0, loc(0, A.n30)), 'ping', 0.8);
add(L(0, loc(0, A.n30)) + 4, 'err', 0.9);
// power shift
add(L(1, loc(1, A.tredje - 0.2)), 'pop');
add(L(1, loc(1, A.tredje + 0.2)), 'pop');
add(L(1, loc(1, A.dyrtiden)), 'pop_hi', 0.9);
[A.vittnen, A.handlingar].forEach((a) => add(L(1, loc(1, a)), 'chime', 0.8));
add(L(1, loc(1, A.utesluter - 0.3)), 'warn');
// veto maths
add(L(2, loc(2, A.n290)), 'pop');
add(L(2, loc(2, A.n260)), 'count_short', 0.8, 30);
add(L(2, loc(2, A.n67)), 'pop');
add(L(2, loc(2, A.n56)), 'count_short', 0.8, 24);
add(L(2, loc(2, A.n56)) + 20, 'err', 0.9);
// nominations
add(L(3, loc(3, A.senaten)), 'pop');
add(L(3, loc(3, A.bedomare)), 'pop');
// budget
add(L(4, loc(4, A.elfte - 0.3)), 'thud', 0.8);
add(L(4, loc(4, A.budget)), 'pop');
add(L(4, loc(4, A.overenskommelse - 0.6)), 'err', 0.9);
// question
add(L(5, loc(5, A.fragan)), 'whoosh', 0.8);
add(L(5, loc(5, A.deal - 0.2)), 'pop_hi');
add(L(5, loc(5, A.deal - 0.2)) + 6, 'pop_hi', 0.9);
add(L(5, loc(5, A.eller, 0)), 'flip');
add(L(5, loc(5, A.stillestand + 0.3)), 'pop');
sfx.sort((a, b) => a.at - b.at);

export const usa3: Episode2 = {
  meta: {id: 'usa-del-3', tag: 'USA 2026 • DEL 3/3', fps: FPS, width: 1080, height: 1920},
  audioFile: 'usa3.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const usa3Duration = total;
