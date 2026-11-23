# SVERIGE • "Polisen och Palantir: 'Vi kan varken bekräfta eller förneka'"

**Tag:** `GRANSKNING • POLISEN` · **Längd:** ~80 s (≈170 ord) — se lång version nedan (kort version ~58 s finns kvar i historiken) · **Kedja:** `5 ÅR` → `ACUS` → `KUNGSHOLMEN` → `VEM GRANSKAR?` (sista låst)
**Hook (frame 0):** Dokumentkort med svaret + svart censurbalk över ordet `PALANTIR` · **Slutfråga:** `[ HEMLIGT ]` `[ OFFENTLIGT ]`
**Ton:** allt är **"enligt Dagens ETC"** — Polisen har varken bekräftat eller förnekat. Ingen slutsats om vad som är rätt.

## Hook-alternativ (olika mekanismer)
| Mekanism | Hook | Betyg | Kommentar |
|---|---|---|---|
| **Auktoritet + gap** | *"'Vi kan varken bekräfta eller förneka.' Polisens svar om Palantir."* | ★★★★★ | Ordagrant citat, öppnar frågan *vad döljs?*, funkar ljudlöst med censurbalken. **Rekommenderas.** |
| Specificitet | *"Fem år. Så länge har Polisen enligt Dagens ETC använt Palantir-teknik."* | ★★★★ | Bra A/B-variant. |
| Identitet/insats | *"Ditt BankID kan vara en datapunkt hos Polisen."* | ★★ | **Överlovar** (vi vet bara vad *systemet ska kunna*). Kasseras. |

## Manus (voiceover) — lång version, ~80 s (≈170 ord)
> "Vi kan varken bekräfta eller förneka." Så svarade Polisen om Palantir.
>
> Palantir är ett amerikanskt dataföretag, grundat 2003 för att bygga analysprogram åt underrättelsetjänsten i kampen mot terrorism. Programvaran, bland annat Gotham, binder ihop data från många system, så att en analytiker ser kopplingarna mellan människor, platser och händelser.
>
> Sedan dess har bolaget fått uppdrag över hela världen. Nato köpte 2025 deras system Maven. Brittiska sjukvården NHS har ett sjuårigt avtal värt upp till trehundratrettio miljoner pund. Och i Tyskland underkände författningsdomstolen 2023 lagen för polisens dataanalys i Hessen, där Palantirs program används.
>
> I Sverige uppger Dagens ETC att Polisen i minst fem år använt ett verktyg byggt på Palantirs teknik, kallat Acus, med bolagets utvecklare på plats i polishuset. Det ska kunna koppla ihop register med bland annat BankID och mobiloperatörer.
>
> Polisen hänvisar till fara för rikets säkerhet, och Justitieminister Strömmer säger att Polisen själv avgör vilka it-tjänster den använder. Kritiker varnar för att människor som inte är misstänkta kan kartläggas.
>
> Så frågan är: ska polisens verktyg få vara hemliga – eller har vi rätt att veta?

**Kedja:** `2003` → `NHS • NATO` → `ACUS` → `VEM GRANSKAR?` (sista låst) · **Delningsalternativ:** klipp efter "…där Palantirs program används." → *Del 1: Vad är Palantir?* (~45 s) och *Del 2: Polisen* (~40 s).

