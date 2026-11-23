# GUIDE FÖR MANUSSKRIVANDE AI — "Förklaringsvideor i serie" (9:16, svenska)

> Läs hela filen innan du skriver. Du skriver **manus + scenspecifikation**; en annan person/AI bygger och renderar videon. Allt du levererar måste kunna byggas **utan frågor**. Håll dig inom de byggstenar som finns (avsnitt 5) — hitta inte på egna visuella lösningar.

---
## 1. Vad är produkten?
Korta nyhets-/förklaringsvideor (55–80 s) för TikTok/Reels/Shorts på **svenska**, i stil med den franska kanalen @bonnequestion.tv men **seriösa, redaktionella och utan tecknade figurer**: vit bakgrund, glaskort, diagram, räknare, checklistor, censurbalkar, stämplar. **Ingen musik, inga foton, inget videomaterial, inga loggor.** Röst (AI-genererad TTS) + korta ljudeffekter + undertexter.

Varje video:
1. börjar **direkt i en kraftfull bild/siffra** (cold open) — ingen titelskylt, ingen "hej och välkommen",
2. har en **"Mystery Chain"** i toppen: fyra rutor `🔒 ? → 🔒 ? → 🔒 ? → 🔒 ?` som låses upp en i taget när rösten når varje steg (sista kan stanna låst som cliffhanger),
3. byter bild var 3–4 sekund (nytt kort/diagram/räknare + ljudeffekt),
4. har en **liten källrad** (mono, nederst) som byter per scen,
5. slutar med en **binär fråga** (två knappar) eller en **cliffhanger mot nästa del**.

Serier: ett ämne kan delas i delar (t.ex. *Bakgrund / Nu / Framtiden* eller *Vad är X? / X i Sverige*). Varje del ska fungera **fristående** men sluta så att nästa del känns nödvändig.

---
## 2. Hur tillverkningen går till (så du förstår varför reglerna finns)
```
DU: manus + scenspecifikation (denna guide)
  ↓
MÄNNISKA: genererar rösten (TTS) av voiceover-texten — EN ljudfil per video
  ↓
SYSTEM: taligenkänning tidssätter varje ord (ordtider) → varje animation kopplas till ett ORD du pekat ut
  ↓
RENDER: Remotion bygger videon (≈5 min), ljudeffekter läggs automatiskt, ljudet mastras till −14 LUFS
```
**Viktigt:** Voiceover-texten du skriver är *exakt* det som läses upp. Ändras texten efter inspelning måste allt tidssättas om. Ändra därför inte ord efter att rösten är genererad.

---
## 3. Röst & språk
- **Svenska**, neutral nyhetston, aktiva meningar, korta (≤ 18 ord/mening). Skriv för örat.
- **Tempo ≈ 2,1 ord/s** (en tydlig, lugn röst). **Mål: 110–170 ord ⇒ 55–80 s.** Bäst räckvidd ≤ 60 s; gå över bara om ämnet kräver det (annars dela i delar).
- **Siffror för röst:** skriv stora tal som ord (*"trettio miljoner dollar"*, *"tretton tusen mål"*, *"trettioåtta dagar"*, *"tvåhundrafemtioåtta platser"*). **Årtal skrivs som siffror** (2003, 2025) — rösten har läst dem rätt. Förkortningar som ska läsas som ord eller bokstäver: skriv så de uttalas (*"Nato"*, *"ICE"*, *"BankID"*, *"Acus"*).
- **Namn**: skriv enligt vanlig stavning; undvik krångliga främmande namn om det finns ett enklare ord. TTS kan fumla — välj hellre "Palantirs vd" än ett svårt namn.
- Inga emojis, parenteser eller förkortningar i voiceover-texten. Tankstreck `–` får användas för paus.
- **Första meningen = hook** (se avsnitt 4). **Sista meningen = fråga** (binär) eller **cliffhanger** ("Och i Sverige? Del två.").

