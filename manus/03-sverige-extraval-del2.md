# VALET 2026 • DEL 2/4 — "Fyra försök. Två är redan förbrukade."

**Tag:** `VALET 2026 • DEL 2/4` · **Längd:** ~68 s (≈135 ord) · **Kedja:** `NEJ 15/10` → `NEJ 3/11` → `SONDERING` → `EXTRAVAL?`
**Slutfråga:** `[ NY REGERING ]` `[ EXTRAVAL ]` · **Teaser:** `DEL 3: SÅ SKULLE ETT EXTRAVAL FUNGERA →`

## Manus (voiceover)
> Fyra försök. Två är redan förbrukade.
>
> Den femtonde oktober röstade riksdagen ned Magdalena Andersson: nittionio ja, tvåhundrafyrtioåtta nej. Den tredje november fick Centerpartiets Elisabeth Thand Ringqvist nej igen – bara Centerpartiet röstade ja.
>
> Sedan dess har Ulf Kristersson sonderat. Han rapporterade till talmannen den sjuttonde november, och talmannen la in en veckas paus. En tredje omröstning kan komma i slutet av november.
>
> Regeln är hård: förkastas talmannens förslag fyra gånger måste ett extra val hållas inom tre månader.
>
> Och talmannen har sagt att när folk firar jul ska Sverige antingen ha en ny regering – eller vara på väg mot ett extraval.
>
> Så frågan är: ny regering – eller extraval?

## Scener
| Tid | Scen | Visuellt | Komponent | Källrad | Kedja |
|---|---|---|---|---|---|
| 0–5 | Cold open | Fyra rutor `[✕][✕][?][?]` — två stämplas röda `NEJ`, två förblir låsta | `ColdOpen` (låsta rutor) | – | dold |
| 5–20 | Försök 1 & 2 | Två kort: `15 OKT  99 JA – 248 NEJ` · `3 NOV  25 JA – 324 NEJ`, röd stämpel `NEJ` | `StepCounter` + kort | `KÄLLA: RIKSDAGEN • WIKIPEDIA` | ruta 1 `NEJ 15/10`, ruta 2 `NEJ 3/11` |
| 20–38 | Just nu | Tidslinje: `17 NOV  SONDERING RAPPORTERAD` → `VECKANS PAUS` → `LATE NOV  3:E OMRÖSTNING?` (pulserar) | `DocumentChecklist` / tidslinje | `KÄLLA: SVT NYHETER • TALMANNEN` | ruta 3 `SONDERING` |
| 38–54 | Regeln | Flöde: `4 × NEJ` → `EXTRA VAL INOM 3 MÅNADER`; kalender med `JUL` markerad | `FlowDiagram` | `REGERINGSFORMEN 6 KAP.` | ruta 4 `EXTRAVAL?` pulserar |
| 54–68 | Slutfråga | Två pills + teaser | `BinaryOutro` + `EpisodeCard` | `KÄLLA: RIKSDAGEN` | – |

## Källor
- [Statsministeromröstningen 15 okt 2026 (sv.wikipedia)](https://sv.wikipedia.org/wiki/Statsministeromr%C3%B6stningen_i_Sverige_15_oktober_2026) · [… 3 nov 2026](https://sv.wikipedia.org/wiki/Statsministeromr%C3%B6stningen_i_Sverige_3_november_2026) · [Placera – Andersson nedröstad](https://www.placera.se/nyheter/magdalena-andersson-nedrostad-i-statsministeromrostning-2026-10-15)
- [SVT – Talmannen: Ny regering eller besked om extraval innan jul](https://www.svt.se/nyheter/inrikes/senaste-nytt-om-val-2026?inlagg=7d6bfb2a1680eaea7cf10f0816af68d2) · [Morgontidningen – extra tid för sondering](https://morgontidningen.se/2026/11/talmannen-ger-kristersson-extra-tid-for-sondering/) · [Sveriges Radio – Så går det med regeringsbildningen](https://www.sverigesradio.se/artikel/sa-gar-det-med-regeringsbildningen-2026)

## ⚠ Verifiera
- Röstsiffrorna kommer från Wikipedia/Placera → **bekräfta på riksdagen.se** innan render.
- Läget **ändras snabbt**: talmannen pratar med partiledarna efter den veckas pausen; en omröstning kan vara avgjord före publicering. Kontrollera dagen du renderar.
- Regeln "4 förkastade förslag → extra val inom 3 månader" bekräftad via SVT-refererat; formellt stöd: Regeringsformen 6 kap. — slå upp exakt paragraf för källraden.
- Obs: Del 1 säger "två chanser kvar" — stämmer med detta (2 av 4 förbrukade).

## Ljudspår
`lock`* ×2 på de låsta rutorna `[?][?]` → `stamp` + `err` på varje `NEJ` · `pop` på de två omröstningskorten · `swish` när tidslinjen ritas · `warn` när `3:E OMRÖSTNING?` pulserar · `swish` + `thud` när `4 × NEJ → EXTRAVAL` visas · `unlock`* per kedjeruta · `pop_hi` ×2 på slutknapparna.
