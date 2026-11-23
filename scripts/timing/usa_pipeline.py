"""USA midterms series (3 parts): cut the combined voice file, transcribe, align to the scripts, generate
src/data/timing.usa.generated.ts

Source: /tmp/usa/usa.wav (24 kHz mono, 156.16 s) = Del 1 + Del 2 + Del 3 in one file.
Cuts (inside silences, -45 dB): P1 0 -> 49.30 | P2 50.30 -> 105.75 | P3 106.75 -> 156.16
Script word syntax 'display|alignkey' -> caption shows display, aligner matches alignkey (ASR writes numbers as digits).
Run: python3 scripts/timing/usa_pipeline.py
"""
import bisect, difflib, json, re, subprocess, wave
import numpy as np

SRC = '/tmp/usa/usa.wav'
REPO = '/home/user/valet-explainer'
WORK = '/tmp/usa'
MODEL = '/tmp/asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/'
CUTS = {1: (0.00, 49.30), 2: (50.30, 105.75), 3: (106.75, 156.16)}

SCRIPTS = {
    1: [
        'Fem|5 platser. Så knapp var republikanernas marginal i representanthuset: 220 mot 215.',
        'Mitt i en presidentperiod röstar USA om hela representanthuset och en tredjedel av senaten. Det brukar gå illa för presidentens parti.',
        'Före valet i början av november hade Donald Trump 37 procents stöd, det lägsta före ett mellanårsval på 50 år, enligt NPR. Och väljarnas viktigaste fråga var dyrtiden.',
        'Partierna försökte skydda sina marginaler: i nio|9 delstater, bland andra Texas, Florida, Ohio och Kalifornien, ritades valkartan om mitt i decenniet.',
        'Senaten såg tryggare ut för republikanerna: 53 platser mot 47.',
        'Så var fem|5 platser och omritade kartor nog?',
    ],
    2: [
        'För första gången sedan 1994 vann demokraterna ett delstatsomfattande val i Texas.',
        'Det var bara början. Natten till den fjärde|4 november tog de representanthuset. Tre veckor senare är de sista loppen fortfarande inte avgjorda, men demokraterna kan landa på omkring 260 platser, flest sedan början av 90-talet. NPR kallar det den största segern för något parti på 50 år.',
        'I senaten vände de nio|9 platser, bland annat i Ohio, Iowa och North Carolina, och har nu 56 av 100.',
        'Omkring 123 miljoner amerikaner röstade, det näst högsta valdeltagandet i ett mellanårsval sedan 1914, enligt preliminära siffror.',
        'Donald Trump sa att valet inte var en folkomröstning om honom. Samtidigt låg hans stöd på 37 procent.',
        'Så frågan är: ett straff för Trump, eller bara det vanliga mönstret?',
    ],
    3: [
        'Trump har ett vapen kvar: vetot. Och demokraterna saknar ungefär 30 röster för att ta det ifrån honom.',
        'Den tredje|3 januari byter makten hand i kongressen. Demokraterna får rätt att kalla vittnen och kräva handlingar. Hakeem Jeffries har sagt att dyrtiden kommer först, och att han varken utesluter eller lovar riksrätt.',
        'Men för att köra över ett veto krävs två tredjedelar: 290 i huset och 67 i senaten. De har omkring 260 och 56.',
        'Däremot har senaten sista ordet om Trumps utnämningar. En bedömare tror att nästan inga går igenom på två år.',
        'Och innan dess? Den elfte|11 december går USA:s tillfälliga budget ut, och kongressen är långt från en överenskommelse.',
        'Så frågan är: deal, eller stillestånd?',
    ],
}

