const fs=require('fs');
const I='#14161B',R='#EF4444',B='#3B7BEA',G='#17B26A';
const marks={
 trad:(f,a)=>`<svg viewBox="0 0 120 120"><path d="M8 84 C 40 84, 40 30, 62 30 C 84 30, 84 66, 62 66 C 46 66, 50 44, 66 44 L 104 44" fill="none" stroke="${f}" stroke-width="9" stroke-linecap="round"/><circle cx="106" cy="44" r="10" fill="${a}"/></svg>`,
 laget:(f,a)=>`<svg viewBox="0 0 120 120"><rect x="12" y="68" width="22" height="36" rx="7" fill="${f}"/><rect x="45" y="46" width="22" height="58" rx="7" fill="${f}"/><rect x="78" y="14" width="22" height="90" rx="7" fill="${a}"/></svg>`,
 zoom:(f,a)=>`<svg viewBox="0 0 120 120"><g fill="none" stroke="${f}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 40 V20 a6 6 0 0 1 6-6 H40"/><path d="M80 14 H100 a6 6 0 0 1 6 6 V40"/><path d="M106 80 V100 a6 6 0 0 1-6 6 H80"/><path d="M40 106 H20 a6 6 0 0 1-6-6 V80"/></g><rect x="40" y="40" width="40" height="40" rx="10" fill="${a}"/></svg>`,
 faktum:(f,a)=>`<svg viewBox="0 0 120 120"><rect x="12" y="16" width="78" height="88" rx="16" fill="none" stroke="${f}" stroke-width="8"/><line x1="28" y1="42" x2="70" y2="42" stroke="${f}" stroke-width="8" stroke-linecap="round"/><line x1="28" y1="62" x2="58" y2="62" stroke="${f}" stroke-width="8" stroke-linecap="round"/><circle cx="86" cy="84" r="26" fill="${a}" stroke="${f==='#fff'?I:'#fff'}" stroke-width="6"/><path d="M74 85 L82 93 L98 74" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
 rakt:(f,a)=>`<svg viewBox="0 0 120 120"><line x1="8" y1="60" x2="78" y2="60" stroke="${f}" stroke-width="14" stroke-linecap="round"/><path d="M72 28 L110 60 L72 92 Z" fill="${a}" stroke="${a}" stroke-width="6" stroke-linejoin="round"/></svg>`,
 nudaa:(f,a)=>`<svg viewBox="0 0 120 120"><path d="M16 22 a14 14 0 0 1 14-14 H90 a14 14 0 0 1 14 14 V70 a14 14 0 0 1-14 14 H56 L34 108 V84 H30 a14 14 0 0 1-14-14 Z" fill="${f}"/><text x="60" y="68" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="800" font-size="62" fill="${a}">?</text></svg>`,
 linsen:(f,a)=>`<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="46" fill="none" stroke="${f}" stroke-width="10"/><circle cx="60" cy="60" r="26" fill="${a}" opacity=".18"/><path d="M38 52 A26 26 0 0 1 56 36" fill="none" stroke="${a}" stroke-width="9" stroke-linecap="round"/><circle cx="60" cy="60" r="7" fill="${a}"/></svg>`,
 klar:(f,a)=>`<svg viewBox="0 0 120 120"><line x1="12" y1="26" x2="108" y2="26" stroke="${f}" stroke-width="12" stroke-linecap="round"/><rect x="8" y="46" width="104" height="28" rx="8" fill="${a}" opacity=".95"/><line x1="12" y1="60" x2="92" y2="60" stroke="#fff" stroke-width="10" stroke-linecap="round"/><line x1="12" y1="94" x2="70" y2="94" stroke="${f}" stroke-width="12" stroke-linecap="round"/></svg>`
};
const items=[
['07','tråden','trad',R,'Dra i tråden så rasar det upp. En enda linje som slingrar sig och slutar i en röd punkt = den lösa ändan du får veta i slutet. Funkar bra för uppföljare och serier.','@tråden.se'],
['08','läget','laget',G,'Det svenska ”hur är läget?” – nyheter som lägesbild. Tre staplar där den sista (högsta/viktigaste) är rödmarkerad. Passar siffer- och data-drivna videor.','@läget.nu'],
['09','zoom ut','zoom',R,'Visar helheten bakom en nyhet. Sökarhörn som zoomar ut runt en röd ruta = ”här är sammanhanget”. Bra för bakgrund/förklarar-videor.','@zoomut.se'],
['10','faktum','faktum',G,'Tydligt, trovärdigt och direkt om att vi faktakollar. Dokumentkort med grön stämpel – samma bekräftat/påstått-språk som i videorna.','@faktum.nu'],
['11','rakt av','rakt',R,'Ingen omskrivning, ingen spin. En rak pil rakt framåt. Känns som tonen i manusen: kort, neutralt, rakt på sak.','@raktav.se'],
['12','nu då?','nudaa',R,'Frågan folk ställer efter en rubrik. Pratbubbla med rött frågetecken – inbjuder till kommentarer (”nu då?”) och passar serier med ”vad händer härnäst”.','@nudå.se'],
['13','linsen','linsen',B,'Vi granskar nyheterna genom en lins. Blå lins med ett ljusreflex-streck. Lugn, saklig, lite teknisk känsla som matchar Palantir/Val-serierna.','@linsen.se'],
['14','klartext','klar',R,'Säg det som det är. Textrader där en rad är markerad i rött – som i redacted-scenerna, fast tvärtom: här avslöjas det. Starkt namn att säga högt.','@klartext.se']
];
const card=([n,name,k,acc,desc,h])=>{const m=marks[k];
return `<div class="card"><div class="no">${n}</div>
<div class="logo"><div class="mk">${m(I,acc)}</div><div class="word">${name}</div></div>
<div class="row"><div class="icon"><div class="s">${m(I,acc)}</div></div><div class="icon dark"><div class="s">${m('#fff',acc)}</div></div><div class="av"><div class="s">${m(I,acc)}</div></div></div>
<div class="tag">${name}</div><p>${desc}</p><div class="handle">${h}</div></div>`};
const html=fs.readFileSync('namn.html','utf8');
const head=html.split('<h1>')[0].replace('</style>','.mk{width:110px;height:110px}.mk svg{width:100%;height:100%}.s{width:52px;height:52px}.s svg{width:100%;height:100%}.logo{gap:20px}.word{font-size:54px}body{width:1900px}.grid{grid-template-columns:repeat(4,1fr)!important}</style>');
fs.writeFileSync('namn2.html',head+`<h1>Namn & logga – 8 fler</h1><div class="sub">Samma palett och stil · förslag 07–14</div><div class="grid">${items.map(card).join('')}</div></body></html>`);
