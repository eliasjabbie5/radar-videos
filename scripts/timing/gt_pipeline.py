"""GTA 6 series (4 parts): cut the combined voice file, transcribe, align to the scripts, generate src/data/timing.gt.generated.ts
Source: /tmp/s5/g.wav (24 kHz mono, 229.68 s). Cuts inside silences (-45 dB).
Script word syntax 'display|alignkey'. Run: python3 scripts/timing/gt_pipeline.py
"""
import bisect, difflib, json, re, subprocess, wave
import numpy as np

SRCS = {'g': '/tmp/s5/g.wav'}
REPO = '/home/user/valet-explainer'
WORK = '/tmp/s5'
MODEL = '/tmp/asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/'
CUTS = {1: ('g', [(0.00, 47.70)]), 2: ('g', [(47.70, 110.10)]), 3: ('g', [(110.10, 170.95)]), 4: ('g', [(171.80, 229.68)])}

SCRIPTS = {
    1: [
        'På bara tjugofyra|24 timmar drog GTA 6 in nästan 3,8 miljarder dollar.',
        'Det betyder att ett enda tv-spel tjänade mer pengar på en enda dag än vad Avatar och Avengers: Endgame gjorde under hela sin tid på bio.',
        'Det här handlar inte bara om ett populärt spel – det visar ett historiskt maktskifte i underhållningsbranschen. Spelindustrin har i tysthet vuxit om både Hollywood och musikbranschen tillsammans.',
        'När Rockstar släppte GTA 5 år 2013 drog det in 800 miljoner dollar första dygnet, vilket då kändes helt overkligt. Tretton år senare har den siffran nästan femdubblats.',
        'För första gången kan ett enda spelsläpp flytta börskurser, sänka produktiviteten på arbetsplatser och dominera hela världens uppmärksamhet samtidigt.',
    ],
    2: [
        'Hur stort är egentligen GTA 6? Så stort att resten av spelindustrin behandlade släppdatumet som en annalkande orkan.',
        'När Rockstar sköt upp spelet två gånger – först från hösten 2025 till maj 2026, och sedan till den 19 november – föll moderbolaget Take-Twos aktie med omkring tio|10 procent över en natt.',
        'Men den riktiga paniken utbröt hos konkurrenterna. Stora spelutgivare med projekt för över en miljard kronor har i månader försökt gissa när GTA 6 skulle landa. Ingen vågar släppa sitt eget storspel i samma kvartal, eftersom GTA suger upp både spelarnas tid och deras pengar.',
        'Så fort Rockstar flyttade sitt datum fick konkurrenter kasta om sina egna scheman för att inte bli helt begravda.',
        'Det har aldrig tidigare hänt att ett enda spel styr kalendern för en hel global industri. Är det imponerande – eller ett tecken på att branschen blivit alldeles för beroende av jättarna?',
        'Frågan är bara: kommer en film någonsin kunna mäta sig med det här igen – eller har spel helt tagit över som världens största kulturform?',
    ],
    3: [
        'Mellan år 2001 och 2008 släppte Rockstar fyra|4 enorma GTA-spel. Mellan 2013 och 2026 släppte de ett enda. Hur kunde väntan bli tretton|13 år lång?',
        'För det första har kostnaderna och komplexiteten exploderat.',
        'Moderna storspel kräver tusentals utvecklare över hela världen och budgetar som ryktas närma sig två|2 miljarder dollar – mer än flera storfilmer tillsammans. Minsta detalj i en öppen värld tar år att bygga.',
        'Men den andra anledningen handlar om ren ekonomi. GTA Online har dragit in miljarder dollar år efter år till Take-Two, utan att de behövt bygga ett helt nytt spel. Det gjorde att Rockstar helt enkelt inte hade bråttom.',
        'Resultatet är en ny verklighet där spelare får vänta över ett decennium på en uppföljare.',
        'Är det värt tretton|13 års väntan för den här nivån – eller saknar du tiden när nya spel kom vartannat år?',
    ],
    4: [
        'Innan GTA 6 ens hann släppas överlevde det den största läckan i spelhistorien – och den kom inte från en rivaliserande stat, utan från en sjuttonåring|17åring på ett hotellrum i London.',
        'År 2022 lyckades tonåringen, utrustad med en mobil, ett tangentbord och en Amazon Fire Stick, ta sig in i Rockstars interna Slack-kanaler och ladda ner nittio|90 tidiga videoklipp från spelet. För ett projekt värt miljarder dollar var det en mardröm.',
        'Rockstar svarade med att låsa ner sina studior helt och hållet, skärpa säkerheten till max och kalla tillbaka personalen till kontoren – trots att mindre läckor fortsatte dyka upp ända fram till släppet 2026.',
        'Ändå slog spelet alla tänkbara försäljningsrekord på dag ett. Det visar kanske branschens märkligaste sanning: för vissa spel spelar inte ens historiens största läcka någon roll.',
        'Tycker du att läckor förstör magin – eller bygger de bara ännu mer hype?',
    ],
}