---
## 4. Retention, hook och engagemang (det som får videon att nå ut)
### 4.1 Hook (0–3 s) — fungerar även utan ljud
Skriv **3 hook-varianter med olika mekanismer** och rekommendera en. Mekanismer: *specificitet* (konkret tal), *överraskning/kontrast*, *auktoritet* (ordagrant citat), *stakes* ("Nitton dagar till nedstängning"), *fråga/dissonans*. Betygsätt dem mot: öppnar den ett **gap** tittaren vill stänga? Är den **specifik**? Är den **sann** och betalas av i videon? Kasta hooks som överlovar.
Exempel som fungerat: *"Fem platser. Så knapp var Republikanernas marginal."* · *"'Vi kan varken bekräfta eller förneka.' Polisens svar om Palantir."* · *"ICE, Nato, Israels försvar – och enligt Dagens ETC svenska polisen. Ett företag: Palantir."*

### 4.2 Retention-karta (följ den)
```
0–4 s    HOOK       stor siffra / citat / fyra kort — direkt visuell chock
4–15 s   KONTEXT    en mening per bild; kedjerutan 1 låses upp
15–50 s  BEATS      2–4 nya visuella kort, ett var ~4–8 s; kedjerutor 2–3
~70 %    VÄNDNING   "men…" — stämpel, tröskellinje, förnekande, motsats
sista 10 s  BINÄR FRÅGA eller CLIFFHANGER (+ ev. "SPARA")
```
- Aldrig > 4 s utan en ny visuell händelse.
- Svaret på hookens gap kommer **sent** men säkert.
- **Loop:** sluta så att första meningen i videon (eller nästa del) naturligt följer.

### 4.3 Engagemang
- **Binär slutfråga** som delar åsikter men går att svara på med **ett ord** (t.ex. `HEMLIGT / OFFENTLIGT`, `STRAFF / VANLIGT MÖNSTER`, `DEAL / STILLESTÅND`). Frågan får inte kräva att tittaren tar ställning till fakta — bara till värdering.
- Skriv en **fastnålad kommentar** med samma fråga + ett löfte ("Vi kollar facit i januari").
- Lägg `SPARA` i sista bilden när det finns något skärmdumpsbart (räkneexempel, checklista).
- Serie-cliffhanger **utan klockslag** ("DEL 2 • NÄSTA VIDEO") — delarna kan läggas upp samma dag.

### 4.4 Publiceringstext (leverera för varje video)
Skärmtext frame 0 (≤ 6 ord) · beskrivning (< 125 tecken) · 3–5 hashtags · fastnålad kommentar · rekommenderad hook + alternativ.

---
## 5. Byggstenarna du får använda (scenspecifikation)
Varje scen har: **`id`**, **voiceover-text för scenen**, **`source`** (källrad, ≤ 55 tecken, versaler, t.ex. `KÄLLA: DAGENS ETC • REALTID`), **`chrome`** (visa kedja+källa: `true`; på cold open `false`), och **en `type`**. Scener staplar widgetar vertikalt. **Plats:** med kedjan i toppen finns ≈ **1 100 px** höjd; max **2–3 widgetar** per scen.

### 5.1 Scentyper
| `type` | Användning | Fält |
|---|---|---|
| `hookTiles` | Cold open: 2–4 stora ordkort som stämplas in, sista kan vara **låst** ("SVERIGE?"), därefter en stor rubrik | `tiles[{label (≤ 9 tecken), sub (≤ 32), trigger, locked?}]`, `headline{text, trigger}` |
| `redacted` | Cold open: dokumentkort där ett ord är **censurerat** och avslöjas när det sägs, + stämpel | `kicker`, `before` (citattext), `secret` (≤ 9 tecken), `meta[3 rader]`, `revealTrigger`, `stamp{text, trigger}` |
| `stack` | Vanlig scen: lista av widgetar | `widgets[...]` (5.2) |
| `binary` | Slutfråga med två knappar (+ ev. SPARA) | `question` (≤ 34 tecken), `options[2]` (≤ 12 tecken), triggers: fråga, knappar, växling |
| `cliff` | Cliffhanger: hela kedjan stor, sista låst + nästa-del-kort | `card{title, sub}` |

