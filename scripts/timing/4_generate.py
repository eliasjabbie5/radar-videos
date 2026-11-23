import json, re, subprocess, math
words=json.load(open('script_words.json'))
END=float(open('/tmp/asr/dur.txt').read())-0.35
# fine silences
p=subprocess.run(['ffmpeg','-i','/tmp/asr/voice16k.wav','-af','silencedetect=noise=-45dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',p)]
en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',p)]
sil=[(a,b) for a,b in zip(st,en) if b-a>=0.14]
snapped=0
for i,w in enumerate(words):
    for a,b in sil:
        if a+0.02<w['s']<b-0.02 and b-w['s']<0.6:
            w['s']=b; snapped+=1; break
# --- manual overrides where ASR missed/garbled a phrase (verified against pauses in the audio)
OVR=[(2,'Centerpartiet',0,34.74,35.65),(2,'mot',0,35.75,36.05),(2,'Vänsterpartiet.',0,36.05,36.93),(2,'Centerpartiet',1,37.54,38.62)]
for sc,tx,occ,a,b in OVR:
    ws=[w for w in words if w['scene']==sc and w['text']==tx]
    ws[occ]['s']=a; ws[occ]['e']=b
for i,w in enumerate(words):
    if i and w['s']<words[i-1]['s']: w['s']=words[i-1]['s']+0.05
for i,w in enumerate(words):
    nxt=words[i+1]['s'] if i+1<len(words) else END+0.2
    e=min(w['e'],nxt)
    for a,b in sil:
        if w['s']<a<e: e=min(e,a+0.04)
    w['e']=max(w['s']+0.1,e)
bad=[]
for w in words:
    for a,b in sil:
        ov=min(w['e'],b)-max(w['s'],a)
        if ov>0.3: bad.append((w['text'],round(w['s'],2),round(w['e'],2),round(a,2),round(b,2)))
print('words straddling a pause >0.3s:',bad)
print('snapped',snapped,'of',len(words))
norm=lambda t:''.join(c for c in t.lower() if c.isalnum())
def find(scene,rx,occ=0,edge='s'):
    ws=[w for w in words if w['scene']==scene and norm(w['text'])==rx]
    assert len(ws)>occ,(scene,rx,occ)
    return round(ws[occ]['s' if edge=='s' else 'e'],2)
SPEC={
 'dagar':(0,'dagar',0,'s'),'regeringE':(0,'regering',0,'e'),'tva':(0,'två',0,'s'),'extraval1':(0,'extraval',0,'s'),
 'sedan':(1,'sedan',0,'s'),'kristersson':(1,'kristerssons',0,'s'),'lopande':(1,'löpande',0,'s'),'riksdagen':(1,'riksdagen',0,'s'),
 'forst':(1,'först',0,'s'),'anderssonE':(1,'andersson',0,'e'),'thand':(1,'thand',0,'s'),'ringqvistE':(1,'ringqvist',0,'e'),
 'fyra':(2,'fyra',0,'s'),'krock':(2,'krock',0,'s'),'center':(2,'centerpartiet',0,'s'),'vanster':(2,'vänsterpartiet',0,'s'),
 'gaVidare':(2,'gå',0,'s'),'socdem':(2,'socialdemokraternas',0,'s'),'blankt':(2,'blankt',0,'s'),'kraver':(2,'kräver',0,'s'),'ministerposter':(2,'ministerposter',0,'s'),
 'matten':(3,'matten',0,'s'),'s175':(3,'175',0,'s'),'hoger':(3,'högerblocket',0,'s'),'s173E':(3,'173',0,'e'),'mandatE':(3,'mandat',0,'e'),
 'vanster2':(3,'vänsterpartiet',0,'s'),'nejknappen':(3,'nejknappen',0,'s'),'faller':(3,'faller',0,'s'),
 'talmannen':(4,'talmannen',0,'s'),'julE':(4,'jul',0,'e'),'fragan':(4,'frågan',0,'s'),'vem':(4,'vem',0,'s'),'eller':(4,'eller',0,'s'),'extraval2':(4,'extraval',0,'s'),
}
anchors={k:find(*v) for k,v in SPEC.items()}
# scene starts: first word - 0.5 s lead (scene 0 = 0)
firsts=[min(w['s'] for w in words if w['scene']==i) for i in range(5)]
starts=[0.0]+[round(f-0.5,2) for f in firsts[1:]]
caps=[]
for i,w in enumerate(words):
    caps.append({'text':w['text'] if i==0 else ' '+w['text'],'startMs':round(w['s']*1000),'endMs':round(w['e']*1000)})
ts="// AUTO-GENERATED from public/voiceover.mp3 (speech recognition aligned to the script).\n// Re-generate when the voiceover changes. Times in seconds unless noted.\nimport type {Caption} from '@remotion/captions';\n\n"
ts+=f"export const AUDIO_SECONDS = {round(float(open("/tmp/asr/dur.txt").read()),2)};\nexport const sceneStarts = {json.dumps(starts)};\nexport const anchors = {json.dumps(anchors,indent=2)} as const;\n\n"
ts+="const raw: [string, number, number][] = "+json.dumps([[c['text'],c['startMs'],c['endMs']] for c in caps],ensure_ascii=False)+";\n"
ts+="export const wordCaptions: Caption[] = raw.map(([text, startMs, endMs]) => ({text, startMs, endMs, timestampMs: Math.round((startMs + endMs) / 2), confidence: null}));\n"
open('/home/user/valet-explainer/src/data/timing.generated.ts','w').write(ts)
print('starts',starts)
for k,v in anchors.items(): print(k,v,end=' | ')
