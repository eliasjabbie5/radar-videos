# PRODUKTIONSGUIDE — så byggs videorna (för en AI som ska bygga fler)

> Läs tillsammans med `GUIDE-FOR-MANUS-AI.md` (som beskriver manus, hook, redaktionella regler och scenkatalogen ur en manusskrivares synvinkel). **Den här filen beskriver allt som behövs för att faktiskt bygga, tidssätta, ljudsätta, rendera och leverera videorna.** Allt nedan är verifierat på de videor som redan gjorts (Val 2026 del 1, Palantir del 1–2, USA 2026 del 1–3).

Språk i videorna: **svenska**. Kod, identifierare och kommandon nedan är på engelska.

---
## 0. Snabb sammanfattning (läs om du bara läser en sak)
1. Format: **1080×1920, 30 fps, ~50–65 s**, vit bakgrund, glaskort, ingen musik, inga foton/loggor. Röst (AI-TTS) + korta ljudeffekter + undertexter.
2. Mänskligheten levererar **en ljudfil** (ofta flera delar i en fil) + manus. Du klipper, taligenkänner, kopplar varje animation till ett **ord**, bygger en `Episode2`-datafil, renderar, mastrar till **−14 LUFS** och levererar `*-master.mp4`.
3. **Färger:** bläck `#14161B`, blå `#3B7BEA` (neutral data), grön `#17B26A` (bekräftat/nytt), **röd `#EF4444` bara för varningar/stämplar/förnekanden**. Inga fler färger. Se avsnitt 3.
4. **Appens UI täcker delar av bilden** — följ de uppmätta säkra zonerna i avsnitt 4 (`APP` i `src/lib/theme.ts`). Det är redan inbyggt i `src/v2/*`.
5. **Ljudeffekter ska ligga lägre än i de första videorna** (de upplevdes som lite höga): `SFX_MASTER = 0.65` i `src/lib/sfx.ts`. Se avsnitt 8.
6. Inga "I MORGON 18:00"-kort: delarna läggs ofta upp samma dag → använd **"NÄSTA VIDEO"** utan klockslag.

---
## 1. Projektöversikt
Projektet är **Remotion 4.0.545** (React 19, TypeScript, Tailwind v4, `@remotion/captions`, `@remotion/google-fonts`). Två system finns i repot:

| System | Filer | Används för |
|---|---|---|
| **v1** (specialbyggt) | `src/Composition.tsx`, `src/data/episode1.ts`, `src/components/**` | Val 2026 del 1. Bygg **inte** nya videor här. |
| **v2** (generiskt, datadrivet) | `src/v2/*`, `src/data/types2.ts`, `src/data/<episode>.ts` | **Allt nytt.** Palantir 1–2, USA 1–3. |

```
src/
  Root.tsx                 ← registrera varje episod som <Composition id="Usa1" component={EpisodeGeneric} .../>
  lib/theme.ts             ← färger, typsnitt, SAFE (gammal) och APP (ny, uppmätt) säkra zoner, mono()
  lib/sfx.ts               ← SFX_MASTER + nivå per ljud (SFX_LIBRARY)
  lib/motion.ts            ← EASE, prog(), lerp()
  data/types2.ts           ← alla widget-/scentyper (Episode2)
  data/<episode>.ts        ← EN FIL PER VIDEO: scener, kedja, ljudhändelser
  data/timing.<serie>.generated.ts   ← AUTOGENERERAD: ordtider + ankare (skapas av pipeline)
  v2/EpisodeGeneric.tsx    ← ljud, scenövergångar, kedja, undertexter, slutfade
  v2/scenes2.tsx           ← scentyper: stack, hookTiles, redacted, binary, cliff
  v2/widgets.tsx           ← widgetar: dots, fusion, cards, counter, checklist, versus, timeline, staff, bars, columns3, bigtext
  v2/ChainChrome.tsx       ← tagg + Mystery Chain (4 rutor) + källrad
  components/chrome/Captions.tsx   ← undertexter (46 px)
scripts/timing/usa_pipeline.py     ← mall för tidssättning (kopiera + redigera)
scripts/sfx/make_sfx.py            ← syntetiserar public/sfx/*.wav (numpy)
public/<serie><N>.mp3, public/sfx/ ← ljud
manus/                              ← manus + guider
```
Att **lägga till en video** = (1) en ljudfil → mp3, (2) tidssättning, (3) `src/data/<namn>.ts`, (4) registrera i `Root.tsx`, (5) rendera + mastra. Inga nya komponenter behövs (se 5 om du saknar en widget).

