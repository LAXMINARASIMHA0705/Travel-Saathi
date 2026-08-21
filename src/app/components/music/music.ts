import { Component, signal, computed, effect, model } from '@angular/core';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  image: string;
  duration: string;
  language: string;
}

@Component({
  selector: 'app-music',
  standalone: true,
  templateUrl: './music.html',
  styleUrls: ['./music.css']
})
export class MusicComponent {

  currentTrackIndex = model<number>(0);
  isPlaying = model<boolean>(false);
  playProgress = model<number>(35);
  isShuffle = model<boolean>(false);
  isRepeat = model<boolean>(false);
  isOpen = model<boolean>(false);

  protected readonly selectedLanguage = signal<string>('all');
  protected readonly selectedArtist = signal<string>('all');

  protected readonly playlist = signal<Track[]>([
    { id: '1', title: 'Midnight Mail Transit', artist: 'Mumbai Lofi', album: 'Suburban Rails', image: '/lofi-india.png', duration: '2:45', language: 'Hindi' },
    { id: '2', title: 'Calm Streets', artist: 'Lofi Girl', album: 'Study Session', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=150&q=80', duration: '2:50', language: 'English' },
    { id: '3', title: 'Kyoto Tea House', artist: 'Tokyo Lofi Society', album: 'Tatami Sessions', image: '/kyoto.png', duration: '3:10', language: 'Japanese' },
    { id: '4', title: 'Monsoon Flamenco', artist: 'Barcelona Chill', album: 'Andalusia Sun', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=150&q=80', duration: '2:58', language: 'Spanish' },
    { id: '5', title: 'Neeve Lofi', artist: 'Tollywood Chill', album: 'Telugu Lofi Hits', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=150&q=80', duration: '3:05', language: 'Telugu' },
    { id: '6', title: 'Samayama Coastal Drive', artist: 'Vizag Sunset Beats', album: 'Coastal Drive Lofi', image: '/vizag.png', duration: '2:48', language: 'Telugu' },
    { id: '7', title: 'Venice Gondola Chill', artist: 'Gelato Beats', album: 'Sun & Sea', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=150&q=80', duration: '3:22', language: 'Italian' }
  ]);

  protected readonly languages = computed(() => {
    const list = this.playlist().map(t => t.language);
    return ['all', ...Array.from(new Set(list))];
  });

  protected readonly artists = computed(() => {
    const lang = this.selectedLanguage();
    const filtered = this.playlist().filter(t => lang === 'all' || t.language === lang);
    const list = filtered.map(t => t.artist);
    return ['all', ...Array.from(new Set(list))];
  });

  protected readonly filteredPlaylist = computed(() => {
    const lang = this.selectedLanguage();
    const artist = this.selectedArtist();

    return this.playlist().filter(t => {
      const matchesLang = lang === 'all' || t.language === lang;
      const matchesArtist = artist === 'all' || t.artist === artist;
      return matchesLang && matchesArtist;
    });
  });

  protected readonly currentTrack = computed(() => {
    return this.playlist()[this.currentTrackIndex()];
  });

  private progressInterval: any = null;

  constructor() {

    effect((onCleanup) => {
      if (this.isPlaying()) {
        this.progressInterval = setInterval(() => {
          this.playProgress.update(p => (p >= 100 ? 0 : p + 1));
        }, 1000);
      } else {
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
        }
      }

      onCleanup(() => {
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
        }
      });
    });
  }

  protected selectTrack(track: Track): void {
    const index = this.playlist().findIndex(t => t.id === track.id);
    if (index !== -1) {
      this.currentTrackIndex.set(index);
      this.playProgress.set(0);
      this.isPlaying.set(true);
    }
  }

  protected togglePlay(): void {
    this.isPlaying.update(p => !p);
  }

  protected nextTrack(): void {
    const activeList = this.filteredPlaylist();
    if (activeList.length === 0) return;

    let nextIndex = 0;
    if (this.isShuffle()) {
      nextIndex = Math.floor(Math.random() * activeList.length);
    } else {
      const currentInActive = activeList.findIndex(t => t.id === this.currentTrack().id);
      nextIndex = (currentInActive + 1) % activeList.length;
    }

    const targetTrack = activeList[nextIndex];
    this.selectTrack(targetTrack);
  }

  protected prevTrack(): void {
    const activeList = this.filteredPlaylist();
    if (activeList.length === 0) return;

    const currentInActive = activeList.findIndex(t => t.id === this.currentTrack().id);
    const prevIndex = (currentInActive - 1 + activeList.length) % activeList.length;

    const targetTrack = activeList[prevIndex];
    this.selectTrack(targetTrack);
  }

  protected toggleShuffle(): void {
    this.isShuffle.update(s => !s);
  }

  protected toggleRepeat(): void {
    this.isRepeat.update(r => !r);
  }

  protected setLanguageFilter(lang: string): void {
    this.selectedLanguage.set(lang);

    const currentArtist = this.selectedArtist();
    if (currentArtist !== 'all') {
      const available = this.artists();
      if (!available.includes(currentArtist)) {
        this.selectedArtist.set('all');
      }
    }
  }

  protected setArtistFilter(artist: string): void {
    this.selectedArtist.set(artist);
  }

  protected closeDrawer(): void {
    this.isOpen.set(false);
  }
}

