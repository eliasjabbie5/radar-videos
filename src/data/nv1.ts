import {nv1Timing as T} from './timing.nv.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.4;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
// [0]hook [1]two reveals [2]Alice Huang + map [3]NYT claims [4]split agencies [5]cliff
const startSecs = [T.sceneStarts[0], T.sceneStarts[1] + 0.3, T.sceneStarts[2], T.sceneStarts[3], T.sceneStarts[4], T.sceneStarts[5]];
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
        {t: 'bigtext', text: '33 ÅR', sub: 'VID MAKTEN · BORTA ÖVER EN NATT', at: loc(0, A.n33), size: 250},
        {t: 'cards', cards: [{kicker: 'NVIDIAS GRUNDARE', title: 'Jensen Huang', at: loc(0, A.jensen - 0.3), tag: 'AVGICK 12 NOVEMBER 2026', stamp: {text: 'AVGICK', at: loc(0, A.huangEnd - 0.2)}}]},
      ],
    },
  },
  {
    key: 'avslojande1',
    from: starts[1],
    duration: dur(1),
    source: 'KÄLLA: MEDIERNA',
    chrome: true,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {t: 'bigtext', text: '2', sub: 'AVSLÖJANDEN BAKOM FALLET', at: loc(1, A.bakom), size: 250},
        {
          t: 'checklist',
          rows: [
            {text: 'HEMLIG RELATION MED EN CHEF', sub: 'RAPPORTERADE DIREKT TILL HUANG', state: 'no', at: loc(1, A.hemlig)},
            {text: 'BROTT MOT BOLAGETS REGLER', state: 'no', at: loc(1, A.brott)},
          ],
        },
      ],
    },
  },
  {
    key: 'alice',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: THE NEW YORK TIMES',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {t: 'cards', cards: [{kicker: 'AVSLÖJANDE 2', title: 'Alice Huang', at: loc(2, A.alice), tag: 'TIDIGARE CHEF · MEGASPEED · SINGAPORE'}]},
        {
          t: 'map',
          title: 'NVIDIA ↔ MEGASPEED',
          view: {lon0: -140, lon1: 130, lat0: -35, lat1: 70},
          dots: 92,
          at: loc(2, A.dels),
          markers: [
            {label: 'NVIDIA · KALIFORNIEN', lon: -122.0, lat: 37.4, at: loc(2, A.dels + 0.2), tone: 'ink', side: 'r'},
            {label: 'MEGASPEED', lon: 103.8, lat: 1.35, at: loc(2, A.megaspeed), tone: 'blue', side: 't'},
          ],
          routes: [{from: 0, to: 1, at: loc(2, A.tidigare), dur: 50, tone: 'muted', dashed: true, label: 'RELATION'}],
        },
      ],
    },
  },
  {
    key: 'nyt',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: THE NEW YORK TIMES',
    chrome: true,
    body: {
      type: 'stack',
      gap: 32,
      widgets: [
        {t: 'bigtext', text: 'ENLIGT NYT', sub: 'HEMLIGA UNDERRÄTTELSERAPPORTER', at: loc(3, A.times), size: 130},
        {
          t: 'checklist',
          rows: [
            {text: 'VÄRVAD AV KINA', sub: 'SÄKERHETSMINISTERIET · ENLIGT NYT', state: 'unknown', at: loc(3, A.varvats), stamp: {text: 'OBEVISAT', at: loc(3, A.sakerhets + 0.5)}},
            {text: 'TRUMP SKA HA INFORMERATS', sub: 'ENLIGT NYT', state: 'unknown', at: loc(3, A.trump)},
            {text: 'INGEN FORMELL VARNING', sub: 'TILL JENSEN HUANG', state: 'no', at: loc(3, A.sjalv)},
          ],
        },
      ],
    },
  },
  {
    key: 'myndigheter',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: THE NEW YORK TIMES',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {t: 'bigtext', text: 'SPLITTRADE', sub: 'USA:S EGNA MYNDIGHETER', at: loc(4, A.samtidigt), size: 120},
        {
          t: 'columns3',
          cols: [
            {title: 'CIA', text: 'Räckte inte som bevis', tone: 'blue', at: loc(4, A.cia)},
            {title: 'FBI', text: 'Räckte inte som bevis', tone: 'blue', at: loc(4, A.fbi)},
            {title: 'NAT. UNDERR.', text: 'Räckte inte som bevis', tone: 'blue', at: loc(4, A.nationella)},
          ],
        },
        {
          t: 'checklist',
          rows: [
            {text: 'JUSTITIEDEPARTEMENTET', sub: 'DROG INGEN SLUTSATS', state: 'unknown', at: loc(4, A.justitie)},
            {text: 'KINA AVFÄRDAR', sub: '"GRUNDLÖST"', state: 'no', at: loc(4, A.kina)},
          ],
        },
      ],
    },
  },
  {
    key: 'cliff',
    from: starts[5],
    duration: dur(5),
    source: 'KÄLLA: THE NEW YORK TIMES',
    chrome: false,
    body: {type: 'cliff', pulseAt: 0, card: {title: 'DEL 2 · MEGASPEED', sub: 'NÄSTA VIDEO', at: loc(5, A.del - 0.3)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['AVGÅNG', 'ALICE HUANG', 'OBEVISAT', 'MEGASPEED?'],
  unlockAt: [starts[1] + 12, gf(A.alice), gf(A.slutsats), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
// hook
add(10, 'thud', 0.9);
add(L(0, loc(0, A.jensen - 0.3)), 'pop');
add(L(0, loc(0, A.huangEnd - 0.2)), 'stamp');
// two reveals
add(L(1, loc(1, A.bakom)), 'thud', 0.8);
[A.hemlig, A.brott].forEach((a) => add(L(1, loc(1, a)), 'err', 0.9));
// Alice
add(L(2, loc(2, A.alice)), 'pop');
add(L(2, loc(2, A.dels + 0.2)), 'pop', 0.9);
add(L(2, loc(2, A.megaspeed)), 'pop', 0.9);
add(L(2, loc(2, A.tidigare)), 'swish');
// NYT
add(L(3, loc(3, A.times)), 'thud', 0.7);
[A.varvats, A.trump].forEach((a) => add(L(3, loc(3, a)), 'pop'));
add(L(3, loc(3, A.sakerhets + 0.5)), 'stamp');
add(L(3, loc(3, A.sjalv)), 'err', 0.9);
// agencies
add(L(4, loc(4, A.samtidigt)), 'thud', 0.7);
[A.cia, A.fbi, A.nationella].forEach((a) => add(L(4, loc(4, a)), 'pop_hi', 0.9));
add(L(4, loc(4, A.justitie)), 'pop');
add(L(4, loc(4, A.kina)), 'err', 0.9);
// cliff
add(L(5, loc(5, A.del - 0.3)), 'pop_hi');
add(L(5, loc(5, A.del - 0.3)) + 8, 'lock');
sfx.sort((a, b) => a.at - b.at);

export const nv1: Episode2 = {
  meta: {id: 'nvidia-del-1', tag: 'NVIDIA • DEL 1/3', fps: FPS, width: 1080, height: 1920},
  audioFile: 'nv1.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const nv1Duration = total;