---
## 2. Arbetsflöde, steg för steg
### Steg 1 — Ta emot material
- Manus (voiceover-text per scen) enligt `GUIDE-FOR-MANUS-AI.md` + `MALL-manus.md`.
- **En ljudfil** med rösten (wav, 24 kHz mono). Ofta ligger flera delar i samma fil → klipp enligt steg 2.
- **Voiceover-texten är exakt det som läses.** Ändras texten efter inspelning måste allt tidssättas om.

### Steg 2 — Klipp delarna
Hitta tystnader mellan delarna: `ffmpeg -i fil16k.wav -af silencedetect=noise=-45dB:d=0.2 -f null -`. Klipp **mitt i en tystnad** mellan delarna, lägg 30 ms fades, spara `public/<serie><N>.mp3` (128 kbit) samt 16 kHz-kopior för taligenkänning. **Klipp med sample-slicing i numpy** (se `usa_pipeline.py: cut()`); ffmpeg `-ss` kombinerat med `afade` har gett fel offset på dessa wav-filer.
> Fallgrop: transkribera hela filen först och läs av vilken del som börjar var. Tidsangivelser från ASR-ordlistor kan vara förskjutna — verifiera mot tystnader.

### Steg 3 — Tidssätt varje ord (ASR + alignment)
Mall: **`scripts/timing/usa_pipeline.py`** (kopiera, byt `CUTS`, `SCRIPTS`, `ANCHORS`, namn).
- Motor: **sherpa-onnx + Parakeet TDT v3 int8** (modell i `/tmp/asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/`; ladda ner från GitHub releases — HuggingFace kan vara blockerat). `pip install sherpa-onnx numpy`.
- Manuset delas i **scener** (`SCRIPTS[del] = [scen1, scen2, …]`), orden alignas teckenvis mot ASR (`difflib`), tider interpoleras mellan träffar, **ordstarter som hamnar i en tystnad snappas till tystnadens slut**, och ett kontrollsteg skriver ut **"words straddling a pause > 0.3 s"** (ska vara tom; annars lägg en `OVERRIDES`-rad med manuella tider).
- **Siffror:** ASR skriver siffror som siffror (`220`, `1994`). Skriv därför dessa som siffror i `SCRIPTS`. För ord som visas på ett sätt men matchas på ett annat: `'Fem|5'` = visa "Fem", matcha mot "5".
- **Ankare** (`ANCHORS`): namn → (scen, ord, förekomst, `'s'`|`'e'` för start/slut). Dessa blir `A.<namn>` i episodfilen.
- Utdata: `src/data/timing.<serie>.generated.ts` med `AUDIO_SECONDS`, `sceneStarts` (scenens första ord − 0,45 s), `anchors`, `words` (undertexter).
- **Kontrollera alltid** utskriften: `char match` ≥ 0.95, inga "straddling", och att ankarordens tider är rimliga mot tystnadslistan. ASR förvanskar namn och småord ("Donald"→"Dorn"); det är ok så länge ordet hamnar rätt i tid.
- Trånga ställen: ankare på ord som ASR missat kan vara upp till ~0,3 s fel → titta på en bildruta vid ankaret.

