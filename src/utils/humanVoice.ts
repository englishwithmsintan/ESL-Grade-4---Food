// Human Voice Engine for Grade 4 ESL Unit 3
// Provides natural, human-quality audio for Mock Test listening, vocabulary, stories, and pronunciation

export function isAbortError(err: any): boolean {
  if (!err) return false;
  const name = err.name || '';
  const message = String(err.message || err);
  return (
    name === 'AbortError' ||
    message.includes('interrupted by a call to pause') ||
    message.includes('play() request was interrupted')
  );
}

class HumanVoiceEngine {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private bestVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  private initVoices() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // Score voices based on human/natural audio quality
    const scored = voices
      .filter(v => v.lang.startsWith('en'))
      .map(v => {
        let score = 0;
        const name = v.name.toLowerCase();
        // Online / Natural neural voices have the highest fidelity
        if (name.includes('natural') || name.includes('neural') || name.includes('online')) score += 100;
        if (name.includes('google') && (v.lang === 'en-US' || v.lang === 'en-GB')) score += 90;
        if (name.includes('samantha') || name.includes('karen') || name.includes('daniel') || name.includes('serena') || name.includes('moira')) score += 70;
        if (name.includes('microsoft') || name.includes('apple')) score += 50;
        if (v.lang === 'en-US' || v.lang === 'en-GB') score += 30;
        if (v.default) score += 10;
        // Penalize robotic sounding synthesizers
        if (name.includes('espeak') || name.includes('compact') || name.includes('zira') || name.includes('david')) score -= 40;
        return { voice: v, score };
      })
      .sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      this.bestVoice = scored[0].voice;
    }
  }

  public stop() {
    if (this.currentAudio) {
      const audio = this.currentAudio;
      (audio as any).__isCancelled = true;
      this.currentAudio = null;
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_) {
        // Safe ignore
      }
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {
        // Safe ignore
      }
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  public isBusy(): boolean {
    return this.isSpeaking;
  }

  /**
   * Check if text matches pre-recorded studio recordings
   */
  private getStudioAudioUrl(text: string): string | null {
    const t = text.toLowerCase();
    if (t.includes('homes around the world') && (t.includes('mongolia') || t.includes('stilt house') || t.includes('yurt'))) {
      return '/audio/listening.mp3';
    }
    if (t.includes('eco-house on the hill') || (t.includes('baggins') && t.includes('solar panels') && t.includes('rainwater'))) {
      return '/audio/ecohouse.mp3';
    }
    if (t.includes('colosseum') && (t.includes('rome') || t.includes('gladiators') || t.includes('ancient'))) {
      return '/audio/colosseum.mp3';
    }
    if (t.includes('my dream home is a cosy eco-house') || (t.includes('dream home') && t.includes('solar panels to make clean electricity'))) {
      return '/audio/model_essay.mp3';
    }
    if (t.includes('in a hole in the ground there lived a hobbit') || (t.includes('hobbit') && t.includes('porthole') && t.includes('brass knob'))) {
      return '/audio/hobbit.mp3';
    }
    return null;
  }

  /**
   * Speaks text using the most human-sounding audio channel available:
   * 1. Pre-recorded studio MP3 (for key stories and listening test)
   * 2. Natural Google Human Speech streaming (for dynamic vocabulary, sentences, and exam questions)
   * 3. Enhanced Web Speech API with neural voice scoring (offline fallback)
   */
  public async speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      rate?: number;
      preferSynthesis?: boolean;
    }
  ): Promise<void> {
    try {
      this.stop();
      if (!text || !text.trim()) return;

      const trimmed = text.trim();
      this.isSpeaking = true;

      // Check for studio recording first
      const studioUrl = this.getStudioAudioUrl(trimmed);
      if (studioUrl) {
        await this.playAudioUrl(studioUrl, options);
        return;
      }

      // If client requested Web Speech API or text is overly long
      if (options?.preferSynthesis || trimmed.length > 250) {
        await this.speakWithBestWebVoice(trimmed, options);
        return;
      }

      // Use Google Natural Human Speech streaming URL for high-quality human speech
      const cleanForTts = trimmed
        .replace(/[^\w\s.,!?'\-/]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanForTts.length > 0 && cleanForTts.length <= 200) {
        const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanForTts)}&tl=en&client=tw-ob`;
        try {
          await this.playAudioUrl(googleTtsUrl, options);
          return;
        } catch (err) {
          // If intentionally stopped by user, do not fallback
          if (isAbortError(err) || !this.isSpeaking) {
            return;
          }
          console.warn('Google Human TTS stream fallback to browser voice:', err);
        }
      }

      if (!this.isSpeaking) return;

      // Fallback to humanized browser synthesis
      await this.speakWithBestWebVoice(trimmed, options);
    } catch (err) {
      if (!isAbortError(err)) {
        console.warn('Speech playback failed:', err);
      }
      this.isSpeaking = false;
      options?.onEnd?.();
    }
  }

  /**
   * Plays an audio URL with callbacks and error recovery
   */
  public playAudioUrl(
    url: string,
    options?: { onStart?: () => void; onEnd?: () => void; rate?: number }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio(url);
        this.currentAudio = audio;
        (audio as any).__isCancelled = false;

        if (options?.rate) {
          audio.playbackRate = options.rate;
        }

        let hasFinished = false;
        const complete = (cleanly: boolean, err?: any) => {
          if (hasFinished) return;
          hasFinished = true;
          this.isSpeaking = false;
          if (this.currentAudio === audio) {
            this.currentAudio = null;
          }
          options?.onEnd?.();
          if (cleanly) {
            resolve();
          } else {
            reject(err);
          }
        };

        audio.onplay = () => {
          if ((audio as any).__isCancelled) return;
          this.isSpeaking = true;
          options?.onStart?.();
        };

        audio.onended = () => {
          complete(true);
        };

        audio.onerror = (e) => {
          if ((audio as any).__isCancelled) {
            complete(true);
            return;
          }
          complete(false, e);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            // When play() is interrupted by pause() or user stop(), handle gracefully without unhandled rejections
            if ((audio as any).__isCancelled || isAbortError(err)) {
              complete(true);
              return;
            }
            complete(false, err);
          });
        }
      } catch (err) {
        if (isAbortError(err)) {
          this.isSpeaking = false;
          this.currentAudio = null;
          options?.onEnd?.();
          resolve();
        } else {
          this.isSpeaking = false;
          this.currentAudio = null;
          options?.onEnd?.();
          reject(err);
        }
      }
    });
  }

  /**
   * SpeechSynthesis with enhanced natural voice selection and teacher pacing
   */
  private speakWithBestWebVoice(
    text: string,
    options?: { onStart?: () => void; onEnd?: () => void; rate?: number }
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        this.isSpeaking = false;
        options?.onEnd?.();
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Ensure voices are initialized
      if (!this.bestVoice) {
        this.initVoices();
      }
      if (this.bestVoice) {
        utterance.voice = this.bestVoice;
      }

      // Natural, warm pacing for Grade 4 ESL students
      utterance.rate = options?.rate || 0.90;
      utterance.pitch = 1.02; // Warm inflection, avoids monotone robotic drone
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        this.isSpeaking = true;
        options?.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        options?.onEnd?.();
        resolve();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        options?.onEnd?.();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }
}

export const humanVoice = new HumanVoiceEngine();
