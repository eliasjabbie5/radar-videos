import {val4Timing as T} from './timing.val.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.5;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
// [0]hook [1]negative parliamentarism [2]four attempts [3]cost [4]question
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
      gap: 40,
      widgets: [
        {t: 'bigtext', text: '2', sub: 'OMRÖSTNINGAR TILL EXTRAVAL', at: loc(0, A.tva), size: 320},
        {
          t: 'timeline',
          nodes: [
            {label: 'FÖRSÖK 3', sub: 'OM RIKSDAGEN SÄGER NEJ', at: loc(0, A.misslyckade)},
            {label: 'FÖRSÖK 4', sub: 'OM RIKSDAGEN SÄGER NEJ', at: loc(0, A.misslyckade + 1.0)},
            {label: 'EXTRAVAL', sub: 'ENLIGT GRUNDLAGEN', at: loc(0, A.extraval), tone: 'red'},
          ],
        },
      ],
    },
  },
  {
    key: 'negativ',
    from: starts[1],
    duration: dur(1),
    source: 'KÄLLA: REGERINGSFORMEN 6 KAP. • RIKSDAGEN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 26,
      widgets: [
        {
          t: 'dots',
          title: 'RIKSDAGEN · 349 LEDAMÖTER',
          at: loc(1, A.majoritet),
          total: 349,
          cols: 30,
          size: 21,
          gap: 7,
          groups: [
            {label: 'HÖGERBLOCKET', n: 173, tone: 'ink', at: loc(1, A.n173), dur: 36},
            {label: 'ÖVRIGA (INKL. V)', n: 176, tone: 'blue', at: loc(1, A.vald), dur: 40},
          ],
          mark: {index: 174, label: 'NEJ-MAJORITET = 175', at: loc(1, A.n175)},
        },
        {
          t: 'checklist',
          rows: [
            {text: '175 NEJ KRÄVS FÖR ATT FÄLLA', state: 'unknown', at: loc(1, A.n175)},
            {text: 'HÖGERBLOCKET HAR 173', sub: 'SAKNAR 2 RÖSTER', state: 'no', at: loc(1, A.n173)},
            {text: 'V LÄGGER NER SINA RÖSTER', sub: 'ANDERSSON BLIR VALD', state: 'yes', at: loc(1, A.lagger)},
          ],
        },
      ],
    },
  },
  {
    key: 'chanser',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: REGERINGSFORMEN 6 KAP.',
    chrome: true,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {
          t: 'dots',
          title: 'TALMANNENS FYRA FÖRSÖK',
          at: loc(2, A.fyra - 0.3),
          total: 4,
          cols: 4,
          size: 150,
          gap: 30,
          groups: [
            {label: 'FÖRBRUKADE', n: 2, tone: 'ink', at: loc(2, A.forbrukade - 0.4), dur: 12},
            {label: 'KVAR', n: 2, tone: 'blue', at: loc(2, A.fyra), dur: 12},
          ],
        },
        {t: 'bigtext', text: 'EXTRAVAL', sub: 'INOM 3 MÅNADER · ENLIGT GRUNDLAGEN', at: loc(2, A.nej2 + 0.3), size: 150},
      ],
    },
  },
  {
    key: 'kostnad',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: REGERINGSFORMEN • RIKSDAGEN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {
          t: 'cards',
          cards: [
            {kicker: 'ETT EXTRAVAL KOSTAR', title: 'Hundratals miljoner', at: loc(3, A.hundratals - 0.3), tag: 'KRONOR'},
            {kicker: 'LÖSER DET DÖDLÄGET?', title: 'Ingen garanti', at: loc(3, A.garanterar), tag: 'DÖDLÄGET KAN KVARSTÅ'},
          ],
        },
      ],
    },
  },
  {
    key: 'fraga',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: RIKSDAGEN',
    chrome: true,
    body: {
      type: 'binary',
      question: 'Lösning eller extraval?',
      questionAt: loc(4, A.fragan),
      options: ['LÖSNING', 'EXTRAVAL'],
      optionsAt: loc(4, A.loser - 0.2),
      switchAt: loc(4, A.eller, 0),
      save: {text: 'SPARA', at: loc(4, A.extraval3 + 0.2)},
      teaser: {text: 'TALMANNEN VILL HA BESKED FÖRE JUL', at: loc(4, A.jul)},
    },
  },
];

const chain: Episode2['chain'] = {
  labels: ['175 NEJ', '173 MANDAT', '2 AV 4', 'EXTRAVAL?'],
  unlockAt: [gf(A.n175), gf(A.n173), gf(A.forbrukade), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
// hook
add(L(0, loc(0, A.tva)), 'thud', 0.9);
[A.misslyckade, A.misslyckade + 1.0].forEach((a) => add(L(0, loc(0, a)), 'pop'));
add(L(0, loc(0, A.extraval)), 'warn', 0.9);
// negative parliamentarism
add(L(1, loc(1, A.majoritet)), 'pop');
add(L(1, loc(1, A.n175)), 'ping', 0.8);
add(L(1, loc(1, A.n173)), 'fill_blue', 0.6, 36);
add(L(1, loc(1, A.n173)), 'err', 0.9);
add(L(1, loc(1, A.vald)), 'fill_blue', 0.6, 40);
add(L(1, loc(1, A.lagger)), 'chime', 0.8);
// four attempts
add(L(2, loc(2, A.fyra - 0.3)), 'pop');
add(L(2, loc(2, A.forbrukade - 0.4)), 'tick', 1);
add(L(2, loc(2, A.forbrukade - 0.4)) + 6, 'tick', 1);
add(L(2, loc(2, A.nej2 + 0.3)), 'thud', 0.8);
add(L(2, loc(2, A.nej2 + 0.3)), 'warn', 0.8);
// cost
add(L(3, loc(3, A.hundratals - 0.3)), 'pop');
add(L(3, loc(3, A.garanterar)), 'pop');
add(L(3, loc(3, A.garanterar)) + 6, 'err', 0.9);
// question
add(L(4, loc(4, A.fragan)), 'whoosh', 0.8);
add(L(4, loc(4, A.loser - 0.2)), 'pop_hi');
add(L(4, loc(4, A.loser - 0.2)) + 6, 'pop_hi', 0.9);
add(L(4, loc(4, A.eller, 0)), 'flip');
add(L(4, loc(4, A.extraval3 + 0.2)), 'pop');
sfx.sort((a, b) => a.at - b.at);

export const val4: Episode2 = {
  meta: {id: 'valet-del-4', tag: 'VALET 2026 • DEL 4/4', fps: FPS, width: 1080, height: 1920},
  audioFile: 'val4.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const val4Duration = total;
