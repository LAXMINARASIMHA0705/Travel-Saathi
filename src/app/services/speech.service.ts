import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  readonly isListening = signal(false);
  readonly isSpeaking = signal(false);
  readonly isTalkBackEnabled = signal(true);

  private availableVoices: SpeechSynthesisVoice[] = [];
  private recognitionSuccess = new Subject<string>();
  readonly recognitionSuccess$ = this.recognitionSuccess.asObservable();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        this.availableVoices = window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  listenForVoiceQuery(): Promise<string> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve('');
        return;
      }
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        resolve('');
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;

        this.isListening.set(true);

        recognition.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          this.isListening.set(false);
          this.recognitionSuccess.next(transcript);
          resolve(transcript);
        };

        recognition.onerror = () => {
          this.isListening.set(false);
          resolve('');
        };
        recognition.onend = () => {
          this.isListening.set(false);
        };

        recognition.start();
      } catch {
        this.isListening.set(false);
        resolve('');
      }
    });
  }

  speakText(text: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!this.isTalkBackEnabled()) return;

    this.stopSpeech();

    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
    if (!cleanText) return;

    this.isSpeaking.set(true);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = this.availableVoices.length > 0 ? this.availableVoices : window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === 'en-in' && v.name.toLowerCase().includes('google')) ||
                           voices.find(v => v.lang.toLowerCase().replace('_', '-') === 'en-in') ||
                           voices.find(v => v.lang.toLowerCase().includes('india')) ||
                           voices.find(v => v.lang.toLowerCase().startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => this.isSpeaking.set(false);
    utterance.onerror = () => this.isSpeaking.set(false);

    window.speechSynthesis.speak(utterance);
  }

  stopSpeech(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking.set(false);
  }
}
