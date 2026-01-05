import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { Mood } from '@/types/mood';

interface MoodBubbleProps {
  mood: Mood;
  onPress: () => void;
  index: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export function MoodBubble({ mood, onPress, index }: MoodBubbleProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(mood.enabled ? 1 : 0.3);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.05, {
        duration: 3000 + index * 200,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    if (!mood.enabled) return;
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  const colors = COLORS.moods[mood.id].gradient;

  return (
    <AnimatedTouchable
      onPress={handlePress}
      activeOpacity={mood.enabled ? 0.7 : 1}
      disabled={!mood.enabled}
      style={[styles.container, animatedStyle]}
    >
      <AnimatedGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.emoji}>{mood.emoji}</Text>
        <Text style={styles.label}>{mood.label}</Text>
      </AnimatedGradient>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginHorizontal: 10,
    marginVertical: 15,
  },
  gradient: {
    flex: 1,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.background,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
