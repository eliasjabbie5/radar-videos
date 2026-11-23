import {AUDIO_SECONDS, anchors as A, sceneStarts, wordCaptions} from './timing.generated';
import type {Episode, SceneTiming, SfxEvent, SfxName} from './types';

const FPS = 30;
const TAIL_SECONDS = 1.0; // calm hold after the last word

/** Total length follows the voiceover. */
const total = Math.round((AUDIO_SECONDS + TAIL_SECONDS) * FPS);
const startFrames = sceneStarts.map((s) => Math.round(s * FPS));

/** Seconds on the voiceover timeline → local frame inside scene `i`. `lead` = frames to start early. */
const at = (i: number, sec: number, lead = 3) => Math.max(0, Math.round(sec * FPS) - startFrames[i] - lead);
const span = (from: number, to: number) => Math.max(1, Math.round((to - from) * FPS));

const timing: Omit<SceneTiming, 'from' | 'duration'>[] = [
  {
    key: 'coldOpen',
    voiceover:
      'Sjuttio dagar efter valet har Sverige fortfarande ingen ny regering. Och nu har landet bara två chanser kvar innan ett extraval blir verklighet.',
    source: null,
    step: null,
  },
  {
    key: 'voteTrack',
    voiceover:
      'Sedan den 17 september styrs Sverige av Ulf Kristerssons övergångsregering, som bara får fatta löpande beslut. Samtidigt har riksdagen redan röstat nej till två statsministerförslag – först Magdalena Andersson, och sedan Centerpartiets Elisabeth Thand Ringqvist.',
    source: 'KÄLLA: RIKSDAGEN',
    step: 1,
  },
  {
    key: 'deadlock',
    voiceover:
      'Enligt grundlagen har talmannen bara fyra försök. Nu ligger allt på en enda krock: Centerpartiet mot Vänsterpartiet. Centerpartiet har valt att gå vidare med Socialdemokraternas 135-punktspaket. Men de säger blankt nej till att Vänsterpartiet ska få sitta i regeringen. Vänsterpartiet å sin sida kräver egna ministerposter.',
    source: 'KÄLLA: SVT NYHETER / AFTONBLADET',
    step: 2,
  },
  {
    key: 'dotGrid',
    voiceover:
      'Och matten i riksdagen är skoningslös. Det krävs inte en majoritet som röstar ja – det räcker att 175 ledamöter röstar nej för att fälla en statsminister. Högerblocket har 173 mandat. Så om Vänsterpartiet trycker på nej-knappen faller allt direkt.',
    source: 'REGERINGSFORMEN 6 KAP. • 349 MANDAT',
    step: 3,
  },
  {
    key: 'outro',
    voiceover:
      'Talmannen vill ha ett besked före jul. Frågan är bara: vem blinkar först – eller går Sverige mot extraval?',
    source: 'KÄLLA: RIKSDAGEN • REGERINGSFORMEN 6 KAP.',
    step: 4,
  },
];

const scenes: SceneTiming[] = timing.map((t, i) => ({
  ...t,
  from: startFrames[i],
  duration: (i + 1 < startFrames.length ? startFrames[i + 1] : total) - startFrames[i],
}));

