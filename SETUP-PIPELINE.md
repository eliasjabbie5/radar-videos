# Radar – automatisk videokedja (uppsättning)

Flöden i n8n (tessou.app.n8n.cloud):
1. **radar – 01 Ämne, manus och faktakoll** – ämne → manus → faktakoll (Gemini, sedan Claude) → revidering → Notion ("Väntar på godkännande").
2. **radar – 02 Röstprov** – testa röst (Gemini TTS, standardröst `sulafat`).
3. **radar – 03 Avsnitt: scener, röst och rendering** – godkänt manus (Notion-länk) → Claude skriver avsnittsdata (`manus/AVSNITT-PROMPT.md`) → kontroll → röst → `jobs/<id>/` committas hit → GitHub Actions renderar.
4. **radar – 04 Rendering klar** – webhook som GitHub anropar; sätter Notion till "Klar" + länk till videon.

## Engångssteg
1. n8n: skapa credential **GitHub (radar)** (typ *GitHub API*, Access Token = fine-grained token för detta repo med *Contents: read/write* och *Actions: read/write* och *Metadata: read*). Välj den i fyra noder i flöde 03 (Hämta systemprompt, Gemini TTS är Google, Committa till GitHub, Starta rendering).
2. n8n: välj credential **Tavily API Key** i noden "Sök källor (Tavily)" om den saknas (flöde 01).
3. n8n: **publicera** flöde 04 och kopiera dess *Production URL* (webhooken).
4. GitHub → Settings → Secrets and variables → Actions → ny hemlighet `N8N_CALLBACK_URL` = den URL:en.
5. GitHub → Settings → Actions → General → Workflow permissions: *Read and write*.

## Köra
- Skapa/godkänn manus i Notion-databasen "radar – videopipeline" (flöde 01 eller eget).
- Kör flöde 03 med länken till sidan. Resultat: Notion-sidan får status **Klar** och en länk till GitHub Release `job-<id>` med `partN-master.mp4`.

## Lokalt test av ett jobb
`node scripts/job/run.mjs jobs/<id>` (kräver ffmpeg, Python med `sherpa-onnx numpy`, ASR-modell i `ASR_MODEL_DIR`, `BROWSER_EXECUTABLE` valfri).
