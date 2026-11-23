import {sv2Timing as T} from './timing.sv.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.5;
// [0]hook [1]north->south [2]grid+EU [3]four zones [4]Europe map [5]marginal price [6]new lines [7]question
const startSecs = [T.sceneStarts[0], T.sceneStarts[1], T.sceneStarts[2], A.fyra - 0.5, T.sceneStarts[3], T.sceneStarts[4], T.sceneStarts[5], T.sceneStarts[6]];
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
const starts = startSecs.map((s) => Math.round(s * FPS));
const gf = (sec: number) => Math.round(sec * FPS);
const loc = (i: number, sec: number, lead = 3) => Math.max(0, Math.round(sec * FPS) - starts[i] - lead);
const dur = (i: number) => (i + 1 < starts.length ? starts[i + 1] : total) - starts[i];
const zAt = (k: number) => A.se1 - 0.2 + ((A.se4 - A.se1 + 0.2) * k) / 3;

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
        {t: 'bigtext', text: '5×', sub: 'SAMMA EL · SKÅNE OCH NORRLAND', at: loc(0, A.fem - 0.3), size: 260},
        {
          t: 'versus',
          left: {title: 'SKÅNE', tone: 'ink', at: loc(0, A.skane), rows: [{text: 'Betalar fem gånger mer', at: loc(0, A.fem)}]},
          right: {title: 'NORRLAND', tone: 'blue', at: loc(0, A.norrland - 0.5), rows: [{text: 'Samma el, lägre pris', at: loc(0, A.norrland)}]},
        },
        {t: 'cards', cards: [{kicker: 'SVARET GÅR TILLBAKA TILL', title: 'EU-beslut 2011', at: loc(0, A.eubeslut)}]},
      ],
    },
  },
  {
    key: 'norrSodra',
    from: starts[1],
    duration: dur(1),
    source: 'KÄLLA: SVENSKA KRAFTNÄT',
    chrome: true,
    body: {
      type: 'stack',
      gap: 20,
      widgets: [
        {
          t: 'sweden',
          at: loc(1, A.producerar),
          flow: {at: loc(1, A.mesta - 0.6), dur: 60, label: 'EL NORR → SÖDER'},
          side: [
            {big: 'NORR', text: 'BILLIG VATTEN- OCH VINDKRAFT', tone: 'green', at: loc(1, A.vattenkraft), zones: [0, 1]},
            {big: 'SÖDER', text: 'DÄR MESTA ELEN ANVÄNDS', tone: 'blue', at: loc(1, A.soder - 0.3), zones: [2, 3]},
            {big: '1 PRIS', text: 'TIDIGARE HADE HELA LANDET SAMMA ELPRIS', tone: 'ink', at: loc(1, A.tidigare)},
          ],
        },
      ],
    },
  },
  {
    key: 'natEu',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: SVENSKA KRAFTNÄT • EU-KOMMISSIONEN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 20,
      widgets: [
        {
          t: 'sweden',
          at: 0,
          flow: {at: loc(2, A.elnatet), dur: 50, label: 'EL NORR → SÖDER'},
          side: [
            {big: 'NÄTET', text: 'KLARAR INTE HUR MYCKET STRÖM SOM HELST', tone: 'ink', at: loc(2, A.elnatet)},
            {big: 'EXPORT', text: 'STRÖPS IBLAND TILL DANMARK', tone: 'red', at: loc(2, A.strop)},
            {big: 'EU', text: 'SATTE NER FOTEN', tone: 'blue', at: loc(2, A.foten - 0.2)},
          ],
        },
      ],
    },
  },
  {
    key: 'zoner',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: SVENSKA KRAFTNÄT (SCHEMATISK KARTA)',
    chrome: true,
    body: {
      type: 'stack',
      gap: 20,
      widgets: [
        {
          t: 'sweden',
          at: 0,
          side: [
            {big: 'SE1', text: 'NORR', sub: 'BILLIGAST', tone: 'green', at: loc(3, zAt(0)), zones: [0]},
            {big: 'SE2', text: 'MELLERSTA NORR', tone: 'blue', at: loc(3, zAt(1)), zones: [1]},
            {big: 'SE3', text: 'MELLANSVERIGE', tone: 'muted', at: loc(3, zAt(2)), zones: [2]},
            {big: 'SE4', text: 'SÖDER', sub: 'DYRAST', tone: 'red', at: loc(3, A.se4), zones: [3]},
          ],
        },
      ],
    },
  },
  {
    key: 'europa',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: SVENSKA KRAFTNÄT • ENTSO-E',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {
          t: 'map',
          title: 'SÖDRA SVERIGE ↔ KONTINENTEN',
          view: {lon0: -6, lon1: 30, lat0: 47, lat1: 66},
          squash: 0.8,
          dots: 84,
          at: loc(4, A.samtidigt),
          markers: [
            {label: 'SE4 · SKÅNE', lon: 13.0, lat: 55.6, at: loc(4, A.samtidigt + 0.3), tone: 'blue', side: 'r'},
            {label: 'TYSKLAND', lon: 10.0, lat: 51.5, at: loc(4, A.tyskland), tone: 'ink', side: 'b'},
          ],
          routes: [{from: 0, to: 1, at: loc(4, A.tatt), dur: 40, tone: 'blue', dashed: true, label: 'HOPKOPPLAT', curve: 0.3}],
        },
        {t: 'bigtext', text: 'HOPKOPPLAT', sub: 'SÖDRA SVERIGE · TYSKLAND · KONTINENTEN', at: loc(4, A.kontinenten - 0.6), size: 120},
      ],
    },
  },
  {
    key: 'marginalpris',
    from: starts[5],
    duration: dur(5),
    source: 'KÄLLA: ENTSO-E • EU-KOMMISSIONEN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {t: 'bigtext', text: 'DYRASTE', sub: 'KILOWATTIMMEN SÄTTER PRISET FÖR ALLA', at: loc(5, A.dyraste - 0.4), size: 190},
        {
          t: 'timeline',
          nodes: [
            {label: 'FÖRSTA KWH', sub: 'BILLIGAST', at: loc(5, A.europeiska), tone: 'green'},
            {label: 'SISTA KWH', sub: 'DYRAST · SÄTTER PRISET', at: loc(5, A.sista), tone: 'red'},
          ],
          chips: [
            {text: 'VINDSTILLA I TYSKLAND', at: loc(5, A.vindstilla), tone: 'muted'},
            {text: 'HÖGA PRISER SMITTAR HIT', at: loc(5, A.smittar), tone: 'red'},
          ],
          stamp: {text: 'PRIS FÖR ALLA', at: loc(5, A.priset + 0.6)},
        },
      ],
    },
  },
  {
    key: 'ledningar',
    from: starts[6],
    duration: dur(6),
    source: 'KÄLLA: SVENSKA KRAFTNÄT',
    chrome: true,
    body: {
      type: 'stack',
      gap: 38,
      widgets: [
        {t: 'bigtext', text: '10+ ÅR', sub: 'NYA KRAFTLEDNINGAR', at: loc(6, A.nya), size: 240},
        {
          t: 'versus',
          left: {title: 'NORR', tone: 'green', at: loc(6, A.verkligheter - 1.2), rows: [{text: 'Billig el', at: loc(6, A.verkligheter - 1.0)}]},
          right: {title: 'SÖDER', tone: 'red', at: loc(6, A.verkligheter - 0.7), rows: [{text: 'Dyr el', at: loc(6, A.verkligheter - 0.5)}]},
        },
      ],
    },
  },
  {
    key: 'fraga',
    from: starts[7],
    duration: dur(7),
    source: 'KÄLLA: SVENSKA KRAFTNÄT',
    chrome: true,
    body: {
      type: 'binary',
      question: 'Samma elpris i hela landet?',
      questionAt: loc(7, A.tycker),
      options: ['JA', 'NEJ'],
      optionsAt: loc(7, A.hela),
      switchAt: loc(7, A.igen + 0.7, 0),
      save: {text: 'SPARA', at: loc(7, A.igen + 0.3)},
    },
  },
];

