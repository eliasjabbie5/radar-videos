"""Sweden explainers: BankID / elpris / kronan: cut the combined voice file, transcribe, align to the scripts, generate
src/data/timing.sv.generated.ts

Source: /tmp/usa/usa.wav (24 kHz mono, 156.16 s) = Del 1 + Del 2 + Del 3 in one file.
Cuts (inside silences, -45 dB): P1 0 -> 49.30 | P2 50.30 -> 105.75 | P3 106.75 -> 156.16
Script word syntax 'display|alignkey' -> caption shows display, aligner matches alignkey (ASR writes numbers as digits).
Run: python3 scripts/timing/usa_pipeline.py
"""
import bisect, difflib, json, re, subprocess, wave
import numpy as np

SRCS = {'a': '/tmp/sv/a.wav', 'b': '/tmp/sv/b.wav'}
REPO = '/home/user/valet-explainer'
WORK = '/tmp/sv'
MODEL = '/tmp/asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/'
CUTS = {1: ('a', 0.00, 59.40), 2: ('a', 59.40, 121.92), 3: ('b', 0.00, 61.92)}

SCRIPTS = {
    1: [
        'Tänk dig att BankID ligger nere i bara en timme. Plötsligt kan du inte logga in hos läkaren, inte deklarera, inte betala en räkning och inte ens hämta ut ett paket.',
        'Det märkliga är att Sveriges viktigaste digitala infrastruktur inte ägs av staten. Den ägs av storbankerna.',
        'Både BankID och Swish byggdes som privata banksamarbeten, och över tid har hela samhället – från Skatteverket till 1177 – kopplat in sig på deras system.',
        'Det har gjort Sverige till ett av världens mest effektiva och kontantlösa länder. Men det skapar också en enorm sårbarhet. Om en enda teknisk bugg eller en överbelastningsattack slår ut systemet stannar vardagen direkt.',
        'Och den som nekas konto hos en storbank riskerar i praktiken att stängas ute från samhället. Nu utreds en statlig e-legitimation som backup.',
        'Frågan är om vi ens klarar oss utan bankerna – eller om staten borde ta över nyckeln till vår identitet?',
    ],
    2: [
        'Varför kan någon i Skåne betala fem gånger mer för exakt samma el som någon i Norrland? Svaret går tillbaka till ett EU-beslut från 2011.',
        'Sverige producerar massor av billig vattenkraft och vindkraft i norr, men den mesta elen används i söder. Tidigare hade hela landet samma elpris.',
        'Men eftersom elnätet inte klarar att skicka ner hur mycket ström som helst, ströp Sverige ibland exporten till Danmark. Då satte EU ner foten – och Sverige tvingades delas upp i fyra elprisområden, från SE1 i norr till SE4 i söder.',
        'Samtidigt är södra Sverige tätt hopkopplat med Tyskland och kontinenten.',
        'På den europeiska elmarknaden är det alltid den sista, dyraste kilowattimmen som sätter priset för alla. Så när det är vindstilla i Tyskland smittar de höga priserna rakt in i svenska elräkningar.',
        'Nya kraftledningar tar över tio år att bygga. Tills dess lever Sverige i två helt olika elverkligheter.',
        'Tycker du att hela landet borde ha samma elpris igen?',
    ],
    3: [
        'Det känns brutalt dyrt att åka på semester i Europa de senaste åren. Det är inte bara priserna som stigit – det är kronan som tappat kraft.',
        'Sedan 1992 har Sverige en rörlig växelkurs. Kronan är en liten valuta i ett litet, exportberoende land.',
        'Så fort det blir oroligt i världsekonomin gör stora internationella investerare samma sak: de säljer små valutor och flyttar pengarna till jättar som dollarn och euron.',
        'För svenska exportföretag är en svag krona faktiskt ofta bra, eftersom svenska varor blir billigare utomlands. Men för vanliga hushåll betyder det dyrare resor, dyrare teknik och högre priser på importerad mat.',
        'Egentligen har Sverige skrivit under på att införa euron en dag, men efter folkomröstningen 2003 har politikerna hållit oss utanför genom att helt enkelt låta bli att gå med i euro-samarbetets väntrum.',
        'Frågan är bara: hur svag måste kronan bli innan svenskarna ändrar sig om euron?',
    ],
}

