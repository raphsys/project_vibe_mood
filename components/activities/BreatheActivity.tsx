import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { MoodType } from '@/types/mood';

interface BreatheActivityProps {
  mood: MoodType;
  color: string;
  onCycleComplete: () => void;
}

export function BreatheActivity({ mood, color, onCycleComplete }: BreatheActivityProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [cycles, setCycles] = useState(0);
  const [score, setScore] = useState(0);

  const config = getBreathConfig(mood);
  const scoreScale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.8, {
          duration: config.inhale,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: config.exhale,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: config.inhale }),
        withTiming(0.3, { duration: config.exhale })
      ),
      -1,
      false
    );

    const phaseInterval = setInterval(() => {
      setPhase((prev) => {
        if (prev === 'inhale') {
          return 'exhale';
        } else {
          setCycles((c) => c + 1);
          setScore((s) => s + 50);
          scoreScale.value = withSequence(withSpring(1.3), withSpring(1));
          onCycleComplete();
          return 'inhale';
        }
      });
    }, config.inhale);

    return () => clearInterval(phaseInterval);
  }, [mood]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.scoreContainer, scoreAnimatedStyle]}>
        <Text style={[styles.score, { color }]}>{score}</Text>
        <Text style={[styles.cycles, { color }]}>{cycles} cycles</Text>
      </Animated.View>

      <View style={styles.breathArea}>
        {[...Array(3)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.circle,
              {
                backgroundColor: i === 0 ? color : `${color}40`,
                borderColor: color,
                width: 150 + i * 40,
                height: 150 + i * 40,
                borderRadius: (150 + i * 40) / 2,
              },
              animatedStyle,
            ]}
          />
        ))}
      </View>

      <View style={styles.instructions}>
        <Text
          style={[
            styles.instruction,
            { color, opacity: phase === 'inhale' ? 1 : 0.3 },
          ]}
        >
          Inspire
        </Text>
        <Text
          style={[
            styles.instruction,
            { color, opacity: phase === 'exhale' ? 1 : 0.3 },
          ]}
        >
          Expire
        </Text>
      </View>
    </View>
  );
}

function getBreathConfig(mood: MoodType) {
  switch (mood) {
    case 'calm':
      return { inhale: 4000, exhale: 6000 };
    case 'energy':
      return { inhale: 2000, exhale: 2000 };
    case 'dream':
      return { inhale: 5000, exhale: 7000 };
    case 'love':
      return { inhale: 3500, exhale: 3500 };
    case 'focus':
      return { inhale: 4000, exhale: 4000 };
    default:
      return { inhale: 4000, exhale: 6000 };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scoreContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  score: {
    ...TYPOGRAPHY.title,
    fontSize: 48,
    fontWeight: '700',
  },
  cycles: {
    ...TYPOGRAPHY.body,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  breathArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderWidth: 3,
  },
  instructions: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 12,
  },
  instruction: {
    ...TYPOGRAPHY.body,
    fontSize: 24,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
});
