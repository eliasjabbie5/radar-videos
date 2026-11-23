# USA 2026 • DEL 1/3 — "Bakgrund: Fem platser"

**Tag:** `USA 2026 • DEL 1/3` · **Längd:** ~55 s (≈112 ord) · **Kedja:** `220–215` → `37 %` → `9 KARTOR` → `RÄCKTE DET?` (sista låst)
**Hook (frame 0):** stor `5` + text `FEM PLATSER.` · 435 punkter, 220 grå/215 blå · **Slutkort:** `DEL 2 • I MORGON 18:00`
**Loop:** slutar "…var fem platser nog?" → börjar "Fem platser. Så knapp var…"

## Manus (voiceover)
> Fem platser. Så knapp var Republikanernas marginal i representanthuset: tvåhundratjugo mot tvåhundrafemton.
>
> Mitt i en presidentperiod röstar USA om hela representanthuset och en tredjedel av senaten. Det brukar gå illa för presidentens parti.
>
> Före valet hade Donald Trump trettiosju procents stöd – lika lite som det lägsta före ett mellanårsval på femtio år, enligt NPR. Och väljarnas viktigaste fråga var dyrtiden.
>
> Partierna försökte skydda sina marginaler: i nio delstater, bland andra Texas, Florida, Ohio och Kalifornien, ritades valkartan om mitt i decenniet.
>
> Senaten såg tryggare ut för republikanerna: femtiotre platser mot fyrtiosju.
>
> Så var fem platser och omritade kartor nog?

## Scener
| Tid | Scen | Visuellt (ljudlöst läsbart) | Komponent | Källrad | Kedja | Ljud |
|---|---|---|---|---|---|---|
| 0–4 | **Hook** | `5` räknas in, 435 punkter: **220 mörka / 215 blå**; tröskellinje **218** ritas, text `MAJORITET = 218` | `ColdOpen` (räknare) + `DotGrid` | – | låsta `[?]×4` | `count` → `thud`, `swish` på linjen |
| 4–14 | Vad är ett mellanårsval? | Tidslinje `2024 VAL → 2026 MELLANÅRSVAL → 2028 VAL`, ikon-etiketter `435 HUSET` · `1/3 SENATEN`; röd pil `PRESIDENTENS PARTI BRUKAR FÖRLORA` | `FlowDiagram` | `KÄLLA: US CONGRESS` | ruta 1 `220–215` | `unlock`, `pop` ×3 |
| 14–26 | Trumps stöd | Mätare **37 %** glider ned; stämpel `LÄGST PÅ 50 ÅR (FÖRE MELLANÅRSVAL)`; chip `DYRTID = VIKTIGAST` | `DocumentChecklist` + mätare | `KÄLLA: NPR • CNN` | ruta 2 `37 %` | `fill_blue`→`stamp`, `pop_hi` |
| 26–40 | Omritade kartor | Nio delstat-etiketter tänds en i taget (`TX FL OH CA NC AL LA TN UT`), räknare `9` | `ComparisonMatrix` (tile-lista) | `KÄLLA: WIKIPEDIA • NPR` | ruta 3 `9 KARTOR` | `tick` ×9 (rullning) |
| 40–50 | Senaten | 100 punkter: **53 mörka / 47 blå** | `DotGrid` (100) | `KÄLLA: US SENATE` | – | `pop` |
| 50–55 | **Cliffhanger** | Fyra rutor: tre upplåsta, **fjärde `RÄCKTE DET?` förblir låst och pulserar**; kort `DEL 2 • I MORGON 18:00` | `MysteryChain` + `EpisodeCard` | `KÄLLA: NPR • WIKIPEDIA` | ruta 4 låst | `warn`, `lock` |

## Engagemang
- **Ingen binär fråga här** — cliffhangern är engagemanget (tittaren ska vilja ha del 2). Kommentar-bete: fastnålad *"Räckte fem platser? Skriv vad du tror."*
- Delbar bild: punktnätet 220–215 med 218-linjen.

## Källor
- [NPR – nationella stämningen & omritade kartor](https://www.npr.org/2026/05/09/nx-s1-5816246/redistricting-trump-republicans-midterms) · [NPR – Demokraternas försprång (okt)](https://www.npr.org/2026/10/06/nx-s1-5989694/midterm-elections-control-congress) · [CNN – Trumps stöd (okt)](https://edition.cnn.com/2026/10/21/politics/cnn-poll-trump-democrats-republicans-midterms)
- [Wikipedia – omdistrikteringen 2025–26](https://en.wikipedia.org/wiki/2025%E2%80%932026_United_States_redistricting) · [Benzinga – dyrtiden som viktigaste fråga](https://benzinga.com/news/politics/26/11/63514265/trump-approval-drops-to-37-as-cost-of-living-tops-voters-priorities)

## ⚠ Verifiera
- **220–215** (2024): bekräftad av sökträff; 53–47 i senaten är härlett (47 + 9 vända = 56) — bekräfta mot US Senate.
- "37 %, lägst på 50 år" = NPR:s snitt i **början av oktober**; CNN:s enskilda mätning gav 32 %. Vi säger "enligt NPR".
- Nio delstater enligt Wikipedia-sammanfattningen (AL, CA, FL, LA, NC, OH, TN, TX, UT). **Kalifornien ritade om till demokraternas fördel** — manuset är därför neutralt ("partierna försökte skydda sina marginaler").