# name -> (scene 1-based, display word, occurrence, 's'|'e')
ANCHORS = {
    1: {
        'fem': (1, 'Fem', 0, 's'), 'republikanernas': (1, 'republikanernas', 0, 's'), 'n220': (1, '220', 0, 's'),
        'mot': (1, 'mot', 0, 's'), 'n215': (1, '215.', 0, 's'), 'end215': (1, '215.', 0, 'e'),
        'mitt': (2, 'Mitt', 0, 's'), 'huset': (2, 'representanthuset', 0, 's'), 'tredjedel': (2, 'tredjedel', 0, 's'),
        'senaten': (2, 'senaten.', 0, 's'), 'brukar': (2, 'brukar', 0, 's'), 'illa': (2, 'illa', 0, 's'), 'parti': (2, 'parti.', 0, 'e'),
        'valet': (3, 'valet', 0, 's'), 'n37': (3, '37', 0, 's'), 'lagsta': (3, 'lägsta', 0, 's'), 'npr': (3, 'NPR.', 0, 's'),
        'viktigaste': (3, 'viktigaste', 0, 's'), 'dyrtiden': (3, 'dyrtiden.', 0, 's'),
        'partierna': (4, 'Partierna', 0, 's'), 'nio': (4, 'nio', 0, 's'), 'texas': (4, 'Texas,', 0, 's'), 'florida': (4, 'Florida,', 0, 's'),
        'ohio': (4, 'Ohio', 0, 's'), 'kalifornien': (4, 'Kalifornien,', 0, 's'), 'ritades': (4, 'ritades', 0, 's'), 'decenniet': (4, 'decenniet.', 0, 's'),
        'tryggare': (5, 'tryggare', 0, 's'), 'n53': (5, '53', 0, 's'), 'n47': (5, '47.', 0, 's'),
        'sa': (6, 'Så', 0, 's'), 'nog': (6, 'nog?', 0, 's'), 'nogEnd': (6, 'nog?', 0, 'e'),
    },
    2: {
        'forsta': (1, 'första', 0, 's'), 'n1994': (1, '1994', 0, 's'), 'vann': (1, 'vann', 0, 's'), 'texas': (1, 'Texas.', 0, 's'),
        'begynnelse': (2, 'början.', 0, 's'), 'natten': (2, 'Natten', 0, 's'), 'huset': (2, 'representanthuset.', 0, 's'),
        'tre': (2, 'Tre', 0, 's'), 'avgjorda': (2, 'avgjorda,', 0, 's'), 'landa': (2, 'landa', 0, 's'), 'n260': (2, '260', 0, 's'),
        'flest': (2, 'flest', 0, 's'), 'npr': (2, 'NPR', 0, 's'), 'segern': (2, 'segern', 0, 's'), 'n50': (2, '50', 0, 's'),
        'senaten': (3, 'senaten', 0, 's'), 'nio': (3, 'nio', 0, 's'), 'ohio': (3, 'Ohio,', 0, 's'), 'iowa': (3, 'Iowa', 0, 's'),
        'carolina': (3, 'Carolina,', 0, 's'), 'n56': (3, '56', 0, 's'), 'n100': (3, '100.', 0, 's'),
        'omkring': (4, 'Omkring', 0, 's'), 'n123': (4, '123', 0, 's'), 'valdeltagandet': (4, 'valdeltagandet', 0, 's'),
        'n1914': (4, '1914,', 0, 's'), 'prelim': (4, 'preliminära', 0, 's'), 'siffror': (4, 'siffror.', 0, 's'),
        'donald': (5, 'Donald', 0, 's'), 'folkomrostning': (5, 'folkomröstning', 0, 's'), 'samtidigt': (5, 'Samtidigt', 0, 's'), 'n37': (5, '37', 0, 's'),
        'fragan': (6, 'frågan', 0, 's'), 'straff': (6, 'straff', 0, 's'), 'eller': (6, 'eller', 0, 's'), 'monstret': (6, 'mönstret?', 0, 's'),
        'monstretEnd': (6, 'mönstret?', 0, 'e'),
    },
    3: {
        'vetot': (1, 'vetot.', 0, 's'), 'saknar': (1, 'saknar', 0, 's'), 'n30': (1, '30', 0, 's'), 'honom': (1, 'honom.', 0, 's'),
        'tredje': (2, 'tredje', 0, 's'), 'kongressen': (2, 'kongressen.', 0, 's'), 'vittnen': (2, 'vittnen', 0, 's'), 'handlingar': (2, 'handlingar.', 0, 's'),
        'jeffries': (2, 'Jeffries', 0, 's'), 'dyrtiden': (2, 'dyrtiden', 0, 's'), 'utesluter': (2, 'utesluter', 0, 's'), 'riksratt': (2, 'riksrätt.', 0, 's'),
        'veto': (3, 'veto', 0, 's'), 'n290': (3, '290', 0, 's'), 'n67': (3, '67', 0, 's'), 'omkring': (3, 'omkring', 0, 's'), 'n260': (3, '260', 0, 's'), 'n56': (3, '56.', 0, 's'),
        'senaten': (4, 'senaten', 0, 's'), 'utnamningar': (4, 'utnämningar.', 0, 's'), 'bedomare': (4, 'bedömare', 0, 's'), 'nastan': (4, 'nästan', 0, 's'),
        'innan': (5, 'innan', 0, 's'), 'elfte': (5, 'elfte', 0, 's'), 'budget': (5, 'budget', 0, 's'), 'overenskommelse': (5, 'överenskommelse.', 0, 's'),
        'fragan': (6, 'frågan', 0, 's'), 'deal': (6, 'deal,', 0, 's'), 'eller': (6, 'eller', 0, 's'), 'stillestand': (6, 'stillestånd?', 0, 's'),
        'stillestandEnd': (6, 'stillestånd?', 0, 'e'),
    },
}
OVERRIDES = {1: [], 2: [(2, 'år.', 0, 24.50, 24.80)], 3: []}