### Steg 4 — Skriv episodfilen (`src/data/<namn>.ts`)
Skelett (förkortat; se `usa1.ts`/`usa3.ts` för komplett):
```ts
import {usa1Timing as T} from './timing.usa.generated';
const FPS = 30, A = T.anchors, TAIL_SECONDS = 1.3;
const total = Math.round((T.AUDIO_SECONDS + TAIL_SECONDS) * FPS);
const startSecs = [T.sceneStarts[0], T.sceneStarts[1], /* … ev. egna: A.npr - 0.4 */];
const starts = startSecs.map((s) => Math.round(s * FPS));
const gf  = (sec: number) => Math.round(sec * FPS);                       // global frame
const loc = (i: number, sec: number, lead = 3) =>                         // LOKAL frame i scen i, tänds 3 frames före ordet
  Math.max(0, Math.round(sec * FPS) - starts[i] - lead);
const dur = (i: number) => (i + 1 < starts.length ? starts[i + 1] : total) - starts[i];

const scenes: Scene2[] = [
  {key: 'hook', from: starts[0], duration: dur(0), source: null, chrome: false,
   body: {type: 'stack', gap: 30, widgets: [ {t:'bigtext', text:'5', sub:'PLATSER', at: loc(0, A.fem), size: 250}, … ]}},
  …
];
const chain = {labels: ['220–215','37 %','9 KARTOR','RÄCKTE DET?'], unlockAt: [starts[1] + 12, gf(A.n37), gf(A.nio), null]};
// sfx: se avsnitt 8
export const usa1: Episode2 = {meta:{id:'usa-del-1', tag:'USA 2026 • DEL 1/3', fps:FPS, width:1080, height:1920},
  audioFile:'usa1.mp3', transitionFrames:18, chain, scenes, captions:T.words, sfx};
export const usa1Duration = total;
```
Regler:
- **Alla `at`-värden i widgetar är LOKALA frames inuti scenen** → använd `loc(sceneIndex, A.ord)`. Stämplar/avslöjanden: `lead 0` på ordets **slut**. Kedjerutor och ljud använder **globala** frames (`gf`, `L(i, local)`).
- Scenbyten: scenen börjar ~0,45 s före sitt första ord; korsfade 18 frames (varje Sequence förlängs med 18). Håll en scen som slutar med stämpel/avslöjande ~0,4 s längre innan nästa tar över.
- Lägg `tag` som `SERIE • DEL N/M`.
- Slutscen: `binary` (slutfråga) eller `cliff` (kedjan stor, ruta 4 låst). **Kortet längst ned säger "NÄSTA VIDEO" / "NÄSTA: DEL 3 · FRAMTIDEN" — aldrig ett klockslag.**
- Registrera i `src/Root.tsx` (kopiera `<Composition id="Usa1" …>`).

### Steg 5 — Förhandsgranska (en bildruta i taget!)
```bash
npx remotion still Usa1 out/stills/u1_520.png --frame=520 --browser-executable=/opt/pw-browsers/chromium --log=error
```
- Kör stills **en i taget** (parallella still-processer har hängt sig).
- Titta på **slutläget** av varje scen (sent i scenen), inte bara början — widgetar tänds en i taget.
- Kontrollera mot zonerna i avsnitt 4 (rita gärna röda rutor över en still som kontrollbild).

### Steg 6 — Rendera
```bash
npx remotion render Usa1 out/final/usa1.mp4 --concurrency=3 --browser-executable=/opt/pw-browsers/chromium --log=error
```
- ~5 min per video på 4 kärnor. Kör video efter video (inte parallellt). I molnet: GitHub Actions-flödet `.github/workflows/render.yml` (workflow_dispatch → renderar + mastrar + laddar upp `*-master.mp4`).
- Chromium-sökvägen `/opt/pw-browsers/chromium` gäller i denna miljö; annars låt Remotion ladda ner egen.
- Använd **inte** `rm -rf <katalog>/*` (blockerat i miljön) — ta bort enskilda filer.

### Steg 7 — Mastra ljudet (−14 LUFS)
```bash
ffmpeg -y -i out/final/usa1.mp4 -c:v copy \
  -af "acompressor=threshold=-18dB:ratio=3:attack=5:release=80:makeup=2,loudnorm=I=-14:TP=-1.5:LRA=9" \
  -c:a aac -b:a 192k out/final/usa1-master.mp4
```
Mät: `ffmpeg -i usa1-master.mp4 -af ebur128=peak=true -f null -` → **I ≈ −14 (±0,5 LUFS), peak ≤ −1,0 dBFS.** Leverera `*-master.mp4`.

