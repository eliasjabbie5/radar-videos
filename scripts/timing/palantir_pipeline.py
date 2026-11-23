"""Palantir series: cut the combined voice file, transcribe, align to the scripts and generate
src/data/timing.palantir.generated.ts

Source: /tmp/ref/pal.wav (24 kHz mono, 162.96 s) = Del 1 + Del 2 + a STRAY leftover paragraph (ignored).
Cut points (verified against silences, -45 dB / 0.08 s):
  Part 1 = 0.00  -> 61.30 s   (last word "två" ends 61.16; silence 61.16-61.93)
  Part 2 = 61.75 -> 127.31 s  (speech starts 61.93; "veta" ends 127.19; silence 127.19-127.43; stray text follows)
30 ms fades. Outputs: public/palantir1.mp3, public/palantir2.mp3, /tmp/asr/p1.wav, p2.wav (+16 kHz copies).

Needs: numpy, sherpa-onnx, ffmpeg; Parakeet v3 model in /tmp/asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/
Run:   python3 scripts/timing/palantir_pipeline.py
"""
import bisect, difflib, json, re, subprocess, sys, wave
import numpy as np

SRC = '/tmp/ref/pal.wav'
REPO = '/home/user/valet-explainer'
WORK = '/tmp/asr'
MODEL = WORK + '/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/'
CUTS = {1: (0.00, 61.30), 2: (61.75, 127.31)}

SCRIPTS = {
    1: [
        'ICE, Nato, Israels försvar – och enligt Dagens ETC svenska polisen. Ett företag: Palantir.',
        'Palantir grundades 2003 för att hjälpa USA:s underrättelsetjänst mot terrorism. Enkelt förklarat bygger de program som lägger ihop data från massor av register på ett ställe – så att man ser vem som hänger ihop med vem, var och när.',
        'I USA byggde de systemet ImmigrationOS åt migrationsmyndigheten ICE, för omkring trettio miljoner dollar. Och Nato köpte 2025 deras system Maven.',
        'Maven användes i USA:s krig mot Iran: enligt Pentagon valdes tretton tusen mål ut på trettioåtta dagar. Om det användes mot Irans ledare Khamenei är obekräftat – Palantirs vd avböjde att kommentera.',
        'I Gaza har Palantir ett partnerskap med Israels försvar för "krigsrelaterade uppdrag". Kritiker säger att tekniken använts mot mål där. Palantir förnekar det.',
        'Och i Sverige? Del två.',
    ],
    2: [
        '"Vi kan varken bekräfta eller förneka." Så svarade Polisen när Dagens ETC frågade om Palantir.',
        'Palantir är ett amerikanskt företag som bygger program som lägger ihop data från många register, så att man ser vem som hänger ihop med vem.',
        'Enligt Dagens ETC har svensk polis i minst fem år använt en svensk version av Palantirs system Gotham, kallad Acus. Minst sex av bolagets utvecklare ska arbeta i polishuset på Kungsholmen, upp till fyra dagar i veckan. Systemet ska kunna koppla ihop polisens register med bland annat BankID och mobiloperatörer.',
        'Palantirs Sverigechef har bekräftat att bolaget arbetat med Försvarsmakten i flera år. Och enligt Dagens ETC skrev Sverige i september 2025 på ett avtal om Maven – systemet som användes i kriget mot Iran. Försvarsministern ville inte kommentera.',
        'Polisen hänvisar till rikets säkerhet. Justitieminister Strömmer säger att Polisen själv avgör vilka it-tjänster den använder. Kritiker varnar för att människor som inte är misstänkta kan kartläggas.',
        'Så frågan är: ska våra myndigheters verktyg få vara hemliga – eller har vi rätt att veta?',
    ],
}

