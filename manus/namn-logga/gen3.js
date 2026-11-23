const fs=require('fs');
const I='#14161B',R='#EF4444',B='#3B7BEA',G='#17B26A';
const marks={
 receipts:(f,a)=>`<svg viewBox="0 0 120 120"><path d="M24 10 H96 V110 L84 100 L72 110 L60 100 L48 110 L36 100 L24 110 Z" fill="none" stroke="${f}" stroke-width="8" stroke-linejoin="round"/><line x1="40" y1="32" x2="80" y2="32" stroke="${f}" stroke-width="8" stroke-linecap="round"/><line x1="40" y1="52" x2="68" y2="52" stroke="${f}" stroke-width="8" stroke-linecap="round"/><line x1="40" y1="74" x2="80" y2="74" stroke="${a}" stroke-width="10" stroke-linecap="round"/></svg>`,
 backstory:(f,a)=>`<svg viewBox="0 0 120 120"><rect x="30" y="8" width="82" height="56" rx="14" fill="none" stroke="${f}" stroke-width="7" opacity=".3"/><rect x="20" y="28" width="82" height="56" rx="14" fill="none" stroke="${f}" stroke-width="7" opacity=".6"/><rect x="10" y="50" width="82" height="56" rx="14" fill="${f}"/><circle cx="51" cy="78" r="9" fill="${a}"/></svg>`,
 unpacked:(f,a)=>`<svg viewBox="0 0 120 120"><rect x="14" y="52" width="92" height="56" rx="12" fill="${f}"/><rect x="20" y="14" width="92" height="28" rx="10" fill="none" stroke="${f}" stroke-width="8" transform="rotate(-8 66 28)"/><circle cx="60" cy="80" r="11" fill="${a}"/></svg>`,
 signal:(f,a)=>`<svg viewBox="0 0 120 120"><g fill="none" stroke="${f}" stroke-width="9" stroke-linecap="round"><path d="M22 56 A52 52 0 0 1 98 56" transform="translate(0 -4)"/><path d="M38 72 A30 30 0 0 1 82 72" transform="translate(0 -4)"/></g><circle cx="60" cy="94" r="13" fill="${a}"/></svg>`,
 plain:(f,a)=>`<svg viewBox="0 0 120 120"><path d="M6 60 C 28 24, 92 24, 114 60 C 92 96, 28 96, 6 60 Z" fill="none" stroke="${f}" stroke-width="9" stroke-linejoin="round"/><circle cx="60" cy="60" r="19" fill="${a}"/><circle cx="52" cy="52" r="6" fill="#fff"/></svg>`,
 blind:(f,a)=>`<svg viewBox="0 0 120 120"><path d="M60 8 A52 52 0 1 0 112 60 L60 60 Z" fill="${f}"/><circle cx="86" cy="34" r="16" fill="${a}"/></svg>`,
 fine:(f,a)=>`<svg viewBox="0 0 120 120"><g stroke="${f}" stroke-width="7" stroke-linecap="round"><line x1="10" y1="62" x2="100" y2="62"/><line x1="10" y1="80" x2="82" y2="80"/><line x1="10" y1="98" x2="94" y2="98"/></g><g stroke="${a}" stroke-width="10" stroke-linecap="round"><line x1="34" y1="14" x2="34" y2="46"/><line x1="20" y1="22" x2="48" y2="38"/><line x1="48" y1="22" x2="20" y2="38"/></g></svg>`,
 dossier:(f,a)=>`<svg viewBox="0 0 120 120"><path d="M8 30 a12 12 0 0 1 12-12 H44 L56 30 H100 a12 12 0 0 1 12 12 V92 a12 12 0 0 1-12 12 H20 a12 12 0 0 1-12-12 Z" fill="${f}"/><rect x="78" y="22" width="14" height="40" rx="7" fill="${a}"/></svg>`
};
const items=[
['15','receipts','receipts',R,'Slang för bevis: ”show the receipts”. Kvitto med en röd totalrad – varje påstående backas av en källa, precis som källraden i videorna.','@receipts.news'],
['16','backstory','backstory',R,'Historien bakom rubriken. Tre lager kort som skalas av, översta med röd punkt. Passar bakgrunds-delar i serier.','@backstory.se'],
['17','unpacked','unpacked',R,'Vi packar upp en nyhet. Låda med lyft lock och röd kärna. Känns som ”unboxing” fast för nyheter – bra i en voiceover.','@unpacked.se'],
['18','signal','signal',R,'Signal vs brus. Radiovågor med en röd källa – vi filtrerar fram det som faktiskt betyder något.','@signal.news'],
['19','plain sight','plain',R,'Allt låg öppet hela tiden. Öga med röd pupill – passar granskande ämnen som Palantir och offentliga data.','@plainsight.se'],
['20','blindspot','blind',R,'Det alla missar. Mörk cirkel med en utskuren kil och röd prick i fältet vi inte ser. Skarpt namn för ”det du inte fått veta”.','@blindspot.se'],
['21','fine print','fine',R,'Det som står med liten stil. Småtext-rader med röd asterisk. Bra för avtal, lagar och upphandlingar.','@fineprint.se'],
['22','dossier','dossier',R,'En mapp med allt om ett ämne. Svart mapp med röd flik. Känns undersökande och passar serier med flera delar.','@dossier.se']
];
const card=([n,name,k,acc,desc,h])=>{const m=marks[k];
return `<div class="card"><div class="no">${n}</div>
<div class="logo"><div class="mk">${m(I,acc)}</div><div class="word">${name}</div></div>
<div class="row"><div class="icon"><div class="s">${m(I,acc)}</div></div><div class="icon dark"><div class="s">${m('#fff',acc)}</div></div><div class="av"><div class="s">${m(I,acc)}</div></div></div>
<div class="tag">${name}</div><p>${desc}</p><div class="handle">${h}</div></div>`};
const html=fs.readFileSync('namn.html','utf8');
const head=html.split('<h1>')[0].replace('</style>','.mk{width:110px;height:110px}.mk svg{width:100%;height:100%}.s{width:52px;height:52px}.s svg{width:100%;height:100%}.logo{gap:20px}.word{font-size:54px}body{width:1900px}.grid{grid-template-columns:repeat(4,1fr)!important}</style>');
fs.writeFileSync('namn3.html',head+`<h1>Names & logos – English options</h1><div class="sub">Samma palett och stil · Förslag 15–22</div><div class="grid">${items.map(card).join('')}</div></body></html>`);
