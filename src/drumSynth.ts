export type DrumSound = 'kick' | 'snare' | 'hihat' | 'hihatOpen';

export function playDrumSound(
  audioCtx: AudioContext,
  sound: DrumSound,
  time: number,
  volume = 0.7
) {
  switch (sound) {
    case 'kick':
      playKick(audioCtx, time, volume);
      break;
    case 'snare':
      playSnare(audioCtx, time, volume);
      break;
    case 'hihat':
      playHiHat(audioCtx, time, volume, false);
      break;
    case 'hihatOpen':
      playHiHat(audioCtx, time, volume, true);
      break;
  }
}

function playKick(audioCtx: AudioContext, time: number, volume: number) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);

  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

  osc.connect(gain).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + 0.3);

  // Add a click transient for attack
  const clickOsc = audioCtx.createOscillator();
  const clickGain = audioCtx.createGain();
  clickOsc.type = 'sine';
  clickOsc.frequency.value = 80;
  clickGain.gain.setValueAtTime(volume * 0.5, time);
  clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
  clickOsc.connect(clickGain).connect(audioCtx.destination);
  clickOsc.start(time);
  clickOsc.stop(time + 0.02);
}

function playSnare(audioCtx: AudioContext, time: number, volume: number) {
  // Noise burst for the snare body
  const bufferSize = audioCtx.sampleRate * 0.15;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1000;

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.6, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

  noise.connect(noiseFilter).connect(noiseGain).connect(audioCtx.destination);
  noise.start(time);
  noise.stop(time + 0.15);

  // Low sine for body/thump
  const osc = audioCtx.createOscillator();
  const oscGain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180, time);
  osc.frequency.exponentialRampToValueAtTime(100, time + 0.05);
  oscGain.gain.setValueAtTime(volume * 0.5, time);
  oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
  osc.connect(oscGain).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + 0.08);
}

function playHiHat(audioCtx: AudioContext, time: number, volume: number, open: boolean) {
  const bufferSize = audioCtx.sampleRate * (open ? 0.3 : 0.05);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const highpass = audioCtx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 7000;

  const bandpass = audioCtx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 10000;

  const gain = audioCtx.createGain();
  const decay = open ? 0.25 : 0.04;
  gain.gain.setValueAtTime(volume * 0.4, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

  noise.connect(highpass).connect(bandpass).connect(gain).connect(audioCtx.destination);
  noise.start(time);
  noise.stop(time + (open ? 0.3 : 0.05));
}
