# PALANTIR • DEL 2/2 — "Palantir i Sverige: polisen och försvaret"

**Tag:** `PALANTIR • DEL 2/2` · **Längd:** ~80 s (≈167 ord) · **Kedja:** `5 ÅR` → `ACUS` → `FÖRSVARET` → `VEM GRANSKAR?` (sista låst)
**Hook (frame 0):** dokumentkort med censurbalk över `PALANTIR` · **Slutfråga:** `[ HEMLIGT ]` `[ OFFENTLIGT ]`
**Loop mot del 1:** del 1 slutar "Och i Sverige?" → del 2 börjar med Polisens svar.
**Option:** går att dela i Del 2 *Polisen* (~50 s) och Del 3 *Försvaret* (~35 s) om du vill ha kortare klipp.

## Manus (voiceover)
> "Vi kan varken bekräfta eller förneka." Så svarade Polisen när Dagens ETC frågade om Palantir.
>
> Palantir är ett amerikanskt företag som bygger program som lägger ihop data från många register, så att man ser vem som hänger ihop med vem.
>
> Enligt Dagens ETC har svensk polis i minst fem år använt en svensk version av Palantirs system Gotham, kallad Acus. Minst sex av bolagets utvecklare ska arbeta i polishuset på Kungsholmen, upp till fyra dagar i veckan.
>
> Systemet ska kunna koppla ihop polisens register med bland annat BankID och mobiloperatörer.
>
> Palantirs Sverigechef har bekräftat att bolaget arbetat med Försvarsmakten i flera år. Och enligt Dagens ETC skrev Sverige i september 2025 på ett avtal om Maven – systemet som användes i kriget mot Iran. Försvarsministern ville inte kommentera.
>
> Polisen hänvisar till rikets säkerhet. Justitieminister Strömmer säger att Polisen själv avgör vilka it-tjänster den använder. Kritiker varnar för att människor som inte är misstänkta kan kartläggas.
>
> Så frågan är: ska våra myndigheters verktyg få vara hemliga – eller har vi rätt att veta?

## Scener
| Tid | Visuellt (ljudlöst läsbart) | Komponent | Källrad | Kedja | Ljud |
|---|---|---|---|---|---|
| 0–5 | Svarskortet, censurbalken över `PALANTIR` dras undan, stämpel `FARA FÖR RIKETS SÄKERHET` | `ColdOpen` (UI-kort) | – | låsta `[?]×4` | `thud`, `stamp` |
| 5–14 | **Snabb förklaring:** spridda rutor (`REGISTER`, `TELEFONER`, `DOKUMENT`) dras ihop till en vy: `PERSON ↔ PLATS ↔ TID`; text `PALANTIR · USA · 2003` | `FlowDiagram` | `KÄLLA: PALANTIR (ÅRSREDOVISNING)` | – | `swish` ×3 |
| 14–32 | **Polisen:** tidslinje `NOV 2025 · DAGENS ETC GRANSKAR` → `MINST 5 ÅR`; kort `POLISHUSET · KUNGSHOLMEN · ≥6 UTVECKLARE · UPP TILL 4 DAGAR/VECKA`; flöde `POLISREGISTER + BANKID + MOBILOPERATÖRER` → `ACUS` → `PROFIL` (streckat, `ENLIGT UPPGIFTER`) | `FlowDiagram` + kort | `KÄLLA: DAGENS ETC • REALTID` | ruta 1 `5 ÅR`, ruta 2 `ACUS` | `unlock` ×2, `pop`, `warn` |
| 32–50 | **Försvaret:** tidslinje `FLERA ÅR · BEKRÄFTAT AV PALANTIR` → `SEP 2025 · AVTAL OM MAVEN (ENLIGT ETC)`; chips `FÖRSVARSMINISTERN: INGEN KOMMENTAR` · `FÖRSVARSMAKTEN: "OPERATIV SEKRETESS"` med röd stämpel `OBEKRÄFTAT AV MYNDIGHET` | `FlowDiagram` + `DocumentChecklist` | `KÄLLA: DAGENS ETC • DAGENS INDUSTRI` | ruta 3 `FÖRSVARET` | `pop` ×3, `stamp`, `lock` |
| 50–68 | **Svaren:** `POLISEN` "rikets säkerhet" · `REGERINGEN` "Polisen avgör själv" · `KRITIKER` "icke misstänkta kan kartläggas"; liten rad `PALANTIR SVERIGE AB · KUNGSGATAN 10 · 7 → 24 ANSTÄLLDA (2015 → 2024)` | `ComparisonMatrix` | `KÄLLA: RIKSDAGEN (FRÅGA 2025/26:167) • REALTID` | ruta 4 pulserar, låst | `pop` ×3, `warn` |
| 68–80 | `[ HEMLIGT ]` `[ OFFENTLIGT ]` + `SPARA` | `BinaryOutro` | `KÄLLA: DAGENS ETC` | – | `pop_hi` ×2, `tick` |

