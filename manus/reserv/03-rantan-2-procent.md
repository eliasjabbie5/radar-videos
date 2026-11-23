# SVERIGE • "Räntan upp till 2 procent — vad betyder det för dig?"

**Tag:** `EKONOMI • RÄNTAN` · **Längd:** ~62 s (≈125 ord) · **Kedja:** `KRIGET` → `INFLATION` → `RIKSBANKEN` → `DIN RÄNTA`
**Slutfråga:** `[ TOPPEN NÅDD ]` `[ FLER HÖJNINGAR ]` · **Teaser:** `NÄSTA: ELSTÖDET I SÖDRA SVERIGE →`

## Manus (voiceover)
> Noll komma två fem. Så mycket höjde Riksbanken styrräntan – till två procent.
>
> Beslutet gäller från den elfte november. Skälet, enligt Riksbanken: starkare konjunktur och högre kostnader på grund av kriget i Mellanöstern, som gör att inflationen väntas stiga över två procent nästa år.
>
> Vad betyder en kvarts procentenhet? För ett bolån på tre miljoner kronor är det ungefär sjutusen femhundra kronor mer i ränta per år. Drygt sexhundra kronor i månaden, före ränteavdraget.
>
> Och Riksbanken tror inte att det stannar här: det är sannolikt att räntan höjs ytterligare under det närmaste året.
>
> Så frågan är: har vi sett toppen – eller är det här bara början?

## Scener
| Tid | Scen | Visuellt | Komponent | Källrad | Kedja |
|---|---|---|---|---|---|
| 0–5 | Cold open | Ränte-urtavla/skala **1,75 → 2,00 %** glider, siffran `+0,25` | `ColdOpen` (räknare) | – | dold |
| 5–20 | Varför | Flöde: `KRIGET I MELLANÖSTERN` → `HÖGRE KOSTNADER` → `INFLATION > 2 %` → `RÄNTEHÖJNING` | `FlowDiagram` | `KÄLLA: RIKSBANKEN` | ruta 1 `KRIGET`, 2 `INFLATION`, 3 `RIKSBANKEN` |
| 20–42 | Din plånbok | Räknekort **EXEMPEL**: `3 000 000 kr × 0,25 % = 7 500 kr/år = 625 kr/mån` + 12 punkter (månader) som tänds | `DotGrid` + `DocumentChecklist` | `EXEMPEL • FÖRE RÄNTEAVDRAG` | ruta 4 `DIN RÄNTA` |
| 42–52 | Framåt | Skala med streckad nästa-steg-markering `FLER HÖJNINGAR SANNOLIKA` | `StepCounter` | `KÄLLA: RIKSBANKEN` | – |
| 52–62 | Slutfråga | Två pills + teaser | `BinaryOutro` | `KÄLLA: RIKSBANKEN • SVT` | – |

## Källor
- [Riksbanken – Styrräntan höjs till 2 procent](https://www.riksbank.se/sv/press-och-publicerat/nyheter-och-pressmeddelanden/pressmeddelanden/2026/styrrantan-hojs-till-2-procent/) · [Beslutet i korthet, nov 2026](https://www.riksbank.se/sv/penningpolitik/penningpolitisk-rapport/2026/penningpolitiskt-beslut-november-2026/)
- [SVT – Riksbankens besked](https://www.svt.se/nyheter/inrikes/riksbankens-besked-sa-blir-styrrantan)

## ⚠ Verifiera
- Räkneexemplet är **aritmetik** (3 000 000 × 0,0025 = 7 500; ÷ 12 = 625) och märks EXEMPEL. Verklig effekt beror på bindningstid/rörlig ränta och marginal.
- Beslutsdatum (mötet 3 nov, ikraft 11 nov) enligt Riksbankens sidor — kontrollera mot pressmeddelandet innan render.
