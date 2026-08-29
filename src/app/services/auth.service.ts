import { Injectable, signal } from '@angular/core';

export interface UserProfile {
  name: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly currentUser = signal<UserProfile | null>(this.loadStoredUser());
  readonly isAuthModalOpen = signal<boolean>(!this.loadStoredUser());

  private loadStoredUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem('travel_saathi_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return null;
  }

  login(user: UserProfile): void {
    this.currentUser.set(user);
    try {
      localStorage.setItem('travel_saathi_user', JSON.stringify(user));
    } catch {}
    this.isAuthModalOpen.set(false);
  }

  logout(): void {
    this.currentUser.set(null);
    try {
      localStorage.removeItem('travel_saathi_user');
    } catch {}
    this.isAuthModalOpen.set(true);
  }

  openModal(): void {
    this.isAuthModalOpen.set(true);
  }

  closeModal(): void {
    this.isAuthModalOpen.set(false);
  }
}
