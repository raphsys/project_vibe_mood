import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { MoodType } from '@/types/mood';

interface MoodParticleProps {
  x: number;
  y: number;
  delay: number;
  color: string;
  mood: MoodType;
}

export function MoodParticle({ x, y, delay, color, mood }: MoodParticleProps) {
  const translateX = useSharedValue(x);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 10, stiffness: 100 })
    );

    switch (mood) {
      case 'calm':
        translateY.value = withDelay(
          delay,
          withTiming(-150, {
            duration: 1800,
            easing: Easing.out(Easing.quad),
          })
        );
        opacity.value = withDelay(delay + 1000, withTiming(0, { duration: 800 }));
        break;

      case 'energy':
        translateY.value = withDelay(
          delay,
          withTiming(-200, {
            duration: 800,
            easing: Easing.out(Easing.cubic),
          })
        );
        translateX.value = withDelay(
          delay,
          withSequence(
            withTiming(x + (Math.random() - 0.5) * 80, { duration: 400 }),
            withTiming(x + (Math.random() - 0.5) * 120, { duration: 400 })
          )
        );
        rotate.value = withDelay(
          delay,
          withTiming(360 * (Math.random() > 0.5 ? 1 : -1), { duration: 800 })
        );
        opacity.value = withDelay(delay + 500, withTiming(0, { duration: 300 }));
        break;

      case 'dream':
        translateY.value = withDelay(
          delay,
          withTiming(-120, {
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
          })
        );
        translateX.value = withDelay(
          delay,
          withSequence(
            withTiming(x + Math.sin(delay) * 60, { duration: 1250 }),
            withTiming(x - Math.sin(delay) * 60, { duration: 1250 })
          )
        );
        rotate.value = withDelay(
          delay,
          withTiming(180, { duration: 2500, easing: Easing.linear })
        );
        opacity.value = withDelay(delay + 1500, withTiming(0, { duration: 1000 }));
        break;

      case 'love':
        translateY.value = withDelay(
          delay,
          withSequence(
            withSpring(-80, { damping: 8 }),
            withSpring(-160, { damping: 12 })
          )
        );
        scale.value = withDelay(
          delay,
          withSequence(
            withSpring(1.3, { damping: 10 }),
            withSpring(0.8, { damping: 10 }),
            withSpring(1.2, { damping: 10 })
          )
        );
        opacity.value = withDelay(delay + 1200, withTiming(0, { duration: 600 }));
        break;

      case 'focus':
        translateY.value = withDelay(
          delay,
          withTiming(-180, {
            duration: 2000,
            easing: Easing.linear,
          })
        );
        opacity.value = withDelay(
          delay,
          withSequence(
            withTiming(0.3, { duration: 500 }),
            withTiming(1, { duration: 500 }),
            withTiming(0.3, { duration: 500 }),
            withTiming(0, { duration: 500 })
          )
        );
        break;
    }
  }, [mood, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: y + translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const particleStyle = getParticleStyle(mood);

  return (
    <Animated.View
      style={[
        styles.particle,
        particleStyle,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

function getParticleStyle(mood: MoodType) {
  switch (mood) {
    case 'calm':
      return { width: 6, height: 6, borderRadius: 3 };
    case 'energy':
      return { width: 10, height: 10, borderRadius: 2 };
    case 'dream':
      return { width: 12, height: 12, borderRadius: 6, opacity: 0.7 };
    case 'love':
      return { width: 8, height: 8, borderRadius: 4 };
    case 'focus':
      return { width: 4, height: 4, borderRadius: 2 };
    default:
      return { width: 8, height: 8, borderRadius: 4 };
  }
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
});
