import type {Caption} from '@remotion/captions';
import type {SfxEvent, SfxName} from '../data/types';
import type {Episode2, Scene2} from '../data/types2';
import type {Job, JobTiming} from './types';

const FPS = 30;
const TAIL_SECONDS = 1.5;
const LEAD = 3;

const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

export class SpecError extends Error {}

interface Ctx {
  timing: JobTiming;
  starts: number[];
}

const REF = /^@(?:(\d+):)?(.+?)(?:#(\d+))?(?:([+-]\d+(?:\.\d+)?))?(!)?$/;

/** Resolve a word reference to seconds + flags. `scene` is 0-based; undefined = search all scenes. */
function resolveSeconds(ref: string, scene: number | undefined, ctx: Ctx): {sec: number; end: boolean} {
  const m = REF.exec(ref);
  if (!m) throw new SpecError(`Bad word reference "${ref}"`);
  const sc = m[1] !== undefined ? Number(m[1]) - 1 : scene;
  const token = m[2];
  const occ = m[3] !== undefined ? Number(m[3]) - 1 : 0;
  const offset = m[4] !== undefined ? Number(m[4]) : 0;
  const end = m[5] === '!';
  const inScene = ctx.timing.words.filter((w) => sc === undefined || w.scene - 1 === sc);
  if (token === '^') {
    if (!inScene.length) throw new SpecError(`No words in scene for "${ref}"`);
    return {sec: inScene[0].s + offset, end: false};
  }
  if (token === '$') {
    if (!inScene.length) throw new SpecError(`No words in scene for "${ref}"`);
    return {sec: inScene[inScene.length - 1].e + offset, end: true};
  }
  const key = norm(token);
  const hits = inScene.filter((w) => norm(w.text) === key);
  if (hits.length <= occ) {
    throw new SpecError(`Word "${token}" (#${occ + 1}) not found in ${sc === undefined ? 'any scene' : `scene ${sc + 1}`}`);
  }
  const w = hits[occ];
  return {sec: (end ? w.e : w.s) + offset, end};
}

function toLocal(ref: string, i: number, key: string, ctx: Ctx): number {
  const {sec, end} = resolveSeconds(ref, i, ctx);
  const lead = end || key === 'switchAt' ? 0 : LEAD;
  return Math.max(0, Math.round(sec * FPS) - ctx.starts[i] - lead);
}

/** Replace every "@..." string in a scene body with a local frame number. */
function resolveBody(node: unknown, i: number, ctx: Ctx, key = ''): unknown {
  if (typeof node === 'string' && node.startsWith('@')) return toLocal(node, i, key, ctx);
  if (Array.isArray(node)) return node.map((x) => resolveBody(x, i, ctx, key));
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) out[k] = resolveBody(v, i, ctx, k);
    return out;
  }
  return node;
}

type Add = (local: number, name: SfxName, volume?: number) => void;

