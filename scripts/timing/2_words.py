import json, re
o=json.load(open('out.json'))
toks,ts=o['tokens'],o['timestamps']
words=[];cur=None
for t,s in zip(toks,ts):
    if t.startswith('▁') or cur is None:
        if cur: words.append(cur)
        cur={'w':t.lstrip('▁'),'s':s,'e':s}
    else:
        cur['w']+=t
    cur['e']=s
if cur: words.append(cur)
json.dump(words,open('asr_words.json','w'),ensure_ascii=False)
for i,w in enumerate(words): print(i,round(w['s'],2),w['w'],end=' | ')
