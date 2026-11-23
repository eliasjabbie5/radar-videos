# USA 2026 • DEL 3/3 — "Framtiden: Vad kan Trump göra nu?"

**Tag:** `USA 2026 • DEL 3/3` · **Längd:** ~57 s (≈120 ord) · **Kedja:** `VETO` → `−32 / −11` → `3 JAN` → `DEAL?`
**Hook (frame 0):** stort `−32` + text `SAKNAS FÖR ATT KÖRA ÖVER VETOT` · **Slutfråga:** `[ DEAL ]` `[ STILLESTÅND ]` · **Slutkort:** `FACIT I JANUARI`
**Alternativ-hook (om du postar inom en vecka):** "Nitton dagar till nedstängning." (räkna om talet!)

## Manus (voiceover)
> Trump har ett vapen kvar: vetot. Och demokraterna saknar trettiotvå röster för att ta det ifrån honom.
>
> Den tredje januari byter makten hand i kongressen. Demokraterna får rätt att kalla vittnen och kräva handlingar. Hakeem Jeffries har sagt att dyrtiden kommer först – och att han varken utesluter eller lovar riksrätt.
>
> Men för att köra över ett veto krävs två tredjedelar: tvåhundranittio i huset och sextiosju i senaten. De har tvåhundrafemtioåtta och femtiosex.
>
> Däremot har senaten sista ordet om Trumps utnämningar. En bedömare tror att nästan inga går igenom på två år.
>
> Och innan dess? Den elfte december går USA:s tillfälliga budget ut – och kongressen är långt från en överenskommelse.
>
> Så frågan är: deal – eller stillestånd?

## Scener
| Tid | Scen | Visuellt (ljudlöst läsbart) | Komponent | Källrad | Kedja | Ljud |
|---|---|---|---|---|---|---|
| 0–4 | **Hook** | `−32` räknas ned, 435 punkter: 258 blå + röd tröskellinje vid **290**, gapet blinkar | `ColdOpen` (räknare) + `DotGrid` | – | låsta `[?]×4` | `count`, `stamp` på `VETO` |
| 4–16 | Maktskiftet | Tidslinje `NU: REPUBLIKANSK KONGRESS` → `3 JAN: DEMOKRATISK`; checklista `☑ VITTNEN ☑ HANDLINGAR ? RIKSRÄTT` (`?` pulserar) | `DocumentChecklist` | `KÄLLA: NPR • JEFFRIES` | ruta 1 `VETO` | `unlock`, `chime` ×2, `warn` |
| 16–30 | Vetots matte | Två punktnät med linjer: **huset 290 (saknas 32)** · **senaten 67 (saknas 11)**; linjerna blir röda | `DotGrid` ×2 + tröskel | `USA:S KONSTITUTION ART. I §7` | ruta 2 `−32 / −11` | `swish`, `err` ×2 |
| 30–40 | Utnämningar | Kort `SENATEN GODKÄNNER` med `56 av 100`; chip `"NÄSTAN INGA PÅ 2 ÅR" — BEDÖMARE` | `ComparisonMatrix` | `KÄLLA: NEWSWEEK` | ruta 3 `3 JAN` | `pop`, `stamp` |
| 40–50 | Före januari | Kalender: `11 DEC — BUDGETEN GÅR UT`, nedräknare; chip `KRIGSFINANSIERING = KRÅNGLET` | `FlowDiagram` | `KÄLLA: HOLLAND & KNIGHT • WILMERHALE` | ruta 4 `DEAL?` pulserar | `riser`, `warn` |
| 50–57 | **Binär fråga** | `[ DEAL ]` `[ STILLESTÅND ]`, text `FACIT I JANUARI`, liten `SPARA` | `BinaryOutro` + `EpisodeCard` | `KÄLLA: NPR • NEWSWEEK` | – | `pop_hi` ×2, `tick` |

## Engagemang
- **Delbar/sparbar bild:** vetoräkningen (290/67 vs 258/56) — lägg `SPARA` i mono i sista bilden.
- Kommentarsbete: ett ord (`DEAL`/`STILLESTÅND`) + löfte om uppföljning i januari (ger anledning att följa).
- Kan klippas till ett fristående **30 s-klipp** (hook + vetoräkningen) för Reels/Shorts-testet.

## Källor
- [NPR – Demokraternas planer för utredningar](https://www.npr.org/2026/11/04/g-s1-150276/2026-midterms-democrats-investigations) · [Newsweek – 56 platser, räcker det?](https://newsweek.com/democrats-56-senate-seats-enough-12745235) · [MoFo – tillsyn 2027](https://www.mofo.com/resources/insights/261105-democratic-congress-means-oversight)
- [Holland & Knight – årsslutsdeadlines](https://www.hklaw.com/en/insights/publications/2026/10/beyond-the-midterms-congress-faces-converging-year-end-deadlines) · [WilmerHale – lame duck](https://www.wilmerhale.com/en/insights/client-alerts/20261013-lame-duck-high-stakes-congresss-postelection-agenda) · [Kiplinger](https://www.kiplinger.com/politics/congress-faces-a-short-busy-lame-duck-session-2026)
- [Axios – Jeffries och riksrätt (aug)](https://www.axios.com/2026/08/26/hakeem-jeffries-trump-impeachment-dems-win-house) · [Yahoo – Jeffries: riksrätt inte prio](https://www.yahoo.com/news/politics/articles/hakeem-jeffries-declares-getting-even-155425574.html)

## ⚠ Verifiera
- **11 december** och "krigsfinansiering som huvudstridsfråga" kommer från rapporter i **oktober/början av november** — kolla läget på publiceringsdagen (kan vara löst/uppskjutet). Skriv inte "kriget mot Iran" i bild utan att bekräfta.
- Jeffries-citatet ("varken utesluter eller lovar") är **före valet** — formulera som "har sagt".
- "3 januari" som tillträdesdag: mofo.com anger 3 jan 2027 — bekräfta mot kongressens kalender.
- Vetoreglerna: 2/3 **av närvarande**; 290/67 gäller full närvaro.
- "Nästan inga utnämningar" är en **enskild bedömares** åsikt (Newsweek) — attribuerad i manus; behåll "en bedömare".
- Bonus (utelämnad): en nyhetsrubrik nämner möjlig riksrätt mot försvarsminister Hegseth i lame duck — bekräfta innan den används.
