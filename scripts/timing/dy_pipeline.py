"""Sweden explainers: matpriser / offentlighetsprincipen / ungdomsrabatt: cut the combined voice file, transcribe, align to the scripts, generate
src/data/timing.dy.generated.ts

Source: /tmp/usa/usa.wav (24 kHz mono, 156.16 s) = Del 1 + Del 2 + Del 3 in one file.
Cuts (inside silences, -45 dB): P1 0 -> 49.30 | P2 50.30 -> 105.75 | P3 106.75 -> 156.16
Script word syntax 'display|alignkey' -> caption shows display, aligner matches alignkey (ASR writes numbers as digits).
Run: python3 scripts/timing/usa_pipeline.py
"""
import bisect, difflib, json, re, subprocess, wave
import numpy as np

SRCS = {'d': '/tmp/s3/d.wav'}
REPO = '/home/user/valet-explainer'
WORK = '/tmp/s3'
MODEL = '/tmp/asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/'
# part 3 splices out an unscripted extra paragraph (120.36-164.12) that is in the recording but not in the script
CUTS = {1: ('d', [(0.00, 57.40)]), 2: ('d', [(57.40, 110.87)]), 3: ('d', [(110.87, 120.36), (164.12, 215.04)])}

SCRIPTS = {
    1: [
        'Har du märkt att matpriserna sköt i höjden – men knappt verkar vilja gå ner igen? En stor del av svaret ligger i hur den svenska matmarknaden är uppbyggd.',
        'I Sverige kontrollerar i princip tre stora aktörer nästan hela dagligvaruhandeln: ICA, Axfood och Coop. Bara ICA står för omkring hälften av all mat som säljs i landet.',
        'Dessutom har ICA en unik modell där varje butik ägs av en egen handlare, samtidigt som de köper in varor gemensamt genom jätten ICA Gruppen.',
        'När inflationen och elpriserna steg kunde kedjorna snabbt höja priserna ut mot kund. Men när kostnaderna sedan planade ut fanns det helt enkelt för lite riktig konkurrens för att pressa ner priserna igen – vilket ledde till rekordvinster hos många handlare.',
        'Konkurrensverket har pekat ut bristen på konkurrens som ett stort problem.',
        'Borde staten bryta upp matjättarnas dominans – eller är det upp till konsumenterna att byta butik?',
    ],
    2: [
        'I de flesta länder i världen är din hemadress, din ålder och din inkomst privat. I Sverige kan vem som helst googla fram allt om dig på tio sekunder.',
        'Det beror på offentlighetsprincipen – en svensk grundlag från 1766 som ger alla medborgare rätt att se myndigheternas handlingar. Tanken var ursprungligen att journalister och medborgare skulle kunna granska makten och stoppa korruption.',
        'Men på senare år har privata sajter som Mrkoll och Ratsit använt utgivningsbevis för att dammsuga myndigheternas register och lägga ut hela svenska folkets personuppgifter på nätet. Det har gjort det skrämmande enkelt för både bedragare och kriminella att hitta rätt dörr.',
        'Nu krockar den gamla svenska lagen med EU:s hårda integritetsregler, och regeringen vill strama åt sajterna.',
        'Borde personuppgifterna låsas in – eller är full öppenhet värd priset?',
    ],
    3: [
        'Varför använder kriminella gäng i Sverige allt yngre tonåringar för att utföra sina grövsta brott? Svaret har länge legat i hur svensk lag straffar unga.',
        'I decennier har Sverige haft en så kallad ungdomsrabatt. Tanken var att unga hjärnor inte är färdigutvecklade, och att långa fängelsestraff mest skapar yrkeskriminella.',
        'Därför fick unga kraftigt sänkta straff, och för den som var under arton|18 år handlade det oftast om sluten ungdomsvård i bara några få år – även vid mord.',
        'Gängen såg snabbt luckan i systemet. Genom att rekrytera 14-|14 och 15-åringar|15åringar via krypterade appar kunde äldre ledare få jobb utförda till minimal risk för egen del.',
        'Nu skärps lagarna steg för steg, med slopad straffrabatt för unga vuxna och nya ungdomsfängelser på väg.',
        'Är hårdare straff rätt väg att gå – eller krävs det något helt annat för att stoppa nyrekryteringen?',
    ],
}

