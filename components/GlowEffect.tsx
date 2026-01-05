import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { MoodType } from '@/types/mood';

interface GlowEffectProps {
  mood: MoodType;
  color: string;
  size?: number;
}

export function GlowEffect({ mood, color, size = 200 }: GlowEffectProps) {
  const opacity = useSharedValue(0.2);
  const scale = useSharedValue(1);

  useEffect(() => {
    const config = getGlowConfig(mood);

    opacity.value = withRepeat(
      withSequence(
        withTiming(config.maxOpacity, {
          duration: config.duration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(config.minOpacity, {
          duration: config.duration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    scale.value = withRepeat(
      withTiming(config.maxScale, {
        duration: config.duration * 2,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [mood]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.glow,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

function getGlowConfig(mood: MoodType) {
  switch (mood) {
    case 'calm':
      return { duration: 2000, minOpacity: 0.1, maxOpacity: 0.3, maxScale: 1.2 };
    case 'energy':
      return { duration: 500, minOpacity: 0.3, maxOpacity: 0.7, maxScale: 1.5 };
    case 'dream':
      return { duration: 3000, minOpacity: 0.05, maxOpacity: 0.25, maxScale: 1.3 };
    case 'love':
      return { duration: 1500, minOpacity: 0.2, maxOpacity: 0.5, maxScale: 1.4 };
    case 'focus':
      return { duration: 2500, minOpacity: 0.15, maxOpacity: 0.35, maxScale: 1.1 };
    default:
      return { duration: 2000, minOpacity: 0.2, maxOpacity: 0.4, maxScale: 1.2 };
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    elevation: 20,
  },
});
