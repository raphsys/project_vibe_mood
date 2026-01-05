import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ExplosionEffect } from './ExplosionEffect';
import { TYPOGRAPHY } from '@/constants/typography';

interface ComboExplosionProps {
  combo: number;
  color: string;
}

export function ComboExplosion({ combo, color }: ComboExplosionProps) {
  const [showExplosion, setShowExplosion] = useState(false);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (combo > 0 && combo % 5 === 0) {
      setShowExplosion(true);

      scale.value = withSequence(
        withSpring(1.5, { damping: 3 }),
        withSpring(1)
      );

      rotate.value = withSequence(
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );

      setTimeout(() => setShowExplosion(false), 1000);
    }
  }, [combo]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  if (combo < 5) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {showExplosion && (
        <ExplosionEffect
          color={color}
          intensity={Math.min(combo / 10, 3)}
          particleCount={Math.min(20 + combo, 50)}
        />
      )}
      <Animated.View style={[styles.comboContainer, animatedStyle]}>
        <Text style={[styles.comboText, { color }]}>x{combo}</Text>
        <Text style={[styles.comboLabel, { color }]}>COMBO!</Text>
      </Animated.View>
    </View>
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
  comboContainer: {
    alignItems: 'center',
  },
  comboText: {
    ...TYPOGRAPHY.title,
    fontSize: 72,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  comboLabel: {
    ...TYPOGRAPHY.body,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 4,
  },
});
