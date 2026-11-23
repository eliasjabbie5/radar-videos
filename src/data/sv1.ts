import {sv1Timing as T} from './timing.sv.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.5;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
// [0]hook [1]who owns [2]connected [3]efficient/vulnerable [4]excluded + e-id [5]question
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
        {t: 'bigtext', text: 'BANKID NERE', sub: 'I BARA EN TIMME', at: loc(0, A.bankid), size: 140},
        {
          t: 'checklist',
          rows: [
            {text: 'LOGGA IN HOS LÄKAREN', state: 'no', at: loc(0, A.lakaren)},
            {text: 'DEKLARERA', state: 'no', at: loc(0, A.deklarera)},
            {text: 'BETALA EN RÄKNING', state: 'no', at: loc(0, A.rakning)},
            {text: 'HÄMTA UT ETT PAKET', state: 'no', at: loc(0, A.paket - 0.2)},
          ],
        },
      ],
    },
  },
  {
    key: 'agare',
    from: starts[1],
    duration: dur(1),
    source: 'KÄLLA: FINANSIELL ID-TEKNIK • GETSWISH',
    chrome: true,
    body: {
      type: 'stack',
      gap: 36,
      widgets: [
        {t: 'bigtext', text: 'PRIVAT', sub: 'SVERIGES VIKTIGASTE DIGITALA INFRASTRUKTUR', at: loc(1, A.maerkliga), size: 190},
        {
          t: 'versus',
          left: {title: 'STATEN', tone: 'blue', at: loc(1, A.staten - 0.4), rows: [{text: 'Äger den inte', at: loc(1, A.staten)}]},
          right: {title: 'STORBANKERNA', tone: 'ink', at: loc(1, A.agsAv), rows: [{text: 'Äger den', at: loc(1, A.storbankerna)}]},
        },
      ],
    },
  },
  {
    key: 'inkopplat',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: FINANSIELL ID-TEKNIK • GETSWISH',
    chrome: true,
    body: {
      type: 'stack',
      gap: 26,
      widgets: [
        {
          t: 'fusion',
          height: 700,
          inputs: [
            {label: 'SKATTEVERKET', at: loc(2, A.skatteverket)},
            {label: '1177', at: loc(2, A.n1177)},
            {label: 'MYNDIGHETER', at: loc(2, A.n1177 + 0.5)},
            {label: 'SAMHÄLLET', at: loc(2, A.system - 0.5)},
          ],
          hub: {label: 'BANKID', at: loc(2, A.bankid3)},
          linksAt: loc(2, A.skatteverket + 0.2),
          outputs: [
            {label: 'SWISH', at: loc(2, A.swish)},
            {label: 'BANKERNA', at: loc(2, A.banksamarbeten)},
          ],
          footnote: {text: 'BYGGT SOM PRIVATA BANKSAMARBETEN', at: loc(2, A.banksamarbeten)},
        },
      ],
    },
  },
  {
    key: 'sarbart',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: UTREDNINGAR • MEDIERNA',
    chrome: true,
    body: {
      type: 'stack',
      gap: 28,
      widgets: [
        {t: 'cards', cards: [{kicker: 'ETT AV VÄRLDENS MEST EFFEKTIVA', title: 'Kontantlöst', at: loc(3, A.effektiva), tag: 'SVERIGE UTAN KONTANTER'}]},
        {t: 'bigtext', text: 'SÅRBART', sub: 'VARDAGEN STANNAR DIREKT', at: loc(3, A.sarbarhet), size: 150},
        {
          t: 'checklist',
          rows: [
            {text: 'EN TEKNISK BUGG', sub: 'SLÅR UT SYSTEMET', state: 'no', at: loc(3, A.bugg)},
            {text: 'EN ÖVERBELASTNINGSATTACK', state: 'no', at: loc(3, A.overbelastning)},
          ],
        },
      ],
    },
  },
  {
    key: 'utesluten',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: REGERINGEN (UTREDNING)',
    chrome: true,
    body: {
      type: 'stack',
      gap: 40,
      widgets: [
        {t: 'bigtext', text: 'UTESTÄNGD', sub: 'DEN SOM NEKAS KONTO HOS EN STORBANK', at: loc(4, A.nekas), size: 150},
        {t: 'checklist', rows: [{text: 'STATLIG E-LEGITIMATION', sub: 'UTREDS · SOM BACKUP', state: 'unknown', at: loc(4, A.utreds)}]},
      ],
    },
  },
  {
    key: 'fraga',
    from: starts[5],
    duration: dur(5),
    source: 'KÄLLA: REGERINGEN (UTREDNING)',
    chrome: true,
    body: {
      type: 'binary',
      question: 'Vem ska äga nyckeln?',
      questionAt: loc(5, A.fragan),
      options: ['BANKERNA', 'STATEN'],
      optionsAt: loc(5, A.bankerna - 0.2),
      switchAt: loc(5, A.eller, 0),
      save: {text: 'SPARA', at: loc(5, A.identitet + 0.2)},
    },
  },
];

const chain: Episode2['chain'] = {
  labels: ['PRIVAT', 'SÅRBART', 'UTESTÄNGD', 'STATEN?'],
  unlockAt: [gf(A.storbankerna), gf(A.sarbarhet), gf(A.stangas), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.bankid)), 'thud', 0.9);
[A.lakaren, A.deklarera, A.rakning, A.paket - 0.2].forEach((a) => add(L(0, loc(0, a)), 'err', 0.8));
add(L(1, loc(1, A.maerkliga)), 'thud', 0.8);
[A.staten - 0.4, A.agsAv].forEach((a) => add(L(1, loc(1, a)), 'pop'));
add(L(1, loc(1, A.storbankerna)), 'pop_hi', 0.9);
[A.skatteverket, A.n1177, A.n1177 + 0.5, A.system - 0.5].forEach((a) => add(L(2, loc(2, a)), 'pop_hi', 0.9));
add(L(2, loc(2, A.skatteverket + 0.2)), 'swish');
add(L(2, loc(2, A.bankid3)), 'thud', 0.8);
[A.swish, A.banksamarbeten].forEach((a) => add(L(2, loc(2, a)), 'pop', 0.9));
add(L(3, loc(3, A.effektiva)), 'pop');
add(L(3, loc(3, A.sarbarhet)), 'thud', 0.8);
[A.bugg, A.overbelastning].forEach((a) => add(L(3, loc(3, a)), 'err', 0.9));
add(L(4, loc(4, A.nekas)), 'thud', 0.8);
add(L(4, loc(4, A.utreds)), 'pop');
add(L(5, loc(5, A.fragan)), 'whoosh', 0.8);
add(L(5, loc(5, A.bankerna - 0.2)), 'pop_hi');
add(L(5, loc(5, A.bankerna - 0.2)) + 6, 'pop_hi', 0.9);
add(L(5, loc(5, A.eller, 0)), 'flip');
add(L(5, loc(5, A.identitet + 0.2)), 'pop');
sfx.sort((a, b) => a.at - b.at);

export const sv1: Episode2 = {
  meta: {id: 'sverige-bankid', tag: 'SVERIGE • BANKID', fps: FPS, width: 1080, height: 1920},
  audioFile: 'sv1.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const sv1Duration = total;
