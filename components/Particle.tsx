import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

interface ParticleProps {
  x: number;
  y: number;
  delay: number;
  color: string;
}

export function Particle({ x, y, delay, color }: ParticleProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) })
    );

    translateY.value = withDelay(
      delay,
      withTiming(-150, {
        duration: 1500,
        easing: Easing.out(Easing.quad),
      })
    );

    opacity.value = withDelay(
      delay + 800,
      withTiming(0, { duration: 700 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x },
      { translateY: y + translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
