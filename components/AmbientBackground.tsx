import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MoodType } from '@/types/mood';
import { COLORS } from '@/constants/colors';

const { width, height } = Dimensions.get('window');

interface AmbientBackgroundProps {
  mood: MoodType;
}

export function AmbientBackground({ mood }: AmbientBackgroundProps) {
  const opacity1 = useSharedValue(0.3);
  const opacity2 = useSharedValue(0.5);
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    const config = getAnimationConfig(mood);

    opacity1.value = withRepeat(
      withTiming(0.7, { duration: config.duration }),
      -1,
      true
    );

    opacity2.value = withRepeat(
      withTiming(0.8, { duration: config.duration * 1.3 }),
      -1,
      true
    );

    scale1.value = withRepeat(
      withTiming(1.5, { duration: config.duration * 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    scale2.value = withRepeat(
      withTiming(1.3, { duration: config.duration * 1.7, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    if (mood === 'dream' || mood === 'focus') {
      rotate.value = withRepeat(
        withTiming(360, { duration: config.duration * 4, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [mood]);

  const moodColors = COLORS.moods[mood];

  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ scale: scale1.value }, { rotate: `${rotate.value}deg` }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [{ scale: scale2.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.blob, styles.blob1, animatedStyle1]}>
        <LinearGradient
          colors={[moodColors.primary, moodColors.gradient[1], 'transparent']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <Animated.View style={[styles.blob, styles.blob2, animatedStyle2]}>
        <LinearGradient
          colors={[moodColors.gradient[0], moodColors.primary, 'transparent']}
          style={styles.gradient}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>
    </View>
  );
}

function getAnimationConfig(mood: MoodType) {
  switch (mood) {
    case 'calm':
      return { duration: 4000 };
    case 'energy':
      return { duration: 1500 };
    case 'dream':
      return { duration: 6000 };
    case 'love':
      return { duration: 3000 };
    case 'focus':
      return { duration: 5000 };
    default:
      return { duration: 3000 };
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
  },
  blob1: {
    top: -width * 0.5,
    left: -width * 0.3,
  },
  blob2: {
    bottom: -width * 0.6,
    right: -width * 0.4,
  },
  gradient: {
    flex: 1,
  },
});