# name -> (scene 1-based, word, occurrence, 's'|'e')
ANCHORS = {
    1: {
        'ice': (1, 'ICE,', 0, 's'), 'nato': (1, 'Nato', 0, 's'), 'israel': (1, 'Israels', 0, 's'),
        'polisen': (1, 'polisen.', 0, 's'), 'palantirEnd': (1, 'Palantir.', 0, 'e'),
        'grundades': (2, 'grundades', 0, 's'), 'terrorism': (2, 'terrorism.', 0, 'e'), 'enkelt': (2, 'Enkelt', 0, 's'),
        'lagger': (2, 'lägger', 0, 's'), 'register': (2, 'register', 0, 's'), 'hanger': (2, 'hänger', 0, 's'),
        'varoch': (2, 'var', 0, 's'),
        'usa': (3, 'USA', 0, 's'), 'immigrationos': (3, 'ImmigrationOS', 0, 's'), 'ice2': (3, 'ICE,', 0, 's'),
        'trettio': (3, 'trettio', 0, 's'), 'dollar': (3, 'dollar.', 0, 'e'), 'nato2': (3, 'Nato', 0, 's'),
        'maven': (3, 'Maven.', 0, 's'),
        'maven2': (4, 'Maven', 0, 's'), 'iran': (4, 'Iran:', 0, 's'), 'pentagon': (4, 'Pentagon', 0, 's'),
        'tretton': (4, 'tretton', 0, 's'), 'trettioatta': (4, 'trettioåtta', 0, 's'), 'dagar': (4, 'dagar.', 0, 'e'),
        'khamenei': (4, 'Khamenei', 0, 's'), 'obekraftat': (4, 'obekräftat', 0, 's'), 'avbojde': (4, 'avböjde', 0, 's'),
        'gaza': (5, 'Gaza', 0, 's'), 'partnerskap': (5, 'partnerskap', 0, 's'),
        'krigsrelaterade': (5, '"krigsrelaterade', 0, 's'), 'kritiker': (5, 'Kritiker', 0, 's'),
        'mal': (5, 'mål', 0, 's'), 'fornekar': (5, 'förnekar', 0, 's'),
        'sverige': (6, 'Sverige?', 0, 's'), 'delTva': (6, 'två.', 0, 'e'),
    },
    2: {
        'varken': (1, 'varken', 0, 's'), 'forneka': (1, 'förneka."', 0, 'e'), 'svarade': (1, 'svarade', 0, 's'),
        'palantirEnd': (1, 'Palantir.', 0, 'e'),
        'amerikanskt': (2, 'amerikanskt', 0, 's'), 'lagger': (2, 'lägger', 0, 's'), 'register': (2, 'register,', 0, 's'),
        'hanger': (2, 'hänger', 0, 's'),
        'enligt': (3, 'Enligt', 0, 's'), 'femAr': (3, 'fem', 0, 's'), 'gotham': (3, 'Gotham,', 0, 's'),
        'acus': (3, 'Acus.', 0, 's'), 'sex': (3, 'sex', 0, 's'), 'kungsholmen': (3, 'Kungsholmen,', 0, 's'),
        'fyraDagar': (3, 'fyra', 0, 's'), 'koppla': (3, 'koppla', 0, 's'), 'bankid': (3, 'BankID', 0, 's'),
        'mobiloperatorer': (3, 'mobiloperatörer.', 0, 's'),
        'sverigechef': (4, 'Sverigechef', 0, 's'), 'forsvarsmakten': (4, 'Försvarsmakten', 0, 's'),
        'flera': (4, 'flera', 0, 's'), 'september': (4, 'september', 0, 's'), 'maven': (4, 'Maven', 0, 's'),
        'iran': (4, 'Iran.', 0, 's'), 'forsvarsministern': (4, 'Försvarsministern', 0, 's'),
        'kommentera': (4, 'kommentera.', 0, 's'),
        'rikets': (5, 'rikets', 0, 's'), 'strommer': (5, 'Strömmer', 0, 's'), 'avgor': (5, 'avgör', 0, 's'),
        'kritiker': (5, 'Kritiker', 0, 's'), 'kartlaggas': (5, 'kartläggas.', 0, 's'),
        'fragan': (6, 'frågan', 0, 's'), 'hemliga': (6, 'hemliga', 0, 's'), 'eller': (6, 'eller', 0, 's'),
        'veta': (6, 'veta?', 0, 's'),
    },
}

# manual overrides: (scene, word, occurrence, start, end) in seconds relative to the part — filled after review
OVERRIDES = {
    # 'Palantir förnekar det.' sits between silences 57.65-57.99 and 58.93-59.61; ASR stamped 'det' inside the pause
    1: [(5, 'förnekar', 0, 58.45, 58.78), (5, 'det.', 0, 58.78, 58.93)],
    2: [],
}

