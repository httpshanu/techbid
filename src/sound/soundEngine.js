// Zero-dependency Web Audio API Sound Synthesizer for TECH BID
// Works 100% offline, ultra-low latency, no external mp3 loading issues

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(forceState) {
    if (forceState !== undefined) {
      this.enabled = forceState;
    } else {
      this.enabled = !this.enabled;
    }
    return this.enabled;
  }

  // Futuristic Whoosh Card Flip Sound
  playCardFlip() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';

    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.35);

    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(3000, now + 0.2);
    filter.frequency.exponentialRampToValueAtTime(500, now + 0.35);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Timer Tick
  playTimerTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Urgent Warning Beep (<= 5 seconds)
  playWarningBeep() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.setValueAtTime(1600, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Time's Up Buzzer
  playTimesUp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.5);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.55);
  }

  // Winning Bid Confirmation Gong / Energy Slam
  playBidWin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Chord: Root + Fifth + Octave
    [261.63, 392.00, 523.25, 659.25].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0.12, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.05);
      osc.stop(now + 1.25);
    });
  }

  // Grand Champion Fanfare
  playChampionFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, t: 0.0, d: 0.15 },
      { f: 659.25, t: 0.15, d: 0.15 },
      { f: 783.99, t: 0.3, d: 0.2 },
      { f: 1046.50, t: 0.55, d: 0.6 }
    ];

    const now = this.ctx.currentTime;
    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.15, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + note.d);
    });
  }

  // Epic Mythic / Legendary Shockwave Boom & Energy Surge
  playMythicShockwave() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Sub-bass earthquake thud
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(95, now);
    bassOsc.frequency.exponentialRampToValueAtTime(28, now + 0.8);
    bassGain.gain.setValueAtTime(0.4, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    bassOsc.connect(bassGain);
    bassGain.connect(this.ctx.destination);
    bassOsc.start(now);
    bassOsc.stop(now + 1.2);

    // 2. High energy plasma sweep
    const sweepOsc = this.ctx.createOscillator();
    const sweepGain = this.ctx.createGain();
    sweepOsc.type = 'sawtooth';
    sweepOsc.frequency.setValueAtTime(180, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.25);
    sweepOsc.frequency.exponentialRampToValueAtTime(320, now + 0.9);
    sweepGain.gain.setValueAtTime(0.12, now);
    sweepGain.gain.linearRampToValueAtTime(0.25, now + 0.15);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
    sweepOsc.connect(sweepGain);
    sweepGain.connect(this.ctx.destination);
    sweepOsc.start(now);
    sweepOsc.stop(now + 1.0);

    // 3. Shimmering celestial golden chime chord (Mythic revelation)
    [587.33, 880.00, 1174.66, 1760.00].forEach((freq, idx) => {
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq, now + 0.08 * idx);
      chimeGain.gain.setValueAtTime(0.08, now + 0.08 * idx);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      chimeOsc.start(now + 0.08 * idx);
      chimeOsc.stop(now + 1.6);
    });
  }
}

export const soundEngine = new SoundEngine();