# name -> (scene 1-based, display word, occurrence, 's'|'e')
ANCHORS = {
    1: {
        'bankid': (1, 'BankID', 0, 's'), 'timme': (1, 'timme.', 0, 's'), 'lakaren': (1, 'läkaren,', 0, 's'), 'deklarera': (1, 'deklarera,', 0, 's'), 'rakning': (1, 'räkning', 0, 's'), 'paket': (1, 'paket.', 0, 's'),
        'maerkliga': (2, 'märkliga', 0, 's'), 'staten': (2, 'staten.', 0, 's'), 'storbankerna': (2, 'storbankerna.', 0, 's'), 'agsAv': (2, 'ägs', 1, 's'),
        'bankid3': (3, 'BankID', 0, 's'), 'swish': (3, 'Swish', 0, 's'), 'banksamarbeten': (3, 'banksamarbeten,', 0, 's'), 'skatteverket': (3, 'Skatteverket', 0, 's'), 'n1177': (3, '1177', 0, 's'), 'system': (3, 'system.', 0, 's'),
        'effektiva': (4, 'effektiva', 0, 's'), 'kontantlosa': (4, 'kontantlösa', 0, 's'), 'sarbarhet': (4, 'sårbarhet.', 0, 's'), 'bugg': (4, 'bugg', 0, 's'), 'overbelastning': (4, 'överbelastningsattack', 0, 's'), 'vardagen': (4, 'vardagen', 0, 's'),
        'nekas': (5, 'nekas', 0, 's'), 'stangas': (5, 'stängas', 0, 's'), 'samhallet': (5, 'samhället.', 0, 's'), 'nu': (5, 'Nu', 0, 's'), 'utreds': (5, 'utreds', 0, 's'), 'elegitimation': (5, 'e-legitimation', 0, 's'), 'backup': (5, 'backup.', 0, 's'),
        'fragan': (6, 'Frågan', 0, 's'), 'klarar': (6, 'klarar', 0, 's'), 'bankerna': (6, 'bankerna', 0, 's'), 'eller': (6, 'eller', 0, 's'), 'staten6': (6, 'staten', 0, 's'), 'nyckeln': (6, 'nyckeln', 0, 's'), 'identitet': (6, 'identitet?', 0, 's'),
    },
    2: {
        'varfor': (1, 'Varför', 0, 's'), 'skane': (1, 'Skåne', 0, 's'), 'fem': (1, 'fem', 0, 's'), 'norrland': (1, 'Norrland?', 0, 's'), 'eubeslut': (1, 'EU-beslut', 0, 's'), 'n2011': (1, '2011.', 0, 's'),
        'producerar': (2, 'producerar', 0, 's'), 'vattenkraft': (2, 'vattenkraft', 0, 's'), 'vindkraft': (2, 'vindkraft', 0, 's'), 'norr': (2, 'norr,', 0, 's'), 'mesta': (2, 'mesta', 0, 's'), 'soder': (2, 'söder.', 0, 's'), 'tidigare': (2, 'Tidigare', 0, 's'), 'samma': (2, 'samma', 0, 's'), 'elpris': (2, 'elpris.', 0, 's'),
        'elnatet': (3, 'elnätet', 0, 's'), 'strop': (3, 'ströp', 0, 's'), 'danmark': (3, 'Danmark.', 0, 's'), 'foten': (3, 'foten', 0, 's'), 'fyra': (3, 'fyra', 0, 's'), 'omraden': (3, 'elprisområden,', 0, 's'), 'se1': (3, 'SE1', 0, 's'), 'se4': (3, 'SE4', 0, 's'), 'se4End': (3, 'söder.', 0, 'e'),
        'samtidigt': (4, 'Samtidigt', 0, 's'), 'tatt': (4, 'tätt', 0, 's'), 'tyskland': (4, 'Tyskland', 0, 's'), 'kontinenten': (4, 'kontinenten.', 0, 's'),
        'europeiska': (5, 'europeiska', 0, 's'), 'sista': (5, 'sista,', 0, 's'), 'dyraste': (5, 'dyraste', 0, 's'), 'priset': (5, 'priset', 0, 's'), 'vindstilla': (5, 'vindstilla', 0, 's'), 'tyskland5': (5, 'Tyskland', 0, 's'), 'smittar': (5, 'smittar', 0, 's'), 'elrakningar': (5, 'elräkningar.', 0, 's'),
        'nya': (6, 'Nya', 0, 's'), 'tio': (6, 'tio', 0, 's'), 'verkligheter': (6, 'elverkligheter.', 0, 's'),
        'tycker': (7, 'Tycker', 0, 's'), 'hela': (7, 'hela', 0, 's'), 'samma7': (7, 'samma', 0, 's'), 'igen': (7, 'igen?', 0, 's'), 'igenEnd': (7, 'igen?', 0, 'e'),
    },
    3: {
        'brutalt': (1, 'brutalt', 0, 's'), 'semester': (1, 'semester', 0, 's'), 'europa': (1, 'Europa', 0, 's'), 'priserna': (1, 'priserna', 0, 's'), 'kronan': (1, 'kronan', 0, 's'), 'tappat': (1, 'tappat', 0, 's'),
        'n1992': (2, '1992', 0, 's'), 'rorlig': (2, 'rörlig', 0, 's'), 'liten': (2, 'liten', 0, 's'), 'export': (2, 'exportberoende', 0, 's'),
        'oroligt': (3, 'oroligt', 0, 's'), 'investerare': (3, 'investerare', 0, 's'), 'saljer': (3, 'säljer', 0, 's'), 'valutor': (3, 'valutor', 0, 's'), 'flyttar': (3, 'flyttar', 0, 's'), 'jattar': (3, 'jättar', 0, 's'), 'dollarn': (3, 'dollarn', 0, 's'), 'euron': (3, 'euron.', 0, 's'),
        'exportforetag': (4, 'exportföretag', 0, 's'), 'svag': (4, 'svag', 0, 's'), 'billigare': (4, 'billigare', 0, 's'), 'hushall': (4, 'hushåll', 0, 's'), 'resor': (4, 'resor,', 0, 's'), 'teknik': (4, 'teknik', 0, 's'), 'mat': (4, 'mat.', 0, 's'),
        'egentligen': (5, 'Egentligen', 0, 's'), 'euron5': (5, 'euron', 0, 's'), 'folkomrostningen': (5, 'folkomröstningen', 0, 's'), 'n2003': (5, '2003', 0, 's'), 'utanfor': (5, 'utanför', 0, 's'), 'vantrum': (5, 'väntrum.', 0, 's'),
        'fragan': (6, 'Frågan', 0, 's'), 'svag6': (6, 'svag', 0, 's'), 'svenskarna': (6, 'svenskarna', 0, 's'), 'euron6': (6, 'euron?', 0, 's'), 'euron6End': (6, 'euron?', 0, 'e'),
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
        sh(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{WORK}/p{p}.wav', '-codec:a', 'libmp3lame', '-b:a', '128k', f'{REPO}/public/sv{p}.mp3'])
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
    ts = "// AUTO-GENERATED by scripts/timing/sv_pipeline.py from public/sv1.mp3 + sv2.mp3 + sv3.mp3.\n"
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
        ts += f"export const sv{p}Timing: PartTiming = {{\n  AUDIO_SECONDS: {round(dur, 2)},\n  sceneStarts: {json.dumps(starts)},\n  anchors: {json.dumps(anchors, indent=4)},\n  words: ({json.dumps(caps, ensure_ascii=False)} as [string, number, number][]).map(([text, startMs, endMs]) => ({{text, startMs, endMs, timestampMs: Math.round((startMs + endMs) / 2), confidence: null}})),\n}};\n\n"
        print('sceneStarts', starts)
        for sc in range(1, n + 1):
            print(f' s{sc}:', ' '.join(f"{w['text']}@{w['s']:.2f}" for w in words if w['scene'] == sc))
        print('silences:', ' '.join(f'{a:.2f}-{b:.2f}' for a, b in sil))
    open(f'{REPO}/src/data/timing.sv.generated.ts', 'w').write(ts)


if __name__ == '__main__':
    main()
