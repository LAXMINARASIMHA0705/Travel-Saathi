import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent {
  protected readonly authService = inject(AuthService);

  protected readonly activeTab = signal<'signin' | 'signup'>('signin');

  // Sign In Form Signals
  protected readonly loginPhone = signal('');
  protected readonly loginPassword = signal('');
  protected readonly loginError = signal('');

  // Sign Up Form Signals
  protected readonly regName = signal('');
  protected readonly regPhone = signal('');
  protected readonly regPassword = signal('');
  protected readonly regError = signal('');

  protected switchTab(tab: 'signin' | 'signup'): void {
    this.activeTab.set(tab);
    this.loginError.set('');
    this.regError.set('');
  }

  protected handleLogin(event: Event): void {
    event.preventDefault();
    const phone = this.loginPhone().trim();
    const pass = this.loginPassword().trim();

    if (!phone) {
      this.loginError.set('Please enter your 10-digit mobile number.');
      return;
    }
    if (!pass) {
      this.loginError.set('Please enter your password.');
      return;
    }

    this.authService.login({
      name: 'Registered Traveler',
      phone: phone.startsWith('+91') ? phone : '+91 ' + phone
    });
  }

  protected handleSignUp(event: Event): void {
    event.preventDefault();
    const name = this.regName().trim();
    const phone = this.regPhone().trim();
    const pass = this.regPassword().trim();

    if (!name) {
      this.regError.set('Please enter your name.');
      return;
    }
    if (!phone) {
      this.regError.set('Please enter your mobile number.');
      return;
    }
    if (!pass || pass.length < 4) {
      this.regError.set('Password must be at least 4 characters long.');
      return;
    }

    this.authService.login({
      name: name,
      phone: phone.startsWith('+91') ? phone : '+91 ' + phone
    });
  }
}
