import {palantir1Timing as T} from './timing.palantir.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 2.2; // hold on the cliffhanger card
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
// hold the hook scene a moment so the PALANTIR headline is readable before the cross-fade
const startSecs = T.sceneStarts.map((s, i) => (i === 1 ? A.palantirEnd + 0.4 : s));
const starts = startSecs.map((s) => Math.round(s * FPS));
const gf = (sec: number) => Math.round(sec * FPS);
const loc = (i: number, sec: number, lead = 3) => Math.max(0, Math.round(sec * FPS) - starts[i] - lead);
const span = (a: number, b: number) => Math.max(1, Math.round((b - a) * FPS));
const dur = (i: number) => (i + 1 < starts.length ? starts[i + 1] : total) - starts[i];

const scenes: Scene2[] = [
  {
    key: 'hook',
    from: starts[0],
    duration: dur(0),
    source: null,
    chrome: false,
    body: {
      type: 'hookTiles',
      tiles: [
        {label: 'ICE', sub: 'USA · MIGRATIONS-MYNDIGHETEN', at: loc(0, A.ice)},
        {label: 'NATO', sub: 'FÖRSVARS-ALLIANS', at: loc(0, A.nato)},
        {label: 'ISRAEL', sub: 'FÖRSVARSMAKT', at: loc(0, A.israel)},
        {label: 'SVERIGE?', sub: 'POLISEN · ENLIGT DAGENS ETC', at: loc(0, A.polisen - 0.5), locked: true},
      ],
      headline: {text: 'PALANTIR', at: loc(0, A.palantirEnd - 0.75)},
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
        {t: 'bigtext', text: '2003', sub: 'GRUNDAT I USA · FÖR UNDERRÄTTELSETJÄNSTEN · MOT TERRORISM', at: loc(1, A.grundades), size: 150},
        {
          t: 'fusion',
          height: 640,
          inputs: [
            {label: 'REGISTER', at: loc(1, A.lagger - 0.3)},
            {label: 'KAMEROR', at: loc(1, A.lagger + 0.4)},
            {label: 'TELEFONER', at: loc(1, A.lagger + 1.1)},
            {label: 'DOKUMENT', at: loc(1, A.register - 0.4)},
          ],
          hub: {label: 'PALANTIR', at: loc(1, A.register + 0.2)},
          linksAt: loc(1, A.register + 0.4),
          outputs: [
            {label: 'PERSON', at: loc(1, A.hanger - 0.2)},
            {label: 'PLATS', at: loc(1, A.varoch)},
            {label: 'TID', at: loc(1, A.varoch + 0.7)},
          ],
          footnote: {text: 'VEM HÄNGER IHOP MED VEM — VAR OCH NÄR', at: loc(1, A.hanger)},
        },
      ],
    },
  },
  {
    key: 'iceNato',
    from: starts[2],
    duration: dur(2),
    source: 'KÄLLA: THE REGISTER • TECHRADAR • NATO NCIA',
    chrome: true,
    body: {
      type: 'stack',
      gap: 30,
      widgets: [
        {
          t: 'cards',
          cards: [
            {
              kicker: 'USA · MIGRATIONSMYNDIGHETEN ICE',
              title: 'ImmigrationOS',
              at: loc(2, A.usa),
              value: {prefix: '≈ $', to: 30, suffix: ' MILJ.', at: loc(2, A.trettio), dur: span(A.trettio, A.dollar)},
              tag: 'APRIL 2025 · BYGGT PÅ ICE:S ÄRENDESYSTEM',
              stamp: {text: 'UTAN KONKURRENS', at: loc(2, A.dollar + 0.3)},
            },
            {
              kicker: 'NATO KÖPTE',
              title: 'Maven',
              at: loc(2, A.nato2),
              value: {text: '2025', at: loc(2, A.maven - 0.3)},
              tag: 'INTELLIGENS · MÅLVAL · PLANERING (NATO NCIA)',
            },
          ],
        },
        {
          t: 'checklist',
          rows: [
            {text: 'Bygger på ICE:s ärendesystem sedan 2014', state: 'yes', at: loc(2, A.immigrationos)},
            {text: 'Ska följa "självutvisning" i nära realtid', sub: 'ENLIGT BUSINESS INSIDER', state: 'yes', at: loc(2, A.ice2)},
          ],
        },
      ],
    },
  },
  {
    key: 'iran',
    from: starts[3],
    duration: dur(3),
    source: 'KÄLLA: THE REGISTER • BREAKING DEFENSE • CNBC',
    chrome: true,
    body: {
      type: 'stack',
      gap: 22,
      widgets: [
        {t: 'checklist', rows: [{text: 'MAVEN ANVÄNDES I USA:S KRIG MOT IRAN', sub: 'ENLIGT PENTAGON', state: 'yes', at: loc(3, A.maven2)}]},
        {
          t: 'counter',
          label: 'MÅL',
          to: 13000,
          at: loc(3, A.tretton),
          dur: span(A.tretton, A.dagar),
          grid: {n: 38, label: 'ENLIGT PENTAGON', at: loc(3, A.tretton), dur: span(A.tretton, A.dagar)},
        },
        {
          t: 'checklist',
          rows: [
            {text: 'MOT IRANS LEDARE KHAMENEI?', sub: 'OM MAVEN ANVÄNDES MOT HONOM', state: 'unknown', at: loc(3, A.khamenei), stamp: {text: 'OBEKRÄFTAT', at: loc(3, A.obekraftat)}},
            {text: 'PALANTIRS VD: INGEN KOMMENTAR', state: 'no', at: loc(3, A.avbojde)},
          ],
        },
      ],
    },
  },
  {
    key: 'gaza',
    from: starts[4],
    duration: dur(4),
    source: 'KÄLLA: PALANTIR • BUSINESS & HUMAN RIGHTS CENTRE • ANADOLU',
    chrome: true,
    body: {
      type: 'stack',
      gap: 34,
      widgets: [
        {
          t: 'timeline',
          nodes: [
            {label: '7 OKT 2023', sub: 'KRIGET BÖRJAR', at: loc(4, A.gaza)},
            {label: 'JAN 2024', sub: 'PALANTIR: "STRATEGISKT PARTNERSKAP"', at: loc(4, A.partnerskap), tone: 'blue'},
          ],
        },
        {
          t: 'versus',
          left: {
            title: 'BEKRÄFTAT',
            tone: 'green',
            at: loc(4, A.partnerskap),
            rows: [
              {text: 'Partnerskap med Israels försvar', at: loc(4, A.partnerskap + 0.3)},
              {text: '"Krigsrelaterade uppdrag"', at: loc(4, A.krigsrelaterade)},
            ],
          },
          right: {
            title: 'PÅSTÅS',
            tone: 'red',
            at: loc(4, A.kritiker - 0.2),
            rows: [
              {text: 'Kritiker: tekniken används mot mål', at: loc(4, A.kritiker + 0.3)},
              {text: 'FN-rapportör: liknande påstående', at: loc(4, A.mal)},
            ],
          },
          stamp: {text: 'PALANTIR FÖRNEKAR', at: loc(4, A.fornekar)},
        },
        {
          t: 'checklist',
          rows: [
            {text: 'Partnerskapet: Palantirs eget uttalande', state: 'yes', at: loc(4, A.krigsrelaterade + 0.4)},
            {text: 'Målval i Gaza: inte bekräftat', sub: 'PALANTIR NEKAR KOPPLING TILL LAVENDER', state: 'unknown', at: loc(4, A.mal + 0.3)},
          ],
        },
      ],
    },
  },
  {
    key: 'cliff',
    from: starts[5],
    duration: dur(5),
    source: 'KÄLLA: DAGENS ETC',
    chrome: true,
    body: {type: 'cliff', pulseAt: loc(5, A.sverige), card: {title: 'DEL 2 • I MORGON 18:00', sub: 'PALANTIR I SVERIGE', at: loc(5, A.delTva - 0.6)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['2003', 'ICE • NATO', 'IRAN • GAZA', 'SVERIGE?'],
  unlockAt: [gf(A.grundades), gf(A.ice2), gf(A.gaza), null],
};

/* ───────── sound effects, derived from the same cues ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
// 1 hook
(scenes[0].body as Extract<Scene2['body'], {type: 'hookTiles'}>).tiles.forEach((t) => add(L(0, t.at), t.locked ? 'warn' : 'pop', 1));
add(L(0, loc(0, A.palantirEnd - 0.75)), 'stamp', 1);
// chain unlocks
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
// 2 what is Palantir
add(L(1, loc(1, A.grundades)), 'pop');
[loc(1, A.lagger - 0.3), loc(1, A.lagger + 0.4), loc(1, A.lagger + 1.1), loc(1, A.register - 0.4)].forEach((l) => add(L(1, l), 'pop_hi', 0.9));
add(L(1, loc(1, A.register + 0.2)), 'thud', 0.8);
add(L(1, loc(1, A.register + 0.4)), 'swish');
[loc(1, A.hanger - 0.2), loc(1, A.varoch), loc(1, A.varoch + 0.7)].forEach((l) => add(L(1, l), 'pop', 0.8));
// 3 ICE + NATO
add(L(2, loc(2, A.usa)), 'pop');
add(L(2, loc(2, A.trettio)), 'count_short', 1, span(A.trettio, A.dollar));
add(L(2, loc(2, A.dollar + 0.3)), 'stamp');
add(L(2, loc(2, A.nato2)), 'pop');
add(L(2, loc(2, A.maven - 0.3)), 'ping', 0.8);
add(L(2, loc(2, A.immigrationos)), 'chime', 0.8);
add(L(2, loc(2, A.ice2)), 'chime', 0.8);
// 4 Iran
add(L(3, loc(3, A.maven2)), 'chime');
add(L(3, loc(3, A.tretton)), 'count', 1, span(A.tretton, A.dagar));
add(L(3, loc(3, A.tretton)), 'fill_blue', 0.8, span(A.tretton, A.dagar));
add(L(3, loc(3, A.khamenei)), 'pop_hi');
add(L(3, loc(3, A.obekraftat)), 'stamp');
add(L(3, loc(3, A.obekraftat)) + 2, 'warn');
add(L(3, loc(3, A.avbojde)), 'err');
// 5 Gaza
add(L(4, loc(4, A.gaza)), 'swish');
add(L(4, loc(4, A.partnerskap)), 'pop');
add(L(4, loc(4, A.partnerskap + 0.3)), 'chime', 0.8);
add(L(4, loc(4, A.krigsrelaterade)), 'tick_soft');
add(L(4, loc(4, A.kritiker - 0.2)), 'pop');
add(L(4, loc(4, A.kritiker + 0.3)), 'warn', 0.8);
add(L(4, loc(4, A.mal)), 'tick_soft');
add(L(4, loc(4, A.fornekar)), 'stamp');
add(L(4, loc(4, A.fornekar)) + 2, 'err');
add(L(4, loc(4, A.krigsrelaterade + 0.4)), 'chime', 0.8);
add(L(4, loc(4, A.mal + 0.3)), 'pop_hi', 0.9);
// 6 cliffhanger
[0, 1, 2].forEach((i) => add(L(5, 6 + i * 6), 'pop', 0.8));
add(L(5, 6 + 3 * 6), 'lock');
add(L(5, loc(5, A.delTva - 0.6)), 'pop_hi');
sfx.sort((a, b) => a.at - b.at);

export const palantir1: Episode2 = {
  meta: {id: 'palantir-del-1', tag: 'PALANTIR • DEL 1/2', fps: FPS, width: 1080, height: 1920},
  audioFile: 'palantir1.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const palantir1Duration = total;
