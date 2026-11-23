import sherpa_onnx, wave, numpy as np, json, sys
d="/tmp/asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/"
r=sherpa_onnx.OfflineRecognizer.from_transducer(encoder=d+"encoder.int8.onnx",decoder=d+"decoder.int8.onnx",joiner=d+"joiner.int8.onnx",tokens=d+"tokens.txt",num_threads=4,model_type="nemo_transducer")
w=wave.open("/tmp/asr/voice16k.wav"); sr=w.getframerate()
x=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
s=r.create_stream(); s.accept_waveform(sr,x); r.decode_stream(s)
res=s.result
print(res.text)
json.dump({"text":res.text,"tokens":list(res.tokens),"timestamps":list(res.timestamps)},open("/tmp/asr/out.json","w"),ensure_ascii=False)
print(len(res.tokens),len(res.timestamps))
