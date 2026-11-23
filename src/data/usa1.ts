import {usa1Timing as T} from './timing.usa.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.3;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
// [0]hook [1]midterms [2]approval [3]redistricting [4]senate [5]cliff
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
      gap: 30,
      widgets: [
        {t: 'bigtext', text: '5', sub: 'PLATSER · REPUBLIKANERNAS MARGINAL', at: loc(0, A.fem), size: 250},
        {
          t: 'dots',
          title: 'REPRESENTANTHUSET · 435 PLATSER',
          at: loc(0, A.republikanernas),
          total: 435,
          cols: 29,
          size: 22,
          gap: 8,
          groups: [
            {label: 'REPUBLIKANER', n: 220, tone: 'ink', at: loc(0, A.n220), dur: 34},
            {label: 'DEMOKRATER', n: 215, tone: 'blue', at: loc(0, A.n215), dur: 34},
          ],
          mark: {index: 217, label: 'MAJORITET = 218', at: loc(0, A.mot)},
        },
      ],
    },
  },
  {
    key: 'mellanval',
    from: starts[1],
    duration: dur(1),
    source: 'KÄLLA: US CONGRESS',
    chrome: true,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {t: 'bigtext', text: 'MELLANÅRSVAL', sub: 'HALVVÄGS I PRESIDENTPERIODEN', at: loc(1, A.mitt), size: 104},
        {
          t: 'timeline',
          nodes: [
            {label: '2024', sub: 'PRESIDENTVAL', at: loc(1, A.mitt + 0.2)},
            {label: '2026', sub: 'MELLANÅRSVAL', at: loc(1, A.huset), tone: 'blue'},
            {label: '2028', sub: 'PRESIDENTVAL', at: loc(1, A.senaten + 0.1)},
          ],
          chips: [
            {text: '435 PLATSER I HUSET', at: loc(1, A.huset + 0.2)},
            {text: '1/3 AV SENATEN', at: loc(1, A.tredjedel)},
            {text: 'PRESIDENTENS PARTI BRUKAR FÖRLORA', at: loc(1, A.brukar), tone: 'red'},
          ],
        },
      ],
    },
  },
  {
    key: 'stod',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: NPR • CNN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 28,
      widgets: [
        {t: 'counter', label: '% STÖD FÖR TRUMP', to: 37, at: loc(2, A.n37), dur: 26, tone: 'ink'},
        {
          t: 'cards',
          cards: [
            {kicker: 'ENLIGT NPR', title: 'Lägst på 50 år', at: loc(2, A.lagsta), tag: 'LÄGSTA FÖRE ETT MELLANÅRSVAL'},
            {kicker: 'VÄLJARNAS VIKTIGASTE FRÅGA', title: 'Dyrtiden', at: loc(2, A.viktigaste)},
          ],
        },
      ],
    },
  },
  {
    key: 'kartor',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: WIKIPEDIA • NPR',
    chrome: true,
    body: {
      type: 'stack',
      gap: 26,
      widgets: [
        {t: 'counter', label: 'DELSTATER RITADE OM', to: 9, at: loc(3, A.nio), dur: 20, tone: 'ink'},
        {
          t: 'checklist',
          rows: [
            {text: 'TEXAS', sub: 'KARTAN OMRITAD', state: 'yes', at: loc(3, A.texas)},
            {text: 'FLORIDA', sub: 'KARTAN OMRITAD', state: 'yes', at: loc(3, A.florida)},
            {text: 'OHIO', sub: 'KARTAN OMRITAD', state: 'yes', at: loc(3, A.ohio)},
            {text: 'KALIFORNIEN', sub: 'KARTAN OMRITAD', state: 'yes', at: loc(3, A.kalifornien)},
          ],
        },
      ],
    },
  },
  {
    key: 'senaten',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: US SENATE',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {t: 'bigtext', text: '53 – 47', sub: 'SENATEN FÖRE VALET', at: loc(4, A.tryggare), size: 190},
        {
          t: 'dots',
          title: 'SENATEN · 100 PLATSER',
          at: loc(4, A.tryggare),
          total: 100,
          cols: 20,
          size: 36,
          gap: 8,
          groups: [
            {label: 'REPUBLIKANER', n: 53, tone: 'ink', at: loc(4, A.n53), dur: 26},
            {label: 'DEMOKRATER', n: 47, tone: 'blue', at: loc(4, A.n47), dur: 24},
          ],
        },
      ],
    },
  },
  {
    key: 'cliff',
    from: starts[5],
    duration: dur(5),
    source: 'KÄLLA: NPR • WIKIPEDIA',
    chrome: false,
    body: {type: 'cliff', pulseAt: 0, card: {title: 'DEL 2 · NU', sub: 'NÄSTA VIDEO', at: loc(5, A.nog - 0.3)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['220–215', '37 %', '9 KARTOR', 'RÄCKTE DET?'],
  unlockAt: [starts[1] + 12, gf(A.n37), gf(A.nio), null],
};

/* ───────── sound effects ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
// hook
add(10, 'pop');
add(L(0, loc(0, A.fem)), 'thud', 0.8);
add(L(0, loc(0, A.n220)), 'fill_blue', 0.7, 30);
add(L(0, loc(0, A.n215)), 'fill_blue', 0.7, 30);
add(L(0, loc(0, A.mot)), 'ping', 0.8);
// midterms
add(L(1, loc(1, A.mitt)), 'pop');
[A.mitt + 0.2, A.huset, A.senaten + 0.1].forEach((a) => add(L(1, loc(1, a)), 'pop', 0.8));
[A.huset + 0.2, A.tredjedel].forEach((a) => add(L(1, loc(1, a)), 'pop_hi', 0.9));
add(L(1, loc(1, A.brukar)), 'warn');
// approval
add(L(2, loc(2, A.n37)), 'count_short', 0.8, 30);
add(L(2, loc(2, A.lagsta)), 'pop');
add(L(2, loc(2, A.viktigaste)), 'pop');
// redistricting
add(L(3, loc(3, A.nio)), 'count_short', 0.7, 24);
[A.texas, A.florida, A.ohio, A.kalifornien].forEach((a) => add(L(3, loc(3, a)), 'pop_hi', 0.9));
// senate
add(L(4, loc(4, A.tryggare)), 'thud', 0.7);
add(L(4, loc(4, A.n53)), 'fill_blue', 0.6, 26);
add(L(4, loc(4, A.n47)), 'fill_blue', 0.6, 24);
// cliff
add(L(5, loc(5, A.nog - 0.3)), 'pop_hi');
add(L(5, loc(5, A.nog - 0.3)) + 8, 'lock');
sfx.sort((a, b) => a.at - b.at);

export const usa1: Episode2 = {
  meta: {id: 'usa-del-1', tag: 'USA 2026 • DEL 1/3', fps: FPS, width: 1080, height: 1920},
  audioFile: 'usa1.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const usa1Duration = total;