## Scener (lång version)
| Tid | Scen | Visuellt | Komponent | Källrad | Kedja | Ljud |
|---|---|---|---|---|---|---|
| 0–5 | **Hook** | Dokumentkort med svar från Polisen, censurbalk över `PALANTIR` dras undan, stämpel `FARA FÖR RIKETS SÄKERHET` | `ColdOpen` (UI-kort) | – | låsta `[?]×4` | `thud`, `stamp` |
| 5–20 | **Vad är Palantir?** | `2003 · USA` → kort `GOTHAM · försvar & underrättelse`, `FOUNDRY · organisationers data`; diagram: många system (`REGISTER`, `SENSORER`, `DOKUMENT`) → en vy med kopplingar | `FlowDiagram` | `KÄLLA: PALANTIRS ÅRSREDOVISNING (10-K)` | ruta 1 `2003` | `unlock`, `pop` ×2, `swish` |
| 20–38 | **Vad mer de gjort** | Tre kort: `NATO · MAVEN (2025)` · `NHS · 7 ÅR · UPP TILL £330 MILJ.` · `TYSKLAND · DOM 2023 · HESSEN`; sista kortet har röd stämpel `UNDERKÄNT AV DOMSTOL` | `ComparisonMatrix` | `KÄLLA: NATO NCIA • THE REGISTER • GFF` | ruta 2 `NHS • NATO` | `pop` ×3, `stamp` |
| 38–52 | **Sverige** | Flöde `REGISTER + BANKID + MOBILOPERATÖRER` → `ACUS` → `PROFIL`, allt `ENLIGT UPPGIFTER`; kort `POLISHUSET · KUNGSHOLMEN` | `FlowDiagram` | `KÄLLA: DAGENS ETC` | ruta 3 `ACUS` | `swish` ×3, `warn`, `unlock` |
| 52–70 | **Svaren** | Tre kolumner: `POLISEN` "varken bekräfta eller förneka" · `REGERINGEN` "Polisen avgör själv" · `KRITIKER` "icke misstänkta kan kartläggas" | `ComparisonMatrix` | `KÄLLA: RIKSDAGEN (FRÅGA 2025/26:167) • DAGENS ETC` | ruta 4 pulserar, låst | `pop` ×3, `lock`, `warn` |
| 70–80 | **Binär fråga** | `[ HEMLIGT ]` `[ OFFENTLIGT ]` + `SPARA` | `BinaryOutro` | `KÄLLA: DAGENS ETC` | – | `pop_hi` ×2 |

