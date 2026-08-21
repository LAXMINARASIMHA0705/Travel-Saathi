import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, beforeEach, it, expect } from 'vitest';
import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), AiService],
    }).compileComponents();
    service = TestBed.inject(AiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a helpful travel reply for itinerary queries', async () => {
    await service.sendChatMessage('Plan me 2 days in Goa');
    const latest = service.chatMessages().at(-1);

    expect(latest?.text).toContain('Goa');
    expect(latest?.text).toContain('itinerary');
  });

  it('should greet the user warmly for hello-style requests', async () => {
    await service.sendChatMessage('hello maya');
    const latest = service.chatMessages().at(-1);

    expect(latest?.text.toLowerCase()).toContain('hello');
    expect(latest?.text.toLowerCase()).toContain('travel');
  });

  it('should remember trip context and adapt follow-up requests', async () => {
    await service.sendChatMessage('Plan a 3-day trip to Goa for 2 people');
    await service.sendChatMessage('Make it cheaper and more food-focused');
    const latest = service.chatMessages().at(-1);

    expect(latest?.text.toLowerCase()).toContain('budget');
  });

  it('should surface a best-fit recommendation with selectable itinerary options', async () => {
    await service.sendChatMessage('Plan a trip to Goa with a small budget');
    const latest = service.chatMessages().at(-1);

    expect(latest?.text.toLowerCase()).toContain('best fit');
    expect(latest?.actionData?.options?.length).toBeGreaterThan(0);
  });
});
