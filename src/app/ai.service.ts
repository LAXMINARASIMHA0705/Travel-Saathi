import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Subject } from 'rxjs';
import { ChatMessage, AiPersona } from './models';
interface ParsedAiResponse extends Pick<ChatMessage, 'thinkingSteps' | 'sources' | 'followUps' | 'actionType' | 'actionData'> {
  text: string;
}
@Injectable({
  providedIn: 'root',
})
export class AiService {
  readonly isAiThinking = signal(false);
  readonly isAiListening = signal(false);
  readonly isTalkBackEnabled = signal(true);
  readonly isAiSpeaking = signal(false);

  toggleVoiceTalkback(): void {
    this.isTalkBackEnabled.update(enabled => !enabled);
    if (!this.isTalkBackEnabled() && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isAiSpeaking.set(false);
    }
  }
  readonly isContinuousVoiceMode = signal(false);
  readonly aiPersona = signal<AiPersona>('advisor');
  readonly chatMessages = signal<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Namaskaram. I am Maya, your expert travel advisor.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  readonly geminiApiKey = signal<string>(
    typeof localStorage !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : ''
  );
  readonly isGeminiActive = computed(() => this.geminiApiKey().trim().length > 10);

  private activeAiAudio: HTMLAudioElement | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private conversationMemory: string[] = [];
  private readonly tripProfileStorageKey = 'maya-trip-profile';
  readonly tripProfile = signal<any>(this.loadTripProfile());

  private recognitionSuccess = new Subject<void>();
  readonly recognitionSuccess$ = this.recognitionSuccess.asObservable();

  private http = inject(HttpClient);

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        this.availableVoices = window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  private loadTripProfile(): any {
    if (typeof window !== 'undefined') {
      try {
        const storedProfile = window.localStorage.getItem(this.tripProfileStorageKey);
        if (storedProfile) {
          return JSON.parse(storedProfile);
        }
      } catch {
      }
    }
    return {
      destination: '',
      days: 0,
      travelers: 0,
      style: 'comfort' as 'budget' | 'comfort' | 'luxury',
      preferences: [] as string[],
    };
  }

