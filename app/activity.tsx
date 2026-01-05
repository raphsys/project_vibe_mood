import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { MOODS } from '@/data/moods';
import { ACTIVITIES } from '@/data/activities';
import { AmbientBackground } from '@/components/AmbientBackground';
import { TapActivity } from '@/components/activities/TapActivity';
import { BreatheActivity } from '@/components/activities/BreatheActivity';
import { DrawActivity } from '@/components/activities/DrawActivity';
import { SwipeActivity } from '@/components/activities/SwipeActivity';
import { HoldActivity } from '@/components/activities/HoldActivity';
import { HapticsService } from '@/services/haptics';
import { soundEngine } from '@/services/soundEngine';
import { MoodType, ActivityType } from '@/types/mood';

export default function ActivityScreen() {
  const router = useRouter();
  const { mood: moodId, activity: activityId } = useLocalSearchParams<{
    mood: string;
    activity: string;
  }>();

  const mood = MOODS.find((m) => m.id === moodId);
  const activity = ACTIVITIES.find((a) => a.id === activityId);
  const moodType = (mood?.id as MoodType) || 'calm';
  const activityType = (activity?.id as ActivityType) || 'tap';
  const moodColor = mood ? COLORS.moods[moodType].primary : COLORS.moods.calm.primary;

  const [timer, setTimer] = useState(activity?.duration || 10);
  const [actionCount, setActionCount] = useState(0);

  const progress = useSharedValue(0);

  useEffect(() => {
    soundEngine.init();
    soundEngine.playAmbient(moodType);
  }, [moodType]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          HapticsService.moodComplete(moodType);
          soundEngine.moodComplete(moodType);
          const randomQuote = mood?.quotes[Math.floor(Math.random() * mood.quotes.length)] || 'Respire';
          router.replace(`/result?mood=${moodId}&quote=${encodeURIComponent(randomQuote)}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [moodId, moodType]);

  useEffect(() => {
    progress.value = withTiming((activity!.duration - timer) / activity!.duration, {
      duration: 300,
    });
  }, [timer]);

  const handleAction = () => {
    HapticsService.moodTap(moodType);
    soundEngine.moodTap(moodType);
    setActionCount((prev) => prev + 1);
  };

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <AmbientBackground mood={moodType} />

      <BlurView intensity={20} style={styles.header}>
        <Text style={styles.timer}>{timer}</Text>
        <Text style={styles.instruction}>{activity?.description}</Text>
      </BlurView>

      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { backgroundColor: moodColor }, progressBarStyle]} />
      </View>

      <View style={styles.activityContainer}>
        {activityType === 'tap' && (
          <TapActivity mood={moodType} color={moodColor} onTap={handleAction} />
        )}
        {activityType === 'breathe' && (
          <BreatheActivity mood={moodType} color={moodColor} onCycleComplete={handleAction} />
        )}
        {activityType === 'draw' && (
          <DrawActivity mood={moodType} color={moodColor} onStroke={handleAction} />
        )}
        {activityType === 'swipe' && (
          <SwipeActivity mood={moodType} color={moodColor} onSwipe={handleAction} />
        )}
        {activityType === 'hold' && (
          <HoldActivity mood={moodType} color={moodColor} onHoldComplete={handleAction} />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.actionCount, { color: moodColor }]}>
          {actionCount} {getActionLabel(activityType, actionCount)}
        </Text>
      </View>
    </View>
  );
}

function getActionLabel(activity: ActivityType, count: number): string {
  switch (activity) {
    case 'tap':
      return count === 1 ? 'tap' : 'taps';
    case 'breathe':
      return count === 1 ? 'cycle' : 'cycles';
    case 'draw':
      return count === 1 ? 'trait' : 'traits';
    case 'swipe':
      return count === 1 ? 'balayage' : 'balayages';
    case 'hold':
      return count === 1 ? 'maintien' : 'maintiens';
    default:
      return 'actions';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 60,
    alignItems: 'center',
    paddingBottom: 16,
  },
  timer: {
    ...TYPOGRAPHY.title,
    fontSize: 48,
    color: COLORS.text,
    marginBottom: 8,
  },
  instruction: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSubtle,
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 40,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  activityContainer: {
    flex: 1,
  },
  footer: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  actionCount: {
    ...TYPOGRAPHY.caption,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
