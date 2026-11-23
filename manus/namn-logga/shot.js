const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:2012,height:1000},deviceScaleFactor:2});
await p.goto('file:///home/user/valet-explainer/manus/namn-logga/namn4.html');await p.waitForTimeout(2500);
await p.screenshot({path:'/home/user/valet-explainer/manus/namn-logga/namn-forslag-4.png',fullPage:true});await b.close()})();
