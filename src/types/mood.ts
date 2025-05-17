export type Mood = '😊' | '😔' | '😐' | '😣' | '🤩';

export interface MoodEntry {
  date: string;
  mood: Mood;
}

export const moodColors: Record<Mood, string> = {
  '😊': '#4ade80', // green for happy
  '😔': '#f87171', // red for sad
  '😐': '#facc15', // yellow for neutral
  '😣': '#c084fc', // purple for stressed
  '🤩': '#60a5fa', // blue for excited
};

export const moodDescriptions: Record<Mood, string> = {
  '😊': 'Happy',
  '😔': 'Sad',
  '😐': 'Neutral',
  '😣': 'Stressed',
  '🤩': 'Excited',
};