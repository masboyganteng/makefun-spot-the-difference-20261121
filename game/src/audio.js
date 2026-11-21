// Synthesised sound: every effect is made with WebAudio oscillators, no sound files.
// The audio context starts on the first sound after a user gesture, as browsers require.

export function createAudio() {
  let ac = null;
  let muted = false;

  function ensure() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }

  function tone(freq, start, dur, type, gain, slideTo) {
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
    amp.gain.setValueAtTime(0.0001, start);
    amp.gain.exponentialRampToValueAtTime(gain, start + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(amp).connect(ac.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  const sounds = {
    find(t, combo = 1) {
      const lift = 1 + (combo - 1) * 0.125;
      tone(784 * lift, t, 0.16, 'sine', 0.22);
      tone(1175 * lift, t + 0.07, 0.32, 'triangle', 0.16);
      tone(1568 * lift, t + 0.14, 0.38, 'sine', 0.08);
    },
    miss(t) {
      tone(190, t, 0.22, 'square', 0.07, 95);
      tone(140, t + 0.05, 0.22, 'sawtooth', 0.04, 80);
    },
    hint(t) {
      tone(420, t, 0.45, 'sine', 0.12, 1260);
      tone(630, t + 0.1, 0.4, 'triangle', 0.06, 1500);
    },
    clear(t) {
      [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, t + i * 0.09, 0.5, 'triangle', 0.14));
    },
    timeup(t) {
      [440, 370, 311, 233].forEach((f, i) => tone(f, t + i * 0.14, 0.32, 'square', 0.05));
    },
    tick(t) {
      tone(1800, t, 0.05, 'square', 0.03);
    },
    select(t) {
      tone(660, t, 0.08, 'triangle', 0.1, 880);
    },
  };

  return {
    unlock: ensure,
    play(name, arg) {
      if (muted || !sounds[name]) return;
      if (!ensure()) return;
      sounds[name](ac.currentTime + 0.005, arg);
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    get muted() {
      return muted;
    },
  };
}