def A(*a): return a + (0, 's')
ANCHORS = {
    1: {
        'tjugofyra': (1, 'tjugofyra', 0, 's'), 'gta': (1, 'GTA', 0, 's'), 'mdr': (1, '3,8', 0, 's'), 'dollar': (1, 'dollar.', 0, 's'),
        'betyder': (2, 'betyder', 0, 's'), 'tvspel': (2, 'tv-spel', 0, 's'), 'avatar': (2, 'Avatar', 0, 's'), 'endgame': (2, 'Endgame', 0, 's'), 'bio': (2, 'bio.', 0, 's'),
        'maktskifte': (3, 'maktskifte', 0, 's'), 'spelindustrin': (3, 'Spelindustrin', 0, 's'), 'hollywood': (3, 'Hollywood', 0, 's'), 'musikbranschen': (3, 'musikbranschen', 0, 's'), 'tillsammans': (3, 'tillsammans.', 0, 's'),
        'rockstar': (4, 'Rockstar', 0, 's'), 'gta5': (4, '5', 0, 's'), 'n800': (4, '800', 0, 's'), 'overkligt': (4, 'overkligt.', 0, 's'), 'tretton': (4, 'Tretton', 0, 's'), 'femdubblats': (4, 'femdubblats.', 0, 's'),
        'forsta': (5, 'För', 0, 's'), 'borskurser': (5, 'börskurser,', 0, 's'), 'produktiviteten': (5, 'produktiviteten', 0, 's'), 'uppmarksamhet': (5, 'uppmärksamhet', 0, 's'), 'samtidigt': (5, 'samtidigt.', 0, 's'),
    },
    2: {
        'hur': (1, 'Hur', 0, 's'), 'gta6': (1, '6?', 0, 's'), 'resten': (1, 'resten', 0, 's'), 'slappdatumet': (1, 'släppdatumet', 0, 's'), 'orkan': (1, 'orkan.', 0, 's'),
        'rockstar': (2, 'Rockstar', 0, 's'), 'tva': (2, 'två', 0, 's'), 'hosten': (2, 'hösten', 0, 's'), 'maj': (2, 'maj', 0, 's'), 'n19': (2, '19', 0, 's'), 'aktie': (2, 'aktie', 0, 's'), 'tio': (2, 'tio', 0, 's'), 'natt': (2, 'natt.', 0, 's'),
        'paniken': (3, 'paniken', 0, 's'), 'konkurrenterna': (3, 'konkurrenterna.', 0, 's'), 'miljard': (3, 'miljard', 0, 's'), 'gissa': (3, 'gissa', 0, 's'), 'landa': (3, 'landa.', 0, 's'), 'ingen': (3, 'Ingen', 0, 's'), 'kvartal': (3, 'kvartal,', 0, 's'), 'suger': (3, 'suger', 0, 's'), 'pengar': (3, 'pengar.', 0, 's'),
        'flyttade': (4, 'flyttade', 0, 's'), 'kasta': (4, 'kasta', 0, 's'), 'scheman': (4, 'scheman', 0, 's'), 'begravda': (4, 'begravda.', 0, 's'),
        'aldrig': (5, 'aldrig', 0, 's'), 'kalendern': (5, 'kalendern', 0, 's'), 'industri': (5, 'industri.', 0, 's'), 'imponerande': (5, 'imponerande', 0, 's'), 'beroende': (5, 'beroende', 0, 's'), 'jattarna': (5, 'jättarna?', 0, 's'), 'jattarnaEnd': (5, 'jättarna?', 0, 'e'),
        'fragan': (6, 'Frågan', 0, 's'), 'film': (6, 'film', 0, 's'), 'eller': (6, 'eller', 0, 's'), 'kulturform': (6, 'kulturform?', 0, 's'), 'kulturformEnd': (6, 'kulturform?', 0, 'e'),
    },
    3: {
        'mellan': (1, 'Mellan', 0, 's'), 'n2001': (1, '2001', 0, 's'), 'n2008': (1, '2008', 0, 's'), 'fyra': (1, 'fyra', 0, 's'), 'gtaspel': (1, 'GTA-spel.', 0, 's'), 'n2013': (1, '2013', 0, 's'), 'n2026': (1, '2026', 0, 's'), 'enda': (1, 'enda.', 0, 's'), 'hur': (1, 'Hur', 0, 's'), 'tretton': (1, 'tretton', 0, 's'), 'lang': (1, 'lång?', 0, 's'),
        'kostnaderna': (2, 'kostnaderna', 0, 's'), 'komplexiteten': (2, 'komplexiteten', 0, 's'), 'exploderat': (2, 'exploderat.', 0, 's'),
        'storspel': (3, 'storspel', 0, 's'), 'utvecklare': (3, 'utvecklare', 0, 's'), 'budgetar': (3, 'budgetar', 0, 's'), 'tva': (3, 'två', 0, 's'), 'storfilmer': (3, 'storfilmer', 0, 's'), 'tillsammans': (3, 'tillsammans.', 0, 's'), 'minsta': (3, 'Minsta', 0, 's'), 'bygga': (3, 'bygga.', 0, 's'),
        'andra': (4, 'andra', 0, 's'), 'ekonomi': (4, 'ekonomi.', 0, 's'), 'online': (4, 'Online', 0, 's'), 'miljarder': (4, 'miljarder', 0, 's'), 'taketwo': (4, 'Take-Two,', 0, 's'), 'nytt': (4, 'nytt', 0, 's'), 'brattom': (4, 'bråttom.', 0, 's'),
        'resultatet': (5, 'Resultatet', 0, 's'), 'verklighet': (5, 'verklighet', 0, 's'), 'decennium': (5, 'decennium', 0, 's'), 'uppfoljare': (5, 'uppföljare.', 0, 's'),
        'arq': (6, 'Är', 0, 's'), 'vart': (6, 'värt', 0, 's'), 'tretton2': (6, 'tretton', 0, 's'), 'vantan': (6, 'väntan', 0, 's'), 'eller': (6, 'eller', 0, 's'), 'vartannat': (6, 'vartannat', 0, 's'), 'arEnd': (6, 'år?', 0, 'e'),
    },
    4: {
        'innan': (1, 'Innan', 0, 's'), 'lackan': (1, 'läckan', 0, 's'), 'spelhistorien': (1, 'spelhistorien', 0, 's'), 'stat': (1, 'stat,', 0, 's'), 'sjutton': (1, 'sjuttonåring', 0, 's'), 'hotellrum': (1, 'hotellrum', 0, 's'), 'london': (1, 'London.', 0, 's'),
        'n2022': (2, '2022', 0, 's'), 'tonaringen': (2, 'tonåringen,', 0, 's'), 'mobil': (2, 'mobil,', 0, 's'), 'tangentbord': (2, 'tangentbord', 0, 's'), 'stick': (2, 'Stick,', 0, 's'), 'slack': (2, 'Slack-kanaler', 0, 's'), 'nittio': (2, 'nittio', 0, 's'), 'spelet': (2, 'spelet.', 0, 's'), 'miljarder': (2, 'miljarder', 0, 's'), 'mardrom': (2, 'mardröm.', 0, 's'),
        'svarade': (3, 'svarade', 0, 's'), 'studior': (3, 'studior', 0, 's'), 'sakerheten': (3, 'säkerheten', 0, 's'), 'personalen': (3, 'personalen', 0, 's'), 'lackor': (3, 'läckor', 0, 's'), 'n2026': (3, '2026.', 0, 's'),
        'anda': (4, 'Ändå', 0, 's'), 'rekord': (4, 'försäljningsrekord', 0, 's'), 'sanning': (4, 'sanning:', 0, 's'), 'lacka': (4, 'läcka', 0, 's'), 'roll': (4, 'roll.', 0, 's'),
        'tycker': (5, 'Tycker', 0, 's'), 'forstor': (5, 'förstör', 0, 's'), 'eller': (5, 'eller', 0, 's'), 'hype': (5, 'hype?', 0, 's'), 'hypeEnd': (5, 'hype?', 0, 'e'),
    },
}
OVERRIDES = {1: [], 2: [], 3: [], 4: []}

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
        sh(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{WORK}/p{p}.wav', '-codec:a', 'libmp3lame', '-b:a', '128k', f'{REPO}/public/gt{p}.mp3'])
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
    ts = "// AUTO-GENERATED by scripts/timing/gt_pipeline.py from public/gt1..4.mp3.\n"
    ts += "// Times in seconds relative to the start of each part's mp3 (Caption startMs/endMs = ms).\n"
    ts += "import type {Caption} from '@remotion/captions';\n\n"
    ts += "export interface PartTiming { AUDIO_SECONDS: number; sceneStarts: number[]; anchors: Record<string, number>; words: Caption[]; }\n\n"
    for p in (1, 2, 3, 4):
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
        ts += f"export const gt{p}Timing: PartTiming = {{\n  AUDIO_SECONDS: {round(dur, 2)},\n  sceneStarts: {json.dumps(starts)},\n  anchors: {json.dumps(anchors, indent=4)},\n  words: ({json.dumps(caps, ensure_ascii=False)} as [string, number, number][]).map(([text, startMs, endMs]) => ({{text, startMs, endMs, timestampMs: Math.round((startMs + endMs) / 2), confidence: null}})),\n}};\n\n"
        print('sceneStarts', starts)
        for sc in range(1, n + 1):
            print(f' s{sc}:', ' '.join(f"{w['text']}@{w['s']:.2f}" for w in words if w['scene'] == sc))
        print('silences:', ' '.join(f'{a:.2f}-{b:.2f}' for a, b in sil))
    open(f'{REPO}/src/data/timing.gt.generated.ts', 'w').write(ts)


if __name__ == '__main__':
    main()
