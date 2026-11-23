# GTA VI • DEL 2/2 — "Rättegången bakom spelet"

**Tag:** `GTA VI • DEL 2/2` · **Längd:** ~64 s (≈130 ord) · **Kedja:** `UPPSAGDA` → `DISCORD` → `RÄTTEGÅNG` → `DOM?`
**Slutfråga:** `[ ROCKSTAR ]` `[ FACKET ]` ("Vems version håller?") · **Teaser:** `VI FÖLJER DOMEN →`

## Manus (voiceover)
> Trettiofyra anställda. Uppsagda i slutet av 2025 – medan Rockstar byggde klart GTA sex.
>
> Trettioen av dem var medlemmar i facket IWGB. Rockstar säger att de fick sluta för att ha läckt hemlig information i en Discord-kanal. Facket säger att det handlar om att krossa en fackklubb, och kallar det spelbranschens värsta fall av fackbusning.
>
> I januari nekade en domstol i Glasgow de uppsagda ersättning i väntan på rättegång. I juni fick facket ändå rätt att driva sina krav på svartlistning.
>
> Rättegången började den tionde september. Den sjuttonde och artonde november höll parterna slutpläderingar – men domaren har inte sagt när hon beslutar. Och till den tjugosjätte november röstar Rockstars brittiska anställda om facket ska erkännas.
>
> Ingen dom har fallit. Så vems version håller – Rockstars eller fackets?

## Scener
| Tid | Scen | Visuellt | Komponent | Källrad | Kedja |
|---|---|---|---|---|---|
| 0–6 | Cold open | Fyra låsta rutor `[?][?][?][?]` → `34` stämplas in, text `UPPSAGDA` | `ColdOpen` (låsta rutor) | – | dold |
| 6–24 | Två versioner | Matris, två kolumner: **ROCKSTAR SÄGER** `Läckor i Discord` ↔ **IWGB SÄGER** `Fackbusning`; `31 + 3` uppdelning | `ComparisonMatrix` | `KÄLLA: GAME DEVELOPER • IWGB` | ruta 1 `UPPSAGDA`, ruta 2 `DISCORD` |
| 24–42 | Vägen till rätten | Checklista/tidslinje: ☑ Jan 2026 ersättning nekad · ☑ Jun 2026 svartlistningskrav prövas · ☑ 10 sep rättegång · ☑ 17–18 nov slutpläderingar · ☐ **DOM** (pulserar) | `DocumentChecklist` | `KÄLLA: PC GAMER • IBTIMES` | ruta 3 `RÄTTEGÅNG` |
| 42–54 | Facket i huset | Mätare: omröstning 12 → 26 nov, dag-räknare tickar | `StepCounter` | `KÄLLA: IBTIMES` | ruta 4 `DOM?` förblir låst (pulserar) |
| 54–64 | Slutfråga | Två pills Rockstar/Facket, "INGEN DOM HAR FALLIT" | `BinaryOutro` | `KÄLLA: GLASGOW EMPLOYMENT TRIBUNAL (REFERAT)` | – |

## Källor
- [Game Developer – rättegången börjar](https://www.gamedeveloper.com/production/-justice-at-last-feels-within-reach-fired-rockstar-workers-rally-in-glasgow-as-union-busting-tribunal-begins) · [PC Gamer – alla anklagelser prövas](https://pcgamer.com/gaming-industry/rockstar-faces-legal-setback-as-uk-tribunal-allows-its-fired-workers-to-bring-every-one-of-their-union-busting-allegations-to-trial/)
- [IBTimes – slutpläderingar & fackomröstning](https://www.ibtimes.co.uk/rockstar-uk-staff-union-vote-gta-6-launch-1829466) · [TechRadar – ersättning nekad](https://www.techradar.com/gaming/new-ruling-in-rockstar-games-legal-battle-means-the-gta-6-studio-wont-be-forced-to-pay-fired-employees-interim-relief-we-regret-that-we-were-put-in-a-position-where-dismissals-were-necessary)

## ⚠ Verifiera / juridik
- **Neutral ton:** alla påståenden tillskrivs part ("Rockstar säger", "facket säger"). Ingen slutsats om skuld.
- 34 = 31 IWGB-medlemmar i Storbritannien + 3 i Kanada (Game Developer m.fl.). Antal som deltar i rättegången varierar i rapporter (t.ex. 23) → vi säger inte det.
- "Slutet av 2025" är avsiktligt grovt — exakt datum finns i källorna om du vill ha det.
- Kolla **före publicering** om domen kommit (sökningen hittade ingen dom per 22 nov).

## Ljudspår
`riser` under de låsta rutorna → `stamp` på `34` · `pop` på de två kolumnerna · `chime` ×4 på ☑ i tidslinjen · `warn` när `DOM` pulserar · `tick`-rullning på fackomröstningen · `unlock`* per kedjeruta · `pop_hi` ×2.
