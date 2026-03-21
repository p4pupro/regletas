let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine') {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration);
  } catch {
    // Audio may be blocked, just skip
  }
}

export function playSuccess() {
  playTone(523, 0.12);
  setTimeout(() => playTone(659, 0.12), 100);
  setTimeout(() => playTone(784, 0.25), 200);
}

export function playError() {
  playTone(200, 0.3, 'triangle');
}

export function playTap() {
  playTone(440, 0.06);
}

export function playDrop() {
  playTone(330, 0.1, 'triangle');
}
