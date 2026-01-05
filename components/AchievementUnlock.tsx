import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { ExplosionEffect } from './ExplosionEffect';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';

const { width } = Dimensions.get('window');

interface Achievement {
  icon: string;
  name: string;
  xpReward: number;
}

interface AchievementUnlockProps {
  achievement: Achievement | null;
  onComplete: () => void;
}

export function AchievementUnlock({ achievement, onComplete }: AchievementUnlockProps) {
  const translateY = useSharedValue(-200);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (achievement) {
      translateY.value = withSequence(
        withSpring(0, { damping: 12 }),
        withDelay(2500, withTiming(-200, { duration: 400 }))
      );

      scale.value = withSequence(
        withSpring(1, { damping: 8 }),
        withDelay(2500, withTiming(0, { duration: 400 }))
      );

      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(2500, withTiming(0, { duration: 400 }))
      );

      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [achievement]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  if (!achievement) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={[styles.container, animatedStyle]}>
        <ExplosionEffect color="#ffd700" intensity={2} particleCount={30} />

        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.icon}>{achievement.icon}</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.label}>Achievement Debloque!</Text>
            <Text style={styles.name}>{achievement.name}</Text>
            <Text style={styles.xp}>+{achievement.xpReward} XP</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    marginTop: 60,
    width: width - 40,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
    borderWidth: 3,
    borderColor: '#ffd700',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  badge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffd700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 36,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
    color: COLORS.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    ...TYPOGRAPHY.title,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  xp: {
    ...TYPOGRAPHY.body,
    fontSize: 16,
    color: '#ffd700',
    fontWeight: '600',
  },
});
