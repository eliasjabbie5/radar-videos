import {ec2Timing as T} from './timing.ec.generated';
import type {SfxEvent, SfxName} from './types';
import type {Episode2, Scene2} from './types2';

const FPS = 30;
const A = T.anchors;
const TAIL_SECONDS = 1.5;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
const startSecs = T.sceneStarts;
const starts = startSecs.map((s) => Math.round(s * FPS));
const gf = (sec: number) => Math.round(sec * FPS);
const loc = (i: number, sec: number, lead = 3) => Math.max(0, Math.round(sec * FPS) - starts[i] - lead);
const dur = (i: number) => (i + 1 < starts.length ? starts[i + 1] : total) - starts[i];

const scenes: Scene2[] = [
  {
    key: 'hook', from: starts[0], duration: dur(0), source: null, chrome: false,
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'bigtext', text: '1995', sub: 'EU STÄNGER DE STATLIGA MONOPOLEN', at: loc(0, A.n1995), size: 190},
      {t: 'checklist', rows: [
        {text: 'APOTEK', sub: 'MONOPOLET FÖRSVANN', state: 'no', at: loc(0, A.apotek)},
        {text: 'TÅG', sub: 'MONOPOLET FÖRSVANN', state: 'no', at: loc(0, A.tag)},
        {text: 'TELEKOM', sub: 'MONOPOLET FÖRSVANN', state: 'no', at: loc(0, A.telekom)},
        {text: 'SYSTEMBOLAGET', sub: 'ÖVERLEVDE', state: 'yes', at: loc(0, A.systembolaget)},
      ]},
    ]},
  },
  {
    key: 'folkhalsa', from: starts[1], duration: dur(1), source: 'KÄLLA: EU-KOMMISSIONEN • RIKSDAGEN', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'FOLKHÄLSA', sub: 'SVERIGE ÖVERTYGADE EU', at: loc(1, A.overtyga), size: 190},
      {t: 'versus',
        left: {title: 'INTE', tone: 'ink', at: loc(1, A.pengar - 0.6), rows: [{text: 'Att tjäna pengar', at: loc(1, A.pengar)}]},
        right: {title: 'SYFTET', tone: 'green', at: loc(1, A.folkhalsa - 0.5), rows: [{text: 'Folkhälsa', at: loc(1, A.folkhalsa)}]}},
    ]},
  },
  {
    key: 'hur', from: starts[2], duration: dur(2), source: 'KÄLLA: SYSTEMBOLAGET • REGERINGEN', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'checklist', rows: [
        {text: 'INGET VINSTINTRESSE', state: 'yes', at: loc(2, A.vinstintresset)},
        {text: 'BEGRÄNSADE ÖPPETTIDER', state: 'yes', at: loc(2, A.oppettiderna)},
        {text: 'INGA LOCKPRISER', sub: 'PÅ ALKOHOL', state: 'yes', at: loc(2, A.lockpriser)},
      ]},
      {t: 'bigtext', text: 'DRICKER MINDRE', sub: 'ENLIGT STATEN · LEVER LÄNGRE', at: loc(2, A.dricker), size: 130},
    ]},
  },
  {
    key: 'garden', from: starts[3], duration: dur(3), source: 'KÄLLA: REGERINGEN • BRYGGERIER', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'bigtext', text: 'GÅRDS-FÖRSÄLJNING', sub: 'DEBATTEN HAR BLOSSAT UPP IGEN', at: loc(3, A.debatten), size: 100},
      {t: 'cards', cards: [{kicker: 'SMÅ BRYGGERIER OCH VINGÅRDAR', title: 'Egna flaskor', at: loc(3, A.bryggerier), tag: 'SÄLJA DIREKT TILL BESÖKARE'}]},
    ]},
  },
  {
    key: 'striden', from: starts[4], duration: dur(4), source: 'KÄLLA: EU-DOMSTOLEN • FÖRESPRÅKARE', chrome: true,
    body: {type: 'stack', gap: 36, widgets: [
      {t: 'versus',
        left: {title: 'KRITIKER', tone: 'red', at: loc(4, A.kritiker), rows: [{text: 'Kan hota monopolet i EU-domstolen', at: loc(4, A.eudomstolen - 0.8)}]},
        right: {title: 'FÖRESPRÅKARE', tone: 'blue', at: loc(4, A.forespraks - 0.2), rows: [{text: 'Reglerna är hopplöst föråldrade', at: loc(4, A.foraldrade - 0.8)}]}},
    ]},
  },
  {
    key: 'fraga', from: starts[5], duration: dur(5), source: 'KÄLLA: SYSTEMBOLAGET', chrome: true,
    body: {type: 'binary', question: 'Skydda Systembolaget?', questionAt: loc(5, A.sa), options: ['SKYDDA', 'MATAFFÄRER'],
      optionsAt: loc(5, A.skydda - 0.2), switchAt: loc(5, A.eller, 0), save: {text: 'SPARA', at: loc(5, A.mataffarerEnd)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['1995', 'FOLKHÄLSA', 'GÅRDSFÖRS.', 'FRAMTID?'],
  unlockAt: [starts[1] + 12, gf(A.folkhalsa), gf(A.gardsforsaljning), null],
};

/* ───────── sound effects (levels: SFX_MASTER in src/lib/sfx.ts) ───────── */
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.n1995)), 'thud', 0.9);
add(L(0, loc(0, A.apotek)), 'err', 0.8);
add(L(0, loc(0, A.tag)), 'err', 0.8);
add(L(0, loc(0, A.telekom)), 'err', 0.8);
add(L(0, loc(0, A.systembolaget)), 'chime', 0.8);
add(L(1, loc(1, A.overtyga)), 'thud', 0.8);
add(L(1, loc(1, A.pengar)), 'pop', 0.9);
add(L(1, loc(1, A.folkhalsa)), 'pop', 0.9);
add(L(2, loc(2, A.vinstintresset)), 'chime', 0.7);
add(L(2, loc(2, A.oppettiderna)), 'chime', 0.7);
add(L(2, loc(2, A.lockpriser)), 'chime', 0.7);
add(L(2, loc(2, A.dricker)), 'thud', 0.7);
add(L(3, loc(3, A.debatten)), 'thud', 0.7);
add(L(3, loc(3, A.bryggerier)), 'pop', 0.9);
add(L(4, loc(4, A.kritiker)), 'pop', 0.9);
add(L(4, loc(4, A.forespraks)), 'pop', 0.9);
add(L(5, loc(5, A.sa)), 'whoosh', 0.8);
add(L(5, loc(5, A.skydda)), 'pop_hi', 1);
add(L(5, loc(5, A.eller)), 'flip', 1);
sfx.sort((a, b) => a.at - b.at);

export const ec2: Episode2 = {
  meta: {id: 'sverige-systembolaget', tag: 'SVERIGE • SYSTEMBOLAGET', fps: FPS, width: 1080, height: 1920},
  audioFile: 'ec2.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const ec2Duration = total;
