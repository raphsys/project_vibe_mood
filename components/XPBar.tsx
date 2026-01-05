import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';

interface XPBarProps {
  level: number;
  currentXP: number;
  xpForNextLevel: number;
  color: string;
}

export function XPBar({ level, currentXP, xpForNextLevel, color }: XPBarProps) {
  const progress = useSharedValue(0);
  const levelScale = useSharedValue(1);

  useEffect(() => {
    const percentage = (currentXP / xpForNextLevel) * 100;
    progress.value = withSpring(percentage, {
      damping: 15,
      stiffness: 100,
    });
  }, [currentXP, xpForNextLevel]);

  useEffect(() => {
    levelScale.value = withSpring(1.2, { damping: 5 });
    setTimeout(() => {
      levelScale.value = withSpring(1);
    }, 500);
  }, [level]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const levelStyle = useAnimatedStyle(() => ({
    transform: [{ scale: levelScale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.levelBadge, { backgroundColor: color }, levelStyle]}>
        <Text style={styles.levelText}>{level}</Text>
      </Animated.View>

      <View style={styles.barContainer}>
        <View style={[styles.barBackground, { backgroundColor: `${color}20` }]}>
          <Animated.View
            style={[
              styles.barFill,
              { backgroundColor: color },
              progressStyle,
            ]}
          />
        </View>
        <Text style={styles.xpText}>
          {currentXP} / {xpForNextLevel} XP
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  levelBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  levelText: {
    ...TYPOGRAPHY.title,
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  },
  barContainer: {
    flex: 1,
    gap: 4,
  },
  barBackground: {
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 12,
  },
  xpText: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
    color: COLORS.textSubtle,
    textAlign: 'center',
  },
});
