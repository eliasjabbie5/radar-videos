import {nv3Timing as T} from './timing.nv.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.5;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
// [0]hook [1]lobbying map [2]compromise [3]critics [4]collapse [5]question
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
      gap: 36,
      widgets: [
        {t: 'ring', value: 25, label: 'Tull på varje AI-chip', sub: 'TILL STATSKASSAN', at: loc(0, A.n25), dur: 30, tone: 'blue', stamp: {text: 'KRASCHAT', at: loc(0, A.kraschat)}},
        {t: 'cards', cards: [{kicker: 'TRUMP GICK MED PÅ', title: 'Nvidia-avtalet', at: loc(0, A.trump), tag: 'ETT SÄREGET AVTAL'}]},
      ],
    },
  },
  {
    key: 'lobby',
    from: starts[1],
    duration: dur(1),
    source: 'KÄLLA: AXIOS • TECHCRUNCH',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {
          t: 'map',
          title: 'AI-CHIP TILL KINA',
          view: {lon0: -130, lon1: 130, lat0: -30, lat1: 62},
          dots: 92,
          at: loc(1, A.stoppat - 0.3),
          markers: [
            {label: 'USA', lon: -77.0, lat: 38.9, at: loc(1, A.stoppat), tone: 'blue', side: 'b'},
            {label: 'KINA', lon: 116.4, lat: 39.9, at: loc(1, A.kina2), tone: 'ink', side: 't'},
            {label: 'HUAWEI', lon: 114.1, lat: 22.5, at: loc(1, A.huawei - 0.4), tone: 'red', side: 'b'},
          ],
          routes: [{from: 0, to: 1, at: loc(1, A.snabbaste), dur: 50, tone: 'red', dashed: true, label: 'STOPPAD'}],
        },
        {t: 'cards', cards: [{kicker: 'NVIDIAS DÅVARANDE VD', title: 'Jensen Huang', at: loc(1, A.davarande), tag: 'LOBBADE MOT TOTALFÖRBUD · VARNADE FÖR HUAWEI'}]},
      ],
    },
  },
  {
    key: 'kompromiss',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: AXIOS • TECHCRUNCH',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {
          t: 'chip',
          label: 'H200',
          sub: 'NÅGOT ÄLDRE CHIP',
          at: loc(2, A.h200 - 0.4),
          tags: [
            {text: 'GODKÄNDA KUNDER', at: loc(2, A.godkanda)},
            {text: 'VIA USA FÖR KONTROLL', at: loc(2, A.skeppas), tone: 'blue'},
            {text: '25 % TULL', at: loc(2, A.belades), tone: 'muted'},
          ],
        },
        {
          t: 'checklist',
          rows: [
            {text: 'FÅR SÄLJAS TILL KINA', sub: 'ENDAST GODKÄNDA KUNDER', state: 'yes', at: loc(2, A.godkanda)},
            {text: 'SKEPPAS FÖRST VIA USA', sub: 'FÖR KONTROLL', state: 'yes', at: loc(2, A.kontroll)},
          ],
        },
      ],
    },
  },
  {
    key: 'kritik',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: AXIOS • TECHCRUNCH',
    chrome: true,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {
          t: 'versus',
          left: {title: 'KONGRESSEN', tone: 'red', at: loc(3, A.kritiker), rows: [{text: 'Kritiker: en säkerhetsrisk', at: loc(3, A.sakerhetsrisk - 0.7)}]},
          right: {title: 'PEKING', tone: 'ink', at: loc(3, A.peking), rows: [{text: 'Styrde bolagen bort från amerikanska chip', at: loc(3, A.chip4)}]},
        },
        {t: 'bigtext', text: 'ÄNDÅ', sub: 'PEKING STYRDE BOLAGEN BORT', at: loc(3, A.anda - 0.2), size: 220},
      ],
    },
  },
  {
    key: 'kollaps',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: NVIDIA (INTÄKTSMÖTE) • MEDIERNA',
    chrome: true,
    body: {
      type: 'stack',
      gap: 28,
      widgets: [
        {t: 'cards', cards: [{kicker: 'TILLFÖRORDNAD VD', title: 'Colette Kress', at: loc(4, A.avgang), tag: 'SKROTADE HELA UPPLÄGGET'}]},
        {t: 'bigtext', text: '0', sub: 'H200-FÖRSÄLJNING TILL KINA · NVIDIAS PROGNOS', at: loc(4, A.noll), size: 200},
        {
          t: 'checklist',
          rows: [
            {text: 'KALIFORNIENS ÅKLAGARE', sub: 'UTREDER NVIDIA', state: 'unknown', at: loc(4, A.kalifornien)},
            {text: 'FINANSINSPEKTIONEN', sub: 'UTREDER NVIDIA', state: 'unknown', at: loc(4, A.finansinspektionen)},
            {text: 'KONGRESSEN', sub: 'UTREDER NVIDIA', state: 'unknown', at: loc(4, A.kongressen)},
          ],
        },
      ],
    },
  },
  {
    key: 'fraga',
    from: starts[5],
    duration: dur(5),
    source: 'KÄLLA: AXIOS • TECHCRUNCH',
    chrome: true,
    body: {
      type: 'binary',
      question: 'Totalförbud mot AI-chip?',
      questionAt: loc(5, A.fragan),
      options: ['TOTALFÖRBUD', 'GÖDER HUAWEI'],
      optionsAt: loc(5, A.totalforbjuda - 0.2),
      switchAt: loc(5, A.eller, 0),
      save: {text: 'SPARA', at: loc(5, A.huawei6 + 0.2)},
    },
  },
];