ANCHORS = {
    1: {
        'matpriserna': (1, 'matpriserna', 0, 's'), 'hojden': (1, 'höjden', 0, 's'), 'ner': (1, 'ner', 0, 's'), 'uppbyggd': (1, 'uppbyggd.', 0, 's'),
        'tre': (2, 'tre', 0, 's'), 'ica': (2, 'ICA,', 0, 's'), 'axfood': (2, 'Axfood', 0, 's'), 'coop': (2, 'Coop.', 0, 's'), 'halften': (2, 'hälften', 0, 's'), 'bara': (2, 'Bara', 0, 's'),
        'unik': (3, 'unik', 0, 's'), 'handlare': (3, 'handlare,', 0, 's'), 'gemensamt': (3, 'gemensamt', 0, 's'), 'icagruppen': (3, 'ICA', 1, 's'),
        'inflationen': (4, 'inflationen', 0, 's'), 'elpriserna': (4, 'elpriserna', 0, 's'), 'hoja': (4, 'höja', 0, 's'), 'planade': (4, 'planade', 0, 's'), 'konkurrens': (4, 'konkurrens', 0, 's'), 'rekordvinster': (4, 'rekordvinster', 0, 's'),
        'konkverket': (5, 'Konkurrensverket', 0, 's'), 'problem': (5, 'problem.', 0, 's'),
        'borde': (6, 'Borde', 0, 's'), 'bryta': (6, 'bryta', 0, 's'), 'eller': (6, 'eller', 0, 's'), 'byta': (6, 'byta', 0, 's'), 'butik': (6, 'butik?', 0, 's'), 'butikEnd': (6, 'butik?', 0, 'e'),
    },
    2: {
        'flesta': (1, 'flesta', 0, 's'), 'hemadress': (1, 'hemadress,', 0, 's'), 'alder': (1, 'ålder', 0, 's'), 'inkomst': (1, 'inkomst', 0, 's'), 'sverige': (1, 'Sverige', 0, 's'), 'googla': (1, 'googla', 0, 's'), 'tio': (1, 'tio', 0, 's'), 'sekunder': (1, 'sekunder.', 0, 's'),
        'offentlighets': (2, 'offentlighetsprincipen', 0, 's'), 'n1766': (2, '1766', 0, 's'), 'medborgare': (2, 'medborgare', 0, 's'), 'handlingar': (2, 'handlingar.', 0, 's'), 'tanken': (2, 'Tanken', 0, 's'), 'granska': (2, 'granska', 0, 's'), 'korruption': (2, 'korruption.', 0, 's'),
        'senare': (3, 'senare', 0, 's'), 'sajter': (3, 'sajter', 0, 's'), 'mrkoll': (3, 'Mrkoll', 0, 's'), 'utgivningsbevis': (3, 'utgivningsbevis', 0, 's'), 'dammsuga': (3, 'dammsuga', 0, 's'), 'register': (3, 'register', 0, 's'), 'natet': (3, 'nätet.', 0, 's'),
        'skrammande': (3, 'skrämmande', 0, 's'), 'bedragare': (3, 'bedragare', 0, 's'), 'kriminella': (3, 'kriminella', 0, 's'), 'dorr': (3, 'dörr.', 0, 's'),
        'krockar': (4, 'krockar', 0, 's'), 'integritetsregler': (4, 'integritetsregler,', 0, 's'), 'regeringen': (4, 'regeringen', 0, 's'), 'sajterna': (4, 'sajterna.', 0, 's'),
        'borde': (5, 'Borde', 0, 's'), 'laser': (5, 'låsas', 0, 's'), 'eller': (5, 'eller', 0, 's'), 'oppenhet': (5, 'öppenhet', 0, 's'), 'priset': (5, 'priset?', 0, 's'), 'prisetEnd': (5, 'priset?', 0, 'e'),
    },
    3: {
        'varfor': (1, 'Varför', 0, 's'), 'kriminella': (1, 'kriminella', 0, 's'), 'yngre': (1, 'yngre', 0, 's'), 'tonaringar': (1, 'tonåringar', 0, 's'), 'grovsta': (1, 'grövsta', 0, 's'), 'svaret': (1, 'Svaret', 0, 's'), 'unga1': (1, 'unga.', 0, 's'),
        'decennier': (2, 'decennier', 0, 's'), 'ungdomsrabatt': (2, 'ungdomsrabatt.', 0, 's'), 'hjarnor': (2, 'hjärnor', 0, 's'), 'langa': (2, 'långa', 0, 's'), 'yrkeskriminella': (2, 'yrkeskriminella.', 0, 's'),
        'sankta': (3, 'sänkta', 0, 's'), 'n18': (3, 'arton', 0, 's'), 'ungdomsvard': (3, 'ungdomsvård', 0, 's'), 'fa': (3, 'få', 0, 's'), 'mord': (3, 'mord.', 0, 's'),
        'gangen': (4, 'Gängen', 0, 's'), 'luckan': (4, 'luckan', 0, 's'), 'rekrytera': (4, 'rekrytera', 0, 's'), 'n14': (4, '14-', 0, 's'), 'appar': (4, 'appar', 0, 's'), 'ledare': (4, 'ledare', 0, 's'), 'risk': (4, 'risk', 0, 's'),
        'skarps': (5, 'skärps', 0, 's'), 'slopad': (5, 'slopad', 0, 's'), 'ungavuxna': (5, 'vuxna', 0, 's'), 'ungdomsfangelser': (5, 'ungdomsfängelser', 0, 's'), 'varg': (5, 'väg.', 0, 's'),
        'ar': (6, 'Är', 0, 's'), 'hardare': (6, 'hårdare', 0, 's'), 'eller': (6, 'eller', 0, 's'), 'annat': (6, 'annat', 0, 's'), 'nyrekryteringen': (6, 'nyrekryteringen?', 0, 's'), 'nyEnd': (6, 'nyrekryteringen?', 0, 'e'),
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
    for p, (src, segs) in CUTS.items():
        if src not in cache:
            w = wave.open(SRCS[src]); cache[src] = (np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64), w.getframerate())
        x, sr = cache[src]
        parts = []
        n = int(0.03 * sr)
        for a, b in segs:
            y = x[int(round(a * sr)):int(round(b * sr))].copy()
            y[:n] *= np.linspace(0, 1, n); y[-n:] *= np.linspace(1, 0, n)
            parts.append(y)
        y = np.concatenate(parts)
        with wave.open(f'{WORK}/p{p}.wav', 'wb') as o:
            o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr)
            o.writeframes(np.round(y).astype(np.int16).tobytes())
        sh(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{WORK}/p{p}.wav', '-codec:a', 'libmp3lame', '-b:a', '128k', f'{REPO}/public/dy{p}.mp3'])
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
    ts = "// AUTO-GENERATED by scripts/timing/dy_pipeline.py from public/dy1.mp3 + dy2.mp3 + dy3.mp3.\n"
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
        ts += f"export const dy{p}Timing: PartTiming = {{\n  AUDIO_SECONDS: {round(dur, 2)},\n  sceneStarts: {json.dumps(starts)},\n  anchors: {json.dumps(anchors, indent=4)},\n  words: ({json.dumps(caps, ensure_ascii=False)} as [string, number, number][]).map(([text, startMs, endMs]) => ({{text, startMs, endMs, timestampMs: Math.round((startMs + endMs) / 2), confidence: null}})),\n}};\n\n"
        print('sceneStarts', starts)
        for sc in range(1, n + 1):
            print(f' s{sc}:', ' '.join(f"{w['text']}@{w['s']:.2f}" for w in words if w['scene'] == sc))
        print('silences:', ' '.join(f'{a:.2f}-{b:.2f}' for a, b in sil))
    open(f'{REPO}/src/data/timing.dy.generated.ts', 'w').write(ts)


if __name__ == '__main__':
    main()
