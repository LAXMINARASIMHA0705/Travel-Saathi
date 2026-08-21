import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';
import { MusicComponent } from './music';

describe('MusicComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicComponent],
    }).compileComponents();
  });

  it('should create the music component', () => {
    const fixture = TestBed.createComponent(MusicComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should extract unique languages for filter chips', () => {
    const fixture = TestBed.createComponent(MusicComponent);
    const component = fixture.componentInstance;

    const languages = component['languages']();
    expect(languages).toContain('all');
    expect(languages).toContain('Hindi');
    expect(languages).toContain('English');
    expect(languages).toContain('Japanese');
    expect(languages).toContain('Spanish');
    expect(languages).toContain('Telugu');
    expect(languages).toContain('Italian');
  });

  it('should filter playlist by selected language', () => {
    const fixture = TestBed.createComponent(MusicComponent);
    const component = fixture.componentInstance;

    component['setLanguageFilter']('Telugu');
    expect(component['selectedLanguage']()).toBe('Telugu');

    const filteredTracks = component['filteredPlaylist']();
    expect(filteredTracks.length).toBeGreaterThan(0);
    expect(filteredTracks.every(t => t.language === 'Telugu')).toBe(true);
  });
});

