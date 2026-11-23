import json, re, difflib, bisect
o=json.load(open('out.json'))
toks,ts=o['tokens'],o['timestamps']
END=float(open('/tmp/asr/dur.txt').read())-0.35

# ASR chars with times (linear inside each token)
ach=[];att=[]
for i,(t,s) in enumerate(zip(toks,ts)):
    e=ts[i+1] if i+1<len(ts) else min(s+0.3,END)
    tt=t.lower()
    for k,c in enumerate(tt):
        if c.isalnum():
            ach.append(c);att.append(s+(e-s)*k/max(len(tt),1))
A=''.join(ach)

SCENES=[
 ('coldOpen','Sjuttio dagar efter valet har Sverige fortfarande ingen ny regering. Och nu har landet bara två chanser kvar innan ett extraval blir verklighet.'),
 ('voteTrack','Sedan den 17 september styrs Sverige av Ulf Kristerssons övergångsregering, som bara får fatta löpande beslut. Samtidigt har riksdagen redan röstat nej till två statsministerförslag – först Magdalena Andersson, och sedan Centerpartiets Elisabeth Thand Ringqvist.'),
 ('deadlock','Enligt grundlagen har talmannen bara fyra försök. Nu ligger allt på en enda krock: Centerpartiet mot Vänsterpartiet. Centerpartiet har valt att gå vidare med Socialdemokraternas 135-punktspaket. Men de säger blankt nej till att Vänsterpartiet ska få sitta i regeringen. Vänsterpartiet å sin sida kräver egna ministerposter.'),
 ('dotGrid','Och matten i riksdagen är skoningslös. Det krävs inte en majoritet som röstar ja – det räcker att 175 ledamöter röstar nej för att fälla en statsminister. Högerblocket har 173 mandat. Så om Vänsterpartiet trycker på nej-knappen faller allt direkt.'),
 ('outro','Talmannen vill ha ett besked före jul. Frågan är bara: vem blinkar först – eller går Sverige mot extraval?'),
]
words=[]  # (scene, text)
for si,(k,t) in enumerate(SCENES):
    for w in t.split():
        if w in ('–',): 
            continue
        words.append((si,w))
norm=lambda w: ''.join(c for c in w.lower() if c.isalnum())
S='';span=[]
for si,w in words:
    n=norm(w); span.append((len(S),len(S)+len(n))); S+=n
sm=difflib.SequenceMatcher(None,S,A,autojunk=False)
anch=[(0,att[0])]
for b in sm.get_matching_blocks():
    for j in range(b.size):
        anch.append((b.a+j,att[b.b+j]))
anch.append((len(S),min(END,att[-1]+0.25)))
xs=[a for a,_ in anch];ys=[t for _,t in anch]
# make strictly monotonic
import numpy as np
def tat(i):
    k=bisect.bisect_right(xs,i)-1
    k=max(0,min(k,len(xs)-2))
    x0,x1=xs[k],xs[k+1]
    y0,y1=ys[k],ys[k+1]
    return y0 if x1==x0 else y0+(y1-y0)*(i-x0)/(x1-x0)
out=[]
for idx,((si,w),(a,b)) in enumerate(zip(words,span)):
    st=tat(a); en=tat(b)
    out.append({'scene':si,'text':w,'s':st,'e':en})
# monotonic + sensible ends
for i,w in enumerate(out):
    if i and w['s']<out[i-1]['s']: w['s']=out[i-1]['s']
for i,w in enumerate(out):
    nxt=out[i+1]['s'] if i+1<len(out) else END+0.2
    w['e']=max(w['s']+0.08,min(w['e'],nxt))
match=sum(b.size for b in sm.get_matching_blocks())/len(S)
print('char match ratio',round(match,3))
json.dump(out,open('script_words.json','w'),ensure_ascii=False)
for si,(k,_) in enumerate(SCENES):
    ws=[w for w in out if w['scene']==si]
    print(f"\n[{k}] first {ws[0]['s']:.2f}  last end {ws[-1]['e']:.2f}")
    print(' '.join(f"{w['text']}@{w['s']:.2f}" for w in ws))
