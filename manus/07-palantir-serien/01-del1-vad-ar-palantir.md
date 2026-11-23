# PALANTIR • DEL 1/2 — "Vad är Palantir?"

**Tag:** `PALANTIR • DEL 1/2` · **Längd:** ~66 s (≈145 ord) · **Kedja:** `2003` → `ICE • NATO` → `IRAN • GAZA` → `SVERIGE?` (sista låst → del 2)
**Hook (frame 0):** fem etikettkort snurrar in: `ICE` `NATO` `ISRAEL` `…SVERIGE?` · **Slutkort:** `DEL 2 • I MORGON 18:00`

## Manus (voiceover)
> ICE, Nato, Israels försvar – och enligt Dagens ETC svenska polisen. Ett företag: Palantir.
>
> Palantir grundades 2003 för att hjälpa USA:s underrättelsetjänst mot terrorism. Enkelt förklarat bygger de program som lägger ihop data från massor av register på ett ställe – så att man ser vem som hänger ihop med vem, var och när.
>
> I USA byggde de systemet ImmigrationOS åt migrationsmyndigheten ICE, för omkring trettio miljoner dollar. Och Nato köpte 2025 deras system Maven.
>
> Maven användes i USA:s krig mot Iran: enligt Pentagon valdes tretton tusen mål ut på trettioåtta dagar. Om det användes mot Irans ledare Khamenei är obekräftat – Palantirs vd avböjde att kommentera.
>
> I Gaza har Palantir ett partnerskap med Israels försvar för "krigsrelaterade uppdrag". Kritiker säger att tekniken använts mot mål där. Palantir förnekar det.
>
> Och i Sverige? Del två.

## Scener
| Tid | Visuellt | Komponent | Källrad | Kedja | Ljud |
|---|---|---|---|---|---|
| 0–4 | Fyra kort `ICE` `NATO` `ISRAEL` `SVERIGE?` stämplas in ett i taget, det sista i grått | `ColdOpen` (kort) | – | låsta `[?]×4` | `pop` ×3, `warn` |
| 4–18 | **Enkel förklaring:** många spridda rutor (`REGISTER`, `KAMEROR`, `TELEFONER`, `DOKUMENT`) dras ihop till en vy med linjer mellan `PERSON` ↔ `PLATS` ↔ `TID`; text `GRUNDAT 2003 • USA` | `FlowDiagram` | `KÄLLA: PALANTIR (ÅRSREDOVISNING)` | ruta 1 `2003` | `swish` ×3, `unlock` |
| 18–30 | Två kort: `ICE · IMMIGRATIONOS · ~$30 MILJ. (APR 2025)` · `NATO · MAVEN (MARS 2025)`; chip `UTAN KONKURRENS` på ICE-kortet | `ComparisonMatrix` | `KÄLLA: THE REGISTER • TECHRADAR • NATO NCIA` | ruta 2 `ICE • NATO` | `pop` ×2, `stamp` |
| 30–46 | **Iran:** räknare `13 000 MÅL · 38 DAGAR` (enligt Pentagon); två rader: ☑ `MAVEN ANVÄNDES I ATTACKERNA` · ❓ `MOT KHAMENEI?` med stämpel `OBEKRÄFTAT` | `StepCounter` + `DocumentChecklist` | `KÄLLA: THE REGISTER • BREAKING DEFENSE • CNBC` | ruta 3 `IRAN • GAZA` | `count`, `stamp`, `warn` |
| 46–58 | **Gaza:** två kolumner: `BEKRÄFTAT: PARTNERSKAP JAN 2024` ↔ `PÅSTÅS: MÅLVAL` med röd text `PALANTIR FÖRNEKAR` | `ComparisonMatrix` | `KÄLLA: PALANTIR • FN-RAPPORTÖR • BUSINESS & HUMAN RIGHTS CENTRE` | – | `pop` ×2, `err` |
| 58–66 | **Cliffhanger:** sista kedjerutan `SVERIGE?` pulserar, förblir låst; kort `DEL 2 • I MORGON 18:00` | `MysteryChain` + `EpisodeCard` | `KÄLLA: DAGENS ETC` | ruta 4 låst | `lock`, `warn` |

