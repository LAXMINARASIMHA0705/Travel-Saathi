import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, beforeEach, it, expect } from 'vitest';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo-text')?.textContent).toContain('VOYAGER');
  });

  it('should include user-selected travel preferences in the trip context', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any;

    app.selectTripPreference('budget', 'budget');
    app.selectTripPreference('transport', 'train');
    app.selectTripPreference('pace', 'relaxed');

    const context = app.buildProfessionalTripContext();

    expect(context).toContain('budget');
    expect(context).toContain('train');
    expect(context).toContain('relaxed');
  });
});

