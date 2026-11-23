#!/usr/bin/env node
/**
 * Run one job folder end to end: audio -> word timing -> spec validation -> render -> master -> measure.
 *
 *   node scripts/job/run.mjs jobs/<id>
 *
 * jobs/<id>/job.json:
 *   {"id": "abc", "parts": [{"n": 1, "audio": "part1.wav", "tag": "GTA 6 • REKORD",
 *     "chain": {"labels": [...4], "unlockAt": [...4]},
 *     "scenes": [{"key", "script", "source", "chrome", "body"}]}]}
 * `script` is the text the voice reads in that scene; `body` may use "@word" references (see src/jobs/types.ts).
 * Env: ASR_MODEL_DIR, BROWSER_EXECUTABLE (optional), CONCURRENCY (optional).
 */
import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const jobDir = process.argv[2];
if (!jobDir) throw new Error('usage: run.mjs jobs/<id>');
const job = JSON.parse(fs.readFileSync(path.join(jobDir, 'job.json'), 'utf8'));
const outDir = path.join('out', job.id);
const pubDir = path.join('public', 'jobs', job.id);
fs.mkdirSync(outDir, {recursive: true});
fs.mkdirSync(pubDir, {recursive: true});

const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, {stdio: 'inherit', ...opts});
  if (r.status !== 0) throw new Error(`${cmd} ${args.slice(0, 3).join(' ')} failed (${r.status})`);
};

// 1) bundle the compiler once so specs can be validated before the (slow) render
const compiler = path.join(outDir, 'compile.mjs');
run('npx', ['esbuild', 'src/jobs/compile.ts', '--bundle', '--platform=node', '--format=esm', `--outfile=${compiler}`, '--log-level=error']);
const {compileJob} = await import(pathToFileURL(path.resolve(compiler)).href);

const results = [];
for (const part of job.parts) {
  const n = part.n;
  const tag = `${job.id}-p${n}`;
  console.log(`\n=== part ${n} ===`);

  // 2) audio -> mp3 in public/, word timing
  const mp3 = path.join(pubDir, `part${n}.mp3`);
  run('ffmpeg', ['-loglevel', 'error', '-y', '-i', path.join(jobDir, part.audio), '-codec:a', 'libmp3lame', '-b:a', '128k', mp3]);
  const scenesFile = path.join(outDir, `scenes${n}.json`);
  fs.writeFileSync(scenesFile, JSON.stringify(part.scenes.map((s) => s.script)));
  const timingFile = path.join(outDir, `timing${n}.json`);
  run('python3', ['scripts/job/timing.py', '--audio', path.join(jobDir, part.audio), '--scenes', scenesFile, '--out', timingFile]);
  const timing = JSON.parse(fs.readFileSync(timingFile, 'utf8'));

  // 3) spec + timing -> props, validate by compiling
  const spec = {
    id: tag,
    tag: part.tag,
    audioFile: `jobs/${job.id}/part${n}.mp3`,
    chain: part.chain,
    scenes: part.scenes.map(({script, ...rest}) => rest),
  };
  const props = {job: {spec, timing: {AUDIO_SECONDS: timing.AUDIO_SECONDS, sceneStarts: timing.sceneStarts, words: timing.words}}};
  try {
    compileJob(props.job);
  } catch (e) {
    throw new Error(`Part ${n}: invalid spec: ${e.message}`);
  }
  const propsFile = path.join(outDir, `props${n}.json`);
  fs.writeFileSync(propsFile, JSON.stringify(props));

  // 4) render + master
  const raw = path.join(outDir, `part${n}.mp4`);
  const master = path.join(outDir, `part${n}-master.mp4`);
  const args = ['remotion', 'render', 'Job', raw, `--props=${propsFile}`, '--log=error'];
  if (process.env.CONCURRENCY) args.push(`--concurrency=${process.env.CONCURRENCY}`);
  if (process.env.BROWSER_EXECUTABLE) args.push(`--browser-executable=${process.env.BROWSER_EXECUTABLE}`);
  run('npx', args);
  run('ffmpeg', ['-loglevel', 'error', '-y', '-i', raw, '-c:v', 'copy', '-af',
    'acompressor=threshold=-18dB:ratio=3:attack=5:release=80:makeup=2,loudnorm=I=-14:TP=-1.5:LRA=9', '-c:a', 'aac', '-b:a', '192k', master]);

  // 5) measure
  const m = spawnSync('ffmpeg', ['-i', master, '-af', 'ebur128=peak=true', '-f', 'null', '-'], {encoding: 'utf8'});
  const lufs = Number((/\sI:\s+(-?[\d.]+) LUFS/g.exec(m.stderr.split('Summary:')[1] ?? '') ?? [])[1]);
  const peak = Number((/Peak:\s+(-?[\d.]+) dBFS/.exec(m.stderr.split('Summary:')[1] ?? '') ?? [])[1]);
  results.push({
    n,
    file: path.basename(master),
    seconds: timing.AUDIO_SECONDS,
    lufs,
    peak,
    alignMatch: timing.match,
    straddling: timing.straddling,
  });
}
fs.writeFileSync(path.join(outDir, 'result.json'), JSON.stringify({id: job.id, results}, null, 2));
console.log(JSON.stringify(results, null, 2));
