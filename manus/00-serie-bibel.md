# Serie-bibel — Editorial Verre × Bonne Question-mekanismerna

Källa: dina spaningar om @bonnequestion.tv + stilen från Val-videon (koncept C).
**Behåll 100 % av strukturen, byt det visuella lagret.**

## 1. Formeln → vår version

| # | Mekanism (Bonne Question) | Vår implementation |
|---|---|---|
| 1 | Cold open 0–4 s, ingen titelskylt | `ColdOpen` i tre varianter: **räknare** (70 DAGAR), **låsta rutor** `[?][?][?][?]`, **UI-kort** som blippar/avvisas. Toppankaret syns *inte* ännu. |
| 2 | Mystery Chain högst upp | `MysteryChain`: fyra glasrutor `[?]→[?]→[?]→[?]` som låses upp en i taget, i takt med rösten. Ersätter de fyra kapslarna i Val-videon. Sista rutan = cliffhangern. |
| 3 | UI-mockups, dokument, flöden | `DocumentChecklist` (☑/☐), `FlowDiagram`, `ComparisonMatrix`, `DotGrid`/`Hemicycle` — allt kodat, inga teckningar, inga pressfoton. |
| 4 | Mikrokällor + tydlig slutfråga | `SourceFooter` (mono, 23 px, bottom 250) som byter per scen + `BinaryOutro` med två glaspiller. |
| 5 | Serie-cliffhanger | `EpisodeCard`: "DEL 2: … →" i mono som sista rad. |

Extra grepp från referensen som vi tar med:
- **Visualiserad matte**: 1 punkt = en enhet (mandat, 100 milj. dollar, 10 soldater) som tänds i realtid.
- **Jämförelsematrisen**: 5 rutor i rad, mitten utgråad + röd stämpel — poängen på en sekund, funkar utan ljud.
- **Steg-räknaren**: numrerade rutor som tänds en efter en.

## 2. Designsystem (oförändrat från videon vi gjorde)
- Canvas **#FFFFFF**. Glaskort `rgba(255,255,255,.9)` + blur 18 + mjuk skugga, radie 28.
- Typsnitt: **Bricolage Grotesque** (rubriker/siffror), **DM Sans** (text/undertexter, 46 px), **DM Mono** (taggar, räknare, källor, versaler, 0.08em).
- Färger: ink `#14161B` · muted `#6B7280` · **röd `#EF4444`** = veto/varning/stämpel · **blå `#3B7BEA`** = neutral data · **grön `#17B26A`** = aktiv/ja.
- Easing `bezier(0.22,1,0.36,1)`, ingen studs. Safe zones: nedre 240 px och högra 140 px fria.
- Allt animeras mot **ord i rösten** (ordtider genereras från ljudfilen, som i Del 1).

## 3. Episodmall (~65–75 s)
| Tid | Block | Komponent |
|---|---|---|
| 0–5 s | Cold open | `ColdOpen` |
| 5–15 s | Läget i en mening | `DocumentChecklist` eller kort + **kedja ruta 1** |
| 15–50 s | 2–3 beats | `FlowDiagram` / `DotGrid` / `ComparisonMatrix` + **kedja ruta 2–3** |
| 50–65 s | Räkneexempel eller jämförelse | `StepCounter` / matris + **kedja ruta 4** |
| 65–75 s | Binär fråga + teaser | `BinaryOutro` + `EpisodeCard` |

## 4. Redaktionella regler
- **Inga loggor, spelgrafik eller pressfoton** (rättigheter) — typografiska kort och diagram.
- Bolagssiffror märks **"enligt Rockstar/Take-Two"**. Rättsfall: **båda sidor, ingen dom**.
- Räknexempel märks **"EXEMPEL"** i bild.
- Varje scen har en källrad i mono; slutkort med alla källor.

## 5. Ljud (nytt)
Samma princip som i Del 1: **inget musikspår, korta effekter ~10–20 dB under rösten, ungefär en per 1,6 s**, alla kopplade till samma cue som animationen. Ljudmallen:

| Händelse | Ljud | Händelse | Ljud |
|---|---|---|---|
| Scenbyte | `whoosh` | Kort/etikett in | `pop` / `pop_hi` |
| Räknare, punkter tänds | `count`, `fill_blue` | Stämpel (NEJ, VETO, FÄLLD) | `stamp` (+ `err`) |
| ☑ / ✕ | `chime` / `err` | Varning, pulserande pill | `warn` |
| Linje ritas | `swish` | Flagga/mål nås | `ping` |
| Spänning före avslöjande | `riser` | Kedjerutan låses upp | **`unlock`*** |

\*Nya effekter att syntetisera när vi bygger: `unlock` (mjuk klick + kort klocka uppåt), `lock` (låst ruta som skakar), `flip` (matris vänds). Tempo: nya rösten = **~2,1 ord/s** → 120–140 ord ≈ 60–66 s.

## 6. Vad som byggs i koden när ni valt manus
`MysteryChain` (ny toppankare) · `DocumentChecklist` · `ComparisonMatrix` · `FlowDiagram` · `EpisodeCard` · `ColdOpen`-varianter · `Episode`-schema som tar kedja + scener + källor ur en datafil (som `episode1.ts`).
