import {nv2Timing as T} from './timing.nv.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.4;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
// [0]hook [1]history [2]layer 1 map [3]layer 2 map [4]denial [5]cliff
const startSecs = [T.sceneStarts[0], T.sceneStarts[1], T.sceneStarts[2], T.sceneStarts[3], T.sceneStarts[4], T.sceneStarts[5]];
const starts = startSecs.map((s) => Math.round(s * FPS));
const gf = (sec: number) => Math.round(sec * FPS);
const loc = (i: number, sec: number, lead = 3) => Math.max(0, Math.round(sec * FPS) - starts[i] - lead);
const dur = (i: number) => (i + 1 < starts.length ? starts[i + 1] : total) - starts[i];
const SEA = {lon0: 92, lon1: 130, lat0: -4, lat1: 26};

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
        {t: 'counter', label: 'MILJARDER $ I AI-CHIP', to: 4, at: loc(0, A.n4), dur: 24, tone: 'blue'},
        {
          t: 'chip',
          label: 'AI-CHIP',
          sub: 'NVIDIA',
          at: loc(0, A.chip - 0.5),
          tags: [
            {text: 'VIA MEGASPEED', at: loc(0, A.okant - 0.4)},
            {text: 'NÄSTAN OKÄNT BOLAG', at: loc(0, A.okant), tone: 'muted'},
            {text: 'SINGAPORE', at: loc(0, A.singapore)},
          ],
        },
      ],
    },
  },
  {
    key: 'historik',
    from: starts[1],
    duration: dur(1),
    source: 'KÄLLA: THE NEW YORK TIMES • MEGASPEED',
    chrome: true,
    body: {
      type: 'stack',
      gap: 36,
      widgets: [
        {t: 'bigtext', text: 'MEGASPEED', sub: 'MOLNBOLAG · SINGAPORE', at: loc(1, A.startade), size: 130},
        {
          t: 'timeline',
          nodes: [
            {label: 'START', sub: 'DOTTERBOLAG TILL KINESISKT SPELBOLAG', at: loc(1, A.dotterbolag)},
            {label: '2023', sub: 'ALICE HUANG TAR ÖVER', at: loc(1, A.n2023), tone: 'blue'},
            {label: 'MOLNPARTNER', sub: 'OFFICIELL PARTNER ÅT NVIDIA', at: loc(1, A.molnpartner), tone: 'green'},
          ],
        },
      ],
    },
  },
  {
    key: 'lager1',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: THE NEW YORK TIMES',
    chrome: true,
    body: {
      type: 'stack',
      gap: 26,
      widgets: [
        {
          t: 'map',
          title: 'LAGER 1 · KRYPHÅLET',
          view: SEA,
          dots: 80,
          at: loc(2, A.upplagget),
          markers: [
            {label: 'SINGAPORE', lon: 103.8, lat: 1.35, at: loc(2, A.singapore3), tone: 'blue', side: 'r'},
            {label: 'MALAYSIA', lon: 101.7, lat: 3.14, at: loc(2, A.malaysia3), tone: 'blue', side: 'l'},
            {label: 'KINA · ALIBABA', lon: 113.3, lat: 23.1, at: loc(2, A.alibaba), tone: 'ink', side: 'r'},
          ],
          routes: [{from: 0, to: 2, at: loc(2, A.hyra), dur: 50, tone: 'blue', dashed: true, label: 'HYR PÅ DISTANS'}],
          stamp: {text: 'LAGLIGT KRYPHÅL', at: loc(2, A.gransen), tone: 'green'},
        },
        {t: 'checklist', rows: [{text: 'CHIPPEN KORSAR INTE KINAS GRÄNS', state: 'yes', at: loc(2, A.korsade)}]},
      ],
    },
  },
  {
    key: 'lager2',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: THE NEW YORK TIMES',
    chrome: true,
    body: {
      type: 'stack',
      gap: 26,
      widgets: [
        {
          t: 'map',
          title: 'LAGER 2 · MISSTÄNKT',
          view: SEA,
          dots: 80,
          at: loc(3, A.utredare),
          markers: [
            {label: 'MALAYSIA', lon: 101.7, lat: 3.14, at: loc(3, A.utredare + 0.2), tone: 'blue', side: 'r'},
            {label: 'KINA', lon: 113.3, lat: 23.1, at: loc(3, A.kina4 - 0.6), tone: 'ink', side: 'r'},
          ],
          routes: [{from: 0, to: 1, at: loc(3, A.skickade), dur: 50, tone: 'red', dashed: true, label: 'FYSISKA SERVRAR'}],
          stamp: {text: 'MISSTÄNKT', at: loc(3, A.misstanker + 0.3), tone: 'red'},
        },
        {t: 'checklist', rows: [{text: 'FÖRFALSKADE TULLDEKLARATIONER', sub: 'UTREDARE I USA, SINGAPORE OCH MALAYSIA', state: 'unknown', at: loc(3, A.tulldek)}]},
      ],
    },
  },
  {
    key: 'fornekar',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: THE NEW YORK TIMES • NVIDIA',
    chrome: true,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {
          t: 'versus',
          left: {title: 'MEGASPEED', tone: 'ink', at: loc(4, A.fornekar), rows: [{text: 'Förnekar brott', at: loc(4, A.fornekar + 0.1)}, {text: '“Laglig verksamhet”', at: loc(4, A.laglig - 0.6)}]},
          right: {title: 'NVIDIA', tone: 'blue', at: loc(4, A.stoppade - 0.2), rows: [{text: 'Stoppade försäljningen 2025', at: loc(4, A.stoppade)}]},
        },
        {t: 'checklist', rows: [{text: 'ALICE HUANG PORTADES', sub: 'FRÅN SINGAPORE', state: 'no', at: loc(4, A.portades)}]},
      ],
    },
  },
  {
    key: 'cliff',
    from: starts[5],
    duration: dur(5),
    source: 'KÄLLA: THE NEW YORK TIMES',
    chrome: false,
    body: {type: 'cliff', pulseAt: 0, card: {title: 'DEL 3 · 25 % TULL', sub: 'NÄSTA VIDEO', at: loc(5, A.del - 0.3)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['4 MDR $', '2 LAGER', 'FÖRNEKAR', '25 % TULL?'],
  unlockAt: [starts[1] + 12, gf(A.lager), gf(A.fornekar), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
// hook
add(L(0, loc(0, A.n4)), 'count_short', 0.8, 24);
add(L(0, loc(0, A.chip - 0.5)), 'thud', 0.8);
[A.okant - 0.4, A.okant, A.singapore].forEach((a) => add(L(0, loc(0, a)), 'pop_hi', 0.9));
// history
add(L(1, loc(1, A.startade)), 'thud', 0.7);
[A.dotterbolag, A.n2023, A.molnpartner].forEach((a) => add(L(1, loc(1, a)), 'pop'));
// layer 1
add(L(2, loc(2, A.upplagget)), 'pop');
[A.singapore3, A.malaysia3, A.alibaba].forEach((a) => add(L(2, loc(2, a)), 'pop', 0.9));
add(L(2, loc(2, A.hyra)), 'swish');
add(L(2, loc(2, A.gransen)), 'chime', 0.8);
add(L(2, loc(2, A.korsade)), 'pop');
// layer 2
add(L(3, loc(3, A.utredare)), 'pop');
add(L(3, loc(3, A.skickade)), 'swish');
add(L(3, loc(3, A.misstanker + 0.3)), 'stamp');
add(L(3, loc(3, A.tulldek)), 'warn', 0.8);
// denial
[A.fornekar, A.stoppade].forEach((a) => add(L(4, loc(4, a)), 'pop'));
add(L(4, loc(4, A.portades)), 'err', 0.9);
// cliff
add(L(5, loc(5, A.del - 0.3)), 'pop_hi');
add(L(5, loc(5, A.del - 0.3)) + 8, 'lock');
sfx.sort((a, b) => a.at - b.at);

export const nv2: Episode2 = {
  meta: {id: 'nvidia-del-2', tag: 'NVIDIA • DEL 2/3', fps: FPS, width: 1080, height: 1920},
  audioFile: 'nv2.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const nv2Duration = total;