### Steg 8 — Leverera
Skicka mp4 + notera allt som **rör sig** (valresultat, kontrakt, datum) och vad som behöver faktakollas på publiceringsdagen. Påminn om plattformens **AI-märkning** (syntetisk röst).

---
## 3. Designsystem ("Ljus glas")
- **Duk:** helt vit `#FFFFFF`. Ingen gradient, inga foton, inga loggor.
- **Glaskort** (`className="glass"`): `rgba(255,255,255,.9)`, blur 18, 1 px kantlinje, mjuk skugga, radie 28. Index i `src/index.css`.
- **Färger (`colors` i `theme.ts`):**

| Roll | Färg | Används till |
|---|---|---|
| Bläck | `#14161B` | text, linjer, "republikaner"/övriga i tal |
| Grå text | `#6B7280` | etiketter, källor |
| **Blå** | `#3B7BEA` | neutral data, hypotes, "demokrater" |
| **Grön** | `#17B26A` | bekräftat/ja, nya platser, upplåsta kedjerutor |
| **Röd** | `#EF4444` | **ENDAST** varning, stämpel, förnekande, låst slutruta |
> **Röd är sparsam.** Använd den aldrig som varumärkesfärg i bild eller som partifärg. (Brand-sheeten v1 såg "extra röd" ut — v2 följer videornas färger.)

- **Typsnitt** (laddas i `src/lib/fonts.ts`): **Bricolage Grotesque** (rubriker/siffror, 600–800), **DM Sans** (brödtext/undertext, 500), **DM Mono** (versaler, spärrade etiketter/källor/siffror via `mono()`).
- **Rörelse:** bezier `(0.22, 1, 0.36, 1)`, **ingen studs**. Element glider in 20–30 px + fade (`Reveal`). Räknare använder `EASE_COUNT`. Stämplar roterar −3° och landar med scale 1.15→1.
- **Undertexter:** 46 px DM Sans, fraser (aldrig ett jättestort ord), aktivt ord mörkt, sagt ord 82 %, kommande ord grått. Visas i nedre tredjedelen.
- **Kedjan (Mystery Chain)** överst: fyra glasrutor `🔒 ?` som blir `● etikett` när rösten når steget (grön ring-puls vid upplåsning). **Ruta 4 förblir normalt låst** (streckad röd ram som pulserar) = cliffhanger. Etiketter **≤ 11 tecken** (versaler).
- **Källrad** (mono, grå, nederst): en per scen, `KÄLLA: …`, ≤ 55 tecken.
- **Partifärger i tal:** republikaner = bläck, demokrater = blå (nya/vunna = grön). Aldrig röd/blå = högerpolitik/vänsterpolitik.

---
## 4. Säkra zoner för TikTok/Reels (UPPMÄTT på en riktig telefon)
En skärmbild av en publicerad video i TikTok visade att appen **beskär och täcker** mer än den gamla regeln (`SAFE`: höger 140, botten 240) antog. Uppmätt (videokoordinater i 1080×1920):

| Område | Uppmätt | Åtgärd |
|---|---|---|
| Sidorna | videon beskärs **~46 px per sida** | vänstermarginal ≥ 90 px |
| Överst | statusfält + TikToks sökruta ("Find related content") täcker **~0–230 px** | tagg/kedja börjar ≥ 250 px |
| Höger | åtgärdsknappar (profil, gilla, kommentera, spara, dela) vid **x ≈ 900–1015, y ≈ 940–1760** | innehåll slutar ≤ x = 895 |
| Nederst | användarnamn + beskrivning **~1700–1920 px** | källrad/undertext ≤ y ≈ 1660 |