/** Sound effects derived from what each widget does. All reveal times are already local frames. */
function sfxForBody(body: Scene2['body'], add: Add) {
  const stamp = (s?: {at: number}) => s && add(s.at, 'stamp', 0.9);
  if (body.type === 'hookTiles') {
    body.tiles.forEach((t) => add(t.at, t.locked ? 'lock' : 'pop', 0.9));
    add(body.headline.at, 'thud', 0.9);
  } else if (body.type === 'redacted') {
    add(body.revealAt, 'unlock', 0.9);
    stamp(body.stamp);
  } else if (body.type === 'binary') {
    add(body.questionAt, 'whoosh', 0.8);
    add(body.optionsAt, 'pop_hi', 1);
    add(body.switchAt, 'flip', 1);
    if (body.save) add(body.save.at, 'chime', 0.8);
    if (body.teaser) add(body.teaser.at, 'pop', 0.8);
  } else if (body.type === 'cliff') {
    add(body.pulseAt, 'warn', 0.8);
    add(body.card.at, 'pop', 0.9);
  } else {
    for (const w of body.widgets) {
      switch (w.t) {
        case 'bigtext': add(w.at, 'thud', 0.8); break;
        case 'counter': add(w.at, 'count', 0.9); break;
        case 'cards':
          w.cards.forEach((c) => {
            add(c.at, 'pop', 0.9);
            if (c.value) add(c.value.at, 'count', 0.8);
            stamp(c.stamp);
          });
          break;
        case 'checklist': w.rows.forEach((r) => { add(r.at, 'pop_hi', 0.9); stamp(r.stamp); }); break;
        case 'versus':
          add(w.left.at, 'pop', 0.9); add(w.right.at, 'pop', 0.9);
          stamp(w.stamp);
          break;
        case 'timeline':
          w.nodes.forEach((n) => add(n.at, 'pop', 0.9));
          w.chips?.forEach((c) => add(c.at, 'pop_hi', 0.8));
          stamp(w.stamp);
          break;
        case 'staff': add(w.at, 'pop', 0.9); add(w.people.at, 'count', 0.8); break;
        case 'bars': w.rows.forEach((r) => add(r.at, 'fill_blue', 0.8)); break;
        case 'columns3': w.cols.forEach((c) => add(c.at, 'pop', 0.9)); break;
        case 'fusion':
          w.inputs.forEach((x) => add(x.at, 'pop', 0.9));
          add(w.hub.at, 'thud', 0.8);
          add(w.linksAt, 'swish', 1);
          w.outputs.forEach((x) => add(x.at, 'pop', 0.9));
          if (w.footnote) add(w.footnote.at, 'chime', 0.8);
          break;
        case 'dots':
          w.groups.forEach((g) => add(g.at, 'fill_blue', 0.8));
          if (w.mark) add(w.mark.at, 'pop_hi', 0.9);
          break;
        case 'map':
          w.markers.forEach((m) => add(m.at, 'pop', 0.9));
          w.routes?.forEach((r) => add(r.at, 'swish', 1));
          stamp(w.stamp);
          break;
        case 'ring': add(w.at, 'count', 0.9); stamp(w.stamp); break;
        case 'chip': add(w.at, 'thud', 0.8); w.tags?.forEach((t) => add(t.at, 'pop', 0.9)); break;
        case 'sweden':
          w.side.forEach((s) => add(s.at, 'pop', 0.9));
          if (w.flow) add(w.flow.at, 'swish', 1);
          break;
        default: break;
      }
    }
  }
}

export function compileJob(job: Job): Episode2 {
  const {spec, timing} = job;
  if (spec.scenes.length !== timing.sceneStarts.length) {
    throw new SpecError(`Spec has ${spec.scenes.length} scenes but timing has ${timing.sceneStarts.length}`);
  }
  const starts = timing.sceneStarts.map((s) => Math.round(s * FPS));
  const total = Math.round((timing.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
  const ctx: Ctx = {timing, starts};

  const scenes: Scene2[] = spec.scenes.map((s, i) => ({
    key: s.key,
    from: starts[i],
    duration: (i + 1 < starts.length ? starts[i + 1] : total) - starts[i],
    source: s.source,
    chrome: s.chrome,
    body: resolveBody(s.body, i, ctx) as Scene2['body'],
  }));

  const unlockAt = spec.chain.unlockAt.map((u) => {
    if (u === null) return null;
    if (typeof u === 'number') return u;
    if (u.startsWith('$')) {
      const n = Number(u.slice(1)) - 1;
      if (!(n >= 0 && n < starts.length)) throw new SpecError(`Bad scene reference "${u}"`);
      return starts[n] + 12;
    }
    return Math.round(resolveSeconds(u, undefined, ctx).sec * FPS);
  });

  const sfx: SfxEvent[] = [];
  const push = (at: number, name: SfxName, volume = 1) => sfx.push({at: Math.max(0, at), name, volume});
  starts.slice(1).forEach((st) => push(st - 4, 'whoosh'));
  unlockAt.forEach((u) => u !== null && push(u, 'unlock'));
  scenes.forEach((sc, i) => sfxForBody(sc.body, (local, name, vol) => push(starts[i] + local, name, vol)));
  sfx.sort((a, b) => a.at - b.at);

  const captions: Caption[] = timing.words.map((w, i) => ({
    text: i === 0 ? w.text : ` ${w.text}`,
    startMs: Math.round(w.s * 1000),
    endMs: Math.round(w.e * 1000),
    timestampMs: Math.round(((w.s + w.e) / 2) * 1000),
    confidence: null,
  }));

  return {
    meta: {id: spec.id, tag: spec.tag, fps: FPS, width: 1080, height: 1920},
    audioFile: spec.audioFile,
    transitionFrames: 18,
    chain: {labels: spec.chain.labels, unlockAt},
    scenes,
    captions,
    sfx,
  };
}

export const jobDuration = (job: Job) => Math.round((job.timing.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