norm = lambda w: ''.join(c for c in w.lower() if c.isalnum())
disp = lambda w: w.split('|')[0]
key = lambda w: w.split('|')[-1]


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def cut():
    w = wave.open(SRC); sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64)
    for p, (a, b) in CUTS.items():
        y = x[int(round(a * sr)):int(round(b * sr))].copy()
        n = int(0.03 * sr)
        y[:n] *= np.linspace(0, 1, n); y[-n:] *= np.linspace(1, 0, n)
        with wave.open(f'{WORK}/p{p}.wav', 'wb') as o:
            o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr)
            o.writeframes(np.round(y).astype(np.int16).tobytes())
        sh(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{WORK}/p{p}.wav', '-codec:a', 'libmp3lame', '-b:a', '128k', f'{REPO}/public/usa{p}.mp3'])
        sh(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{WORK}/p{p}.wav', '-ar', '16000', '-ac', '1', f'{WORK}/p{p}_16k.wav'])


def asr(p):
    import sherpa_onnx
    r = sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=MODEL + 'encoder.int8.onnx', decoder=MODEL + 'decoder.int8.onnx', joiner=MODEL + 'joiner.int8.onnx',
        tokens=MODEL + 'tokens.txt', num_threads=4, model_type='nemo_transducer')
    w = wave.open(f'{WORK}/p{p}_16k.wav'); sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    s = r.create_stream(); s.accept_waveform(sr, x); r.decode_stream(s)
    res = s.result
    out = {'text': res.text, 'tokens': list(res.tokens), 'timestamps': list(res.timestamps)}
    json.dump(out, open(f'{WORK}/p{p}_asr.json', 'w'), ensure_ascii=False)
    return out


def silences(p, noise=-45, d=0.15):
    err = sh(['ffmpeg', '-i', f'{WORK}/p{p}_16k.wav', '-af', f'silencedetect=noise={noise}dB:d={d}', '-f', 'null', '-']).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', err)]
    en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', err)]
    return list(zip(st, en))


def align(p, asr_out, dur):
    END = dur - 0.2
    toks, ts = asr_out['tokens'], asr_out['timestamps']
    ach, att = [], []
    for i, (t, s) in enumerate(zip(toks, ts)):
        e = ts[i + 1] if i + 1 < len(ts) else min(s + 0.3, END)
        tt = t.lower()
        for k, c in enumerate(tt):
            if c.isalnum():
                ach.append(c); att.append(s + (e - s) * k / max(len(tt), 1))
    A = ''.join(ach)
    words = []
    for si, text in enumerate(SCRIPTS[p], start=1):
        for w in text.split():
            words.append({'scene': si, 'text': disp(w), 'key': key(w)})
    S = ''; span = []
    for w in words:
        n = norm(w['key']); span.append((len(S), len(S) + len(n))); S += n
    sm = difflib.SequenceMatcher(None, S, A, autojunk=False)
    anch = [(0, att[0])]
    for b in sm.get_matching_blocks():
        for j in range(b.size):
            anch.append((b.a + j, att[b.b + j]))
    anch.append((len(S), min(END, att[-1] + 0.25)))
    xs = [a for a, _ in anch]; ys = [t for _, t in anch]

    def tat(i):
        k = bisect.bisect_right(xs, i) - 1
        k = max(0, min(k, len(xs) - 2))
        x0, x1, y0, y1 = xs[k], xs[k + 1], ys[k], ys[k + 1]
        return y0 if x1 == x0 else y0 + (y1 - y0) * (i - x0) / (x1 - x0)

    for w, (a, b) in zip(words, span):
        w['s'] = tat(a); w['e'] = tat(b)
    ratio = sum(b.size for b in sm.get_matching_blocks()) / len(S)
    return words, ratio, END


def refine(p, words, END, sil):
    for sc, tx, occ, a, b in OVERRIDES[p]:
        ws = [w for w in words if w['scene'] == sc and norm(w['text']) == norm(tx)]
        ws[occ]['s'] = a; ws[occ]['e'] = b
    snaplog = []
    for w in words:
        for a, b in sil:
            if a + 0.02 < w['s'] < b - 0.02 and b - w['s'] < 0.6:
                snaplog.append((w['text'], round(w['s'], 2), round(a, 2), round(b, 2))); w['s'] = b; break
    print('snapped:', snaplog)
    pulled = []
    for a, b in sil:
        if b - a < 0.15:
            continue
        nxt = [i for i, w in enumerate(words) if w['s'] >= a - 0.05]
        if not nxt:
            continue
        i = nxt[0]; w = words[i]
        prev_s = words[i - 1]['s'] if i else 0
        if w['s'] > b + 0.12 and prev_s < a and w['s'] - b < 0.8:
            pulled.append((w['text'], round(w['s'], 2), round(b, 2))); w['s'] = b
    print('pulled:', pulled)
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
            ov = min(w['e'], b) - max(w['s'], a)
            if ov > 0.3:
                bad.append((w['text'], round(w['s'], 2), round(w['e'], 2), round(a, 2), round(b, 2)))
    return bad


def anchors_for(p, words):
    out = {}
    for name, (sc, tx, occ, edge) in ANCHORS[p].items():
        ws = [w for w in words if w['scene'] == sc and norm(w['text']) == norm(tx)]
        assert len(ws) > occ, (p, name, tx)
        out[name] = round(ws[occ]['s' if edge == 's' else 'e'], 2)
    return out


def main():
    cut()
    ts = "// AUTO-GENERATED by scripts/timing/usa_pipeline.py from public/usa1.mp3 + usa2.mp3 + usa3.mp3.\n"
    ts += "// Times in seconds relative to the start of each part's mp3 (Caption startMs/endMs = ms).\n"
    ts += "import type {Caption} from '@remotion/captions';\n\n"
    ts += "export interface PartTiming { AUDIO_SECONDS: number; sceneStarts: number[]; anchors: Record<string, number>; words: Caption[]; }\n\n"
    for p in (1, 2, 3):
        dur = float(sh(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{WORK}/p{p}.wav']).stdout)
        out = asr(p)
        print(f'\n=== PART {p} ({dur:.2f}s) ASR:\n{out["text"]}\n')
        words, ratio, END = align(p, out, dur)
        sil = silences(p)
        bad = refine(p, words, END, sil)
        print(f'char match {ratio:.3f} | straddling pause >0.3 s: {bad}')
        n = len(SCRIPTS[p])
        firsts = [min(w['s'] for w in words if w['scene'] == si) for si in range(1, n + 1)]
        starts = [0.0] + [round(f - 0.45, 2) for f in firsts[1:]]
        anchors = anchors_for(p, words)
        caps = [[w['text'] if i == 0 else ' ' + w['text'], round(w['s'] * 1000), round(w['e'] * 1000)] for i, w in enumerate(words)]
        ts += f"export const usa{p}Timing: PartTiming = {{\n  AUDIO_SECONDS: {round(dur, 2)},\n  sceneStarts: {json.dumps(starts)},\n  anchors: {json.dumps(anchors, indent=4)},\n  words: ({json.dumps(caps, ensure_ascii=False)} as [string, number, number][]).map(([text, startMs, endMs]) => ({{text, startMs, endMs, timestampMs: Math.round((startMs + endMs) / 2), confidence: null}})),\n}};\n\n"
        print('sceneStarts', starts)
        for sc in range(1, n + 1):
            print(f' s{sc}:', ' '.join(f"{w['text']}@{w['s']:.2f}" for w in words if w['scene'] == sc))
        print('silences:', ' '.join(f'{a:.2f}-{b:.2f}' for a, b in sil))
    open(f'{REPO}/src/data/timing.usa.generated.ts', 'w').write(ts)


if __name__ == '__main__':
    main()
