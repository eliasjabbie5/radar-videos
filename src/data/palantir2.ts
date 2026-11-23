import {palantir2Timing as T} from './timing.palantir.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.0;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
// scene 3 (police) is split in two so each half fits on screen: [0]hook [1]explain [2]police-A [3]police-B [4]defence [5]answers [6]question
// the reveal (scene 1) and the 'OBEKRÄFTAT' stamp (scene 5) are held ~0.4 s before cross-fading
const startSecs = [T.sceneStarts[0], A.palantirEnd + 0.35, T.sceneStarts[2], A.koppla - 0.5, T.sceneStarts[3], T.sceneStarts[4] + 0.4, T.sceneStarts[5]];
const starts = startSecs.map((s) => Math.round(s * FPS));
const gf = (sec: number) => Math.round(sec * FPS);
const loc = (i: number, sec: number, lead = 3) => Math.max(0, Math.round(sec * FPS) - starts[i] - lead);
const span = (a: number, b: number) => Math.max(1, Math.round((b - a) * FPS));
const dur = (i: number) => (i + 1 < starts.length ? starts[i + 1] : total) - starts[i];

const scenes: Scene2[] = [
  {
    key: 'svar',
    from: starts[0],
    duration: dur(0),
    source: null,
    chrome: false,
    body: {
      type: 'redacted',
      kicker: 'SVAR FRÅN POLISEN',
      before: 'Vi kan varken bekräfta eller förneka relationer med',
      secret: 'PALANTIR',
      revealAt: loc(0, A.palantirEnd - 0.55),
      stamp: {text: 'FARA FÖR RIKETS SÄKERHET', at: loc(0, A.svarade)},
      meta: ['FRÅN: POLISMYNDIGHETEN', 'TILL: DAGENS ETC', 'ÄRENDE: SAMARBETE MED PALANTIR'],
      metaAt: 24,
    },
  },
  {
    key: 'vadAr',
    from: starts[1],
    duration: dur(1),
    source: 'KÄLLA: PALANTIR (ÅRSREDOVISNING)',
    chrome: true,
    body: {
      type: 'stack',
      gap: 26,
      widgets: [
        {t: 'bigtext', text: 'PALANTIR · USA', sub: 'AMERIKANSKT FÖRETAG · BYGGER ANALYSPROGRAM', at: loc(1, A.amerikanskt), size: 100},
        {
          t: 'fusion',
          height: 640,
          inputs: [
            {label: 'REGISTER', at: loc(1, A.amerikanskt + 0.7)},
            {label: 'TELEFONER', at: loc(1, A.amerikanskt + 1.25)},
            {label: 'KAMEROR', at: loc(1, A.amerikanskt + 1.8)},
            {label: 'DOKUMENT', at: loc(1, A.amerikanskt + 2.35)},
          ],
          hub: {label: 'PALANTIR', at: loc(1, A.lagger + 0.3)},
          linksAt: loc(1, A.lagger + 0.5),
          outputs: [
            {label: 'PERSON', at: loc(1, A.hanger - 0.9)},
            {label: 'PLATS', at: loc(1, A.hanger - 0.3)},
            {label: 'TID', at: loc(1, A.hanger + 0.3)},
          ],
          footnote: {text: 'VEM HÄNGER IHOP MED VEM', at: loc(1, A.hanger)},
        },
      ],
    },
  },
  {
    key: 'polisA',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: DAGENS ETC • REALTID',
    chrome: true,
    body: {
      type: 'stack',
      gap: 28,
      widgets: [
        {
          t: 'timeline',
          nodes: [
            {label: 'NOV 2025', sub: 'DAGENS ETC GRANSKAR', at: loc(2, A.enligt)},
            {label: 'MINST 5 ÅR', sub: 'I BRUK ENLIGT TIDNINGEN', at: loc(2, A.femAr), tone: 'blue'},
            {label: 'ACUS', sub: 'SVENSK VERSION AV GOTHAM', at: loc(2, A.acus), tone: 'red'},
          ],
          chips: [
            {text: 'ENLIGT DAGENS ETC', at: loc(2, A.enligt + 0.3)},
            {text: 'ANONYMA KÄLLOR', at: loc(2, A.gotham), tone: 'muted'},
          ],
        },
        {
          t: 'staff',
          title: 'POLISHUSET · KUNGSHOLMEN',
          at: loc(2, A.sex - 0.3),
          people: {n: 6, at: loc(2, A.sex), dur: 30, label: 'UTVECKLARE FRÅN PALANTIR'},
          week: {filled: 4, at: loc(2, A.fyraDagar), label: 'UPP TILL 4 DAGAR I VECKAN'},
        },
      ],
    },
  },
  {
    key: 'polisB',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: DAGENS ETC',
    chrome: true,
    body: {
      type: 'stack',
      gap: 26,
      widgets: [
        {
          t: 'fusion',
          height: 600,
          inputs: [
            {label: 'POLIS-REGISTER', at: loc(3, A.koppla)},
            {label: 'BANKID', at: loc(3, A.bankid - 0.2)},
            {label: 'MOBIL-OPERATÖRER', at: loc(3, A.mobiloperatorer - 0.3)},
          ],
          hub: {label: 'ACUS', at: loc(3, A.bankid + 0.4)},
          linksAt: loc(3, A.bankid + 0.2),
          outputs: [{label: 'PROFIL', at: loc(3, A.mobiloperatorer + 0.5), dashed: true}],
          footnote: {text: 'ENLIGT UPPGIFTER · SKA KUNNA', at: loc(3, A.mobiloperatorer + 0.6)},
        },
      ],
    },
  },
  {
    key: 'forsvaret',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: DAGENS ETC • DAGENS INDUSTRI',
    chrome: true,
    body: {
      type: 'stack',
      gap: 28,
      widgets: [
        {
          t: 'timeline',
          nodes: [
            {label: 'FLERA ÅR', sub: 'BEKRÄFTAT AV PALANTIRS SVERIGECHEF', at: loc(4, A.sverigechef)},
            {label: 'SEP 2025', sub: 'AVTAL OM MAVEN · ENLIGT DAGENS ETC', at: loc(4, A.september), tone: 'blue'},
          ],
          chips: [
            {text: 'FÖRSVARSMINISTERN: INGEN KOMMENTAR', at: loc(4, A.forsvarsministern), tone: 'muted'},
            {text: 'FÖRSVARSMAKTEN: "OPERATIV SEKRETESS"', at: loc(4, A.forsvarsministern + 0.8), tone: 'muted'},
          ],
          stamp: {text: 'OBEKRÄFTAT AV MYNDIGHET', at: loc(4, A.kommentera)},
        },
        {
          t: 'cards',
          cards: [
            {
              kicker: 'SYSTEMET SOM ANVÄNDES I KRIGET MOT IRAN',
              title: 'Maven',
              at: loc(4, A.maven),
              tag: 'SAMMA PRODUKT · KONFIGURATION I SVERIGE OKÄND',
            },
          ],
        },
      ],
    },
  },
  {
    key: 'svaren',
    from: starts[5],
    duration: dur(5),
    source: 'KÄLLA: RIKSDAGEN (FRÅGA 2025/26:167) • DAGENS ETC',
    chrome: true,
    body: {
      type: 'stack',
      gap: 36,
      widgets: [
        {
          t: 'columns3',
          cols: [
            {title: 'POLISEN', text: 'Hänvisar till rikets säkerhet', tone: 'ink', at: loc(5, A.rikets)},
            {title: 'REGERINGEN', text: 'Polisen avgör själv', tone: 'blue', at: loc(5, A.strommer)},
            {title: 'KRITIKER', text: 'Icke misstänkta kan kartläggas', tone: 'red', at: loc(5, A.kritiker)},
          ],
        },
        {
          t: 'bars',
          title: 'PALANTIR SVERIGE AB · ANSTÄLLDA',
          rows: [
            {label: '2015', n: 7, at: loc(5, A.avgor + 0.2), dur: 18, tone: 'muted'},
            {label: '2024', n: 24, at: loc(5, A.avgor + 1.0), dur: 36, tone: 'ink'},
          ],
        },
      ],
    },
  },
  {
    key: 'fraga',
    from: starts[6],
    duration: dur(6),
    source: 'KÄLLA: DAGENS ETC',
    chrome: true,
    body: {
      type: 'binary',
      question: 'Ska verktygen få vara hemliga?',
      questionAt: loc(6, A.fragan),
      options: ['HEMLIGT', 'OFFENTLIGT'],
      optionsAt: loc(6, A.hemliga - 0.2),
      switchAt: loc(6, A.eller, 0),
      save: {text: 'SPARA', at: loc(6, A.veta + 0.2)},
    },
  },
];

