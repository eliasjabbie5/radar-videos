"""Valet 2026 del 2-4 (Swedish government formation): cut the combined voice file, transcribe, align to the scripts, generate
src/data/timing.val.generated.ts

Source: /tmp/usa/usa.wav (24 kHz mono, 156.16 s) = Del 1 + Del 2 + Del 3 in one file.
Cuts (inside silences, -45 dB): P1 0 -> 49.30 | P2 50.30 -> 105.75 | P3 106.75 -> 156.16
Script word syntax 'display|alignkey' -> caption shows display, aligner matches alignkey (ASR writes numbers as digits).
Run: python3 scripts/timing/usa_pipeline.py
"""
import bisect, difflib, json, re, subprocess, wave
import numpy as np

SRC = '/tmp/val/val.wav'
REPO = '/home/user/valet-explainer'
WORK = '/tmp/val'
MODEL = '/tmp/asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/'
CUTS = {2: (0.00, 55.50), 3: (55.50, 109.84), 4: (109.84, 164.96)}

SCRIPTS = {
    2: [
        'Om du undrar varför Sverige fortfarande saknar regering, pekar nästan alla pilar mot ett enda parti: Centerpartiet.',
        'Efter valet har partiledaren Elisabeth Thand Ringqvist hållit fast vid två stenhårda röda linjer. Centern vägrar stödja en regering som samarbetar med Sverigedemokraterna. Samtidigt säger de blankt nej till att Vänsterpartiet ska få sitta i regeringen.',
        'I början av november gjorde partiet något helt nytt i svensk politik. De krävde att både Ulf Kristersson och Magdalena Andersson skulle lägga fram färdiga totalpaket. Den 15 november valde Centern till slut att gå vidare med Socialdemokraternas förslag.',
        'Enligt Centerpartiet handlar strategin om att säkra en bred och stabil mittenpolitik. Kritiker menar däremot att de dubbla kraven gör hela ekvationen omöjlig att lösa.',
        'För även om Centern nu valt sida, finns det ett stort hinder kvar. Nästa del handlar om krocken med Vänsterpartiet.',
    ],
    3: [
        'Centerpartiet har valt Magdalena Andersson – men ändå finns ingen regering. Varför? Svaret ligger i krocken mellan Centerpartiet och Vänsterpartiet.',
        'Socialdemokraternas plan är en regering med S, C och Miljöpartiet. Vänsterpartiet ska stå utanför, men få inflytande genom ett nära samarbete kring ett paket på 135 punkter.',
        'Problemet är att förhandlingarna har kört fast totalt. Vänsterpartiet håller fast vid sitt krav på egna ministerposter. Centerpartiet säger däremot nej till både V-ministrar och stora delar av Vänsterpartiets ekonomiska politik.',
        'Och här blir matten i riksdagen avgörande. Utan Vänsterpartiet saknar de rödgröna stöd nog för att klara omröstningen. Om V trycker på nej-knappen faller Magdalena Andersson direkt.',
        'Två partier som inte kan styra ihop – men som inte heller kan släppa fram en regering utan varandra. Vad händer om allt kraschar? Det tar vi i sista delen.',
    ],
    4: [
        'Sverige är bara två misslyckade omröstningar ifrån ett extraval. Så här fungerar regeln som pressar partiledarna just nu.',
        'I Sverige behöver en statsminister faktiskt inte ha en majoritet som röstar ja. Det räcker att inte minst 175 ledamöter röstar nej – det kallas negativ parlamentarism. Eftersom högerblocket har 173 mandat kan Magdalena Andersson bli vald om Vänsterpartiet bara lägger ner sina röster.',
        'Men talmannen har bara fyra chanser totalt. Två är redan förbrukade. Om riksdagen säger nej två gånger till måste Sverige enligt grundlagen hålla extraval inom tre månader.',
        'Problemet? Ett extraval kostar hundratals miljoner och garanterar inte ens att dödläget försvinner.',
        'Talmannen vill ha besked före jul. Så frågan är enkel: tror du att partierna löser det i sista sekund – eller går vi mot extraval?',
    ],
}