const base: Omit<Episode, 'sfx'> = {
  meta: {id: 'valet-2026-del-1', tag: 'VALET 2026 • DEL 1/4', fps: FPS, width: 1080, height: 1920},
  audioFile: 'voiceover.mp3',
  captionsFile: 'captions.json',
  transitionFrames: 18,
  scenes,
  content: {
    // ── Scene 1 · 0:00 ──────────────────────────────────────
    coldOpen: {
      days: 70,
      label: 'DAGAR UTAN REGERING',
      pill: '2 AV 4 FÖRSÖK KVAR',
      dateLeft: 'RIKSDAGEN • STOCKHOLM',
      dateRight: '22 NOV 2026',
      countStart: 5,
      countEnd: at(0, A.dagar + 0.25, 0),
      labelAt: at(0, A.dagar),
      pillAt: at(0, A.tva),
    },
    // ── Scene 2 ─────────────────────────────────────────────
    voteTrack: {
      status: 'ÖVERGÅNGSREGERING • SEDAN 17 SEP',
      statusAt: at(1, A.sedan),
      chips: [
        {text: 'ULF KRISTERSSON', at: at(1, A.kristersson)},
        {text: 'ENDAST LÖPANDE BESLUT', at: at(1, A.lopande)},
      ],
      timeline: {from: '17 SEP', to: '22 NOV', at: at(1, A.sedan + 0.4), dur: span(A.sedan + 0.4, A.riksdagen)},
      cards: [
        {n: '01', label: 'M. ANDERSSON', state: 'result', result: 'NEJ', at: at(1, A.riksdagen), stampAt: at(1, A.anderssonE, 0)},
        {n: '02', label: 'E. THAND RINGQVIST', state: 'result', result: 'NEJ', at: at(1, A.riksdagen + 0.25), stampAt: at(1, A.ringqvistE, 0)},
        {n: '03', label: '?', state: 'pending', at: at(1, A.riksdagen + 0.5)},
        {n: '04', label: 'EXTRAVAL', state: 'dim', at: at(1, A.riksdagen + 0.75)},
      ],
    },
    // ── Scene 3 ─────────────────────────────────────────────
    deadlock: {
      attempts: {
        at: at(2, A.fyra),
        items: [
          {label: 'FÖRSÖK 1', value: 'NEJ', tone: 'no'},
          {label: 'FÖRSÖK 2', value: 'NEJ', tone: 'no'},
          {label: 'FÖRSÖK 3', value: '?', tone: 'pending'},
          {label: 'FÖRSÖK 4', value: 'EXTRAVAL', tone: 'dim'},
        ],
      },
      docPill: 'S-PAKETET • 135 PUNKTER',
      docPillAt: at(2, A.socdem),
      cards: [
        {
          party: 'CENTERPARTIET',
          accent: 'center',
          at: at(2, A.krock),
          rows: [
            {tone: 'yes', text: 'Går vidare med S', at: at(2, A.gaVidare)},
            {tone: 'no', text: 'Inga V-ministrar', at: at(2, A.blankt)},
          ],
        },
        {
          party: 'VÄNSTERPARTIET',
          accent: 'parl',
          at: at(2, A.krock + 0.3),
          rows: [
            {tone: 'no', text: 'Kräver ministerposter', at: at(2, A.kraver)},
            {tone: 'dim', text: 'Stöd ej säkrat', at: at(2, A.ministerposter)},
          ],
        },
      ],
      tension: {label: 'LÅSNING', lineAt: at(2, A.krock + 0.2), chipAt: at(2, A.krock + 0.6)},
    },
    // ── Scene 4 ─────────────────────────────────────────────
    dotGrid: {
      totalSeats: 349,
      threshold: 175,
      introAt: at(3, A.matten - 0.5),
      subtitle: 'NEJ-RÖSTER AV 175 SOM KRÄVS',
      // NOTE: V's seat count is a placeholder (2022 result = 24). Verify against the 2026 result.
      rightBlock: {seats: 173, label: 'HÖGERBLOCKET: 173', at: at(3, A.hoger, 0), dur: span(A.hoger, A.mandatE)},
      left: {seats: 24, label: '+ VÄNSTERPARTIET', at: at(3, A.nejknappen, 0), dur: 24},
      thresholdLabel: '175 NEJ = FÄLLD',
      doneLabel: 'FÄLLD',
      gaugeAt: at(3, A.s175),
      fellAt: at(3, A.faller, 0),
    },
    // ── Scene 5 ─────────────────────────────────────────────
    outro: {
      timeline: {from: '22 NOV', to: '24 DEC', label: 'BESKED FÖRE JUL', at: at(4, A.talmannen), dur: span(A.talmannen, A.julE)},
      question: 'Vem blinkar först före jul?',
      questionAt: at(4, A.fragan),
      options: ['NY REGERING', 'EXTRAVAL'],
      optionsAt: at(4, A.vem),
      switchAt: at(4, A.eller, 0),
      teaser: 'DEL 2: VARFÖR ALLT FASTNAR HOS CENTERN →',
      teaserAt: at(4, A.eller + 0.4),
    },
  },
  captions: wordCaptions,
};

