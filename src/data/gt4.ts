import {gt4Timing as T} from './timing.gt.generated';
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
    body: {type: 'stack', gap: 30, widgets: [
      {t: 'bigtext', text: 'LÄCKAN', sub: 'DEN STÖRSTA I SPELHISTORIEN', at: loc(0, A.lackan - 0.3), size: 200},
      {t: 'map', title: 'INTE EN STAT – EN 17-ÅRING', view: {lon0: -11, lon1: 4, lat0: 49.5, lat1: 59.5}, squash: 0.62, dots: 70, at: loc(0, A.stat),
        markers: [{label: 'LONDON • HOTELLRUM', lon: -0.12, lat: 51.5, at: loc(0, A.hotellrum), tone: 'red', side: 'l'}]},
    ]},
  },
  {
    key: 'intrang', from: starts[1], duration: dur(1), source: 'KÄLLA: RÄTTEGÅNGSHANDLINGAR • MEDIA', chrome: true,
    body: {type: 'stack', gap: 30, widgets: [
      {t: 'counter', label: 'TIDIGA VIDEOKLIPP LADDADES NER', to: 90, at: loc(1, A.nittio - 0.3), dur: 40, tone: 'red'},
      {t: 'checklist', rows: [
        {text: 'EN MOBIL', sub: 'UTRUSTNING', state: 'yes', at: loc(1, A.mobil)},
        {text: 'ETT TANGENTBORD', sub: 'UTRUSTNING', state: 'yes', at: loc(1, A.tangentbord)},
        {text: 'AMAZON FIRE STICK', sub: 'IN I SLACK-KANALERNA', state: 'yes', at: loc(1, A.stick), stamp: {text: 'MARDRÖM', at: loc(1, A.mardrom)}},
      ]},
    ]},
  },
  {
    key: 'svar', from: starts[2], duration: dur(2), source: null, chrome: true,
    body: {type: 'stack', gap: 32, widgets: [
      {t: 'bigtext', text: 'LOCKDOWN', sub: 'ROCKSTARS SVAR', at: loc(2, A.svarade), size: 190},
      {t: 'checklist', rows: [
        {text: 'STUDIORNA LÅSTES NER', sub: 'HELT OCH HÅLLET', state: 'yes', at: loc(2, A.studior)},
        {text: 'SÄKERHET TILL MAX', sub: 'SKÄRPT', state: 'yes', at: loc(2, A.sakerheten)},
        {text: 'PERSONAL TILLBAKA TILL KONTOR', sub: 'KALLADES IN', state: 'yes', at: loc(2, A.personalen)},
        {text: 'MINDRE LÄCKOR FORTSATTE', sub: 'FRAM TILL SLÄPPET 2026', state: 'no', at: loc(2, A.lackor)},
      ]},
    ]},
  },
  {
    key: 'rekord', from: starts[3], duration: dur(3), source: null, chrome: true,
    body: {type: 'stack', gap: 34, widgets: [
      {t: 'versus',
        left: {title: 'LÄCKAN', tone: 'red', at: loc(3, A.anda - 0.3), rows: [{text: 'Största i historien', at: loc(3, A.lacka)}]},
        right: {title: 'SLÄPPET', tone: 'green', at: loc(3, A.anda), rows: [{text: 'Rekord dag ett', at: loc(3, A.rekord)}]},
        stamp: {text: 'INGEN ROLL', at: loc(3, A.roll)}},
      {t: 'bigtext', text: 'REKORD', sub: 'ÄVEN EFTER HISTORIENS STÖRSTA LÄCKA', at: loc(3, A.sanning), size: 200},
    ]},
  },
  {
    key: 'fraga', from: starts[4], duration: dur(4), source: null, chrome: true,
    body: {type: 'binary', question: 'Läckor: förstör eller hype?', questionAt: loc(4, A.tycker), options: ['FÖRSTÖR', 'HYPE'],
      optionsAt: loc(4, A.forstor - 0.2), switchAt: loc(4, A.eller, 0), save: {text: 'SPARA', at: loc(4, A.hypeEnd)}},
  },
];

const chain: Episode2['chain'] = {
  labels: ['LÄCKAN', '90 KLIPP', 'LOCKDOWN', 'MAGIN?'],
  unlockAt: [starts[1] + 12, gf(A.nittio), gf(A.svarade), null],
};

const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock'));
add(L(0, loc(0, A.lackan)), 'thud', 0.9);
add(L(0, loc(0, A.hotellrum)), 'pop', 0.9);
add(L(0, loc(0, A.stat)), 'warn', 0.7);
add(L(1, loc(1, A.nittio)), 'count', 0.9);
add(L(1, loc(1, A.mobil)), 'pop', 0.9);
add(L(1, loc(1, A.tangentbord)), 'pop', 0.9);
add(L(1, loc(1, A.stick)), 'pop', 0.9);
add(L(1, loc(1, A.mardrom)), 'stamp', 0.9);
add(L(2, loc(2, A.svarade)), 'thud', 0.9);
add(L(2, loc(2, A.studior)), 'lock', 0.9);
add(L(2, loc(2, A.sakerheten)), 'pop', 0.9);
add(L(2, loc(2, A.personalen)), 'pop', 0.9);
add(L(2, loc(2, A.lackor)), 'err', 0.8);
add(L(3, loc(3, A.anda)), 'pop', 0.9);
add(L(3, loc(3, A.roll)), 'stamp', 0.9);
add(L(3, loc(3, A.sanning)), 'thud', 0.8);
add(L(4, loc(4, A.tycker)), 'whoosh', 0.8);
add(L(4, loc(4, A.forstor)), 'pop_hi', 1);
add(L(4, loc(4, A.eller)), 'flip', 1);
sfx.sort((a, b) => a.at - b.at);

export const gt4: Episode2 = {
  meta: {id: 'gta6-lackan', tag: 'GTA 6 • LÄCKAN', fps: FPS, width: 1080, height: 1920},
  audioFile: 'gt4.mp3',
  transitionFrames: 18,
  chain,
  scenes,
  captions: T.words,
  sfx,
};
export const gt4Duration = total;