## Källor för Palantir-avsnittet
- [Palantir 10-K (SEC) – Gotham, Foundry, Apollo, AIP, uppstarten 2003](https://www.sec.gov/Archives/edgar/data/1321655/000132165525000022/pltr-20241231.htm) · [Wikipedia – Palantir](https://en.wikipedia.org/wiki/Palantir_Technologies)
- [The Register – NHS-avtalet (2023)](https://www.theregister.com/2023/06/20/palantir_nhs_england_deal/) · [Computer Weekly – Can anyone else do what it does?](https://www.computerweekly.com/news/366645878/Palantir-Can-anyone-else-do-what-it-does)
- [IAPP – tyska författningsdomstolen stoppar polisens programvara](https://iapp.org/news/b/german-constitutional-court-blocks-police-use-of-surveillance-software) · [Techdirt – domen och Palantir](https://www.techdirt.com/2023/02/28/german-court-places-limits-on-mass-surveillance-enabled-by-peter-thiels-palantir-software/)

## ⚠ Verifiera (Palantir-avsnittet)
- **NATO/Maven (mars 2025)** och **NHS (nov 2023, 7 år, upp till £330 milj.)**: siffror varierar mellan källor (en rapport nämner £480 milj.) → kolla NHS England/NATO NCIA.
- **Tyska domen (feb 2023)** gällde **lagarna** i Hessen och Hamburg, inte företaget. Manuset säger "lagen för polisens dataanalys i Hessen, där Palantirs program används" — bekräfta att Hessen använder Palantir (HessenData) hos GFF/domstolen.
- **Utelämnat medvetet** (inte bekräftat i oberoende källor eller ensidiga källor): ICE-kontraktet (belopp från en aktivistsajt), Israel, Ukraina, danska polisen/Europol, FT-uppgiften om NHS-åtkomst. Lägg till först efter egen verifiering.
- Beskriv **inte** Palantir som "spionbolag" eller använd ägarnas politik som argument — det är ETC:s ordval, inte ett belagt faktum för manuset.

## Publicering
- **Skärmtext frame 0:** `"VARKEN BEKRÄFTA ELLER FÖRNEKA"`
- **Beskrivning:** Polisens svar om Palantir: "varken bekräfta eller förneka". Enligt Dagens ETC. *(< 125 tecken)*
- **Hashtags:** #palantir #polisen #sverige #integritet #nyheter
- **Fastnålad kommentar:** "Ska polisens verktyg få vara hemliga? HEMLIGT eller OFFENTLIGT — ett ord räcker."
- **Svarsvideo-idé:** ta en kommentar som säger "men det är för brottsbekämpning" → svara med *vad* regeringen/Polisen faktiskt sagt.
- Ämnet **delar åsikter** (trygghet vs integritet) — det driver kommentarer utan att manuset tar ställning.

## Produktionsregler
- **Inga Palantir- eller polisloggor**, ingen polisbild/uniform — bara typografiska kort och censurbalkar.
- Syntetisk röst → slå på **AI-märkning**.
- Bra praxis: **kontakta Polisen och Palantir för kommentar** innan publicering (originalartiklarna anger att ingen ville kommentera).

## Källor
- [Dagens ETC – Polisens hemliga samarbete med Palantir](https://www.etc.se/story/dagens-etc-avsloejar-polisens-hemliga-samarbete-med-spionbolaget-palantir) · [Dagens ETC – "Svenska kodare bygger Palantirs hemliga system"](https://www.etc.se/story/svenska-kodare-bygger-palantirs-hemliga-system-paa-plats-i-polishuset) · [Realtid – Palantir jobbar från polishuset](https://www.realtid.se/it-tech/palantir-jobbar-fran-svenska-polishuset-i-hemlighet/)
- [Riksdagen – skriftlig fråga 2025/26:167 (Löberg) om polisens analys- och underrättelseverktyg](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/skriftlig-fraga/polisens-anvandning-av-analys-och_hd11167/) · [Omni – Strömmer: "Polisen avgör själv"](https://omniekonomi.se/strommer-om-kontroversiella-palantir-polisen-avgor-sjalv/a/0pj4oJ) · [Dagens ETC – Strömmer krävs på svar](https://www.etc.se/inrikes/efter-dagens-etc-s-palantir-granskning-stroemmer-kraevs-paa-svar) · [Dagens ETC – V kräver svar, vill kalla rikspolischefen](https://www.etc.se/inrikes/v-kraever-svar-om-palantir-vill-kalla-rikspolischefen-till-utskottet)
- [TV4 – Polisens användning av Palantir ifrågasätts](https://www.tv4.se/artikel/6W2BaTandDPNm4mp4UU91V/polisens-anvaendning-av-palantir-ifragasaetts-riskerna-aer-enorma) · [Dagens ETC – experten: "miljontals oskyldiga svenskar kan övervakas"](https://www.etc.se/inrikes/experten-om-palantirskandalen-miljontals-oskyldiga-svenskar-kan-oevervakas)

## ⚠ Verifiera innan publicering (viktigt — känsligt ämne)
- **Allt bygger på Dagens ETC:s granskning (nov 2025)**; Acus, "svensk Gotham", utvecklare på plats, BankID/operatörsdata och att insynsrådet inte visste är *deras* uppgifter. Polisen har enligt sökningarna **inte bekräftat eller förnekat**. Manuset använder därför "enligt", "uppger", "ska kunna".
- **Aktualitet:** avslöjandet är ca ett år gammalt. Jag hittade **ingen ny avslöjande detalj under 2026** — kolla ETC, TT och riksdagen efter uppdateringar. Saknas ny vinkel: rama som **"ett år senare — vad vet vi, vad vet vi inte?"** (kräver att du bekräftar att inga svar kommit).
- **Riksdagsspåret:** V:s kallelse av rikspolischefen och ett utskottsmöte 24 april 2026 nämns bara i en partipolitisk källa (Clarté) — **bekräfta på riksdagen.se** innan det används. Utelämnat i manuset.
- **Citatet från Strömmer** är hämtat ur svaret på skriftlig fråga 2025/26:167 (omskrivet, inte ordagrant).
- **Utelämnat (osäkert/ensidigt):** påståendet att Försvarsmakten har ett affärsförhållande med Palantir (partipolitisk källa) och uppgifter om Palantirs ägare/ideologi — bidrar inte och ökar juridisk risk.
- "Kritiker varnar för att icke misstänkta kan kartläggas" — kommer från bl.a. Föreningen för digitala fri- och rättigheter (Peter Michanek) i ETC; behåll attribueringen i bild.
