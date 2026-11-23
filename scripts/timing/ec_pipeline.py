"""Sweden explainers: tech / systembolaget / kiruna: cut the combined voice file, transcribe, align to the scripts, generate
src/data/timing.ec.generated.ts

Source: /tmp/usa/usa.wav (24 kHz mono, 156.16 s) = Del 1 + Del 2 + Del 3 in one file.
Cuts (inside silences, -45 dB): P1 0 -> 49.30 | P2 50.30 -> 105.75 | P3 106.75 -> 156.16
Script word syntax 'display|alignkey' -> caption shows display, aligner matches alignkey (ASR writes numbers as digits).
Run: python3 scripts/timing/usa_pipeline.py
"""
import bisect, difflib, json, re, subprocess, wave
import numpy as np

SRCS = {'e': '/tmp/s4/e.wav'}
REPO = '/home/user/valet-explainer'
WORK = '/tmp/s4'
MODEL = '/tmp/asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/'
CUTS = {1: ('e', [(0.00, 58.40)]), 2: ('e', [(58.40, 111.42)]), 3: ('e', [(111.42, 170.40)])}

SCRIPTS = {
    1: [
        'Hur kunde ett litet land med tio|10 miljoner invånare bli en av världens absolut största fabriker för techbolag – med jättar som Spotify, Klarna och Minecraft?',
        'Mycket började med en oväntad skattereform i slutet av 90-talet: Hem-PC-reformen.',
        'Staten gjorde det billigt för vanliga familjer att hyra en dator via jobbet, samtidigt som Sverige byggde ut snabbt bredband långt före resten av världen. En hel generation växte upp uppkopplade i sina pojkrum.',
        'Lägg till gratis universitet, ett starkt skyddsnät som gör det mindre farligt att våga starta företag och en hemmamarknad som är så liten att svenska startups tvingas tänka globalt från dag ett|1.',
        'Resultatet blev att Stockholm i dag producerar fler miljardbolag per capita än nästan någon annan stad utanför Silicon Valley.',
        'Frågan är bara: kan Sverige behålla försprånget i AI-eran – eller håller resten av världen på att springa ikapp?',
    ],
    2: [
        'När Sverige gick med i EU 1995 försvann nästan alla statliga monopol – på apotek, tåg och telekom. Men ett enda lyckades överleva: Systembolaget.',
        'Anledningen är att Sverige lyckades övertyga EU om att monopolet inte handlar om att tjäna pengar, utan om folkhälsa.',
        'Genom att ta bort vinstintresset, begränsa öppettiderna och inte ha några lockpriser på alkohol menar staten att svenskarna dricker mindre och lever längre.',
        'Samtidigt har debatten blossat upp igen kring gårdsförsäljning – alltså om små svenska bryggerier och vingårdar ska få sälja egna flaskor direkt till besökare.',
        'Kritiker varnar för att det kan hota hela monopolet i EU-domstolen, medan förespråkare menar att reglerna är hopplöst föråldrade.',
        'Så vad tycker du: är Systembolaget värt att skydda – eller är det dags att sälja vin i vanliga mataffärer?',
    ],
    3: [
        'Djupt under marken i Kiruna ligger något som kan förändra hela Europas framtid: den största kända fyndigheten av sällsynta jordartsmetaller på vår kontinent.',
        'De här metallerna är helt avgörande för den gröna omställningen. Utan dem går det inte att bygga elbilar, vindkraftverk eller modern försvarsteknik.',
        'Problemet är att Europa i dag är extremt beroende av Kina, som kontrollerar nästan hela världsmarknaden.',
        'Fyndet i Kiruna skulle kunna göra Sverige till Europas viktigaste råvaruleverantör och minska beroendet av Kina kraftigt.',
        'Men det finns en stor hake: att få miljötillstånd, hantera konflikter med rennäringen och faktiskt öppna en ny gruva i Sverige tar ofta tio|1 till femton|15 år.',
        'Europa skriker efter metallerna nu, men naturen och lagarna kräver tid. Borde Sverige snabba på gruvtillstånden – eller är miljöskyddet viktigare?',
    ],
}