const chain: Episode2['chain'] = {
  labels: ['EU 2011', '4 ZONER', 'DYRASTE KWH', 'SAMMA PRIS?'],
  unlockAt: [gf(A.n2011), gf(A.se4), gf(A.dyraste + 0.5), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.fem - 0.3)), 'thud', 0.9);
[A.skane, A.fem, A.norrland - 0.5, A.norrland, A.eubeslut].forEach((a) => add(L(0, loc(0, a)), 'pop_hi', 0.8));
add(L(1, loc(1, A.producerar)), 'pop');
add(L(1, loc(1, A.vattenkraft)), 'pop');
add(L(1, loc(1, A.mesta - 0.6)), 'swish');
add(L(1, loc(1, A.soder - 0.3)), 'pop');
add(L(1, loc(1, A.tidigare)), 'pop');
add(L(2, loc(2, A.elnatet)), 'pop');
add(L(2, loc(2, A.strop)), 'err', 0.9);
add(L(2, loc(2, A.foten - 0.2)), 'thud', 0.8);
[0, 1, 2, 3].forEach((k) => add(L(3, loc(3, k === 3 ? A.se4 : zAt(k))), k === 3 ? 'warn' : 'pop', 0.9));
add(L(4, loc(4, A.samtidigt)), 'pop');
add(L(4, loc(4, A.tatt)), 'swish');
add(L(4, loc(4, A.tyskland)), 'pop', 0.9);
add(L(4, loc(4, A.kontinenten - 0.6)), 'thud', 0.7);
add(L(5, loc(5, A.dyraste - 0.4)), 'thud', 0.8);
[A.europeiska, A.sista].forEach((a) => add(L(5, loc(5, a)), 'pop'));
add(L(5, loc(5, A.vindstilla)), 'pop_hi', 0.9);
add(L(5, loc(5, A.smittar)), 'warn', 0.8);
add(L(5, loc(5, A.priset + 0.6)), 'stamp');
add(L(6, loc(6, A.nya)), 'thud', 0.8);
[A.verkligheter - 1.0, A.verkligheter - 0.5].forEach((a) => add(L(6, loc(6, a)), 'pop'));
add(L(7, loc(7, A.tycker)), 'whoosh', 0.8);
add(L(7, loc(7, A.hela)), 'pop_hi');
add(L(7, loc(7, A.hela)) + 6, 'pop_hi', 0.9);
add(L(7, loc(7, A.igen + 0.7, 0)), 'flip');
add(L(7, loc(7, A.igen + 0.3)), 'pop');
sfx.sort((a, b) => a.at - b.at);

export const sv2: Episode2 = {
  meta: {id: 'sverige-elpris', tag: 'SVERIGE • ELPRIS', fps: FPS, width: 1080, height: 1920},
  audioFile: 'sv2.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const sv2Duration = total;
