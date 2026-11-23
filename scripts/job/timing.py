#!/usr/bin/env python3
"""Generic word timing: voice file + script (one string per scene) -> timing JSON for src/jobs/compile.ts.

Usage:
  python3 scripts/job/timing.py --audio part1.wav --scenes scenes.json --out part1.timing.json [--model DIR]

scenes.json is a JSON list of strings, one per scene (the words the voice reads in that scene).
A script word may be written 'display|key' when the speech recogniser writes it differently
(e.g. 'tjugofyra|24'); the caption shows `display`, alignment matches `key`.

Alignment = Parakeet TDT v3 (sherpa-onnx) word-level ASR, character-level difflib match against the script,
word starts snapped to silence ends, words that straddle a pause are reported.
The quality figure `match` (0-1) is written to the JSON; below ~0.85 a human should look.
"""
import argparse, bisect, difflib, json, os, re, subprocess, sys, tempfile, wave
import numpy as np

norm = lambda w: ''.join(c for c in w.lower() if c.isalnum())
disp = lambda w: w.split('|')[0]
key = lambda w: w.split('|')[-1]


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def to_16k(src, dst):
    r = sh(['ffmpeg', '-loglevel', 'error', '-y', '-i', src, '-ar', '16000', '-ac', '1', dst])
    if r.returncode:
        sys.exit('ffmpeg failed: ' + r.stderr)


def duration(path):
    return float(sh(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]).stdout)


def asr(wav16, model):
    import sherpa_onnx
    r = sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=model + '/encoder.int8.onnx', decoder=model + '/decoder.int8.onnx', joiner=model + '/joiner.int8.onnx',
        tokens=model + '/tokens.txt', num_threads=4, model_type='nemo_transducer')
    w = wave.open(wav16)
    sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    s = r.create_stream()
    s.accept_waveform(sr, x)
    r.decode_stream(s)
    res = s.result
    return {'text': res.text, 'tokens': list(res.tokens), 'timestamps': list(res.timestamps)}


def silences(wav16, noise=-45, d=0.15):
    err = sh(['ffmpeg', '-i', wav16, '-af', f'silencedetect=noise={noise}dB:d={d}', '-f', 'null', '-']).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', err)]
    en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', err)]
    return list(zip(st, en))


def align(scenes, out, dur):
    END = dur - 0.2
    toks, ts = out['tokens'], out['timestamps']
    ach, att = [], []
    for i, (t, s) in enumerate(zip(toks, ts)):
        e = ts[i + 1] if i + 1 < len(ts) else min(s + 0.3, END)
        tt = t.lower()
        for k, c in enumerate(tt):
            if c.isalnum():
                ach.append(c)
                att.append(s + (e - s) * k / max(len(tt), 1))
    if not ach:
        sys.exit('ASR returned no text')
    A = ''.join(ach)
    words = []
    for si, text in enumerate(scenes, start=1):
        for w in text.split():
            if norm(key(w)) == '':
                continue
            words.append({'scene': si, 'text': disp(w), 'key': key(w)})
    S = ''
    span = []
    for w in words:
        n = norm(w['key'])
        span.append((len(S), len(S) + len(n)))
        S += n
    sm = difflib.SequenceMatcher(None, S, A, autojunk=False)
    anch = [(0, att[0])]
    for b in sm.get_matching_blocks():
        for j in range(b.size):
            anch.append((b.a + j, att[b.b + j]))
    anch.append((len(S), min(END, att[-1] + 0.25)))
    xs = [a for a, _ in anch]
    ys = [t for _, t in anch]

    def tat(i):
        k = bisect.bisect_right(xs, i) - 1
        k = max(0, min(k, len(xs) - 2))
        x0, x1, y0, y1 = xs[k], xs[k + 1], ys[k], ys[k + 1]
        return y0 if x1 == x0 else y0 + (y1 - y0) * (i - x0) / (x1 - x0)

    for w, (a, b) in zip(words, span):
        w['s'] = tat(a)
        w['e'] = tat(b)
    ratio = sum(b.size for b in sm.get_matching_blocks()) / max(len(S), 1)
    return words, ratio, END


def refine(words, END, sil):
    for w in words:
        for a, b in sil:
            if a + 0.02 < w['s'] < b - 0.02 and b - w['s'] < 0.6:
                w['s'] = b
                break
    for a, b in sil:
        if b - a < 0.15:
            continue
        nxt = [i for i, w in enumerate(words) if w['s'] >= a - 0.05]
        if not nxt:
            continue
        i = nxt[0]
        w = words[i]
        prev_s = words[i - 1]['s'] if i else 0
        if w['s'] > b + 0.12 and prev_s < a and w['s'] - b < 0.8:
            w['s'] = b
    for i, w in enumerate(words):
        if i and w['s'] < words[i - 1]['s']:
            w['s'] = words[i - 1]['s'] + 0.05
    for i, w in enumerate(words):
        nxt = words[i + 1]['s'] if i + 1 < len(words) else END + 0.2
        e = min(w['e'], nxt)
        for a, b in sil:
            if w['s'] < a < e:
                e = min(e, a + 0.04)
        w['e'] = max(w['s'] + 0.1, e)
    bad = []
    for w in words:
        for a, b in sil:
            if min(w['e'], b) - max(w['s'], a) > 0.3:
                bad.append(w['text'])
    return bad


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--audio', required=True)
    ap.add_argument('--scenes', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--model', default=os.environ.get('ASR_MODEL_DIR', '/tmp/asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8'))
    a = ap.parse_args()
    scenes = json.load(open(a.scenes))
    dur = duration(a.audio)
    with tempfile.TemporaryDirectory() as td:
        w16 = os.path.join(td, 'a16.wav')
        to_16k(a.audio, w16)
        out = asr(w16, a.model)
        sil = silences(w16)
    words, ratio, END = align(scenes, out, dur)
    bad = refine(words, END, sil)
    firsts = [min(w['s'] for w in words if w['scene'] == si) for si in range(1, len(scenes) + 1)]
    starts = [0.0] + [round(f - 0.45, 2) for f in firsts[1:]]
    res = {
        'AUDIO_SECONDS': round(dur, 2),
        'sceneStarts': starts,
        'match': round(ratio, 3),
        'straddling': bad,
        'asrText': out['text'],
        'words': [{'scene': w['scene'], 'text': w['text'], 's': round(w['s'], 3), 'e': round(w['e'], 3)} for w in words],
    }
    json.dump(res, open(a.out, 'w'), ensure_ascii=False)
    print(f"match {ratio:.3f} | duration {dur:.2f}s | scenes {len(scenes)} | straddling {bad}")


if __name__ == '__main__':
    main()
