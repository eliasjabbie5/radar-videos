"""Nvidia / Jensen Huang series (3 parts): cut the combined voice file, transcribe, align to the scripts, generate
src/data/timing.nv.generated.ts

Source: /tmp/usa/usa.wav (24 kHz mono, 156.16 s) = Del 1 + Del 2 + Del 3 in one file.
Cuts (inside silences, -45 dB): P1 0 -> 49.30 | P2 50.30 -> 105.75 | P3 106.75 -> 156.16
Script word syntax 'display|alignkey' -> caption shows display, aligner matches alignkey (ASR writes numbers as digits).
Run: python3 scripts/timing/usa_pipeline.py
"""
import bisect, difflib, json, re, subprocess, wave
import numpy as np

SRC = '/tmp/nv/nv.wav'
REPO = '/home/user/valet-explainer'
WORK = '/tmp/nv'
MODEL = '/tmp/asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/'
CUTS = {1: (0.00, 72.50), 2: (72.50, 139.80), 3: (139.80, 212.44)}

SCRIPTS = {
    1: [
        '33 år vid makten – sedan borta över en natt. Den tolfte|12 november 2026 avgick Nvidias grundare Jensen Huang.',
        'Bakom fallet fanns två avslöjanden. Dels en hemlig relation med en chef som rapporterade direkt till Huang på Nvidia – ett brott mot bolagets regler.',
        'Dels en relation med Alice Huang, en tidigare chef på molnbolaget Megaspeed i Singapore.',
        'Enligt The New York Times cirkulerade hemliga amerikanska underrättelserapporter om att hon värvats av Kinas säkerhetsministerium – för att komma nära Jensen Huang och påverka USA:s chippolitik. President Trump ska ha informerats, men Huang själv fick aldrig någon formell varning.',
        'Samtidigt var USA:s egna myndigheter splittrade. Källor inom CIA, FBI och USA:s nationella underrättelsetjänst betonade att övervakningen inte räckte för att bevisa att hon var spion. Justitiedepartementet drog ingen slutsats – och Kina avfärdade allt som grundlöst.',
        'Ändå tappade Nvidias styrelse förtroendet. Och hur kunde Megaspeed köpa AI-chip för miljarder? Del två.',
    ],
    2: [
        'Över fyra|4 miljarder dollar i amerikanska AI-chip – via ett nästan okänt bolag i Singapore. Så fungerade Megaspeed.',
        'Megaspeed startade som ett dotterbolag till ett kinesiskt spelbolag. Men 2023 tog investeraren Alice Huang över och gjorde bolaget till en officiell molnpartner åt Nvidia.',
        'Upplägget hade två lager. Först det lagliga kryphålet: Megaspeed och dotterbolaget Speedmatrix byggde datacenter i Singapore och Malaysia. Kinesiska jättar som Alibaba kunde då hyra Nvidias datorkraft på distans, utan att chippen korsade Kinas gräns.',
        'Men utredare i USA, Singapore och Malaysia misstänker också ett andra lager: att skalbolag förfalskade tulldeklarationer och skickade fysiska servrar vidare från Malaysia in i Kina.',
        'Megaspeed förnekar brott och kallar verksamheten laglig. Ändå stoppade Nvidia försäljningen till bolaget 2025 – och Alice Huang portades från Singapore.',
        'Och varför gick USA själva med på tjugofem|25 procent tull på chip till Kina? Del tre.',
    ],
    3: [
        '25 procent rakt in i USA:s statskassa på varje AI-chip. Därför gick Trump med på ett säreget Nvidia-avtal – som nu har kraschat.',
        'USA har länge stoppat de snabbaste AI-chippen till Kina av rädsla för att tekniken stärker Kinas militär. Men Nvidias dåvarande vd Jensen Huang lobbade hårt mot totalförbud – och varnade för att det bara tvingar fram kinesiska rivaler som Huawei.',
        'Kompromissen blev speciell. Nvidia fick sälja det något äldre chippet H200 till godkända kinesiska kunder, men chippen måste först skeppas via USA för kontroll – och belades med 25 procent tull.',
        'Kritiker i kongressen kallade det en säkerhetsrisk. Samtidigt styrde Peking sina bolag bort från amerikanska chip ändå.',
        'Efter Huangs avgång skrotade nya tillförordnade vd:n Colette Kress hela upplägget. Nu räknar Nvidia med noll|0 H200-försäljning till Kina – medan Kaliforniens åklagare, finansinspektionen och kongressen utreder bolaget.',
        'Frågan är: bör USA totalförbjuda AI-chip till Kina – eller göder det bara Huawei?',
    ],
}

