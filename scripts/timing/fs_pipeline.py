"""Sweden explainers: friskolor / bostadskö / snus: cut the combined voice file, transcribe, align to the scripts, generate
src/data/timing.fs.generated.ts

Source: /tmp/usa/usa.wav (24 kHz mono, 156.16 s) = Del 1 + Del 2 + Del 3 in one file.
Cuts (inside silences, -45 dB): P1 0 -> 49.30 | P2 50.30 -> 105.75 | P3 106.75 -> 156.16
Script word syntax 'display|alignkey' -> caption shows display, aligner matches alignkey (ASR writes numbers as digits).
Run: python3 scripts/timing/usa_pipeline.py
"""
import bisect, difflib, json, re, subprocess, wave
import numpy as np

SRCS = {'c': '/tmp/s2/c.wav'}
REPO = '/home/user/valet-explainer'
WORK = '/tmp/s2'
MODEL = '/tmp/asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/'
CUTS = {1: ('c', 0.00, 59.10), 2: ('c', 59.10, 117.40), 3: ('c', 117.40, 177.76)}

SCRIPTS = {
    1: [
        'Sverige är i princip det enda landet i världen där privata aktiebolag får ta ut obegränsad vinst på skattefinansierade skolor. Hur hamnade vi där?',
        'År 1992 gjorde Sverige en historisk reform. Föräldrar fick fritt skolval och systemet med skolpeng infördes – pengarna skulle följa eleven, oavsett om skolan drevs av kommunen eller av en privat aktör.',
        'Förespråkarna menar att systemet skapar valfrihet, höjer kvaliteten genom konkurrens och avlastar kommunerna.',
        'Kritiker pekar däremot på en helt annan bild: att jakten på elever och vinst leder till betygsinflation, större segregation och att skattepengar går till aktieägare istället för fler lärare.',
        'Trots att en stor majoritet av väljarna i mätning efter mätning vill begränsa vinsterna i skolan har riksdagen inte lyckats enas om att ändra lagen.',
        'Är det dags att förbjuda vinster i skolan – eller funkar det fria skolvalet bäst som det är?',
    ],
    2: [
        'I Stockholm står över 800 000 personer i bostadskö. Vill du ha en hyresrätt i innerstan får du räkna med 15 till 20 års väntetid. Hur kunde systemet gå sönder så totalt?',
        'I Sverige sätts hyrorna inte av utbud och efterfrågan, utan genom bruksvärdessystemet där Hyresgästföreningen och fastighetsägarna förhandlar.',
        'Det håller hyrorna nere för den som redan har ett kontrakt. Men baksidan är att nästan ingen flyttar – och att det byggs för få nya hyresrätter.',
        'Resultatet blir en marknad i obalans. De som inte har tjugo|20 års kötid tvingas ut på en dyr andrahandsmarknad, eller i värsta fall en olaglig svartmarknad där kontrakt säljs för hundratusentals kronor.',
        'Lösningen som ekonomer ofta föreslår – marknadshyror – är politisk dynamit och fick till och med en hel regering att falla 2021.',
        'Vad är egentligen minst dåligt: tjugo|20 års kötid eller högre hyror?',
    ],
    3: [
        'Varför får svenskar köpa snus i varenda kiosk, när det är totalförbjudet i resten av EU?',
        'Redan 1992 förbjöd EU försäljning av snus på grund av hälsoriskerna. Men när Sverige skulle gå med i unionen 1995 blev snuset en knäckfråga.',
        'Sverige lyckades förhandla fram ett permanent undantag: brunt tobakssnus får säljas i Sverige, men aldrig exporteras till andra EU-länder.',
        'Nu har striden blossat upp igen – fast om vitt snus. Eftersom nikotinpåsar inte innehåller tobak hamnade de i en juridisk gråzon och exploderade snabbt i hela Europa.',
        'Flera EU-länder vill nu förbjuda eller hårt reglera även det vita snuset för att stoppa unga från att fastna i nikotin. Samtidigt menar Sverige att snuset är en huvudorsak till att vi har lägst andel rökare i hela EU.',
        'Borde EU sluta lägga sig i svenskt snus – eller är det rätt att sätta gränser?',
    ],
}

