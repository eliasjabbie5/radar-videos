const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1720,height:1000},deviceScaleFactor:2});
await p.goto('file:///home/user/valet-explainer/manus/namn-logga/radar/brand-sheet.html');await p.waitForTimeout(2500);
await p.screenshot({path:'radar-brand-sheet.png',fullPage:true});
// transparent PNGs of logos
await p.setContent(`<body style="margin:0;background:transparent"><div id=m style="display:inline-block;width:1024px;height:1024px">${require('fs').readFileSync('radar-mark.svg','utf8')}</div></body>`);
await p.locator('#m').screenshot({path:'radar-mark.png',omitBackground:true});
await b.close()})();
