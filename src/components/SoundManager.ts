// Web Audio API Retro Sound Effects Synthesizer

class SoundSFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playClick() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playPop() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playCorrect() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc1.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.50, now + 0.24);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      
      osc1.start();
      osc2.start(now + 0.24);
      
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playWrong() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.25);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.3);
      
      osc.start();
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playTick() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playKahootBeep() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 short blip
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major pentatonic climb
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        
        gain.gain.setValueAtTime(0.1, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.5);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.5);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playBell() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.51, now); // E6
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3); // C6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playBuzzer() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      
      osc1.frequency.setValueAtTime(130, now);
      osc2.frequency.setValueAtTime(138, now); // Dissonant low buzz

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playLetterKey() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440 + Math.random() * 200, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }
}

export const sound = new SoundSFX();