ANCHORS = {
    1: {
        'sverige': (1, 'Sverige', 0, 's'), 'enda': (1, 'enda', 0, 's'), 'privata': (1, 'privata', 0, 's'), 'aktiebolag': (1, 'aktiebolag', 0, 's'), 'obegransad': (1, 'obegränsad', 0, 's'), 'skattefin': (1, 'skattefinansierade', 0, 's'), 'skolor': (1, 'skolor.', 0, 's'), 'hamnade': (1, 'hamnade', 0, 's'),
        'n1992': (2, '1992', 0, 's'), 'historisk': (2, 'historisk', 0, 's'), 'foraldrar': (2, 'Föräldrar', 0, 's'), 'skolval': (2, 'skolval', 0, 's'), 'skolpeng': (2, 'skolpeng', 0, 's'), 'pengarna': (2, 'pengarna', 0, 's'), 'eleven': (2, 'eleven,', 0, 's'), 'kommunen': (2, 'kommunen', 0, 's'), 'aktor': (2, 'aktör.', 0, 's'),
        'forespraks': (3, 'Förespråkarna', 0, 's'), 'valfrihet': (3, 'valfrihet,', 0, 's'), 'kvaliteten': (3, 'kvaliteten', 0, 's'), 'konkurrens': (3, 'konkurrens', 0, 's'), 'avlastar': (3, 'avlastar', 0, 's'),
        'kritiker': (4, 'Kritiker', 0, 's'), 'jakten': (4, 'jakten', 0, 's'), 'betygsinflation': (4, 'betygsinflation,', 0, 's'), 'segregation': (4, 'segregation', 0, 's'), 'skattepengar': (4, 'skattepengar', 0, 's'), 'aktieagare': (4, 'aktieägare', 0, 's'), 'larare': (4, 'lärare.', 0, 's'),
        'majoritet': (5, 'majoritet', 0, 's'), 'valjarna': (5, 'väljarna', 0, 's'), 'begransa': (5, 'begränsa', 0, 's'), 'riksdagen': (5, 'riksdagen', 0, 's'), 'enas': (5, 'enas', 0, 's'), 'lagen': (5, 'lagen.', 0, 's'),
        'dags': (6, 'dags', 0, 's'), 'forbjuda': (6, 'förbjuda', 0, 's'), 'eller': (6, 'eller', 0, 's'), 'skolvalet': (6, 'skolvalet', 0, 's'), 'bast': (6, 'bäst', 0, 's'), 'ar': (6, 'är?', 0, 's'),
    },
    2: {
        'stockholm': (1, 'Stockholm', 0, 's'), 'n800': (1, '800', 0, 's'), 'bostadsko': (1, 'bostadskö.', 0, 's'), 'hyresratt': (1, 'hyresrätt', 0, 's'), 'innerstan': (1, 'innerstan', 0, 's'), 'n15': (1, '15', 0, 's'), 'n20': (1, '20', 0, 's'), 'vantetid': (1, 'väntetid.', 0, 's'), 'sonder': (1, 'sönder', 0, 's'),
        'hyrorna': (2, 'hyrorna', 0, 's'), 'utbud': (2, 'utbud', 0, 's'), 'efterfragan': (2, 'efterfrågan,', 0, 's'), 'bruksvarde': (2, 'bruksvärdessystemet', 0, 's'), 'hyresgast': (2, 'Hyresgästföreningen', 0, 's'), 'fastighets': (2, 'fastighetsägarna', 0, 's'), 'forhandlar': (2, 'förhandlar.', 0, 's'),
        'nere': (3, 'nere', 0, 's'), 'kontrakt': (3, 'kontrakt.', 0, 's'), 'baksidan': (3, 'baksidan', 0, 's'), 'flyttar': (3, 'flyttar', 0, 's'), 'byggs': (3, 'byggs', 0, 's'), 'hyresratter': (3, 'hyresrätter.', 0, 's'),
        'obalans': (4, 'obalans.', 0, 's'), 'kotid': (4, 'kötid', 0, 's'), 'andrahand': (4, 'andrahandsmarknad,', 0, 's'), 'svartmarknad': (4, 'svartmarknad', 0, 's'), 'saljs': (4, 'säljs', 0, 's'), 'hundratusentals': (4, 'hundratusentals', 0, 's'), 'kronor': (4, 'kronor.', 0, 's'),
        'losningen': (5, 'Lösningen', 0, 's'), 'marknadshyror': (5, 'marknadshyror', 0, 's'), 'dynamit': (5, 'dynamit', 0, 's'), 'regering': (5, 'regering', 0, 's'), 'falla': (5, 'falla', 0, 's'), 'n2021': (5, '2021.', 0, 's'),
        'minst': (6, 'minst', 0, 's'), 'dalig': (6, 'dåligt:', 0, 's'), 'kotid6': (6, 'kötid', 0, 's'), 'hogre': (6, 'högre', 0, 's'), 'hyror': (6, 'hyror?', 0, 's'), 'hyrorEnd': (6, 'hyror?', 0, 'e'),
    },
    3: {
        'varfor': (1, 'Varför', 0, 's'), 'svenskar': (1, 'svenskar', 0, 's'), 'snus': (1, 'snus', 0, 's'), 'kiosk': (1, 'kiosk,', 0, 's'), 'totalforbjudet': (1, 'totalförbjudet', 0, 's'), 'eu': (1, 'EU?', 0, 's'),
        'n1992': (2, '1992', 0, 's'), 'forbjod': (2, 'förbjöd', 0, 's'), 'halso': (2, 'hälsoriskerna.', 0, 's'), 'unionen': (2, 'unionen', 0, 's'), 'n1995': (2, '1995', 0, 's'), 'knackfraga': (2, 'knäckfråga.', 0, 's'),
        'forhandla': (3, 'förhandla', 0, 's'), 'undantag': (3, 'undantag:', 0, 's'), 'brunt': (3, 'brunt', 0, 's'), 'aldrig': (3, 'aldrig', 0, 's'), 'exporteras': (3, 'exporteras', 0, 's'), 'eulander': (3, 'EU-länder.', 0, 's'),
        'striden': (4, 'striden', 0, 's'), 'vitt': (4, 'vitt', 0, 's'), 'nikotinpasar': (4, 'nikotinpåsar', 0, 's'), 'tobak': (4, 'tobak', 0, 's'), 'grazon': (4, 'gråzon', 0, 's'), 'exploderade': (4, 'exploderade', 0, 's'), 'europa': (4, 'Europa.', 0, 's'),
        'flera': (5, 'Flera', 0, 's'), 'forbjuda': (5, 'förbjuda', 0, 's'), 'reglera': (5, 'reglera', 0, 's'), 'unga': (5, 'unga', 0, 's'), 'nikotin': (5, 'nikotin.', 0, 's'), 'samtidigt': (5, 'Samtidigt', 0, 's'), 'huvudorsak': (5, 'huvudorsak', 0, 's'), 'lagst': (5, 'lägst', 0, 's'), 'rokare': (5, 'rökare', 0, 's'),
        'borde': (6, 'Borde', 0, 's'), 'sluta': (6, 'sluta', 0, 's'), 'eller': (6, 'eller', 0, 's'), 'granser': (6, 'gränser?', 0, 's'), 'granserEnd': (6, 'gränser?', 0, 'e'),
    },
}
OVERRIDES = {1: [], 2: [], 3: []}