### 5.2 Widgetar (i `stack`)
| `t` | Visar | Fält (och rimliga längder) | Höjd |
|---|---|---|---|
| `bigtext` | Stor siffra/ord + undertext | `text` (≤ 14), `sub` (≤ 60, mono), `trigger` | ~170–220 |
| `fusion` | **Dataflöde**: flera källor → nav → resultat (använd för "så fungerar X"/"kopplar ihop") | `inputs[2–4]` (≤ 14 tecken vardera), `hub` (≤ 9), `outputs[1–3]` (≤ 10, `dashed:true` = osäkert/påstått), `footnote` (≤ 40) | 600–640 |
| `cards` | Stora faktakort med **rubrik + räknande värde + tagg + stämpel** | `kicker` (≤ 40 mono), `title` (≤ 14), `value{prefix,to\|text,suffix}`, `tag` (≤ 50), `stamp` (≤ 18) | 300–360/kort (max 2) |
| `counter` | Jättestor **räknare** (+ valfri dagsruta, t.ex. 38 dagar) | `label` (≤ 8), `to`, `grid{n,label}` | ~400 |
| `checklist` | Rader med ✓ / ? / ✕ (+ stämpel) | rad: `text` (≤ 38), `sub` (≤ 36 mono), `state: yes\|unknown\|no`, `stamp` (≤ 18) | 112/rad |
| `versus` | Två kolumner **Bekräftat ↔ Påstås** / A ↔ B (+ stämpel) | `left/right{title, tone, rows[2–3] (≤ 34 tecken)}`, `stamp` | 330–560 |
| `timeline` | Tidslinje med 2–3 noder, chips och valfri stämpel | `nodes[{label ≤ 14, sub ≤ 40}]`, `chips[≤ 38]`, `stamp` | 210–330 |
| `staff` | Personikoner (n st) + arbetsvecka (X av 5 dagar) | `title`, `people{n,label}`, `week{filled,label}` | ~330 |
| `bars` | Punktrader som växer (t.ex. 7 → 24 anställda) | `title`, `rows[{label,n}]` | ~190 |
| `columns3` | Tre kolumner med citat (Aktör A / B / C) | `cols[{title ≤ 12, text ≤ 40, tone}]` | ~330 |

`tone` = `ink | red | green | blue | muted`. **Röd = varning/stämpel/förnekande, grön = bekräftat/ja, blå = neutral data/hypotes.**

### 5.3 Det som INTE finns (föreslå inte det som byggt)
Kartor, foton, grafer med axlar, videoklipp, logotyper, animerade personer. Behöver du något sådant — skriv under rubriken **"Önskemål (ej byggt)"** och ge en fungerande lösning med ovan widgetar ändå.

### 5.4 Triggers (hur bilden synkas till rösten)
Varje element i en scen **tänds när ett visst ord sägs**. Du pekar ut ordet:
- `trigger: "ImmigrationOS"` = tänds när ordet börjar sägas (≈ 0,1 s före).
- `trigger: "dollar (slut)"` = på ordets **slut** (använd för stämplar/avslöjanden).
- Förekommer ordet flera gånger i scenen: `trigger: "ICE (2:a)"`.
- Räknare/stolpar som ska **fyllas under en fras**: ange start- och slutord: `trigger: "tretton → dagar (slut)"`.
- **Mönster som fungerat:** kort in på sitt namn; siffra räknar upp medan den sägs; stämpel på ordets **slut** ("obekräftat", "förnekar"); kedjeruta låses upp på nyckelordet.
- Allt som sägs behöver inte visas, men **allt viktigt som visas bör sägas** (undvik att bilden avslöjar något rösten inte täcker, utom små extradetaljer).

