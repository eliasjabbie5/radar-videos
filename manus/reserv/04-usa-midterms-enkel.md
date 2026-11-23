# INTERNATIONELLT • "Trump förlorade kongressen — vad kan han göra nu?"

**Tag:** `USA • MELLANÅRSVALET` · **Längd:** ~62 s (≈120 ord, ~2,1 ord/s) · **Kedja:** `HUSET` → `SENATEN` → `VETO` → `STILLESTÅND?`
**Slutfråga:** `[ REGERA ÄNDÅ ]` `[ STILLESTÅND ]` · **Teaser:** `NÄSTA: DE FEM MAKTSKIFTEN I JANUARI →` (förslag)

## Manus (voiceover)
> Tvåhundrafemtioåtta. Så många av representanthusets fyrahundratrettiofem platser har demokraterna efter mellanårsvalet den tredje november – flest sedan 1992.
>
> I senaten får de, tillsammans med två oberoende, femtiosex av hundra platser. Nio platser bytte sida.
>
> Det blir delad makt: en republikansk president och en demokratisk kongress. Donald Trump har sagt att han tänker blockera demokraternas lagförslag.
>
> Hans vapen är vetot. Men för att köra över ett veto krävs två tredjedelar – ungefär tvåhundranittio röster i huset och sextiosju i senaten. Demokraterna saknar trettiotvå i huset och elva i senaten.
>
> Däremot styr de nu senatens godkännande av Trumps utnämningar.
>
> Så frågan är: kan Trump regera ändå – eller blir de två sista åren ett stillestånd?

## Scener
| Tid | Scen | Visuellt | Komponent | Källrad | Kedja |
|---|---|---|---|---|---|
| 0–6 | Cold open | Räknare 0 → **258** + rutnät om 435 punkter (blå tänds, grå resten) | `ColdOpen` (räknare) + `DotGrid` | – | dold |
| 6–18 | Huset & senaten | Två punktnät: **Huset 258/435**, **Senaten 56/100** (9 punkter byter färg grå→blå) | `DotGrid` ×2 | `KÄLLA: NPR • YAHOO NEWS` | ruta 1 `HUSET`, ruta 2 `SENATEN` |
| 18–30 | Delad makt | Matris: `PRESIDENT: REPUBLIKAN` ↔ `KONGRESS: DEMOKRATER`, röd stämpel `VETO` | `ComparisonMatrix` | `KÄLLA: AP • NPR` | ruta 3 `VETO` |
| 30–46 | Vetots matte | Samma punktnät med **tröskellinje** (som 175-linjen i del 1): huset 290 → `SAKNAS 32`, senaten 67 → `SAKNAS 11`, linjen blir röd | `DotGrid` + tröskel | `USA:S KONSTITUTION ART. I §7` | – |
| 46–54 | Utnämningar | Checklista: ☑ Senaten godkänner utnämningar ☐ Lagar utan veto | `DocumentChecklist` | `KÄLLA: NPR` | ruta 4 `STILLESTÅND?` pulserar |
| 54–62 | Slutfråga | Två pills + teaser | `BinaryOutro` | `KÄLLA: AP • YAHOO NEWS` | – |

## Ljudspår
`count` (258 räknas) → `thud` vid sista siffran · `pop` per punktnät · `tick`-rullning när nio senatsplatser byter färg (`fill_blue`) · `stamp` på `VETO` · `swish` när tröskellinjen ritas · `err` + `stamp` när `SAKNAS 32` visas · `unlock`* vid varje kedjeruta · `chime`/`err` på checklistan · `pop_hi` ×2 på slutknapparna.
*ny effekt (se serie-bibeln).

## Källor
- [NPR – Democrats win full control of Congress](https://www.kut.org/politics/2026-11-03/democrats-win-full-control-of-congress-ushering-in-a-new-era-of-divided-government) · [Yahoo News – final Senate result, 56 seats](https://www.yahoo.com/news/politics/article/final-2026-midterm-election-results-democrats-clinch-56-seat-senate-majority-with-peltolas-alaska-win-what-they-can--and-cant--do-next-184618858.html) · [Yahoo News – 258 House seats](https://www.yahoo.com/news/politics/article/lots-of-2026-midterm-races-still-havent-been-called-heres-where-things-stand-205425643.html)
- [Live-tracker (257 D / 173 R, 430 av 435 avgjorda)](https://www.poliwave.com/us/live/midterms-2026) · [CNBC live updates](https://www.cnbc.com/2026/11/03/midterm-elections-2026-live-updates.html)

## ⚠ Verifiera
- **Siffrorna rör sig**: 257 vs 258 i huset (5 platser var oavgjorda i trackern), och senaten är "54 D + 2 oberoende" = 56. Kolla dagen du renderar (Mississippi bekräftades inte i sökningen).
- "Flest sedan 1992" och "nio platser bytte sida" kommer från Yahoo News — hitta AP-bekräftelse.
- Vetoregeln: två tredjedelar av närvarande i varje kammare — 290/67 gäller full närvaro.
- Neutral ton: manuset säger vad som hänt och vad Trump *sagt*, inte vad som kommer hända.