norm = lambda w: ''.join(c for c in w.lower() if c.isalnum())
disp = lambda w: w.split('|')[0]
key = lambda w: w.split('|')[-1]


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def cut():
    cache = {}
    for p, (src, a, b) in CUTS.items():
        if src not in cache:
            w = wave.open(SRCS[src]); cache[src] = (np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64), w.getframerate())
        x, sr = cache[src]
        y = x[int(round(a * sr)):int(round(b * sr))].copy()
        n = int(0.03 * sr)
        y[:n] *= np.linspace(0, 1, n); y[-n:] *= np.linspace(1, 0, n)
        with wave.open(f'{WORK}/p{p}.wav', 'wb') as o:
            o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr)
            o.writeframes(np.round(y).astype(np.int16).tobytes())
        sh(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{WORK}/p{p}.wav', '-codec:a', 'libmp3lame', '-b:a', '128k', f'{REPO}/public/fs{p}.mp3'])
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
            if w == '–':
                continue
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
    ts = "// AUTO-GENERATED by scripts/timing/fs_pipeline.py from public/fs1.mp3 + fs2.mp3 + fs3.mp3.\n"
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
        ts += f"export const fs{p}Timing: PartTiming = {{\n  AUDIO_SECONDS: {round(dur, 2)},\n  sceneStarts: {json.dumps(starts)},\n  anchors: {json.dumps(anchors, indent=4)},\n  words: ({json.dumps(caps, ensure_ascii=False)} as [string, number, number][]).map(([text, startMs, endMs]) => ({{text, startMs, endMs, timestampMs: Math.round((startMs + endMs) / 2), confidence: null}})),\n}};\n\n"
        print('sceneStarts', starts)
        for sc in range(1, n + 1):
            print(f' s{sc}:', ' '.join(f"{w['text']}@{w['s']:.2f}" for w in words if w['scene'] == sc))
        print('silences:', ' '.join(f'{a:.2f}-{b:.2f}' for a, b in sil))
    open(f'{REPO}/src/data/timing.fs.generated.ts', 'w').write(ts)


if __name__ == '__main__':
    main()