## Publicering
- **Skärmtext frame 0:** `"VARKEN BEKRÄFTA ELLER FÖRNEKA"` · **Beskrivning:** Polisen och Försvaret: vad vet vi om Palantir i Sverige? Enligt Dagens ETC. Del 2/2. · **Hashtags:** #palantir #polisen #försvarsmakten #integritet #nyheter
- **Fastnålad:** "Ska våra myndigheters verktyg få vara hemliga? HEMLIGT eller OFFENTLIGT — ett ord räcker."
- Inga loggor, ingen uniformsbild. AI-märkning om rösten är syntetisk. Be Polisen, Försvarsmakten och Palantir om kommentar före publicering.

## Källor
- [Dagens ETC – Polisens hemliga samarbete](https://www.etc.se/story/dagens-etc-avsloejar-polisens-hemliga-samarbete-med-spionbolaget-palantir) · [Dagens ETC – kodare på plats i polishuset](https://www.etc.se/story/svenska-kodare-bygger-palantirs-hemliga-system-paa-plats-i-polishuset) · [Realtid – Palantir jobbar från polishuset](https://www.realtid.se/it-tech/palantir-jobbar-fran-svenska-polishuset-i-hemlighet/)
- [Dagens ETC – "Här flyr ÖB frågor om avtalet med Palantir"](https://www.etc.se/inrikes/haer-flyr-oeb-fraagor-om-avtalet-med-palantir) · [Processnet – Hemliga Palantir-affären](https://www.processnet.se/article/view/1235634/hemliga_palantiraffaren_det_galler_for_kansliga_personuppgifter)
- [Riksdagen – skriftlig fråga 2025/26:167](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/skriftlig-fraga/polisens-anvandning-av-analys-och_hd11167/) · [Omni – Strömmer: "Polisen avgör själv"](https://omniekonomi.se/strommer-om-kontroversiella-palantir-polisen-avgor-sjalv/a/0pj4oJ)

## ⚠ Verifiera
- **Polisdelen** bygger på **anonyma källor hos Dagens ETC** (Acus = "svensk Gotham", ≥6 utvecklare, 4 dagar/vecka, BankID/operatörsdata). Polisen har inte bekräftat eller förnekat.
- **Försvarsmakten:** att Palantirs Sverigechef (Anders Fridén) bekräftat flera års samarbete står i en sammanfattning av DI — hitta originalcitatet. **Maven-avtalet i sept 2025** är ETC:s uppgift ur läckta Signal-chattar; ÖB, försvarsministern (Pål Jonson) och Försvarsmakten har inte kommenterat/bekräftat. "Systemet som användes i kriget mot Iran" = samma *produkt* (Maven Smart System); hur det är konfigurerat i Sverige är okänt.
- **Palantir Sverige AB** (7 → 24 anställda): från Realtid — kolla bolagsregistret.
- **Utelämnat medvetet:** AP-fondernas Palantir-innehav (SVT/Affärsvärlden: miljardbelopp; tidpunkterna oklara — AP7 4,8 mdr kr nämns), partiernas positioner (en partisk källa), kopplingen Försvarsmakten ↔ Minab-attacken (partiska källor), Palantir-VD:ns tomt i Härjedalen. Lägg bara till efter egen verifiering.