### 5.5 Kedjan (Mystery Chain)
`chain`: 4 etiketter (versaler, **≤ 11 tecken** för att få plats, t.ex. `2003`, `ICE • NATO`, `FÖRSVARET`, `VEM GRANSKAR?`) och `chain_unlock`: vilket ord som låser upp respektive ruta (`null` = förblir låst). **Ruta 4 ska normalt förbli låst** (cliffhangern) eller låsas upp först i sista beaten.

### 5.6 Ljud
Ljudeffekter läggs **automatiskt** från samma triggers (pop, tick, svep, stämpel, klockton, lås m.m.). Du skriver **inga** ljud, men en kort **"Ljudspår"-rad** per scen är välkommen om du vill föreslå var tyngden ska ligga (t.ex. "tung stämpel på 'förnekar'"). Ingen musik.

---
## 6. Redaktionella regler (viktigt — nyheter, juridik, förtroende)
1. **Sanning före klick.** Varje påstående ska ha källa. Inga hooks som kräver att videon "betalar av" något den inte kan bevisa.
2. **Attribuera osäkert.** Använd *"enligt X"*, *"uppger"*, *"ska kunna"*, *"påstås"*. Skilj tydligt på **bekräftat / påstått / obekräftat** — och visa det i bild (`OBEKRÄFTAT`, `PALANTIR FÖRNEKAR`, `ENLIGT DAGENS ETC`).
3. **Neutralitet.** Berätta vad som hänt och **vem som sa vad**; ta inte ställning i sakfrågan. Slutfrågan är en **värdering**, inte ett faktapåstående. Båda sidor ska finnas med i känsliga ämnen.
4. **Känsligt (rättsfall, personer, krig, övervakning):** ingen slutsats om skuld; inget "X dödade Y" om det inte är bevisat; ta med bolagets/myndighetens svar; lista vad som **utelämnats** och varför.
5. **Siffror:** ange alltid vem siffran kommer från ("enligt Pentagon", "enligt bolaget"). Räkneexempel märks **EXEMPEL**. Siffror som rör sig (valresultat, kontrakt) → flagga i "Verifiera".
6. **Källor:** föredra primärkällor (myndighet, bolagets egna rapporter, domstol, riksdagen) och stora redaktioner. Partipolitiska/aktivistiska/krypto-/bloggsajter räknas **inte** som ensam källa — markera dem som svaga.
7. **Inga loggor, inga riktiga personers bilder, inga citat som låter som att någon sagt något de inte sagt.** Citat ska vara ordagranna eller tydligt omskrivna ("säger att …").
8. **AI-märkning:** videon har syntetisk röst — påminn om att slå på plattformens AI-märkning.
9. **Be om kommentar** från de som omnämns innan publicering (rekommendation i varje manus under känsliga ämnen).
10. **Aktualitet:** skriv i "Verifiera" vilket datum uppgifterna är hämtade och vad som kan ha ändrats.

---
## 7. Struktur & mallar
**Standard (6–7 scener):**
1. Cold open (`hookTiles` eller `redacted` eller `stack` med `counter`) — chrome av
2. "Vad är det här?" — enkel förklaring (oftast `fusion` eller `bigtext`+`checklist`)
3–5. Beats (`cards`, `counter`, `checklist`, `versus`, `timeline`, `staff`, `bars`, `columns3`)
6. Svaren/vändningen (`columns3` eller `versus`)
7. `binary` eller `cliff`

**Seriemönster:** *Bakgrund → Nu → Framtiden*, eller *Vad är X? → X i Sverige*. Del 1 ska sluta med en låst ruta som del 2 låser upp.

Leveransformat: se **`MALL-manus.md`** (fyll i exakt så).

