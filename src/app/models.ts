export interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
}

export interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  time: string;
  thinkingSteps?: string[];
  sources?: Array<{ name: string; icon: string }>;
  followUps?: string[];
  actionType?: 'music' | 'food' | 'itinerary' | 'phrase';
  actionData?: any;
}

export type AiPersona = 'guide' | 'foodie' | 'budget' | 'translator' | 'advisor';
