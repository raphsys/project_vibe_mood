import { Activity } from '@/types/mood';

export const ACTIVITIES: Activity[] = [
  {
    id: 'tap',
    icon: '👆',
    label: 'Rythme',
    description: 'Tape au bon rythme',
    duration: 60,
  },
  {
    id: 'breathe',
    icon: '🫁',
    label: 'Respirer',
    description: 'Synchronise ta respiration',
    duration: 90,
  },
  {
    id: 'draw',
    icon: '✏️',
    label: 'Tracer',
    description: 'Suis les figures qui apparaissent',
    duration: 80,
  },
  {
    id: 'swipe',
    icon: '👋',
    label: 'Parcours',
    description: 'Guide les éléments sur leur chemin',
    duration: 70,
  },
  {
    id: 'hold',
    icon: '🤲',
    label: 'Méditation',
    description: 'Maintiens plusieurs fois',
    duration: 60,
  },
];