# name -> (scene 1-based, display word, occurrence, 's'|'e')
ANCHORS = {
    2: {
        'saknar': (1, 'saknar', 0, 's'), 'regering': (1, 'regering,', 0, 's'), 'pilar': (1, 'pilar', 0, 's'), 'parti': (1, 'parti:', 0, 's'), 'cp': (1, 'Centerpartiet.', 0, 's'), 'cpEnd': (1, 'Centerpartiet.', 0, 'e'),
        'efter': (2, 'Efter', 0, 's'), 'partiledaren': (2, 'partiledaren', 0, 's'), 'linjer': (2, 'linjer.', 0, 's'), 'vagrar': (2, 'vägrar', 0, 's'), 'sd': (2, 'Sverigedemokraterna.', 0, 's'),
        'samtidigt': (2, 'Samtidigt', 0, 's'), 'nej': (2, 'nej', 0, 's'), 'v': (2, 'Vänsterpartiet', 0, 's'), 'regeringen': (2, 'regeringen.', 0, 's'),
        'borjan': (3, 'början', 0, 's'), 'kravde': (3, 'krävde', 0, 's'), 'kristersson': (3, 'Kristersson', 0, 's'), 'andersson': (3, 'Andersson', 0, 's'), 'totalpaket': (3, 'totalpaket.', 0, 's'),
        'n15': (3, '15', 0, 's'), 'sociald': (3, 'Socialdemokraternas', 0, 's'), 'forslag': (3, 'förslag.', 0, 's'),
        'enligt': (4, 'Enligt', 0, 's'), 'mitten': (4, 'mittenpolitik.', 0, 's'), 'kritiker': (4, 'Kritiker', 0, 's'), 'omojlig': (4, 'omöjlig', 0, 's'),
        'hinder': (5, 'hinder', 0, 's'), 'nasta': (5, 'Nästa', 0, 's'), 'krocken': (5, 'krocken', 0, 's'), 'vEnd': (5, 'Vänsterpartiet.', 0, 'e'),
    },
    3: {
        'valt': (1, 'valt', 0, 's'), 'ingen': (1, 'ingen', 0, 's'), 'varfor': (1, 'Varför?', 0, 's'), 'krocken': (1, 'krocken', 0, 's'), 'vEnd': (1, 'Vänsterpartiet.', 0, 'e'),
        'plan': (2, 'plan', 0, 's'), 's': (2, 'S,', 0, 's'), 'c': (2, 'C', 0, 's'), 'mp': (2, 'Miljöpartiet.', 0, 's'), 'utanfor': (2, 'utanför,', 0, 's'), 'inflytande': (2, 'inflytande', 0, 's'),
        'n135': (2, '135', 0, 's'), 'punkter': (2, 'punkter.', 0, 's'),
        'forhandlingarna': (3, 'förhandlingarna', 0, 's'), 'totalt': (3, 'totalt.', 0, 's'), 'v': (3, 'Vänsterpartiet', 0, 's'), 'ministerposter': (3, 'ministerposter.', 0, 's'),
        'cp': (3, 'Centerpartiet', 0, 's'), 'nej': (3, 'nej', 0, 's'), 'vministrar': (3, 'V-ministrar', 0, 's'), 'ekonomiska': (3, 'ekonomiska', 0, 's'),
        'matten': (4, 'matten', 0, 's'), 'avgorande': (4, 'avgörande.', 0, 's'), 'utan': (4, 'Utan', 0, 's'), 'rodgronA': (4, 'rödgröna', 0, 's'), 'omrostningen': (4, 'omröstningen.', 0, 's'),
        'nejknappen': (4, 'nej-knappen', 0, 's'), 'faller': (4, 'faller', 0, 's'),
        'tva': (5, 'Två', 0, 's'), 'varandra': (5, 'varandra.', 0, 's'), 'kraschar': (5, 'kraschar?', 0, 's'), 'sista': (5, 'sista', 0, 's'),
    },
    4: {
        'tva': (1, 'två', 0, 's'), 'misslyckade': (1, 'misslyckade', 0, 's'), 'extraval': (1, 'extraval.', 0, 's'), 'regeln': (1, 'regeln', 0, 's'),
        'majoritet': (2, 'majoritet', 0, 's'), 'ja': (2, 'ja.', 0, 's'), 'n175': (2, '175', 0, 's'), 'nej': (2, 'nej', 0, 's'), 'negativ': (2, 'negativ', 0, 's'),
        'hogerblocket': (2, 'högerblocket', 0, 's'), 'n173': (2, '173', 0, 's'), 'vald': (2, 'vald', 0, 's'), 'lagger': (2, 'lägger', 0, 's'),
        'fyra': (3, 'fyra', 0, 's'), 'tva2': (3, 'Två', 0, 's'), 'forbrukade': (3, 'förbrukade.', 0, 's'), 'nej2': (3, 'nej', 0, 's'), 'grundlagen': (3, 'grundlagen', 0, 's'),
        'tre': (3, 'tre', 0, 's'), 'manader': (3, 'månader.', 0, 's'),
        'extraval2': (4, 'extraval', 0, 's'), 'kostar': (4, 'kostar', 0, 's'), 'hundratals': (4, 'hundratals', 0, 's'), 'garanterar': (4, 'garanterar', 0, 's'), 'dodlaget': (4, 'dödläget', 0, 's'),
        'talmannen': (5, 'Talmannen', 0, 's'), 'jul': (5, 'jul.', 0, 's'), 'fragan': (5, 'frågan', 0, 's'), 'loser': (5, 'löser', 0, 's'), 'eller': (5, 'eller', 0, 's'), 'extraval3': (5, 'extraval?', 0, 's'), 'extravalEnd': (5, 'extraval?', 0, 'e'),
    },
}
OVERRIDES = {2: [], 3: [], 4: []}

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
        sh(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{WORK}/p{p}.wav', '-codec:a', 'libmp3lame', '-b:a', '128k', f'{REPO}/public/val{p}.mp3'])
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
    ts = "// AUTO-GENERATED by scripts/timing/val_pipeline.py from public/val2.mp3 + val3.mp3 + val4.mp3.\n"
    ts += "// Times in seconds relative to the start of each part's mp3 (Caption startMs/endMs = ms).\n"
    ts += "import type {Caption} from '@remotion/captions';\n\n"
    ts += "export interface PartTiming { AUDIO_SECONDS: number; sceneStarts: number[]; anchors: Record<string, number>; words: Caption[]; }\n\n"
    for p in (2, 3, 4):
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
        ts += f"export const val{p}Timing: PartTiming = {{\n  AUDIO_SECONDS: {round(dur, 2)},\n  sceneStarts: {json.dumps(starts)},\n  anchors: {json.dumps(anchors, indent=4)},\n  words: ({json.dumps(caps, ensure_ascii=False)} as [string, number, number][]).map(([text, startMs, endMs]) => ({{text, startMs, endMs, timestampMs: Math.round((startMs + endMs) / 2), confidence: null}})),\n}};\n\n"
        print('sceneStarts', starts)
        for sc in range(1, n + 1):
            print(f' s{sc}:', ' '.join(f"{w['text']}@{w['s']:.2f}" for w in words if w['scene'] == sc))
        print('silences:', ' '.join(f'{a:.2f}-{b:.2f}' for a, b in sil))
    open(f'{REPO}/src/data/timing.val.generated.ts', 'w').write(ts)


if __name__ == '__main__':
    main()
