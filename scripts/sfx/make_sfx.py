"""Synthesises the sound-effect library into public/sfx/*.wav (44.1 kHz mono, peak -1 dBFS).
Run:  python3 scripts/sfx/make_sfx.py      (needs numpy)
Design: dry, soft, short — UI-style cues for an editorial look. No music bed."""
import numpy as np, wave, os, sys
SR = 44100
rng = np.random.default_rng(7)
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'sfx')
os.makedirs(OUT, exist_ok=True)

def t(d): return np.arange(int(SR * d)) / SR
def env_exp(n, tau, attack=0.002):
    x = np.arange(n) / SR
    e = np.exp(-x / tau)
    a = np.minimum(1, x / attack)
    return e * a
def noise(n): return rng.standard_normal(n)
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = ((f >= lo) & (f <= hi)).astype(float)
    # soft edges
    k = max(1, int(len(f) * 0.002)); m = np.convolve(m, np.ones(k) / k, 'same')
    return np.fft.irfft(X * m, len(x))
def sine_sweep(d, f0, f1, curve='exp'):
    tt = t(d)
    f = f0 * (f1 / f0) ** (tt / d) if curve == 'exp' else f0 + (f1 - f0) * tt / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR)
def fade(x, a=0.003, b=0.01):
    n = len(x); fa = int(SR * a); fb = int(SR * b)
    x = x.copy(); x[:fa] *= np.linspace(0, 1, fa); x[-fb:] *= np.linspace(1, 0, fb); return x
