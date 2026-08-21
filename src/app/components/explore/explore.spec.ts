import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';
import { ExploreComponent } from './explore';

describe('ExploreComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreComponent],
    }).compileComponents();
  });

  it('should create the explore component', () => {
    const fixture = TestBed.createComponent(ExploreComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should load destination phrase guides with language codes', () => {
    const fixture = TestBed.createComponent(ExploreComponent);
    const component = fixture.componentInstance;
    
    const destinations = component['destinations']();
    expect(destinations.length).toBeGreaterThan(0);

    destinations.forEach(dest => {
      expect(dest.phrases).toBeDefined();
      expect(dest.phrases.length).toBeGreaterThan(0);
      dest.phrases.forEach(phrase => {
        expect(phrase.langCode).toBeTruthy();
        expect(phrase.original).toBeTruthy();
        expect(phrase.pronounce).toBeTruthy();
        expect(phrase.meaning).toBeTruthy();
      });
    });
  });
});