norm = lambda w: ''.join(c for c in w.lower() if c.isalnum())


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def cut():
    """Slice the samples directly (ffmpeg -ss / afade misbehave on this wav: input-side seek lands at 2x the offset,
    output-side seek keeps the original PTS so afade's st= fires early)."""
    w = wave.open(SRC); sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64)
    for p, (a, b) in CUTS.items():
        y = x[int(round(a * sr)):int(round(b * sr))].copy()
        n = int(0.03 * sr)
        y[:n] *= np.linspace(0, 1, n); y[-n:] *= np.linspace(1, 0, n)
        with wave.open(f'{WORK}/p{p}.wav', 'wb') as o:
            o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr)
            o.writeframes(np.round(y).astype(np.int16).tobytes())
        sh(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{WORK}/p{p}.wav', '-codec:a', 'libmp3lame', '-b:a', '128k', f'{REPO}/public/palantir{p}.mp3'])
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
    return [(a, b) for a, b in zip(st, en)]


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
            words.append({'scene': si, 'text': w})
    S = ''; span = []
    for w in words:
        n = norm(w['text']); span.append((len(S), len(S) + len(n))); S += n
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
    # manual overrides
    for sc, tx, occ, a, b in OVERRIDES[p]:
        ws = [w for w in words if w['scene'] == sc and norm(w['text']) == norm(tx)]
        ws[occ]['s'] = a; ws[occ]['e'] = b
    # snap word starts that fall inside a silence to the silence end (ASR onsets run early)
    snapped = 0; snaplog = []
    for w in words:
        for a, b in sil:
            if a + 0.02 < w['s'] < b - 0.02 and b - w['s'] < 0.6:
                snaplog.append((w['text'], round(w['s'], 2), round(a, 2), round(b, 2), round(w['e'], 2))); w['s'] = b; snapped += 1; break
    print('snapped words (text, start, sil_a, sil_b, end):', snaplog)
    # first word after a pause that the aligner placed LATE (garbled/dropped words) -> pull to the silence end
    pulled = []
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
            pulled.append((w['text'], round(w['s'], 2), round(b, 2))); w['s'] = b
    print('pulled to silence end:', pulled)
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
    return snapped, bad


def anchors_for(p, words):
    out = {}
    for name, (sc, tx, occ, edge) in ANCHORS[p].items():
        ws = [w for w in words if w['scene'] == sc and norm(w['text']) == norm(tx)]
        assert len(ws) > occ, (p, name, tx)
        out[name] = round(ws[occ]['s' if edge == 's' else 'e'], 2)
    return out


def main():
    cut()
    ts = "// AUTO-GENERATED by scripts/timing/palantir_pipeline.py from public/palantir1.mp3 + palantir2.mp3.\n"
    ts += "// Times in seconds relative to the start of each part's mp3 (except Caption startMs/endMs = ms).\n"
    ts += "import type {Caption} from '@remotion/captions';\n\n"
    ts += "export interface PartTiming { AUDIO_SECONDS: number; sceneStarts: number[]; anchors: Record<string, number>; words: Caption[]; }\n\n"
    report = {}
    for p in (1, 2):
        dur = float(sh(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{WORK}/p{p}.wav']).stdout)
        out = asr(p)
        print(f'\n=== PART {p} ({dur:.2f}s) ASR:\n{out["text"]}\n')
        words, ratio, END = align(p, out, dur)
        sil = silences(p)
        snapped, bad = refine(p, words, END, sil)
        print(f'char match {ratio:.3f} | snapped {snapped}/{len(words)} | straddling pause >0.3 s: {bad}')
        firsts = [min(w['s'] for w in words if w['scene'] == si) for si in range(1, 7)]
        starts = [0.0] + [round(f - 0.45, 2) for f in firsts[1:]]
        anchors = anchors_for(p, words)
        caps = [[w['text'] if i == 0 else ' ' + w['text'], round(w['s'] * 1000), round(w['e'] * 1000)] for i, w in enumerate(words)]
        ts += f"export const palantir{p}Timing: PartTiming = {{\n  AUDIO_SECONDS: {round(dur, 2)},\n  sceneStarts: {json.dumps(starts)},\n  anchors: {json.dumps(anchors, indent=4)},\n  words: ({json.dumps(caps, ensure_ascii=False)} as [string, number, number][]).map(([text, startMs, endMs]) => ({{text, startMs, endMs, timestampMs: Math.round((startMs + endMs) / 2), confidence: null}})),\n}};\n\n"
        report[p] = {'ratio': ratio, 'starts': starts, 'anchors': anchors, 'dur': dur, 'bad': bad}
        print('sceneStarts', starts)
        for sc in range(1, 7):
            print(f' s{sc}:', ' '.join(f"{w['text']}@{w['s']:.2f}" for w in words if w['scene'] == sc))
        print('silences:', ' '.join(f'{a:.2f}-{b:.2f}' for a, b in sil))
    open(f'{REPO}/src/data/timing.palantir.generated.ts', 'w').write(ts)
    json.dump(report, open(f'{WORK}/palantir_report.json', 'w'), indent=1)


if __name__ == '__main__':
    main()
