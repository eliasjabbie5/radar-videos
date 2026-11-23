const fs=require('fs');
const I='#14161B',R='#EF4444',B='#3B7BEA',G='#17B26A';
const mark=(f=I,a=R,mid=f)=>`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="50" fill="none" stroke="${f}" stroke-width="8"/><circle cx="60" cy="60" r="26" fill="none" stroke="${mid}" stroke-width="6" opacity=".4"/><path d="M60 60 L60 10 A50 50 0 0 1 104 36 Z" fill="${a}" opacity=".25"/><line x1="60" y1="60" x2="104" y2="36" stroke="${a}" stroke-width="8" stroke-linecap="round"/><circle cx="82" cy="40" r="7" fill="${a}"/></svg>`;
// standalone svg files
fs.writeFileSync('radar-mark.svg',mark());
fs.writeFileSync('radar-mark-white.svg',mark('#fff',R));
const css=`
:root{--ink:${I};--red:${R};--blue:${B};--green:${G}}
*{box-sizing:border-box;margin:0}
body{background:#fff;width:1600px;padding:60px;font-family:'DM Sans',sans-serif;color:var(--ink)}
h1{font-family:'Bricolage Grotesque';font-weight:800;font-size:46px;letter-spacing:-1px}
.mono{font-family:'DM Mono';font-size:14px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em}
h2{font-family:'DM Mono';font-size:14px;text-transform:uppercase;letter-spacing:.1em;color:var(--red);margin:0 0 16px}
.sec{margin-top:44px}
.grid{display:grid;gap:24px}
.card{background:rgba(255,255,255,.92);border:1px solid rgba(20,22,27,.08);border-radius:28px;box-shadow:0 10px 40px rgba(20,22,27,.08);padding:28px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;position:relative}
.card.dark{background:var(--ink);border-color:transparent}
.card.red{background:var(--red);border-color:transparent}
.card.dark .word,.card.red .word{color:#fff}
.word{font-family:'Bricolage Grotesque';font-weight:800;letter-spacing:-.04em;line-height:1}
.lock{display:flex;align-items:center;gap:.28em}
.lock svg{display:block}
.cap{font-family:'DM Mono';font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:.08em;position:absolute;left:18px;top:14px}
.dark .cap,.red .cap{color:rgba(255,255,255,.6)}
.sw{height:110px;border-radius:20px;display:flex;align-items:flex-end;padding:12px;font-family:'DM Mono';font-size:13px;color:#fff}
.phone{width:270px;height:480px;border-radius:22px;overflow:hidden;position:relative;border:1px solid rgba(20,22,27,.12);box-shadow:0 14px 40px rgba(20,22,27,.14);background:#fff;flex:none}
.safe{position:absolute;right:0;top:0;bottom:0;width:35px;background:repeating-linear-gradient(45deg,rgba(239,68,68,.12),rgba(239,68,68,.12) 4px,transparent 4px,transparent 8px)}
.safeb{position:absolute;left:0;right:0;bottom:0;height:60px;background:repeating-linear-gradient(45deg,rgba(239,68,68,.12),rgba(239,68,68,.12) 4px,transparent 4px,transparent 8px)}
p{line-height:1.5;color:#374151}
`;
const lock=(size,f=I,a=R,dot=true)=>`<div class="lock"><div style="width:${size*1.1}px;height:${size*1.1}px">${mark(f,a)}</div><div class="word" style="font-size:${size}px;color:${f}">radar</div></div>`;
const lockStack=(size)=>`<div style="display:flex;flex-direction:column;align-items:center;gap:${size*.12}px"><div style="width:${size*1.5}px;height:${size*1.5}px">${mark()}</div><div class="word" style="font-size:${size}px">radar</div></div>`;
const html=`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@500&display=swap" rel="stylesheet"><style>${css}</style></head><body>
<div style="display:flex;justify-content:space-between;align-items:end"><div><div class="mono">Brand sheet · v1</div><h1>radar</h1></div><div class="mono" style="text-align:right">Nyheterna, förklarade.<br>Svenska & engelska</div></div>

<div class="sec"><h2>01 · Huvudlogga</h2>
<div class="grid" style="grid-template-columns:2fr 1fr 1fr">
<div class="card" style="height:300px"><span class="cap">Horisontell</span>${lock(96)}</div>
<div class="card" style="height:300px"><span class="cap">Stående</span>${lockStack(52)}</div>
<div class="card" style="height:300px"><span class="cap">Endast märke</span><div style="width:150px;height:150px">${mark()}</div></div></div></div>

<div class="sec"><h2>02 · Färgversioner</h2>
<div class="grid" style="grid-template-columns:repeat(4,1fr)">
<div class="card" style="height:190px"><span class="cap">På vitt</span>${lock(48)}</div>
<div class="card dark" style="height:190px"><span class="cap">På bläck</span>${lock(48,'#fff',R)}</div>
<div class="card red" style="height:190px"><span class="cap">På röd</span>${lock(48,'#fff','#fff')}</div>
<div class="card" style="height:190px;background:#F4F5F7"><span class="cap">Enfärgad</span>${lock(48,I,I)}</div></div></div>

<div class="sec"><h2>03 · Profilbild & app-ikon</h2>
<div class="grid" style="grid-template-columns:repeat(5,1fr)">
<div class="card" style="height:200px"><span class="cap">Cirkel (TikTok/IG)</span><div style="width:130px;height:130px;border-radius:50%;background:#fff;border:1px solid rgba(20,22,27,.12);box-shadow:0 6px 18px rgba(20,22,27,.12);display:grid;place-items:center"><div style="width:84px;height:84px">${mark()}</div></div></div>
<div class="card" style="height:200px"><span class="cap">Cirkel mörk</span><div style="width:130px;height:130px;border-radius:50%;background:${I};display:grid;place-items:center"><div style="width:84px;height:84px">${mark('#fff',R)}</div></div></div>
<div class="card" style="height:200px"><span class="cap">App-ikon</span><div style="width:130px;height:130px;border-radius:30px;background:${I};display:grid;place-items:center"><div style="width:84px;height:84px">${mark('#fff',R)}</div></div></div>
<div class="card" style="height:200px"><span class="cap">App-ikon röd</span><div style="width:130px;height:130px;border-radius:30px;background:${R};display:grid;place-items:center"><div style="width:84px;height:84px">${mark('#fff','#fff')}</div></div></div>
<div class="card" style="height:200px"><span class="cap">Små storlekar</span><div style="display:flex;gap:16px;align-items:end"><div style="width:48px;height:48px">${mark()}</div><div style="width:32px;height:32px">${mark()}</div><div style="width:20px;height:20px">${mark()}</div><div style="width:16px;height:16px">${mark()}</div></div></div></div></div>

<div class="sec" style="display:grid;grid-template-columns:1.3fr 1fr;gap:24px"><div><h2>04 · Färger</h2>
<div class="grid" style="grid-template-columns:repeat(4,1fr)">
<div class="sw" style="background:${I}">Bläck<br>#14161B</div><div class="sw" style="background:${R}">Radar-röd<br>#EF4444</div><div class="sw" style="background:${B}">Blå<br>#3B7BEA</div><div class="sw" style="background:${G}">Grön<br>#17B26A</div></div>
<p style="margin-top:14px;font-size:15px"><b>Regel:</b> röd = svepet, blippet och varningar/stämplar. Blå = neutral data. Grön = bekräftat. Bakgrund alltid vit.</p></div>
<div><h2>05 · Typsnitt</h2>
<div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:44px;letter-spacing:-1.5px;line-height:1">Bricolage Grotesque</div><div class="mono" style="margin:4px 0 14px">Rubriker & logotyp · 800</div>
<div style="font-size:28px;font-weight:500">DM Sans</div><div class="mono" style="margin:2px 0 14px">Brödtext · 400/500</div>
<div style="font-family:'DM Mono';font-size:24px">DM Mono — 37 % · 258 · 11 DEC</div><div class="mono" style="margin-top:2px">Siffror & etiketter · 500</div></div></div>

<div class="sec"><h2>06 · Frirum & minsta storlek</h2>
<div class="grid" style="grid-template-columns:1fr 1fr">
<div class="card" style="height:240px"><span class="cap">Frirum = höjden på r:et</span><div style="padding:34px;border:2px dashed rgba(239,68,68,.55);border-radius:6px">${lock(54)}</div></div>
<div class="card" style="height:240px;align-items:flex-start;justify-content:center;padding-left:40px"><span class="cap">Minsta storlek</span><div style="display:flex;align-items:center;gap:30px">${lock(30)}<span class="mono">Wordmark ≥ 30 px</span></div><div style="display:flex;align-items:center;gap:30px"><div style="width:24px;height:24px">${mark()}</div><span class="mono">Märke ≥ 24 px</span></div></div></div></div>

<div class="sec"><h2>07 · I videon (9:16)</h2>
<div style="display:flex;gap:28px;align-items:flex-start">
<div><div class="phone" style="display:grid;place-items:center">${lockStack(34)}<div style="position:absolute;bottom:70px;left:0;right:0;text-align:center" class="mono">Nyheterna, förklarade.</div><div class="safe"></div><div class="safeb"></div></div><p style="margin-top:10px;font-size:14px;width:270px"><b>Intro</b> · 1,2 s: svepet roterar, blippet tänds, ”pling”.</p></div>
<div><div class="phone"><div style="position:absolute;left:16px;top:21px;display:flex;align-items:center;gap:6px"><div style="width:20px;height:20px">${mark()}</div><div class="word" style="font-size:16px">radar</div></div>
<div style="position:absolute;left:16px;right:60px;top:110px"><div class="mono" style="color:${R}">USA 2026 • DEL 1/3</div><div class="word" style="font-size:54px;margin-top:8px">5</div><div class="word" style="font-size:28px;margin-top:4px">FEM PLATSER.</div></div><div class="safe"></div><div class="safeb"></div></div><p style="margin-top:10px;font-size:14px;width:270px"><b>Vattenstämpel</b> · uppe till vänster, utanför röd zon.</p></div>
<div><div class="phone" style="display:grid;place-items:center"><div style="text-align:center"><div style="width:90px;height:90px;margin:0 auto">${mark()}</div><div class="word" style="font-size:28px;margin-top:10px">Följ för del 2</div><div class="mono" style="margin-top:8px;color:${R}">I MORGON 18:00</div></div><div class="safe"></div><div class="safeb"></div></div><p style="margin-top:10px;font-size:14px;width:270px"><b>Slutkort</b> · märket + nästa del.</p></div>
<div style="flex:1;padding-top:6px"><h2 style="margin-top:0">08 · Röst & texter</h2>
<p><b>Namn:</b> radar<br><b>Användarnamn:</b> @radar.nyheter (eller ledigt alternativ)<br><b>Tagline SV:</b> Nyheterna, förklarade.<br><b>Tagline EN:</b> The news, on radar.<br><b>Bio:</b> Korta förklarare om det som händer. Källor i varje video. AI-röst.<br><b>Ton:</b> kort, neutral, attribuerad.</p>
<h2 style="margin-top:26px">Röda zoner</h2><p style="font-size:14px">Rödrutigt = TikTok/Instagram-UI: höger 140 px och nederkant 240 px (av 1080×1920) – ingen text eller logga där.</p></div>
</div></div>
</body></html>`;
fs.writeFileSync('brand-sheet.html',html);