const chain: Episode2['chain'] = {
  labels: ['25 % TULL', 'H200', 'KRASCH', 'FÖRBUD?'],
  unlockAt: [starts[1] + 12, gf(A.h200), gf(A.skrotade), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
// hook
add(L(0, loc(0, A.n25)), 'count_short', 0.8, 30);
add(L(0, loc(0, A.n25)), 'thud', 0.8);
add(L(0, loc(0, A.trump)), 'pop');
add(L(0, loc(0, A.kraschat)), 'stamp');
// lobbying
add(L(1, loc(1, A.stoppat)), 'pop');
add(L(1, loc(1, A.kina2)), 'pop', 0.9);
add(L(1, loc(1, A.snabbaste)), 'swish');
add(L(1, loc(1, A.davarande)), 'pop');
add(L(1, loc(1, A.huawei - 0.4)), 'warn', 0.8);
// compromise
add(L(2, loc(2, A.h200 - 0.4)), 'thud', 0.8);
[A.godkanda, A.skeppas, A.belades].forEach((a) => add(L(2, loc(2, a)), 'pop_hi', 0.9));
[A.godkanda, A.kontroll].forEach((a) => add(L(2, loc(2, a)), 'chime', 0.6));
// critics
add(L(3, loc(3, A.kritiker)), 'pop');
add(L(3, loc(3, A.peking)), 'pop');
add(L(3, loc(3, A.anda - 0.2)), 'thud', 0.8);
// collapse
add(L(4, loc(4, A.avgang)), 'pop');
add(L(4, loc(4, A.noll)), 'thud', 0.9);
add(L(4, loc(4, A.noll)) + 4, 'err', 0.9);
[A.kalifornien, A.finansinspektionen, A.kongressen].forEach((a) => add(L(4, loc(4, a)), 'pop_hi', 0.9));
// question
add(L(5, loc(5, A.fragan)), 'whoosh', 0.8);
add(L(5, loc(5, A.totalforbjuda - 0.2)), 'pop_hi');
add(L(5, loc(5, A.totalforbjuda - 0.2)) + 6, 'pop_hi', 0.9);
add(L(5, loc(5, A.eller, 0)), 'flip');
add(L(5, loc(5, A.huawei6 + 0.2)), 'pop');
sfx.sort((a, b) => a.at - b.at);

export const nv3: Episode2 = {
  meta: {id: 'nvidia-del-3', tag: 'NVIDIA • DEL 3/3', fps: FPS, width: 1080, height: 1920},
  audioFile: 'nv3.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const nv3Duration = total;