  setGeminiApiKey(key: string): void {
    const cleanKey = key.trim();
    this.geminiApiKey.set(cleanKey);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('gemini_api_key', cleanKey);
    }
  }

  setPersona(persona: AiPersona): void {
    this.aiPersona.set(persona);
    const announcement = `Okay, I will now act as your ${persona} specialist.`;
    this.chatMessages.update((msgs) => [...msgs, { sender: 'ai', text: announcement, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    this.speakText(announcement);
  }

  toggleContinuousMode(): void {
    this.isContinuousVoiceMode.update((value) => !value);
  }

  async sendChatMessage(queryText: string, tripContext?: string): Promise<void> {
    if (!queryText?.trim()) return;

    this.isAiThinking.set(true);
    this.chatMessages.update((msgs) => [...msgs, { sender: 'user', text: queryText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);

    this.chatMessages.update((msgs) => [
      ...msgs,
      {
        sender: 'ai',
        text: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    const aiMessageIndex = this.chatMessages().length - 1;

    this.updateTripProfile(queryText);

    let response: ParsedAiResponse = this.createProfessionalAdvisorFallback(queryText, tripContext); 
    const shouldUseGemini = this.isGeminiActive() && !this.isTestEnvironment();
    if (shouldUseGemini) {
      try {
        response = {
          ...response,
          text: await this.callGeminiApi(queryText, tripContext),
        };
      } catch (error) {
        console.error('Error calling Gemini API:', error);
        response = {
          ...response,
          text: `I apologize, but I encountered an error connecting to Gemini. Please check your API key and network connection.`,
        };
      }
    }

    this.conversationMemory = [...this.conversationMemory, queryText].slice(-6);

    this.chatMessages.update((msgs) => {
      const updatedMsgs = [...msgs];
      if (updatedMsgs[aiMessageIndex]) {
        updatedMsgs[aiMessageIndex] = {
          ...updatedMsgs[aiMessageIndex], 
          text: '', 
          thinkingSteps: response.thinkingSteps,
          sources: response.sources,
          followUps: response.followUps, 
          actionType: response.actionType,
          actionData: response.actionData,
        };
      }
      return updatedMsgs;
    });

    await this.streamTextToMessage(response.text, aiMessageIndex);

    this.isAiThinking.set(false);
    this.speakText(response.text);
  }

  private streamTextToMessage(text: string, messageIndex: number): Promise<void> {
    return new Promise(resolve => {
      if (this.isTestEnvironment()) { 
        this.chatMessages.update(msgs => {
          const updatedMsgs = [...msgs];
          if (updatedMsgs[messageIndex]) {
            updatedMsgs[messageIndex] = { ...updatedMsgs[messageIndex], text };
          }
          return updatedMsgs;
        });
        resolve();
        return;
      }

      const words = text.split(/(\s+)/);
      let i = 0;
      const intervalId = setInterval(() => {
        if (i >= words.length) {
          clearInterval(intervalId);
          resolve();
          return;
        }
        this.chatMessages.update(msgs => {
          const updatedMsgs = [...msgs];
          if (updatedMsgs[messageIndex]) {
            updatedMsgs[messageIndex] = { ...updatedMsgs[messageIndex], text: updatedMsgs[messageIndex].text + words[i] };
          }
          return updatedMsgs;
        });
        i++;
      }, 50);
    });
  }

  formatMarkdownText(text: string): string {
    if (!text) return '';
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br/>');
    return formatted;
  }

  private async callGeminiApi(query: string, tripContext?: string): Promise<string> {
    const apiKey = this.geminiApiKey();
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const prompt = `You are Maya, an expert travel advisor. Provide a professional, context-aware recommendation or answer based on the user's query and the provided trip details.
    
    Trip Context: ${tripContext || 'No specific trip context provided.'}
    User Query: ${query}
    
    Please provide a concise and helpful response.`;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    try {
      const response = await firstValueFrom(this.http.post<any>(apiUrl, requestBody));
      if (response && response.candidates && response.candidates.length > 0) {
        return response.candidates[0].content.parts[0].text;
      } else {
        return 'I could not generate a response from Gemini. Please try again.';
      }
    } catch (error: any) {
      if (error instanceof HttpErrorResponse) {
        console.error('HTTP Error:', error.message);
        if (error.status === 400) {
          return `Gemini API returned an error (Status 400). This might be due to an invalid API key or malformed request. Details: ${error.error?.error?.message || error.message}`;
        } else if (error.status === 403) {
          return `Gemini API returned an error (Status 403). This usually means your API key is not authorized for this operation.`;
        } else if (error.status === 500) {
          return `Gemini API returned a server error (Status 500). The service might be temporarily unavailable.`;
        }
      }
      throw error; 
    }
  }

  private updateTripProfile(query: string): void {
    this.tripProfile.update(profile => {
      const newProfile = { ...profile, preferences: [...profile.preferences] };
      const text = query.toLowerCase();

      if (text.includes('goa') || text.includes('munnar') || text.includes('agra') || text.includes('shimla') || text.includes('kerala')) {
        newProfile.destination = text.includes('goa') ? 'Goa' : text.includes('munnar') ? 'Munnar' : text.includes('agra') ? 'Agra' : text.includes('shimla') ? 'Shimla' : 'Kerala';
      }

      if (text.includes('3 day') || text.includes('3-day')) {
        newProfile.days = 3;
      } else if (text.includes('2 day') || text.includes('2-day')) {
        newProfile.days = 2;
      } else if (/\b(\d+)\s+day/.test(text)) {
        const match = text.match(/\b(\d+)\s+day/);
        if (match) newProfile.days = Number(match[1]);
      }

      if (text.includes('2 people') || text.includes('for 2')) {
        newProfile.travelers = 2;
      } else if (text.includes('3 people') || text.includes('for 3')) {
        newProfile.travelers = 3;
      }

      if (text.includes('budget') || text.includes('cheaper')) {
        newProfile.style = 'budget';
        newProfile.preferences.push('budget');
      }

      if (text.includes('food') || text.includes('restaurant') || text.includes('biryani') || text.includes('dosa')) {
        newProfile.preferences.push('food');
      }

      newProfile.preferences = [...new Set(newProfile.preferences)].slice(-4);

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(this.tripProfileStorageKey, JSON.stringify(newProfile));
        } catch {
        }
      }
      return newProfile;
    });
  }

  listenForVoiceQuery(tripContext: string): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.sendChatMessage('Taj Mahal timings', tripContext);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;

      this.setVoiceState('listening');

      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        this.recognitionSuccess.next(); 
        this.sendChatMessage(transcript, tripContext);
      };

      recognition.onerror = () => this.setVoiceState('idle');
      recognition.onend = () => this.setVoiceState('idle');

      recognition.start();
    } catch {
      this.setVoiceState('idle');
    }
  }

  private createProfessionalAdvisorFallback(query: string, context?: string): ParsedAiResponse {
    const intent = query.toLowerCase();
    const currentProfile = this.tripProfile();
    const activeTravelStyle = currentProfile.style === 'budget' || currentProfile.style === 'luxury' ? currentProfile.style : this.aiPersona();
    const personaLine = activeTravelStyle === 'foodie'
      ? 'I am highlighting the best food stops and local bites first.'
      : activeTravelStyle === 'budget'
        ? 'I am keeping this practical and cost-conscious with a budget-first plan.'
        : activeTravelStyle === 'translator'
          ? 'I am framing this as a simple phrase and local communication help.'
          : activeTravelStyle === 'luxury'
            ? 'I am shaping this as a polished luxury-style recommendation.'
            : 'I am shaping this as a polished travel recommendation.';

    const memoryHint = this.conversationMemory.length > 0 ? `You previously asked about: ${this.conversationMemory.slice(-2).join(' • ')}` : '';
    const profileHint = currentProfile.destination || currentProfile.days || currentProfile.travelers
      ? `Trip profile: ${currentProfile.destination || 'a destination'} • ${currentProfile.days ? `${currentProfile.days} days` : 'flexible length'} • ${currentProfile.travelers ? `${currentProfile.travelers} traveler(s)` : 'flexible group size'} • ${currentProfile.style} style • ${currentProfile.preferences.join(', ') || 'balanced plan'}`
      : '';
    const memoryAndProfile = [memoryHint, profileHint].filter(Boolean).join('\n');

    if (intent.includes('hello') || intent.includes('hi') || intent.includes('hey')) {
      return {
        text: `Hello! I am Maya, your travel companion, and I am here to help with your next trip.

${personaLine}
${context || ''}

I can help with itineraries, food picks, local phrases, and smart travel planning.

${memoryAndProfile}`,
        thinkingSteps: ['I recognized a greeting and opened with a warm travel-focused welcome.', 'I am ready to help with itinerary planning, food, or local guidance.'],
        sources: [{ name: 'Travel Concierge', icon: '🧭' }],
        followUps: ['Plan a 3-day getaway', 'Recommend local food spots', 'Help with transport options'],
      };
    }

    if (intent.includes('food') || intent.includes('eat') || intent.includes('restaurant') || intent.includes('biryani') || intent.includes('dosa')) {
      const budgetAdjustment = intent.includes('cheaper') || intent.includes('budget') ? 'I would favor lower-cost options and local favorites that still feel special.' : '';
      return {
        text: `Here is a food-first recommendation for "${query}":
• Start with a local specialty that is easy to find and well reviewed.
• Pair the meal with a nearby café or market for a relaxed afternoon.
• Keep one backup choice in case the first stop is crowded.
${budgetAdjustment ? `\n${budgetAdjustment}` : ''}

${personaLine}
${context || ''}

${memoryAndProfile}`,
        thinkingSteps: ['I recognized a food-focused request.', 'I am prioritizing an easy, memorable local dining experience.'],
        sources: [{ name: 'Local Dining Tips', icon: '🍲' }],
        followUps: ['Show me budget-friendly food options', 'Suggest nearby cafés', 'Plan a full food itinerary'],
        actionType: 'food',
        actionData: {
          id: 'ai-food-1',
          name: 'Signature Local Thali',
          price: 320,
          rating: 4.8,
          prepTime: '25 mins',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
        },
      };
    }

    if (intent.includes('translate') || intent.includes('phrase') || intent.includes('language') || intent.includes('speak')) {
      return {
        text: `Here is a practical phrase guide for "${query}":
• "Where is the station?" — a very useful first question.
• "How much is this?" — helpful for markets and taxis.
• "Can you help me with directions?" — ideal for travel emergencies.

${personaLine}
${context || ''}

${memoryAndProfile}`,
        thinkingSteps: ['I recognized a translation or phrase request.', 'I am focusing on practical, everyday travel language.'],
        sources: [{ name: 'Phrasebook', icon: '🗣️' }],
        followUps: ['Translate Hindi phrases', 'Translate Telugu phrases', 'Help me ask for directions'],
        actionType: 'phrase',
        actionData: [
          { label: 'Where is the station?', local: 'स्टेशन कहाँ है?' },
          { label: 'How much is this?', local: 'यह कितने का है?' },
        ],
      };
    }

    if (intent.includes('goa') || intent.includes('itinerary') || intent.includes('2 day') || intent.includes('3 day') || intent.includes('day 1') || intent.includes('day 2')) {
      const budgetMode = intent.includes('budget') || intent.includes('cheaper') || currentProfile.style === 'budget' ? 'Budget-friendly' : 'Balanced';
      const transportChoices = intent.includes('train') || intent.includes('car') || intent.includes('flight') || intent.includes('bus')
        ? 'I also matched the plan to the transport style you mentioned.'
        : 'I included a few route styles so you can pick between train, bus, car, or flight depending on your comfort and budget.';

      const bestFit = budgetMode === 'Budget-friendly' ? 'Best fit: a low-cost plan with local food and public transport.' : 'Best fit: a balanced plan with comfort, food, and flexible movement.';
      const optionPrompts = [
        { label: 'Budget', prompt: 'Make this more budget-friendly' },
        { label: 'Train', prompt: 'Suggest a train-friendly version' },
        { label: 'Car', prompt: 'Suggest a car-friendly version' },
      ];

      return {
        text: `Here is a polished itinerary plan for "${query}":
• Option 1 — ${budgetMode} pace: keep mornings for major sights, use evenings for food and downtime, and choose local eateries over premium restaurants.
• Option 2 — Comfort pace: add a slower breakfast, one extra cultural stop, and a nicer dinner without overloading the day.
• Option 3 — Adventure pace: prioritize early starts, scenic viewpoints, and flexible transport so you can swap between train, bus, car, or flight depending on availability.

${transportChoices}

${bestFit}

${personaLine}
${context || ''}

${memoryAndProfile}`,
        thinkingSteps: ['I recognized a destination-planning request.', 'I am structuring the answer with multiple travel options based on budget and transport.'],
        sources: [{ name: 'Trip Planner', icon: '🗺️' }],
        followUps: ['Turn this into a budget version', 'Make it more family-friendly', 'Add food stops', 'Suggest train-friendly options', 'Suggest car-friendly options'],
        actionType: 'itinerary',
        actionData: {
          title: 'Flexible Travel Plan',
          bestFit,
          options: optionPrompts,
          days: [
            { day: 'Option A', title: 'Budget & Local', details: 'Use public transport, local food, and a lighter pace.' },
            { day: 'Option B', title: 'Comfort & Easy', details: 'Choose a car or cab, a slower pace, and a nicer dinner.' },
            { day: 'Option C', title: 'Adventure & Flexible', details: 'Mix train, bus, or flight based on availability and energy.' },
          ],
        },
      };
    }

    return {
      text: `Here is a practical advisor-style response for "${query}":
• Start with the highest-value experience first.
• Keep early morning hours for major sights and leave the afternoon flexible for traffic, weather, or queues.
• For your current plan, I would prioritize comfort, timing, and realistic backup options.

${personaLine}
${context || ''}

${memoryAndProfile}`,
      thinkingSteps: ['I recognized a general travel request.', 'I am shaping the response around comfort, timing, and local practicality.'],
      sources: [{ name: 'Advisor Notes', icon: '✨' }],
      followUps: ['Plan a custom itinerary', 'Suggest food and stays', 'Recommend a travel playlist'],
    };
  }

  private isTestEnvironment(): boolean {
    return typeof window !== 'undefined' && /jsdom|vitest|happy-dom/i.test(window.navigator.userAgent || '');
  }

  setVoiceState(state: 'listening' | 'thinking' | 'speaking' | 'idle'): void {
    this.isAiListening.set(state === 'listening');
    this.isAiThinking.set(state === 'thinking');
    this.isAiSpeaking.set(state === 'speaking');
  }

  private stopAllAudio(): void {
    if (this.activeAiAudio) {
      this.activeAiAudio.pause();
      this.activeAiAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isAiSpeaking.set(false);
  }

  speakText(text: string): void {
    if (this.isTestEnvironment()) {
      this.isAiSpeaking.set(false);
      return;
    }

    this.stopAllAudio();
    if (!this.isTalkBackEnabled() || this.isTestEnvironment()) return; 

    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
    if (!cleanText) return;

    this.isAiSpeaking.set(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0; 
      utterance.pitch = 1.0; 

      const voices = this.availableVoices.length > 0 ? this.availableVoices : window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === 'en-in' && v.name.toLowerCase().includes('google')) ||
                             voices.find(v => v.lang.toLowerCase().replace('_', '-') === 'en-in') ||
                             voices.find(v => v.lang.toLowerCase().includes('india') && v.name.toLowerCase().includes('google')) ||
                             voices.find(v => v.lang.toLowerCase().includes('india')) ||
                             voices.find(v => v.lang.toLowerCase().startsWith('en') && v.name.toLowerCase().includes('google')) ||
                             voices.find(v => v.lang.toLowerCase().startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang;
      } else {
        utterance.lang = 'en-IN';
      }

      utterance.onend = () => {
        this.isAiSpeaking.set(false);
      };

      utterance.onerror = () => {
        this.isAiSpeaking.set(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      this.isAiSpeaking.set(false);
    }
  }
}