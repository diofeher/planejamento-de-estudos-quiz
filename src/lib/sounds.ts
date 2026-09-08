/**
 * Sound effects using Web Audio API.
 * All synthesized — no external files.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume: number = 0.12
) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

export function playCorrect() {
  playTone(523.25, 0.12, "sine", 0.1);
  setTimeout(() => playTone(783.99, 0.2, "sine", 0.1), 100);
}

export function playWrong() {
  playTone(233.08, 0.25, "sawtooth", 0.06);
  setTimeout(() => playTone(174.61, 0.3, "sawtooth", 0.06), 150);
}

export function playSelect() {
  playTone(880, 0.06, "sine", 0.08);
}

export function playComplete() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, "sine", 0.08), i * 100);
  });
}
