# USA 2026 • DEL 2/3 — "Nu: Vad hände natten till den 4 november?"

**Tag:** `USA 2026 • DEL 2/3` · **Längd:** ~54 s (≈110 ord) · **Kedja:** `TEXAS` → `HUSET 258` → `SENATEN 56` → `STRAFF?`
**Hook (frame 0):** `TEXAS` stort + `1994 → 2026` · **Slutfråga:** `[ STRAFF ]` `[ VANLIGT MÖNSTER ]` · **Slutkort:** `DEL 3 • I MORGON 18:00`
**Svarar på del 1:** "Nej — fem platser räckte inte."

## Manus (voiceover)
> För första gången sedan 1994 vann demokraterna ett delstatsomfattande val i Texas.
>
> Det var bara början. Natten till den fjärde november tog de representanthuset med tvåhundrafemtioåtta platser – flest sedan 1992, och fyrtiotre fler än förra gången.
>
> I senaten vände de nio platser, bland annat i Ohio, Iowa och North Carolina, och har nu femtiosex av hundra.
>
> Omkring hundratjugotre miljoner amerikaner röstade – det näst högsta valdeltagandet i ett mellanårsval sedan 1914, enligt preliminära siffror.
>
> Donald Trump sa att valet inte var en folkomröstning om honom. Samtidigt låg hans stöd på trettiosju procent.
>
> Så frågan är: ett straff för Trump – eller bara det vanliga mönstret?

## Scener
| Tid | Scen | Visuellt (ljudlöst läsbart) | Komponent | Källrad | Kedja | Ljud |
|---|---|---|---|---|---|---|
| 0–4 | **Hook** | Stort kort `TEXAS`; tidslinje `1994 ──── 2026` där en röd prick blir blå; stämpel `FÖRSTA SEDAN 1994` | `ColdOpen` (UI-kort) | – | låsta `[?]×4` | `thud`, `stamp` |
| 4–16 | Huset | Punktnät 435: från **220 → 258 blå**, tröskel 218 passeras, siffran `258`; chip `FLEST SEDAN 1992` · `+43` | `DotGrid` | `KÄLLA: YAHOO NEWS • CNN` | ruta 1 `TEXAS`, ruta 2 `HUSET 258` | `count`, `fill_blue`, `unlock` |
| 16–28 | Senaten | 100 punkter: **47 → 56 blå**, nio punkter byter färg en i taget; etiketter `OH` `IA` `NC`… | `DotGrid` (100) | `KÄLLA: NPR • YAHOO NEWS` | ruta 3 `SENATEN 56` | `tick`-rullning, `chime` på nionde |
| 28–38 | Valdeltagande | Stor mätare **123 milj. · 49 %**; etikett `NÄST HÖGST SEDAN 1914 (PRELIMINÄRT)` | `StepCounter` | `KÄLLA: CFR` | – | `count_short`, `ping` |
| 38–48 | Trumps svar | Citatkort: *"Inte en folkomröstning om mig"* ↔ mätare `STÖD 37 %` | `ComparisonMatrix` | `KÄLLA: NPR • CNBC` | – | `pop` ×2, `warn` |
| 48–54 | **Binär fråga** | Fråga + `[ STRAFF ]` `[ VANLIGT MÖNSTER ]`, kedjerutan `STRAFF?` pulserar; kort `DEL 3 • I MORGON 18:00` | `BinaryOutro` + `EpisodeCard` | `KÄLLA: NPR • CNN` | ruta 4 `STRAFF?` | `pop_hi` ×2, `tick` på växling |

## Engagemang
- Frågan delar åsikter **utan att manuset tar ställning** (historiskt förlorar presidentens parti oftast — båda svaren är försvarbara). Det är det som driver kommentarer.
- Fastnålad: *"STRAFF eller MÖNSTER? Ett ord räcker. Facit i januari."*
- Svarsvideo dagen efter till mest likeade kommentar.

## Källor
- [CNN – takeaways](https://edition.cnn.com/2026/11/03/politics/midterm-election-night-takeaways) · [NPR – Democrats win big](https://www.npr.org/2026/11/03/nx-s1-5992757/election-day-live-updates-key-races) · [NPR – full control of Congress](https://www.kut.org/politics/2026-11-03/democrats-win-full-control-of-congress-ushering-in-a-new-era-of-divided-government)
- [Yahoo News – 56-mandat i senaten](https://www.yahoo.com/news/politics/article/final-2026-midterm-election-results-democrats-clinch-56-seat-senate-majority-with-peltolas-alaska-win-what-they-can--and-cant--do-next-184618858.html) · [Yahoo News – 258 i huset](https://www.yahoo.com/news/politics/article/lots-of-2026-midterm-races-still-havent-been-called-heres-where-things-stand-205425643.html) · [CFR – valet i siffror](https://www.cfr.org/articles/2026-election-by-the-numbers) · [The Statesman – 10 takeaways](https://www.thestatesman.com/world/senate-flips-texas-turned-blue-trumps-party-wiped-out-10-key-takeaways-from-the-2026-us-midterms-1503658730.html)

## ⚠ Verifiera
- **Texas 1994** står i NPR/CNN — kontrollera exakt formulering (vilka delstatsomfattande val).
- **258 / 56 rör sig** (257 i vissa trackers, fem platser var oavgjorda; Mississippi obekräftat). Uppdatera på publiceringsdagen.
- Valdeltagande (123,5 milj., 49,1 %) är **preliminärt** enligt CFR.
- Bonusfakta (ej i manus, **enbart en källa**, MS NOW): Susan Collins väntades förlora i Maine. Lägg inte till utan andra källor.
- Trumps citat varierar mellan källor — manuset använder NPR/CNBC-versionen ("inte en folkomröstning", "accepterar resultatet").