Inbyggt i **`APP = {left: 90, right: 185, top: 250, bottom: 260, scale: 0.92}`** (`src/lib/theme.ts`):
- All sceninnehåll i `src/v2/scenes2.tsx` (`Frame`) skalas **0,92** och centreras → bredd 805 px (x 90–895).
- Innehållsbandet för scener med kedja är **y ≈ 470–1480**; scener utan kedja (`chrome:false`, t.ex. cold open) **y ≈ 280–1480**.
- `ChainChrome` ligger vid y = 250; källraden `bottom: 270`; undertexter `bottom: 330`.
- **Max höjd** för en scens widgetar (i widgetarnas egna enheter): **≈ 1 100 px** med kedja, ≈ 1 200 px utan.
- Äldre videor (Val del 1, Palantir 1–2) renderades med de gamla zonerna; vid omrendering får de de nya — kontrollera att långa scener ryms.
- Instagram Reels/YouTube Shorts har liknande men något större undre UI → håll undertext och källa **ovanför** y ≈ 1660.

---
## 5. Scener och widgetar (v2-byggstenar)
Alla typer finns i `src/data/types2.ts`. Fältlängder och användning står i `GUIDE-FOR-MANUS-AI.md` §5; här en kort karta + **nya `dots`**.

**Scentyper:** `stack` (lista widgetar, mest använd) · `hookTiles` (2–4 stora ordkort, ev. låst) · `redacted` (dokument med censurbalk som dras undan) · `binary` (slutfråga + två knappar + `teaser`/`save`) · `cliff` (kedjan stor, sista låst).
**Widgetar:** `bigtext`, `counter`, `cards`, `checklist`, `versus`, `timeline`, `staff`, `bars`, `columns3`, `fusion`, **`dots`**.

**`dots` (ny)** — platsrutnät (riksdag/kongress):
```ts
{t:'dots', title:'REPRESENTANTHUSET · 435 PLATSER', at: loc(0, A.x), total:435, cols:29, size:22, gap:8,
 groups:[{label:'REPUBLIKANER', n:220, tone:'ink',  at: loc(0, A.n220), dur:34},
         {label:'DEMOKRATER',   n:215, tone:'blue', at: loc(0, A.n215), dur:34}],
 mark:{index:217, label:'MAJORITET = 218', at: loc(0, A.mot)}}      // ring runt en prick + etikett
```
Grupperna fyller rutnätet **i ordning**; varje grupp räknar upp från `at` över `dur` frames; en live-räknare visas per grupp. Bredd: 29 kolumner × 22 px (435 platser), 20 × 36 px (100 platser). Lägg "kvarvarande" i en egen grupp om raden ska vara fylld.

**Tumregler för bildinnehåll**
- Max **2–3 widgetar** per scen; ny visuell händelse minst var ~4:e sekund.
- Allt viktigt som visas ska sägas; widget tänds **på ordet** (lead 3 frames), stämplar **på ordets slut**.
- Osäkert/påstått → `dashed`, `unknown`-ikon, eller stämpel `OBEKRÄFTAT`/`ENLIGT <KÄLLA>`.
- Kort med stämpel: håll `title` kort (stämpeln ligger på rad 3); 1 rad rubrik.
- Citat på skärmen: **indirekt** ("Inte en folkomröstning om honom") om inte ordagrant.
- Saknar du en widget: bygg den i `widgets.tsx` (typ i `types2.ts`, en `case` i `renderWidget`) — följ `Dots` som mall; använd `Reveal`, `prog`, `toneColor`, bredd `W = 876`.

---
## 6. Slutscener
- **Binär fråga** (`binary`): `question` ≤ 34 tecken, `options` ≤ 12 tecken vardera (annars bryts pillen), `optionsAt` = första svarsordet, `switchAt` = "eller" (markeringen hoppar), valfri `save: {text:'SPARA'}` eller `teaser: {text:'NÄSTA: DEL 3 · FRAMTIDEN'}`.
- **Cliffhanger** (`cliff`): hela kedjan stor, ruta 4 låst/pulserande + kort `{title:'DEL 2 · NU', sub:'NÄSTA VIDEO'}`.
- **Aldrig klockslag** ("I MORGON 18:00"): delarna publiceras ofta samma dag.