const chain: Episode2['chain'] = {
  labels: ['5 ÅR', 'ACUS', 'FÖRSVARET', 'VEM GRANSKAR?'],
  unlockAt: [gf(A.femAr), gf(A.acus), gf(A.forsvarsmakten), null],
};

/* ───────── sound effects ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
// 1 redacted answer
add(10, 'pop');
[0, 1, 2].forEach((i) => add(L(0, 24 + i * 5), 'tick_soft', 1));
add(L(0, loc(0, A.palantirEnd - 0.55)), 'flip');
add(L(0, loc(0, A.palantirEnd - 0.55)) + 4, 'thud', 0.8);
add(L(0, loc(0, A.svarade)), 'stamp');
// 2 explain
add(L(1, loc(1, A.amerikanskt)), 'pop');
[0.7, 1.25, 1.8, 2.35].forEach((o) => add(L(1, loc(1, A.amerikanskt + o)), 'pop_hi', 0.9));
add(L(1, loc(1, A.lagger + 0.3)), 'thud', 0.8);
add(L(1, loc(1, A.lagger + 0.5)), 'swish');
[-0.9, -0.3, 0.3].forEach((o) => add(L(1, loc(1, A.hanger + o)), 'pop', 0.8));
// 3a police
[A.enligt, A.femAr, A.acus].forEach((a) => add(L(2, loc(2, a)), 'pop'));
add(L(2, loc(2, A.gotham)), 'tick_soft');
add(L(2, loc(2, A.sex - 0.3)), 'pop');
add(L(2, loc(2, A.sex)), 'fill_blue', 0.7, 30);
add(L(2, loc(2, A.fyraDagar)), 'tick', 1);
[1, 2, 3].forEach((i) => add(L(2, loc(2, A.fyraDagar) + i * 6), 'tick', 0.9));
// 3b fusion
[A.koppla, A.bankid - 0.2, A.mobiloperatorer - 0.3].forEach((a) => add(L(3, loc(3, a)), 'pop_hi', 0.9));
add(L(3, loc(3, A.bankid + 0.4)), 'thud', 0.8);
add(L(3, loc(3, A.bankid + 0.2)), 'swish');
add(L(3, loc(3, A.mobiloperatorer + 0.5)), 'warn');
// 4 defence
add(L(4, loc(4, A.sverigechef)), 'pop');
add(L(4, loc(4, A.september)), 'pop');
add(L(4, loc(4, A.maven)), 'pop');
add(L(4, loc(4, A.forsvarsministern)), 'err', 0.9);
add(L(4, loc(4, A.forsvarsministern + 0.8)), 'err', 0.9);
add(L(4, loc(4, A.kommentera)), 'stamp');
add(L(4, loc(4, A.kommentera)) + 2, 'lock');
// 5 answers
[A.rikets, A.strommer, A.kritiker].forEach((a, i) => add(L(5, loc(5, a)), i === 2 ? 'warn' : 'pop'));
add(L(5, loc(5, A.avgor + 0.2)), 'count_short', 0.8, 40);
add(L(5, loc(5, A.avgor + 1.0)), 'fill_blue', 0.8, 40);
// 6 question
add(L(6, loc(6, A.fragan)), 'whoosh', 0.8);
add(L(6, loc(6, A.hemliga - 0.2)), 'pop_hi');
add(L(6, loc(6, A.hemliga - 0.2)) + 6, 'pop_hi', 0.9);
add(L(6, loc(6, A.eller, 0)), 'flip');
add(L(6, loc(6, A.veta + 0.2)), 'pop');
sfx.sort((a, b) => a.at - b.at);

export const palantir2: Episode2 = {
  meta: {id: 'palantir-del-2', tag: 'PALANTIR • DEL 2/2', fps: FPS, width: 1080, height: 1920},
  audioFile: 'palantir2.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const palantir2Duration = total;
