// Simple synthesizer using Web Audio API
let audioContext: AudioContext | null = null;

const getContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

const createOscillator = (
  type: OscillatorType,
  freq: number,
  startTime: number,
  duration: number,
  vol: number = 0.1
) => {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  // Envelope to avoid clicking
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const playSound = {
  // Soft tick for selecting cells
  select: () => {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    createOscillator('sine', 800, ctx.currentTime, 0.05, 0.05);
  },

  // Clear blip for entering numbers
  input: () => {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    createOscillator('sine', 600, ctx.currentTime, 0.1, 0.1);
    createOscillator('triangle', 1200, ctx.currentTime, 0.1, 0.05);
  },

  // Lower tone for deleting
  delete: () => {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    createOscillator('sawtooth', 200, ctx.currentTime, 0.15, 0.05);
  },

  // Sliding tone for restart
  restart: () => {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  },

  // Victory jingle
  win: () => {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    
    // C Major Arpeggio: C5, E5, G5, C6
    createOscillator('sine', 523.25, now, 0.2, 0.1);       // C5
    createOscillator('sine', 659.25, now + 0.1, 0.2, 0.1); // E5
    createOscillator('sine', 783.99, now + 0.2, 0.2, 0.1); // G5
    createOscillator('square', 1046.50, now + 0.3, 0.4, 0.05); // C6 - added sparkle
  }
};