/**
 * Sound effects, derived from the same cues that drive the animation — move a cue and its
 * sound moves with it. `v` = gain multiplier, `d` = cut length in frames.
 */
const buildSfx = (e: Omit<Episode, 'sfx'>): SfxEvent[] => {
  const out: SfxEvent[] = [];
  // local < 0 is allowed (e.g. a whoosh that leads the scene change)
  const add = (scene: number, local: number, name: SfxName, v = 1, d?: number) =>
    out.push({at: Math.max(0, e.scenes[scene].from + local), name, volume: v, duration: d});
  const {coldOpen: c, voteTrack: vt, deadlock: dl, dotGrid: g, outro: o} = e.content;

  // scene changes
  e.scenes.slice(1).forEach((s, i) => add(i + 1, -4, 'whoosh'));

  // 1 · cold open
  add(0, 0, 'riser', 1, c.countEnd);
  add(0, c.countStart, 'count', 1, c.countEnd - c.countStart);
  add(0, c.countEnd, 'thud', 1);
  add(0, c.labelAt, 'pop');
  add(0, c.pillAt, 'warn');

  // 2 · vote track
  add(1, vt.statusAt, 'pop');
  vt.chips.forEach((ch) => add(1, ch.at, 'pop_hi'));
  add(1, vt.timeline.at, 'swish');
  vt.cards.forEach((card) => {
    add(1, card.at, 'pop', 0.8);
    if (card.stampAt !== undefined) {
      add(1, card.stampAt, 'stamp');
      add(1, card.stampAt + 2, 'err');
    }
  });

  // 3 · deadlock
  dl.attempts.items.forEach((it, i) =>
    add(2, dl.attempts.at + i * 8, it.tone === 'no' ? 'err' : it.tone === 'pending' ? 'pop_hi' : 'tick_soft'),
  );
  add(2, dl.docPillAt, 'pop');
  dl.cards.forEach((card) => add(2, card.at, 'pop', 0.9));
  add(2, dl.tension.lineAt, 'swish');
  add(2, dl.tension.chipAt, 'warn');
  dl.cards.forEach((card) =>
    card.rows.forEach((r) => add(2, r.at, r.tone === 'yes' ? 'chime' : r.tone === 'no' ? 'err' : 'tick_soft')),
  );

  // 4 · riksdag
  add(3, g.introAt, 'swish');
  add(3, g.introAt, 'count_short', 1, 40);
  add(3, g.gaugeAt, 'pop');
  add(3, g.rightBlock.at, 'fill_blue', 1, g.rightBlock.dur);
  add(3, g.left.at, 'fill_red', 1, g.left.dur);
  add(3, g.left.at + 3, 'err');
  add(3, g.fellAt, 'stamp', 1.15);

  // 5 · outro
  add(4, o.timeline.at, 'swish');
  add(4, o.timeline.at + o.timeline.dur, 'ping');
  add(4, o.questionAt, 'whoosh', 0.8);
  add(4, o.optionsAt, 'pop_hi');
  add(4, o.optionsAt + 6, 'pop_hi', 0.9);
  add(4, o.switchAt, 'pop');
  add(4, o.teaserAt, 'tick_soft', 1.2);

  return out.sort((a, b) => a.at - b.at);
};

export const episode1: Episode = {...base, sfx: buildSfx(base)};

export const episodeDuration = (e: Episode) => e.scenes.reduce((sum, s) => sum + s.duration, 0);