---
## 8. Kvalitetschecklista (kryssa innan du levererar)
- [ ] 110–170 ord, ≈ 2,1 ord/s ⇒ 55–80 s
- [ ] Hook först, 3 varianter, en rekommenderad och sann
- [ ] Ny visuell händelse var ≤ 4 s (räkna scenernas widgetar mot rösten)
- [ ] Varje widget har en **trigger** (ett ord) och ryms i 1 100 px
- [ ] Kedja: 4 etiketter ≤ 11 tecken + vilket ord som låser upp varje; ruta 4 låst
- [ ] Slut: binär fråga (ett-ords-svar) **eller** cliffhanger med tid
- [ ] Alla siffror skrivna som ord i voiceover (årtal som siffror)
- [ ] Alla påståenden attribuerade; bekräftat/påstått/obekräftat synligt i bild
- [ ] Källrad per scen (≤ 55 tecken) + källlista med länkar
- [ ] "Verifiera"-lista (siffror som rör sig, svaga källor, vad som utelämnats)
- [ ] Publiceringstext: skärmtext, beskrivning, hashtags, fastnålad kommentar

---
## 9. Referensexempel (färdiga, fungerar — kopiera upplägget)
### Exempel A — PALANTIR DEL 1/2 "Vad är Palantir?" (63 s, ≈ 145 ord)
Kedja: `2003` → `ICE • NATO` → `IRAN • GAZA` → `SVERIGE?` (sista låst). Slut: cliffhanger `DEL 2 • NÄSTA VIDEO`.
```
Voiceover:
ICE, Nato, Israels försvar – och enligt Dagens ETC svenska polisen. Ett företag: Palantir.
Palantir grundades 2003 för att hjälpa USA:s underrättelsetjänst mot terrorism. Enkelt förklarat bygger de program som lägger ihop data från massor av register på ett ställe – så att man ser vem som hänger ihop med vem, var och när.
I USA byggde de systemet ImmigrationOS åt migrationsmyndigheten ICE, för omkring trettio miljoner dollar. Och Nato köpte 2025 deras system Maven.
Maven användes i USA:s krig mot Iran: enligt Pentagon valdes tretton tusen mål ut på trettioåtta dagar. Om det användes mot Irans ledare Khamenei är obekräftat – Palantirs vd avböjde att kommentera.
I Gaza har Palantir ett partnerskap med Israels försvar för "krigsrelaterade uppdrag". Kritiker säger att tekniken använts mot mål där. Palantir förnekar det.
Och i Sverige? Del två.
```
| Scen | type | Innehåll (trigger) |
|---|---|---|
| 1 hook | `hookTiles` | `ICE`("ICE") · `NATO`("Nato") · `ISRAEL`("Israels") · låst `SVERIGE?`("svenska polisen") · rubrik `PALANTIR`("Palantir" slut) |
| 2 vad är det | `stack` | `bigtext` "2003"("grundades") + `fusion` inputs REGISTER/KAMEROR/TELEFONER/DOKUMENT → hub PALANTIR("register") → outputs PERSON("hänger")/PLATS("var")/TID("när") · *kedja 1 på "grundades"* |
| 3 ICE+Nato | `stack` | `cards` ICE·ImmigrationOS·≈$30 milj.(räknar "trettio→dollar slut")·stämpel UTAN KONKURRENS + NATO·Maven·2025 + `checklist` 2 ✓-rader · *kedja 2 på andra "ICE"* |
| 4 Iran | `stack` | `checklist` ✓ "MAVEN ANVÄNDES…"("Maven") + `counter` 13 000 MÅL + 38 dagsrutor("tretton→dagar slut") + `checklist` ? KHAMENEI("Khamenei")·stämpel OBEKRÄFTAT("obekräftat") + ✕ PALANTIRS VD: INGEN KOMMENTAR("avböjde") |
| 5 Gaza | `stack` | `timeline` 7 OKT 2023 → JAN 2024 + `versus` BEKRÄFTAT ↔ PÅSTÅS + stämpel PALANTIR FÖRNEKAR("förnekar") + `checklist` · *kedja 3 på "Gaza"* |
| 6 cliff | `cliff` | hela kedjan stor, ruta 4 låst och röd; kort `DEL 2 • NÄSTA VIDEO` |

