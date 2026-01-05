import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MoodType } from '@/types/mood';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const HapticsService = {
  light: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },

  medium: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },

  heavy: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },

  success: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },

  moodTap: async (mood: MoodType) => {
    if (Platform.OS === 'web') return;

    switch (mood) {
      case 'calm':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;

      case 'energy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await sleep(50);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;

      case 'dream':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await sleep(100);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;

      case 'love':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await sleep(80);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await sleep(80);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;

      case 'focus':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await sleep(200);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  },

  moodComplete: async (mood: MoodType) => {
    if (Platform.OS === 'web') return;

    switch (mood) {
      case 'calm':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;

      case 'energy':
        for (let i = 0; i < 3; i++) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          await sleep(100);
        }
        break;

      case 'dream':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await sleep(150);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await sleep(150);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;

      case 'love':
        for (let i = 0; i < 2; i++) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await sleep(120);
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          await sleep(120);
        }
        break;

      case 'focus':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await sleep(300);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
    }
  },
};
