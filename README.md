# Valet 2026 — Editorial Verre (Remotion)

1080×1920 · 30 fps · ~79 s (follows `public/voiceover.mp3`) · voice + sound effects. White canvas, frosted-glass cards,
Bricolage Grotesque / DM Sans / DM Mono.

## Render in the cloud
1. `public/voiceover.mp3` is already in the repo.
2. Push, then **Actions → Render video → Run workflow**.
3. Download the `.mp4` from the run's *Artifacts*.

Local preview: `npm install && npm run dev`.

## Where things live
- `src/data/episode1.ts` — all text, scene order, source footers and animation cues.
  Cues are computed from `timing.generated.ts` (e.g. `at(2, A.kraver)` = "when the voice says *kräver*").
- `src/data/timing.generated.ts` — AUTO-GENERATED word timings + anchors for the voiceover.
- `src/components/scenes/*` — the five scenes. `src/components/chrome/*` — top anchor, source footer, captions.
- `concepts/` — the three design concepts that were compared (not part of the render).

## Sound effects
`public/sfx/*.wav` are synthesised by `npm run sfx` (`scripts/sfx/make_sfx.py`, numpy only): pops, ticks, whooshes,
stamps, chimes, count/fill tick-trains. Which sound plays when is derived from the animation cues at the bottom of
`src/data/episode1.ts` (`buildSfx`) — move a cue and its sound follows. Levels per sound: `src/lib/sfx.ts`
(tuned to sit ~10–20 dB under the voice, like the reference videos; no music bed).
The CI workflow (and `npm run master`) finishes with loudness mastering to −14 LUFS.

## New voiceover? Re-time everything
`scripts/timing/` holds the pipeline used for episode 1 (speech recognition via sherpa-onnx +
Parakeet v3, aligned to the script, snapped to real pauses with ffmpeg). Run the four scripts in order
(paths inside point at `/tmp/asr`; adjust), then re-render. `4_generate.py` also has a small `OVR` list for phrases the recogniser missed — check its "words straddling a pause" output. If you only tweak the audio slightly, nudge
`sceneStarts`/anchors in `timing.generated.ts` by hand.

## Notes
- Vänsterpartiet's seat count (24) in `episode1.ts` is a placeholder — set the real 2026 number.
- Safe zones: bottom 240 px and right 140 px stay clear (`SAFE` in `src/lib/theme.ts`).

## Guides for other AIs
- `manus/GUIDE-FOR-MANUS-AI.md` + `manus/MALL-manus.md` — writing scripts.
- `manus/PRODUKTIONSGUIDE-FOR-VIDEO-AI.md` — building, timing, sound effects (`SFX_MASTER` in `src/lib/sfx.ts`), safe zones (`APP` in `src/lib/theme.ts`), rendering and mastering.
