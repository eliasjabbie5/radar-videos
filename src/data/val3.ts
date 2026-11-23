import {val3Timing as T} from './timing.val.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.3;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
// [0]hook [1]plan [2]stuck [3]maths [4]cliff  (the hook's last word ends just after scene 1's nominal start -> hold 0.3 s)
const startSecs = [T.sceneStarts[0], T.sceneStarts[1] + 0.3, T.sceneStarts[2], T.sceneStarts[3], T.sceneStarts[4]];
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
        {t: 'bigtext', text: 'C ≠ V', sub: 'CENTERPARTIET · VÄNSTERPARTIET', at: loc(0, A.krocken - 0.2), size: 230},
        {
          t: 'checklist',
          rows: [
            {text: 'CENTERN VALDE ANDERSSON', sub: 'SOCIALDEMOKRATERNAS FÖRSLAG', state: 'yes', at: loc(0, A.valt)},
            {text: 'ÄNDÅ INGEN REGERING', state: 'no', at: loc(0, A.ingen)},
            {text: 'VARFÖR?', state: 'unknown', at: loc(0, A.varfor)},
          ],
        },
      ],
    },
  },
  {
    key: 'plan',
    from: starts[1],
    duration: dur(1),
    source: 'KÄLLA: PARTIERNAS UTTALANDEN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 32,
      widgets: [
        {
          t: 'columns3',
          cols: [
            {title: 'S', text: 'Socialdemokraterna', tone: 'blue', at: loc(1, A.plan)},
            {title: 'C', text: 'Centerpartiet', tone: 'green', at: loc(1, A.c - 0.2)},
            {title: 'MP', text: 'Miljöpartiet', tone: 'ink', at: loc(1, A.mp - 0.2)},
          ],
        },
        {
          t: 'cards',
          cards: [
            {
              kicker: 'VÄNSTERPARTIET STÅR UTANFÖR',
              title: 'Paket på',
              at: loc(1, A.utanfor),
              value: {to: 135, suffix: ' punkter', at: loc(1, A.n135), dur: 26},
              tag: 'NÄRA SAMARBETE · INFLYTANDE UTAN MINISTRAR',
            },
          ],
        },
      ],
    },
  },
  {
    key: 'fastkort',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: PARTIERNAS UTTALANDEN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {t: 'bigtext', text: 'KÖRT FAST', sub: 'FÖRHANDLINGARNA', at: loc(2, A.forhandlingarna), size: 150},
        {
          t: 'versus',
          left: {title: 'VÄNSTERPARTIET', tone: 'ink', at: loc(2, A.v), rows: [{text: 'Kräver egna ministerposter', at: loc(2, A.ministerposter - 0.9)}]},
          right: {
            title: 'CENTERPARTIET',
            tone: 'blue',
            at: loc(2, A.cp),
            rows: [
              {text: 'Nej till V-ministrar', at: loc(2, A.vministrar)},
              {text: 'Nej till stora delar av V:s politik', at: loc(2, A.ekonomiska)},
            ],
          },
          stamp: {text: 'FASTLÅST', at: loc(2, A.ekonomiska + 1.2)},
        },
      ],
    },
  },
  {
    key: 'matten',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: RIKSDAGEN',
    chrome: true,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {t: 'bigtext', text: 'MATTEN', sub: 'RIKSDAGEN · 349 LEDAMÖTER', at: loc(3, A.matten), size: 170},
        {
          t: 'checklist',
          rows: [
            {text: 'RÖDGRÖNA UTAN V', sub: 'SAKNAR STÖD NOG', state: 'no', at: loc(3, A.rodgronA)},
            {text: 'V RÖSTAR NEJ', sub: 'STATSMINISTERVALET', state: 'no', at: loc(3, A.nejknappen), stamp: {text: 'FALLER', at: loc(3, A.faller + 0.4)}},
          ],
        },
      ],
    },
  },
  {
    key: 'cliff',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: PARTIERNAS UTTALANDEN',
    chrome: false,
    body: {type: 'cliff', pulseAt: 0, card: {title: 'DEL 4 · KRASCH?', sub: 'NÄSTA VIDEO', at: loc(4, A.kraschar - 0.3)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['S+C+MP', '135 PUNKTER', 'NEJ = FALL', 'VAD NU?'],
  unlockAt: [gf(A.mp + 0.3), gf(A.punkter), gf(A.faller + 0.3), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
// hook
add(L(0, loc(0, A.valt)), 'chime', 0.8);
add(L(0, loc(0, A.ingen)), 'err', 0.9);
add(L(0, loc(0, A.varfor)), 'warn', 0.8);
add(L(0, loc(0, A.krocken - 0.2)), 'thud', 0.9);
// plan
[A.plan, A.c - 0.2, A.mp - 0.2].forEach((a) => add(L(1, loc(1, a)), 'pop'));
add(L(1, loc(1, A.utanfor)), 'pop');
add(L(1, loc(1, A.n135)), 'count_short', 0.8, 26);
// stuck
add(L(2, loc(2, A.forhandlingarna)), 'thud', 0.8);
[A.v, A.cp].forEach((a) => add(L(2, loc(2, a)), 'pop'));
[A.vministrar, A.ekonomiska].forEach((a) => add(L(2, loc(2, a)), 'err', 0.9));
add(L(2, loc(2, A.ekonomiska + 1.2)), 'stamp');
// maths
add(L(3, loc(3, A.matten)), 'thud', 0.8);
add(L(3, loc(3, A.rodgronA)), 'err', 0.9);
add(L(3, loc(3, A.nejknappen)), 'pop');
add(L(3, loc(3, A.faller + 0.4)), 'stamp');
// cliff
add(L(4, loc(4, A.kraschar - 0.3)), 'pop_hi');
add(L(4, loc(4, A.kraschar - 0.3)) + 8, 'lock');
sfx.sort((a, b) => a.at - b.at);

export const val3: Episode2 = {
  meta: {id: 'valet-del-3', tag: 'VALET 2026 • DEL 3/4', fps: FPS, width: 1080, height: 1920},
  audioFile: 'val3.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const val3Duration = total;
