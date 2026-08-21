import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { ExploreComponent } from './components/explore/explore';
import { MusicComponent } from './components/music/music';
import { FoodComponent } from './components/food/food';
import { CommonModule } from '@angular/common';
import { ChatMessage, AiPersona, Track } from './models';
import { AiService } from './ai.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ExploreComponent, MusicComponent, FoodComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, OnDestroy {
  protected readonly aiService = inject(AiService);

  protected readonly isMusicDrawerOpen = signal(false);
  protected readonly isFoodDrawerOpen = signal(false);
  protected readonly isProfileDrawerOpen = signal(false);
  protected readonly isAiDrawerOpen = signal(false);

  protected readonly musicTrackIndex = signal(0);
  protected readonly musicIsPlaying = signal(false);
  protected readonly musicPlayProgress = signal(35);
  protected readonly musicIsShuffle = signal(false);
  protected readonly musicIsRepeat = signal(false);

  protected readonly foodCart = signal<any[]>([]);
  protected readonly foodOrderStatus = signal<'idle' | 'checking_out' | 'placed'>('idle');
  protected readonly foodDeliveryStep = signal(1);

  protected readonly playlist: Track[] = [ 
    { id: '1', title: 'Midnight Mail Transit', artist: 'Mumbai Lofi', image: '/lofi-india.png' },
    { id: '2', title: 'Calm Streets', artist: 'Lofi Girl', image: '/lofi-travel.png' },
    { id: '3', title: 'Kyoto Tea House', artist: 'Tokyo Lofi Society', image: '/kyoto.png' },
    { id: '4', title: 'Monsoon Flamenco', artist: 'Barcelona Chill', image: '/lofi-travel.png' },
    { id: '5', title: 'Neeve Lofi', artist: 'Tollywood Chill', image: '/lofi-india.png' },
    { id: '6', title: 'Samayama Coastal Drive', artist: 'Vizag Sunset Beats', image: '/vizag.png' },
    { id: '7', title: 'Venice Gondola Chill', artist: 'Gelato Beats', image: '/lofi-travel.png' }
  ];

  protected readonly currentTrack = computed(() => {
    return this.playlist[this.musicTrackIndex()];
  });

  protected readonly cartCount = computed(() => {
    return this.foodCart().reduce((sum, item) => sum + item.quantity, 0);
  });

  protected readonly cartTotal = computed(() => {
    return this.foodCart().reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  });

  protected readonly tripDays = signal(5);
  protected readonly travelerCount = signal(2);
  protected readonly travelStyle = signal<'budget' | 'comfort' | 'luxury'>('comfort');
  protected readonly tripPreferences = signal<Record<string, string>>({
    budget: 'balanced',
    transport: 'flexible',
    pace: 'balanced',
  });
  protected readonly tripPreferencesCompleted = signal(false);

  protected readonly estimatedBudget = computed(() => {
    const days = this.tripDays();
    const people = this.travelerCount();
    const style = this.travelStyle();
    
    let multiplier = 2500; // comfort per day per person
    if (style === 'budget') multiplier = 1200;
    if (style === 'luxury') multiplier = 6000;

    const total = days * people * multiplier;
    return {
      stay: Math.round(total * 0.4),
      food: Math.round(total * 0.25),
      transit: Math.round(total * 0.20),
      sightseeing: Math.round(total * 0.15),
      grandTotal: total
    };
  });

  private subscriptions = new Subscription();

  protected toggleMusicPlay(event: Event): void {
    event.stopPropagation();
    this.musicIsPlaying.update(p => !p);
  }

  protected selectTripPreference(category: 'budget' | 'transport' | 'pace', value: string): void {
    this.tripPreferences.update(current => ({ ...current, [category]: value }));
    this.tripPreferencesCompleted.set(true);
    this.aiService.chatMessages.update(msgs => [...msgs, { sender: 'ai', text: `Preference updated: ${category} → ${value}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  }

  protected reopenTripPreferences(): void {
    this.tripPreferencesCompleted.set(false);
  }

  protected buildProfessionalTripContext(): string {
    const budget = this.estimatedBudget();
    const prefs = this.tripPreferences();
    return `Trip profile: ${this.tripDays()} days, ${this.travelerCount()} traveler(s), ${this.travelStyle()} travel style. Budget preference: ${prefs['budget']}, transport preference: ${prefs['transport']}, pace preference: ${prefs['pace']}. Budget estimate: ₹${budget.grandTotal.toLocaleString()} (Stay ₹${budget.stay.toLocaleString()}, Food ₹${budget.food.toLocaleString()}, Transit ₹${budget.transit.toLocaleString()}, Sightseeing ₹${budget.sightseeing.toLocaleString()}).`;
  }

  ngOnInit(): void {
    const sub = this.aiService.recognitionSuccess$.subscribe(() => {
      this.openAiConcierge();
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected openAiConcierge(): void {
    this.isAiDrawerOpen.set(true);
  }

  protected startVoiceRecognition(event?: Event): void {
    if (event) event.stopPropagation();
    this.aiService.listenForVoiceQuery(this.buildProfessionalTripContext());
  }

  protected async enableWakeWordListening(event?: Event): Promise<void> {
    if (event) event.stopPropagation();
    this.aiService.setVoiceState('listening');

    this.playWakeChime(); 

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { 
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch {
    }
  }

  protected handleCodewordTrigger(fullTranscript?: string): void {

    this.playWakeChime();

    this.openAiConcierge();

    if (fullTranscript) {
      let queryPart = fullTranscript
        .replace(/hey maya|namaste maya|ok maya|hi maya|maiya|maya|ma ya/g, '')
        .trim();

      if (queryPart.length > 2) {
        this.aiService.sendChatMessage(queryPart, this.buildProfessionalTripContext());
        return;
      }
    }

    const greeting = 'Yes, how can I help you?';
    this.aiService.setVoiceState('speaking'); // Set state to speaking for greeting
    this.aiService.chatMessages.update(msgs => [...msgs, { sender: 'ai', text: greeting, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    this.aiService.speakText(greeting);
    this.startVoiceRecognition();
  }

  private playWakeChime(): void {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  }

  protected toggleTalkBack(): void {
    this.aiService.isTalkBackEnabled.update(v => !v);
  }

  protected setPersona(persona: AiPersona): void {
    this.aiService.setPersona(persona);
  }

  protected sendChatMessage(query: string): void {
    if (!query?.trim()) return;
    this.aiService.sendChatMessage(query, this.buildProfessionalTripContext());
  }

  protected playTrackFromAi(trackId: string): void {
    const idx = this.playlist.findIndex(t => t.id === trackId);
    if (idx !== -1) {
      this.musicTrackIndex.set(idx);
      this.musicIsPlaying.set(true);
      const track = this.playlist[idx];
      this.aiService.speakText(`Now playing ${track.title}`);
    }
  }

  protected addFoodFromAi(foodItem: any): void {
    const currentCart = [...this.foodCart()];
    const existing = currentCart.find(i => i.menuItem.id === foodItem.id || i.menuItem.name === foodItem.name);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      currentCart.push({
        menuItem: {
          id: foodItem.id || 'ai-food-' + Date.now(),
          name: foodItem.name,
          price: foodItem.price || 299,
          rating: foodItem.rating || 4.7,
          isVeg: true,
          prepTime: foodItem.prepTime || '20 mins',
          image: foodItem.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80'
        },
        quantity: 1
      });
    }
    
    this.foodCart.set(currentCart);
    this.aiService.speakText(`Added ${foodItem.name} to your food cart!`);
    this.isFoodDrawerOpen.set(true);
  }

  protected triggerAiSpeak(): void {
    this.startVoiceRecognition();
  }
}