---
## 7. Ljudeffekter
### 7.1 Principer
- **Ingen musik.** Korta, torra UI-ljud (pop, tick, svep, stämpel, klockton, lås) som **understryker visuella händelser**. Synthas med numpy: `npm run sfx` / `python3 scripts/sfx/make_sfx.py` → `public/sfx/*.wav` (44,1 kHz mono, peak −1 dBFS).
- **Nivå: lägre än i de första videorna.** De tidigare videorna (Val 1, Palantir 1–2, USA 1–3) renderades med nivåerna i tabellen nedan **×1,0** och upplevdes som *lite höga* (målet var 10–20 dB under rösten). **Nya videor använder `SFX_MASTER = 0.65` (≈ −3,7 dB)** i `src/lib/sfx.ts`, som multipliceras på alla effekter i både v1 och v2. Känns det fortfarande för mycket: sänk `SFX_MASTER` till 0.5 (≈ −6 dB). Rösten ska alltid vara tydligt dominant; en effekt ska märkas först när den saknas.
- Efter mixen mastras hela ljudet till −14 LUFS; **justera effektnivån via `SFX_MASTER`, inte via mastringen.**

### 7.2 Biblioteket (gain före `SFX_MASTER`, längd)
| Ljud | Gain | Längd | Används till |
|---|---|---|---|
| `whoosh` | 0,20 | 0,7 s | scenbyte (4 frames före) |
| `swish` | 0,12 | 0,45 s | linjer som ritas (fusion), tröskel |
| `pop` | 0,16 | 0,14 s | ett kort/ett element kommer in |
| `pop_hi` | 0,14 | 0,12 s | listrader, flera element i rad |
| `tick` / `tick_soft` | 0,11 / 0,22 | 0,03 s | räknande rutor, små steg |
| `thud` | 0,26 | 0,55 s | stor siffra/titel, tungt avstamp |
| `stamp` | 0,28 | 0,6 s | stämplar (OBEKRÄFTAT, FÖRSTA SEDAN 1994) |
| `chime` | 0,17 | 0,8 s | bekräftelse (✓), "klart" |
| `ping` | 0,17 | 0,9 s | markering (majoritetsring) |
| `err` | 0,14 | 0,34 s | nej/✕/"ingen kommentar"/saknas |
| `warn` | 0,17 | 0,6 s | varning, vändning, "men…" |
| `count` / `count_short` | 0,11 / 0,10 | 1,3 / 1,5 s | siffror som räknar upp (klipp med `duration`) |
| `fill_blue` / `fill_red` | 0,10 / 0,14 | 3,1 / 1,0 s | fyllnad av prickar/staplar (klipp med `duration`) |
| `riser` | 0,10 | 1,4 s | uppbyggnad före avslöjande |
| `unlock` / `lock` | 0,20 / 0,20 | 0,55 / 0,4 s | kedjerutor låses upp / sista låses |
| `flip` | 0,14 | 0,3 s | slutfrågans markering hoppar |

### 7.3 Hur effekter placeras (i episodfilen)
```ts
const sfx: SfxEvent[] = [];
const add = (g: number, name: SfxName, volume = 1, duration?: number) => sfx.push({at: Math.max(0, g), name, volume, duration});
const L = (i: number, local: number) => starts[i] + local;     // lokal → global frame
starts.slice(1).forEach((s) => add(s - 4, 'whoosh'));          // scenbyten
chain.unlockAt.forEach((u) => u !== null && add(u, 'unlock')); // kedjerutor
add(L(1, loc(1, A.n37)), 'count_short', 0.8, 30);             // räknare: duration klipper ljudet
add(L(1, loc(1, A.npr)), 'pop');
```
**Mönster som fungerat:** `pop`/`pop_hi` på varje nytt kort/rad, `count_short` när en siffra räknar (klipp till animationens längd), `fill_blue` när prickar fylls, `stamp` på stämplar, `err` på negativa rader, `warn` på "men"/varning, `unlock` på kedjerutor, `lock` när sista rutan stannar låst, `whoosh` på varje scenbyte. Använd inte mer än ~1 effekt per 0,5 s; tysta ställen är bra.
Varje effekt spelas i en `<Sequence>` med `<Html5Audio volume=…>` och en 5-frames utfade i slutet (klick-skydd) — redan inbyggt i `EpisodeGeneric.tsx`.

