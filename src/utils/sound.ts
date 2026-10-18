/**
 * Web Audio API synthesized sound generator for Pomodoro timer and ambient soundscapes.
 * Pure native audio synthesis with crystal clarity, ambient focus soundscapes, and zero external file dependencies.
 */

class SoundController {
  private audioCtx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private activeAmbientType: 'binaural' | 'rain' | 'none' = 'none';

  private initCtx(): AudioContext | null {
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Focus Session Completion: Gentle harmonic crystal chime (528Hz Solfeggio / 1056Hz)
   */
  public playFocusCompleteChime() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      const freqs = [528, 660, 792, 1056];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.25 / (idx + 1), now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.8);
      });
    } catch (e) {
      console.warn('Audio synthesis not permitted by browser policy', e);
    }
  }

  /**
   * Break Completion: Dual bell chime (660Hz / 880Hz)
   */
  public playBreakCompleteBell() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      [660, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        gain.gain.setValueAtTime(0, now + idx * 0.18);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.18 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 1.5);
      });
    } catch (e) {
      console.warn('Audio synthesis not permitted', e);
    }
  }

  /**
   * Soft UI Tick / Start confirmation sound
   */
  public playStartTap() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      // ignore
    }
  }

  /**
   * Continuous Ambient Soundscape: 432Hz Binaural Focus Drone
   */
  public startAmbientBinaural(volume = 0.3) {
    this.stopAmbient();
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432, ctx.currentTime); // 432Hz Alpha ground

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(439, ctx.currentTime); // 7Hz Theta binaural beat difference

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.15, ctx.currentTime + 1.5);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      this.ambientSource = osc1;
      this.ambientGain = gain;
      this.activeAmbientType = 'binaural';
    } catch (e) {
      console.warn('Could not start binaural drone', e);
    }
  }

  /**
   * Continuous Ambient Soundscape: Lo-Fi Soft Rain Pink Noise
   */
  public startAmbientRain(volume = 0.3) {
    this.stopAmbient();
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      // Pink noise algorithm
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.2, ctx.currentTime + 1.5);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();

      this.ambientSource = whiteNoise;
      this.ambientGain = gain;
      this.activeAmbientType = 'rain';
    } catch (e) {
      console.warn('Could not start rain synthesizer', e);
    }
  }

  public setAmbientVolume(volume: number) {
    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume * 0.2)),
        this.audioCtx.currentTime
      );
    }
  }

  public stopAmbient() {
    if (this.ambientSource) {
      try {
        if ('stop' in this.ambientSource && typeof this.ambientSource.stop === 'function') {
          this.ambientSource.stop();
        }
        this.ambientSource.disconnect();
      } catch (e) {
        // ignore
      }
      this.ambientSource = null;
    }
    this.activeAmbientType = 'none';
  }

  public getActiveAmbientType(): 'binaural' | 'rain' | 'none' {
    return this.activeAmbientType;
  }
}

export const soundController = new SoundController();
