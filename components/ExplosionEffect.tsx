import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  duration: number;
}

interface ExplosionEffectProps {
  color: string;
  intensity?: number;
  particleCount?: number;
}

export function ExplosionEffect({ color, intensity = 1, particleCount = 20 }: ExplosionEffectProps) {
  const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (i / particleCount) * Math.PI * 2,
    distance: 50 + Math.random() * 100 * intensity,
    size: 4 + Math.random() * 8 * intensity,
    duration: 500 + Math.random() * 500,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <ParticleElement key={particle.id} particle={particle} color={color} />
      ))}
    </View>
  );
}

function ParticleElement({ particle, color }: { particle: Particle; color: string }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    const endX = Math.cos(particle.angle) * particle.distance;
    const endY = Math.sin(particle.angle) * particle.distance;

    translateX.value = withTiming(endX, {
      duration: particle.duration,
      easing: Easing.out(Easing.cubic),
    });

    translateY.value = withTiming(endY, {
      duration: particle.duration,
      easing: Easing.out(Easing.cubic),
    });

    opacity.value = withDelay(
      particle.duration * 0.5,
      withTiming(0, { duration: particle.duration * 0.5 })
    );

    scale.value = withTiming(0.2, {
      duration: particle.duration,
      easing: Easing.out(Easing.quad),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: color,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
  },
});