ANCHORS = {
    1: {
        'litet': (1, 'litet', 0, 's'), 'n10': (1, 'tio', 0, 's'), 'fabriker': (1, 'fabriker', 0, 's'), 'spotify': (1, 'Spotify,', 0, 's'), 'klarna': (1, 'Klarna', 0, 's'), 'minecraft': (1, 'Minecraft?', 0, 's'),
        'skattereform': (2, 'skattereform', 0, 's'), 'hempc': (2, 'Hem-PC-reformen.', 0, 's'),
        'billigt': (3, 'billigt', 0, 's'), 'dator': (3, 'dator', 0, 's'), 'bredband': (3, 'bredband', 0, 's'), 'generation': (3, 'generation', 0, 's'), 'pojkrum': (3, 'pojkrum.', 0, 's'),
        'universitet': (4, 'universitet,', 0, 's'), 'skyddsnat': (4, 'skyddsnät', 0, 's'), 'hemmamarknad': (4, 'hemmamarknad', 0, 's'), 'globalt': (4, 'globalt', 0, 's'),
        'stockholm': (5, 'Stockholm', 0, 's'), 'miljardbolag': (5, 'miljardbolag', 0, 's'), 'valley': (5, 'Valley.', 0, 's'),
        'fragan': (6, 'Frågan', 0, 's'), 'behalla': (6, 'behålla', 0, 's'), 'eller': (6, 'eller', 0, 's'), 'ikapp': (6, 'ikapp?', 0, 's'), 'ikappEnd': (6, 'ikapp?', 0, 'e'),
    },
    2: {
        'n1995': (1, '1995', 0, 's'), 'monopol': (1, 'monopol', 0, 's'), 'apotek': (1, 'apotek,', 0, 's'), 'tag': (1, 'tåg', 0, 's'), 'telekom': (1, 'telekom.', 0, 's'), 'enda': (1, 'enda', 0, 's'), 'systembolaget': (1, 'Systembolaget.', 0, 's'),
        'anledningen': (2, 'Anledningen', 0, 's'), 'overtyga': (2, 'övertyga', 0, 's'), 'pengar': (2, 'pengar,', 0, 's'), 'folkhalsa': (2, 'folkhälsa.', 0, 's'),
        'vinstintresset': (3, 'vinstintresset,', 0, 's'), 'oppettiderna': (3, 'öppettiderna', 0, 's'), 'lockpriser': (3, 'lockpriser', 0, 's'), 'dricker': (3, 'dricker', 0, 's'), 'langre': (3, 'längre.', 0, 's'),
        'debatten': (4, 'debatten', 0, 's'), 'gardsforsaljning': (4, 'gårdsförsäljning', 0, 's'), 'bryggerier': (4, 'bryggerier', 0, 's'), 'flaskor': (4, 'flaskor', 0, 's'), 'besokare': (4, 'besökare.', 0, 's'),
        'kritiker': (5, 'Kritiker', 0, 's'), 'eudomstolen': (5, 'EU-domstolen,', 0, 's'), 'forespraks': (5, 'förespråkare', 0, 's'), 'foraldrade': (5, 'föråldrade.', 0, 's'),
        'sa': (6, 'Så', 0, 's'), 'skydda': (6, 'skydda', 0, 's'), 'eller': (6, 'eller', 0, 's'), 'mataffarer': (6, 'mataffärer?', 0, 's'), 'mataffarerEnd': (6, 'mataffärer?', 0, 'e'),
    },
    3: {
        'kiruna': (1, 'Kiruna', 0, 's'), 'framtid': (1, 'framtid:', 0, 's'), 'storsta': (1, 'största', 0, 's'), 'jordarts': (1, 'jordartsmetaller', 0, 's'), 'kontinent': (1, 'kontinent.', 0, 's'),
        'metallerna': (2, 'metallerna', 0, 's'), 'gron': (2, 'gröna', 0, 's'), 'elbilar': (2, 'elbilar,', 0, 's'), 'vindkraftverk': (2, 'vindkraftverk', 0, 's'), 'forsvarsteknik': (2, 'försvarsteknik.', 0, 's'),
        'problemet': (3, 'Problemet', 0, 's'), 'beroende': (3, 'beroende', 0, 's'), 'kina': (3, 'Kina,', 0, 's'), 'varldsmarknaden': (3, 'världsmarknaden.', 0, 's'),
        'fyndet': (4, 'Fyndet', 0, 's'), 'ravaruleverantor': (4, 'råvaruleverantör', 0, 's'), 'minska': (4, 'minska', 0, 's'), 'kraftigt': (4, 'kraftigt.', 0, 's'),
        'hake': (5, 'hake:', 0, 's'), 'miljotillstand': (5, 'miljötillstånd,', 0, 's'), 'rennaringen': (5, 'rennäringen', 0, 's'), 'gruva': (5, 'gruva', 0, 's'), 'tio': (5, 'tio', 0, 's'), 'ar': (5, 'år.', 0, 's'),
        'europa': (6, 'Europa', 0, 's'), 'skriker': (6, 'skriker', 0, 's'), 'tid': (6, 'tid.', 0, 's'), 'borde': (6, 'Borde', 0, 's'), 'snabba': (6, 'snabba', 0, 's'), 'eller': (6, 'eller', 0, 's'), 'miljoskyddet': (6, 'miljöskyddet', 0, 's'), 'viktigare': (6, 'viktigare?', 0, 's'), 'viktigareEnd': (6, 'viktigare?', 0, 'e'),
    },
}
OVERRIDES = {1: [], 2: [], 3: [(5, 'år.', 0, 47.15, 47.48)]}

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
        sh(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{WORK}/p{p}.wav', '-codec:a', 'libmp3lame', '-b:a', '128k', f'{REPO}/public/ec{p}.mp3'])
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
    ts = "// AUTO-GENERATED by scripts/timing/ec_pipeline.py from public/ec1.mp3 + ec2.mp3 + ec3.mp3.\n"
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
        ts += f"export const ec{p}Timing: PartTiming = {{\n  AUDIO_SECONDS: {round(dur, 2)},\n  sceneStarts: {json.dumps(starts)},\n  anchors: {json.dumps(anchors, indent=4)},\n  words: ({json.dumps(caps, ensure_ascii=False)} as [string, number, number][]).map(([text, startMs, endMs]) => ({{text, startMs, endMs, timestampMs: Math.round((startMs + endMs) / 2), confidence: null}})),\n}};\n\n"
        print('sceneStarts', starts)
        for sc in range(1, n + 1):
            print(f' s{sc}:', ' '.join(f"{w['text']}@{w['s']:.2f}" for w in words if w['scene'] == sc))
        print('silences:', ' '.join(f'{a:.2f}-{b:.2f}' for a, b in sil))
    open(f'{REPO}/src/data/timing.ec.generated.ts', 'w').write(ts)


if __name__ == '__main__':
    main()
