const fs=require('fs');
const I='#14161B',R='#EF4444',B='#3B7BEA',G='#17B26A';
const marks={
 lumen:(f,a)=>`<svg viewBox="0 0 120 120"><g stroke="${f}" stroke-width="8" stroke-linecap="round"><line x1="100.0" y1="60.0" x2="114.0" y2="60.0"/><line x1="88.3" y1="88.3" x2="98.2" y2="98.2"/><line x1="60.0" y1="100.0" x2="60.0" y2="114.0"/><line x1="31.7" y1="88.3" x2="21.8" y2="98.2"/><line x1="20.0" y1="60.0" x2="6.0" y2="60.0"/><line x1="31.7" y1="31.7" x2="21.8" y2="21.8"/><line x1="60.0" y1="20.0" x2="60.0" y2="6.0"/><line x1="88.3" y1="31.7" x2="98.2" y2="21.8"/></g><circle cx="60" cy="60" r="24" fill="${a}"/></svg>`,
 spot:(f,a)=>`<svg viewBox="0 0 120 120"><path d="M46 22 L74 22 L106 106 L14 106 Z" fill="${a}" opacity=".18"/><rect x="38" y="6" width="44" height="24" rx="10" fill="${f}"/><ellipse cx="60" cy="102" rx="34" ry="9" fill="${a}"/></svg>`,
 belysa:(f,a)=>`<svg viewBox="0 0 120 120"><g stroke="${f}" stroke-width="9" stroke-linecap="round"><line x1="10" y1="28" x2="76" y2="28"/><line x1="10" y1="60" x2="62" y2="60"/><line x1="10" y1="92" x2="84" y2="92"/></g><circle cx="84" cy="60" r="28" fill="${a}" opacity=".16"/><circle cx="84" cy="60" r="28" fill="none" stroke="${a}" stroke-width="8"/></svg>`,
 glimt:(f,a)=>`<svg viewBox="0 0 120 120"><path d="M52 8 C56 40 64 48 96 52 C64 56 56 64 52 96 C48 64 40 56 8 52 C40 48 48 40 52 8 Z" fill="${a}"/><path d="M94 70 C96 86 100 90 114 92 C100 94 96 98 94 114 C92 98 88 94 74 92 C88 90 92 86 94 70 Z" fill="${f}"/></svg>`,
 prisma:(f,a)=>`<svg viewBox="0 0 120 120"><path d="M50 14 L90 84 L10 84 Z" fill="none" stroke="${f}" stroke-width="8" stroke-linejoin="round" transform="translate(-8 4)"/><line x1="0" y1="66" x2="40" y2="58" stroke="${f}" stroke-width="7" stroke-linecap="round"/><g stroke-width="7" stroke-linecap="round"><line x1="66" y1="50" x2="116" y2="26" stroke="${a}"/><line x1="68" y1="58" x2="116" y2="58" stroke="#3B7BEA"/><line x1="66" y1="66" x2="116" y2="92" stroke="#17B26A"/></g></svg>`,
 radar:(f,a)=>`<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="${f}" stroke-width="8"/><circle cx="60" cy="60" r="26" fill="none" stroke="${f}" stroke-width="6" opacity=".4"/><path d="M60 60 L60 10 A50 50 0 0 1 104 36 Z" fill="${a}" opacity=".25"/><line x1="60" y1="60" x2="104" y2="36" stroke="${a}" stroke-width="8" stroke-linecap="round"/><circle cx="82" cy="40" r="7" fill="${a}"/></svg>`,
 dags:(f,a)=>`<svg viewBox="0 0 120 120"><line x1="6" y1="84" x2="114" y2="84" stroke="${f}" stroke-width="9" stroke-linecap="round"/><path d="M30 84 A30 30 0 0 1 90 84 Z" fill="${a}"/><g stroke="${a}" stroke-width="8" stroke-linecap="round"><line x1="60" y1="22" x2="60" y2="34"/><line x1="18" y1="42" x2="27" y2="50"/><line x1="102" y1="42" x2="93" y2="50"/></g></svg>`,
 fokus:(f,a)=>`<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="38" fill="none" stroke="${f}" stroke-width="8"/><g stroke="${f}" stroke-width="8" stroke-linecap="round"><line x1="60" y1="6" x2="60" y2="22"/><line x1="60" y1="98" x2="60" y2="114"/><line x1="6" y1="60" x2="22" y2="60"/><line x1="98" y1="60" x2="114" y2="60"/></g><circle cx="60" cy="60" r="14" fill="${a}"/></svg>`
};
const items=[
['23','lumen','lumen',R,'Latinskt ord för ljus – samma stavning och nästan samma uttal på svenska och engelska. Sol med strålar och röd kärna.','@lumen.news'],
['24','spotlight','spot',R,'Används redan som lånord i svenskan. ”Sätt strålkastarljus på” en nyhet. Kon av ljus mot en röd punkt.','@spotlight.se'],
['25','belysa','belysa',R,'Svenska ”belysa” = att kasta ljus över en sak (precis vad en förklarare gör). Låter exotiskt på engelska men uttalas lätt. Cirkel av ljus över en rad text.','@belysa.se'],
['26','glimt','glimt',R,'Svenska glimt = glimt/gnista, engelska ”glint/glimmer” ligger nära. Kort och minnesvärt. Röd gnista + liten svart gnista.','@glimt.se'],
['27','prisma','prisma',R,'Samma ord på båda språken (prisma/prism). Ljuset delas upp i flera vinklar – exakt som en nyhet som får flera perspektiv. Strålarna i seriens röd/blå/grön.','@prisma.se'],
['28','radar','radar',R,'Exakt samma ord på båda språken. Radarsvep som hittar det röda blippet. Kort, tydligt, lätt att säga.','@radar.news'],
['29','dagsljus','dags',R,'Dagsljus/daylight – nästan samma ord. ”Ut i dagsljuset” = det som var dolt avslöjas. Röd soluppgång över horisonten.','@dagsljus.se'],
['30','fokus','fokus',R,'Focus/fokus – nästan samma stavning. Sikte med röd mitt. Skarpt, enkelt, internationellt.','@fokus.news']
];
const card=([n,name,k,acc,desc,h])=>{const m=marks[k];
return `<div class="card"><div class="no">${n}</div>
<div class="logo"><div class="mk">${m(I,acc)}</div><div class="word">${name}</div></div>
<div class="row"><div class="icon"><div class="s">${m(I,acc)}</div></div><div class="icon dark"><div class="s">${m('#fff',acc)}</div></div><div class="av"><div class="s">${m(I,acc)}</div></div></div>
<div class="tag">${name}</div><p>${desc}</p><div class="handle">${h}</div></div>`};
const html=fs.readFileSync('namn.html','utf8');
const head=html.split('<h1>')[0].replace('</style>','.mk{width:110px;height:110px}.mk svg{width:100%;height:100%}.s{width:52px;height:52px}.s svg{width:100%;height:100%}.logo{gap:20px}.word{font-size:54px}body{width:1900px}.grid{grid-template-columns:repeat(4,1fr)!important}</style>');
fs.writeFileSync('namn4.html',head+`<h1>Namn som funkar på svenska & engelska – ljus</h1><div class="sub">Samma palett och stil · Förslag 23–30</div><div class="grid">${items.map(card).join('')}</div></body></html>`);
