export type MoodType = 'calm' | 'energy' | 'dream' | 'love' | 'focus';

export type ActivityType = 'tap' | 'breathe' | 'draw' | 'swipe' | 'hold';

export interface Mood {
  id: MoodType;
  emoji: string;
  label: string;
  enabled: boolean;
  quotes: string[];
}

export interface Activity {
  id: ActivityType;
  icon: string;
  label: string;
  description: string;
  duration: number;
}