---
## 8. Varumärke (radar)
Kanalnamn och logga: **radar** ("Nyheterna, förklarade." / "The news, on radar."). Filer i `manus/namn-logga/radar/`:
- `radar-brand-sheet-v2.png` (aktuell, i videornas färger), `radar-mark-v2.svg/png` (märke), `radar-mark-white-v2.svg` (vit), `radar-logo-white-bg.png`, `radar-mark-white-bg.png`.
- Märket: bläckring + blått svep + **grön** blipp. Wordmark: Bricolage Grotesque 800, gemener.
- Vattenstämpel (om den används): uppe till vänster **inom säkra zoner** (x ≥ 90, y ≥ 250 om den ligger i tagg-raden).
- Profilbild: cirkel, märket centrerat. (Den äldre brand-sheeten v1 har röd svep/blipp — använd v2.)

---
## 9. Kvalitetskontroll före leverans
- [ ] `npx tsc --noEmit` rent
- [ ] "words straddling a pause" tom; `char match` ≥ 0.95
- [ ] Stills på **slutläget** av varje scen; inget överlappar kedjan, källraden eller undertexten
- [ ] Inget innehåll i de uppmätta zonerna (avsnitt 4)
- [ ] Stämplar/avslöjanden på ordets slut; ingen scen byts precis när en stämpel visas
- [ ] Slutscen har ingen klockslagsformulering
- [ ] Färger enligt avsnitt 3 (röd bara för varning)
- [ ] `SFX_MASTER` = 0,65 eller lägre; rösten dominerar
- [ ] Mastrat: ≈ −14 LUFS, peak ≤ −1 dBFS; längd = ljud + 1–1,5 s svans
- [ ] Siffror som rör sig noterade för användaren; AI-märkning påminns

### Fallgropar som redan hittats
- ASR förvanskar namn och siffror → manuella `OVERRIDES` och `display|key`-syntax.
- Ankare på ord rakt efter en paus kan hamna för sent → pipelinen "drar" dem till tystnadens slut; kolla ändå.
- En stämpel eller avslöjande **sist** i en scen hinner korsfadas bort → håll scenen ~0,4 s längre.
- Stills parallellt = hängning; rendera en video i taget.
- Stack-scener med för mycket innehåll får tomt i ena änden och trängsel i andra: sikta på 2–3 widgetar, 700–1 000 px.
- `Cards`-stämpel ligger på rad 3: långa rubriker (2–3 rader) krockar med den.
- `binary`-pillar: ≤ 12 tecken per alternativ.
- Kontrollera alltid att texten i bild inte lovar något som rösten inte säger.

---
## 10. Filindex
- Manus: `manus/00-serie-bibel.md`, `manus/04-usa-serien/`, `manus/07-palantir-serien/`, övriga i `manus/` och `manus/reserv/`
- Guider: `manus/GUIDE-FOR-MANUS-AI.md` (manus), **denna fil** (bygge), `manus/MALL-manus.md` (mall)
- Färdiga episodfiler att kopiera: `src/data/usa1.ts` (siffror/prickar), `usa2.ts` (7 scener, binär slut), `usa3.ts` (veto-matematik), `palantir1.ts`/`palantir2.ts` (fusion/redacted/hookTiles)
- Pipeline: `scripts/timing/usa_pipeline.py` (3 delar), `palantir_pipeline.py` (2 delar)
- Ljud: `scripts/sfx/make_sfx.py`, `src/lib/sfx.ts`, `public/sfx/`
- Render/CI: `.github/workflows/render.yml`, `remotion.config.ts`, `package.json`