def save(name, x):
    x = fade(x); x = x / (np.max(np.abs(x)) + 1e-9) * 0.891  # -1 dBFS
    with wave.open(os.path.join(OUT, name + '.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    print('  ', name, round(len(x) / SR, 2), 's')
def bell(f, d, tau, partials=((1, 1), (2.76, 0.25), (5.4, 0.08))):
    tt = t(d); x = np.zeros_like(tt)
    for r, a in partials: x += a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt / (tau / (0.6 + 0.4 * r)))
    x *= np.minimum(1, (d - tt) / 0.12)  # taper to avoid a click at the cut
    return x
def place(buf, x, at):
    i = int(at * SR); buf[i:i + len(x)] += x[:len(buf) - i]
def click(f=2200, d=0.03):
    n = int(SR * d)
    return (band(noise(n), 3000, 12000) * 0.5 + np.sin(2 * np.pi * f * t(d)) * 0.5) * env_exp(n, d / 5, 0.0005)

# ---------- one-shots ----------
n = int(SR * 0.7); tt = t(0.7)
w = band(noise(n), 300, 5000); sweep = np.sin(np.pi * tt / 0.7) ** 2
# moving lowpass feel: crossfade between two bands
w = band(noise(n), 250, 1200) * (1 - tt / 0.7) + band(noise(n), 1500, 6000) * (tt / 0.7)
save('whoosh', w * sweep)

n = int(SR * 0.45); tt = t(0.45)
save('swish', band(noise(n), 2500, 9000) * np.sin(np.pi * tt / 0.45) ** 1.5)

save('pop', np.pad(sine_sweep(0.14, 560, 250) * env_exp(int(SR * 0.14), 0.045, 0.001), (0, 0)) + np.pad(click(2500, 0.012) * 0.25, (0, int(SR * 0.14) - int(SR * 0.012))))
save('pop_hi', np.pad(sine_sweep(0.12, 960, 520) * env_exp(int(SR * 0.12), 0.035, 0.001), (0, 0)) + np.pad(click(3200, 0.012) * 0.2, (0, int(SR * 0.12) - int(SR * 0.012))))
save('tick', click(2400, 0.03))
save('tick_soft', click(1500, 0.03) * 0.6)

# thud + stamp (impact)
d = 0.55; tt = t(d)
body = sine_sweep(d, 120, 42) * env_exp(len(tt), 0.16, 0.001)
sub = np.sin(2 * np.pi * 55 * tt) * env_exp(len(tt), 0.2, 0.003) * 0.5
thump = band(noise(len(tt)), 60, 400) * env_exp(len(tt), 0.03, 0.0005) * 0.7
save('thud', body + sub + thump)
d = 0.6; tt = t(d); n = len(tt)
imp = band(noise(n), 700, 4500) * env_exp(n, 0.035, 0.0003) * 0.9
body = sine_sweep(d, 150, 48) * env_exp(n, 0.14, 0.001)
tail = band(noise(n), 150, 900) * env_exp(n, 0.12, 0.002) * 0.25
save('stamp', imp + body * 1.1 + tail)

# chime (check) / ping (flag) / err / warn
d = 0.8; buf = np.zeros(int(SR * d))
place(buf, bell(1319, 0.7, 0.30), 0.0); place(buf, bell(1760, 0.6, 0.28), 0.09)
save('chime', buf)
save('ping', bell(1568, 0.9, 0.38))
d = 0.34; buf = np.zeros(int(SR * d))
for k, f in enumerate((233, 196)):
    seg = (np.sin(2 * np.pi * f * t(0.11)) + 0.35 * np.sign(np.sin(2 * np.pi * f * t(0.11))) * 0.3) * env_exp(int(SR * 0.11), 0.05, 0.002)
    place(buf, seg, k * 0.13)
save('err', buf)
d = 0.6; buf = np.zeros(int(SR * d))
vib = 1 + 0.01 * np.sin(2 * np.pi * 6 * t(0.5))
for k, f in enumerate((660, 495)):
    seg = np.sin(2 * np.pi * f * t(0.25) * 1) * env_exp(int(SR * 0.25), 0.11, 0.004)
    place(buf, seg, k * 0.18)
save('warn', buf)

# unlock (chain box opens): soft click + two rising bell notes
buf = np.zeros(int(SR * 0.55))
place(buf, click(2600, 0.012) * 0.45, 0.0)
place(buf, bell(1175, 0.42, 0.20), 0.02)
place(buf, bell(1568, 0.40, 0.22), 0.13)
save('unlock', buf)

# lock (denied / still locked): dull low thunk + tiny rattle
d = 0.4; buf = np.zeros(int(SR * d)); tt = t(0.25)
thunk = sine_sweep(0.25, 120, 70) * env_exp(len(tt), 0.07, 0.002) + band(noise(len(tt)), 150, 700) * env_exp(len(tt), 0.02, 0.0005) * 0.6
place(buf, thunk, 0.0)
for k, at in enumerate((0.1, 0.145, 0.185)):
    place(buf, click(1800 + 300 * k, 0.015) * (0.28 - 0.06 * k), at)
save('lock', buf)

# flip (comparison card turns): fast airy swish + short tick
d = 0.3; buf = np.zeros(int(SR * d)); n = int(SR * 0.22); tt = t(0.22)
place(buf, band(noise(n), 2500, 9500) * np.sin(np.pi * tt / 0.22) ** 1.5 * 0.8, 0.0)
place(buf, click(2200, 0.02) * 0.5, 0.2)
save('flip', buf)

# ---------- sequences (cut to length in Remotion) ----------
def ticks(duration, f_start, f_end, pitch0, pitch1, ease=1.0):
    """tick train; rate goes f_start→f_end (Hz) across duration, pitch pitch0→pitch1"""
    buf = np.zeros(int(SR * (duration + 0.1))); tcur = 0.0
    while tcur < duration:
        p = tcur / duration
        rate = f_start + (f_end - f_start) * p ** ease
        pitch = pitch0 + (pitch1 - pitch0) * p
        c = click(pitch, 0.03) * (0.5 + 0.5 * (1 - p * 0.3))
        place(buf, c, tcur); tcur += 1 / rate
    return buf
save('count', ticks(1.2, 70, 12, 1600, 2600, 1.4))            # fast → slow count-up (0→70)
save('count_short', ticks(1.4, 45, 14, 1300, 2200, 1.2))      # seat counter
save('fill_blue', ticks(3.0, 14, 38, 900, 2100, 1.0) * 1.0)    # seats lighting, rising
save('fill_red', ticks(0.9, 30, 70, 1500, 3200, 0.8))          # fast red burst

# riser (builds tension)
d = 1.4; tt = t(d); n = len(tt)
r = band(noise(n), 800, 7000) * (tt / d) ** 2 * 0.6 + sine_sweep(d, 180, 1100) * (tt / d) ** 3 * 0.5
save('riser', r)
print('done ->', os.path.abspath(OUT))