## Engagemang
- Ingen binär fråga — **cliffhangern är kroken** till del 2. Fastnålad: *"Vilket av länderna/uppdragen visste du inte om? Del 2 handlar om Sverige."*
- `OBEKRÄFTAT` och `PALANTIR FÖRNEKAR` ska stå **i bild**, inte bara i rösten.

## Källor
- [Palantir 10-K (SEC)](https://www.sec.gov/Archives/edgar/data/1321655/000132165525000022/pltr-20241231.htm) · [Wikipedia – Palantir](https://en.wikipedia.org/wiki/Palantir_Technologies)
- **ICE:** [The Register (21 apr 2025)](https://www.theregister.com/2025/04/21/ice_enlists_palantir_to_develop/) · [TechRadar](https://www.techradar.com/pro/security/palantir-to-develop-immigrationos-for-ice-to-speed-up-deportations) · [Business Insider via Yahoo](https://www.yahoo.com/news/ice-just-ordered-30-million-212445164.html) · [Rep. Menendez brev (feb 2026)](https://menendez.house.gov/imo/media/doc/palantir_letter.pdf)
- **Maven/Iran:** [The Register – Maven och Iran (mars 2026)](https://www.theregister.com/2026/03/13/palantirs_maven_smart_system_iran/) · [Breaking Defense (maj 2026)](https://breakingdefense.com/2026/05/insatiable-appetite-for-ai-maven-usage-surged-for-strikes-on-iran-pentagon-ai-chief-says/) · [CNBC – Karp om Mellanöstern](https://www.cnbc.com/2026/03/12/palantir-tech-gives-west-critical-edge-in-middle-east-ceo-alex-karp.html) · [Wikipedia – Khameneis död](https://en.wikipedia.org/wiki/Assassination_of_Ali_Khamenei)
- **Gaza:** [Anadolu – rapporter om Palantir-teknik](https://www.aa.com.tr/en/middle-east/palantir-ai-technologies-used-in-israeli-attacks-say-reports/3933223) · [Business & Human Rights Centre – Palantirs svar](https://www.business-humanrights.org/en/latest-news/palantir-response-to-the-allegations-over-its-complicity-in-war-crimes-amid-israels-war-in-gaza/)

## ⚠ Verifiera
- **ICE:** nu belagt av flera medier (Wired, 404 Media, Business Insider, The Register, TechRadar). Belopp varierar ($29,8–30 mn) → manuset säger "omkring". ICE kallade det en **ändring av ett befintligt kontrakt**; ICE motiverade avtalet som enda leverantör ("utan konkurrens"). Kontrollera mot USAspending/SAM.gov.
- **Khamenei:** att han dödades i USA–Israels öppningsattack **28 feb 2026** är väl belagt. Att *Palantir/Maven* användes **mot honom** är **inte bekräftat** — påståendena kommer från krypto- och bloggsajter; CNBC rapporterar att Karp **avböjde att kommentera**. Manuset säger därför "obekräftat". Skriv inte "Palantir dödade Khamenei".
- **Gaza:** *partnerskapet* (jan 2024, "krigsrelaterade uppdrag") är Palantirs eget uttalande = bekräftat. Att tekniken används i **målval** (t.ex. via Lavender) är **påstående** från kritiker/FN-rapportör Albanese; Palantir kallar det osant och nekar koppling till Lavender.
- **Mål-siffran** (13 000 på 38 dagar) kommer från Pentagons AI-chef (CDAO) — "enligt Pentagon".
- **Valfritt men starkt belagt (utelämnat för längd):** en Pentagonutredning ska enligt rapporter ha funnit att övertro på ett Palantir-byggt system bidrog till en attack mot en skola i Minab där 123 barn dog; Palantir bestrider, utredningen pågår ([Gizmodo](https://gizmodo.com/pentagon-investigators-say-overreliance-on-palantir-ai-tech-contributed-to-u-s-strike-that-killed-123-iranian-children-2000814477)). Känsligt — lägg bara till om du vill, med fullt attribuerad formulering.
- Utelämnat: NHS-avtalet och tyska domen (ryms inte; kan bytas in i stället för ICE-raden).