### Exempel B — PALANTIR DEL 2/2 "Palantir i Sverige" (66 s, ≈ 167 ord)
Kedja: `5 ÅR` → `ACUS` → `FÖRSVARET` → `VEM GRANSKAR?` (sista låst). Slut: binär `HEMLIGT / OFFENTLIGT` + SPARA.
```
"Vi kan varken bekräfta eller förneka." Så svarade Polisen när Dagens ETC frågade om Palantir.
Palantir är ett amerikanskt företag som bygger program som lägger ihop data från många register, så att man ser vem som hänger ihop med vem.
Enligt Dagens ETC har svensk polis i minst fem år använt en svensk version av Palantirs system Gotham, kallad Acus. Minst sex av bolagets utvecklare ska arbeta i polishuset på Kungsholmen, upp till fyra dagar i veckan.
Systemet ska kunna koppla ihop polisens register med bland annat BankID och mobiloperatörer.
Palantirs Sverigechef har bekräftat att bolaget arbetat med Försvarsmakten i flera år. Och enligt Dagens ETC skrev Sverige i september 2025 på ett avtal om Maven – systemet som användes i kriget mot Iran. Försvarsministern ville inte kommentera.
Polisen hänvisar till rikets säkerhet. Justitieminister Strömmer säger att Polisen själv avgör vilka it-tjänster den använder. Kritiker varnar för att människor som inte är misstänkta kan kartläggas.
Så frågan är: ska våra myndigheters verktyg få vara hemliga – eller har vi rätt att veta?
```
| Scen | type | Innehåll (trigger) |
|---|---|---|
| 1 hook | `redacted` | dokumentkort "SVAR FRÅN POLISEN", citat med **censurbalk över PALANTIR** som dras undan på "Palantir"(slut) · stämpel FARA FÖR RIKETS SÄKERHET("svarade") |
| 2 snabbförklaring | `stack` | `bigtext` PALANTIR · USA + `fusion` (4 källor → PALANTIR → PERSON/PLATS/TID) |
| 3a polisen | `stack` | `timeline` NOV 2025 → MINST 5 ÅR("fem") → ACUS("Acus") + chips ENLIGT DAGENS ETC/ANONYMA KÄLLOR + `staff` 6 personer("sex") + vecka 4 av 5 dagar("fyra") |
| 3b datan | `stack` | `fusion` POLISREGISTER/BANKID/MOBILOPERATÖRER → ACUS → **streckad** PROFIL (ENLIGT UPPGIFTER) |
| 4 försvaret | `stack` | `timeline` FLERA ÅR(bekräftat av Palantir) → SEP 2025(avtal om Maven, enligt ETC) + chips "INGEN KOMMENTAR" + `cards` Maven + stämpel OBEKRÄFTAT AV MYNDIGHET("kommentera" slut) |
| 5 svaren | `stack` | `columns3` POLISEN/REGERINGEN/KRITIKER + `bars` 7 → 24 anställda |
| 6 fråga | `binary` | "Ska verktygen få vara hemliga?" · knappar HEMLIGT/OFFENTLIGT · SPARA |

---
## 10. Befintligt innehåll (för att undvika dubbletter / bygga serier)
Färdiga videos: **Val 2026 del 1**, **Palantir del 1–2**. Färdiga manus (ej byggda): **GTA VI** (3,79 mdr dollar; Rockstar-rättegången), **Val del 2** (extraval), **USA-serien** (3 delar), **Mars-vulkanen**, **FN & mördarrobotar**, **Räntan 2 %**, **Elstödet i södra Sverige**. Se mapparna `manus/` och `manus/reserv/`.

## 11. Så ber du om nya ämnen (urvalskriterier)
Aktuellt (≤ 2 veckor eller ny vinkel), **konkreta tal**, minst **två oberoende källor**, en **konflikt eller ett gap** ("vem granskar?", "räckte det?"), går att visa med våra byggstenar, har en **tydlig värderingsfråga** att avsluta på. Undvik ämnen som kräver kartor/foton, där allt bygger på en enda anonym källa, eller där vi inte kan skilja bekräftat från påstått.