# name -> (scene 1-based, display word, occurrence, 's'|'e')
ANCHORS = {
    1: {
        'n33': (1, '33', 0, 's'), 'natt': (1, 'natt.', 0, 's'), 'n12': (1, 'tolfte', 0, 's'), 'avgick': (1, 'avgick', 0, 's'), 'grundare': (1, 'grundare', 0, 's'), 'jensen': (1, 'Jensen', 0, 's'), 'huangEnd': (1, 'Huang.', 0, 'e'),
        'bakom': (2, 'Bakom', 0, 's'), 'avslojanden': (2, 'avslöjanden.', 0, 's'), 'hemlig': (2, 'hemlig', 0, 's'), 'chef': (2, 'chef', 0, 's'), 'rapporterade': (2, 'rapporterade', 0, 's'), 'brott': (2, 'brott', 0, 's'), 'regler': (2, 'regler.', 0, 's'),
        'dels': (3, 'Dels', 0, 's'), 'alice': (3, 'Alice', 0, 's'), 'tidigare': (3, 'tidigare', 0, 's'), 'molnbolaget': (3, 'molnbolaget', 0, 's'), 'megaspeed': (3, 'Megaspeed', 0, 's'), 'singapore': (3, 'Singapore.', 0, 's'),
        'enligt': (4, 'Enligt', 0, 's'), 'times': (4, 'Times', 0, 's'), 'hemliga': (4, 'hemliga', 0, 's'), 'varvats': (4, 'värvats', 0, 's'), 'sakerhets': (4, 'säkerhetsministerium', 0, 's'), 'nara': (4, 'nära', 0, 's'),
        'chippolitik': (4, 'chippolitik.', 0, 's'), 'trump': (4, 'Trump', 0, 's'), 'informerats': (4, 'informerats,', 0, 's'), 'sjalv': (4, 'själv', 0, 's'), 'varning': (4, 'varning.', 0, 's'),
        'samtidigt': (5, 'Samtidigt', 0, 's'), 'splittrade': (5, 'splittrade.', 0, 's'), 'cia': (5, 'CIA,', 0, 's'), 'fbi': (5, 'FBI', 0, 's'), 'nationella': (5, 'nationella', 0, 's'), 'overvakningen': (5, 'övervakningen', 0, 's'),
        'spion': (5, 'spion.', 0, 's'), 'justitie': (5, 'Justitiedepartementet', 0, 's'), 'slutsats': (5, 'slutsats', 0, 's'), 'kina': (5, 'Kina', 0, 's'), 'grundlost': (5, 'grundlöst.', 0, 's'),
        'anda': (6, 'Ändå', 0, 's'), 'styrelse': (6, 'styrelse', 0, 's'), 'megaspeed2': (6, 'Megaspeed', 0, 's'), 'miljarder': (6, 'miljarder?', 0, 's'), 'del': (6, 'Del', 0, 's'),
    },
    2: {
        'over': (1, 'Över', 0, 's'), 'n4': (1, 'fyra', 0, 's'), 'miljarder': (1, 'miljarder', 0, 's'), 'dollar': (1, 'dollar', 0, 's'), 'chip': (1, 'AI-chip', 0, 's'), 'okant': (1, 'okänt', 0, 's'), 'singapore': (1, 'Singapore.', 0, 's'), 'fungerade': (1, 'fungerade', 0, 's'),
        'startade': (2, 'startade', 0, 's'), 'dotterbolag': (2, 'dotterbolag', 0, 's'), 'spelbolag': (2, 'spelbolag.', 0, 's'), 'n2023': (2, '2023', 0, 's'), 'investeraren': (2, 'investeraren', 0, 's'), 'alice': (2, 'Alice', 0, 's'),
        'molnpartner': (2, 'molnpartner', 0, 's'), 'nvidia': (2, 'Nvidia.', 0, 's'),
        'upplagget': (3, 'Upplägget', 0, 's'), 'lager': (3, 'lager.', 0, 's'), 'forst': (3, 'Först', 0, 's'), 'kryphalet': (3, 'kryphålet:', 0, 's'), 'speedmatrix': (3, 'Speedmatrix', 0, 's'), 'datacenter': (3, 'datacenter', 0, 's'),
        'singapore3': (3, 'Singapore', 0, 's'), 'malaysia3': (3, 'Malaysia.', 0, 's'), 'alibaba': (3, 'Alibaba', 0, 's'), 'hyra': (3, 'hyra', 0, 's'), 'distans': (3, 'distans,', 0, 's'), 'korsade': (3, 'korsade', 0, 's'), 'gransen': (3, 'gräns.', 0, 's'),
        'utredare': (4, 'utredare', 0, 's'), 'misstanker': (4, 'misstänker', 0, 's'), 'andra': (4, 'andra', 0, 's'), 'skalbolag': (4, 'skalbolag', 0, 's'), 'forfalskade': (4, 'förfalskade', 0, 's'),
        'tulldek': (4, 'tulldeklarationer', 0, 's'), 'skickade': (4, 'skickade', 0, 's'), 'servrar': (4, 'servrar', 0, 's'), 'fran': (4, 'från', 0, 's'), 'kina4': (4, 'Kina.', 0, 's'),
        'fornekar': (5, 'förnekar', 0, 's'), 'laglig': (5, 'laglig.', 0, 's'), 'stoppade': (5, 'stoppade', 0, 's'), 'n2025': (5, '2025', 0, 's'), 'portades': (5, 'portades', 0, 's'), 'singapore5': (5, 'Singapore.', 0, 's'),
        'varfor': (6, 'varför', 0, 's'), 'n25': (6, 'tjugofem', 0, 's'), 'tull': (6, 'tull', 0, 's'), 'kina6': (6, 'Kina?', 0, 's'), 'del': (6, 'Del', 0, 's'),
    },
    3: {
        'n25': (1, '25', 0, 's'), 'statskassa': (1, 'statskassa', 0, 's'), 'chip': (1, 'AI-chip.', 0, 's'), 'trump': (1, 'Trump', 0, 's'), 'avtal': (1, 'Nvidia-avtal', 0, 's'), 'kraschat': (1, 'kraschat.', 0, 's'),
        'stoppat': (2, 'stoppat', 0, 's'), 'snabbaste': (2, 'snabbaste', 0, 's'), 'kina2': (2, 'Kina', 0, 's'), 'radsla': (2, 'rädsla', 0, 's'), 'militar': (2, 'militär.', 0, 's'), 'davarande': (2, 'dåvarande', 0, 's'),
        'lobbade': (2, 'lobbade', 0, 's'), 'totalforbud': (2, 'totalförbud', 0, 's'), 'varnade': (2, 'varnade', 0, 's'), 'huawei': (2, 'Huawei.', 0, 's'),
        'kompromissen': (3, 'Kompromissen', 0, 's'), 'h200': (3, 'H200', 0, 's'), 'godkanda': (3, 'godkända', 0, 's'), 'skeppas': (3, 'skeppas', 0, 's'), 'kontroll': (3, 'kontroll', 0, 's'), 'belades': (3, 'belades', 0, 's'), 'n25b': (3, '25', 0, 's'), 'tull': (3, 'tull.', 0, 's'),
        'kritiker': (4, 'Kritiker', 0, 's'), 'sakerhetsrisk': (4, 'säkerhetsrisk.', 0, 's'), 'samtidigt': (4, 'Samtidigt', 0, 's'), 'peking': (4, 'Peking', 0, 's'), 'chip4': (4, 'chip', 0, 's'), 'anda': (4, 'ändå.', 0, 's'),
        'avgang': (5, 'avgång', 0, 's'), 'skrotade': (5, 'skrotade', 0, 's'), 'kress': (5, 'Kress', 0, 's'), 'upplagget': (5, 'upplägget.', 0, 's'), 'noll': (5, 'noll', 0, 's'), 'h200forsaljning': (5, 'H200-försäljning', 0, 's'),
        'kalifornien': (5, 'Kaliforniens', 0, 's'), 'finansinspektionen': (5, 'finansinspektionen', 0, 's'), 'kongressen': (5, 'kongressen', 0, 's'), 'utreder': (5, 'utreder', 0, 's'),
        'fragan': (6, 'Frågan', 0, 's'), 'totalforbjuda': (6, 'totalförbjuda', 0, 's'), 'eller': (6, 'eller', 0, 's'), 'goder': (6, 'göder', 0, 's'), 'huawei6': (6, 'Huawei?', 0, 's'), 'huaweiEnd': (6, 'Huawei?', 0, 'e'),
    },
}
OVERRIDES = {1: [], 2: [], 3: []}

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
        sh(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{WORK}/p{p}.wav', '-codec:a', 'libmp3lame', '-b:a', '128k', f'{REPO}/public/nv{p}.mp3'])
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
    ts = "// AUTO-GENERATED by scripts/timing/nv_pipeline.py from public/nv1.mp3 + nv2.mp3 + nv3.mp3.\n"
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
        ts += f"export const nv{p}Timing: PartTiming = {{\n  AUDIO_SECONDS: {round(dur, 2)},\n  sceneStarts: {json.dumps(starts)},\n  anchors: {json.dumps(anchors, indent=4)},\n  words: ({json.dumps(caps, ensure_ascii=False)} as [string, number, number][]).map(([text, startMs, endMs]) => ({{text, startMs, endMs, timestampMs: Math.round((startMs + endMs) / 2), confidence: null}})),\n}};\n\n"
        print('sceneStarts', starts)
        for sc in range(1, n + 1):
            print(f' s{sc}:', ' '.join(f"{w['text']}@{w['s']:.2f}" for w in words if w['scene'] == sc))
        print('silences:', ' '.join(f'{a:.2f}-{b:.2f}' for a, b in sil))
    open(f'{REPO}/src/data/timing.nv.generated.ts', 'w').write(ts)


if __name__ == '__main__':
    main()
