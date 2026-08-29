export interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  time: string;
  thinkingSteps?: string[];
  sources?: Array<{ name: string; icon: string }>;
  followUps?: string[];
  actionType?: 'food' | 'itinerary' | 'phrase';
  actionData?: any;
}

export type AiPersona = 'guide' | 'foodie' | 'budget' | 'translator' | 'advisor';
