import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { MoodType } from '@/types/mood';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface HoldActivityProps {
  mood: MoodType;
  color: string;
  onHoldComplete: () => void;
}

export function HoldActivity({ mood, color, onHoldComplete }: HoldActivityProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [score, setScore] = useState(0);
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);
  const scoreScale = useSharedValue(1);

  const holdDuration = getHoldDuration(mood);

  const completeHold = () => {
    setCompleted((prev) => prev + 1);
    setScore((prev) => prev + 200);
    scoreScale.value = withSequence(withSpring(1.4), withSpring(1));
    onHoldComplete();
  };

  const gesture = Gesture.LongPress()
    .minDuration(holdDuration)
    .onBegin(() => {
      setIsHolding(true);
      progress.value = withTiming(1, {
        duration: holdDuration,
        easing: Easing.linear,
      });
      scale.value = withSpring(1.2);
      glow.value = withTiming(1, { duration: holdDuration });
    })
    .onFinalize(() => {
      if (progress.value >= 0.99) {
        runOnJS(completeHold)();
      }
      runOnJS(setIsHolding)(false);
      progress.value = withTiming(0, { duration: 300 });
      scale.value = withSpring(1);
      glow.value = withTiming(0);
    });

  const animatedCircleProps = useAnimatedStyle(() => {
    const circumference = 2 * Math.PI * 80;
    const strokeDashoffset = circumference * (1 - progress.value);

    return {
      strokeDashoffset,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 0.5 + glow.value * 0.5,
  }));

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <Animated.View style={[styles.scoreContainer, scoreAnimatedStyle]}>
          <Text style={[styles.score, { color }]}>{score}</Text>
          <Text style={[styles.completed, { color }]}>{completed} maintiens</Text>
        </Animated.View>

        <Animated.View style={[styles.circleContainer, animatedContainerStyle]}>
          <Svg width={200} height={200} style={styles.svg}>
            <Circle
              cx={100}
              cy={100}
              r={80}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={8}
              fill="none"
            />
            <AnimatedCircle
              cx={100}
              cy={100}
              r={80}
              stroke={color}
              strokeWidth={8}
              fill="none"
              strokeDasharray={`${2 * Math.PI * 80}`}
              strokeLinecap="round"
              rotation="-90"
              origin="100, 100"
              style={animatedCircleProps}
            />
          </Svg>
          <View style={styles.centerContent}>
            <Text style={[styles.instruction, { color }]}>
              {isHolding ? 'Continue...' : 'Appuie et maintiens'}
            </Text>
          </View>
        </Animated.View>

        <View style={styles.instructions}>
          <Text style={[styles.instructionText, { color: COLORS.textSubtle }]}>
            Maintiens {holdDuration / 1000}s pour marquer
          </Text>
        </View>
      </View>
    </GestureDetector>
  );
}

function getHoldDuration(mood: MoodType): number {
  switch (mood) {
    case 'calm':
      return 5000;
    case 'energy':
      return 3000;
    case 'dream':
      return 7000;
    case 'love':
      return 4000;
    case 'focus':
      return 6000;
    default:
      return 5000;
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
  completed: {
    ...TYPOGRAPHY.body,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    ...TYPOGRAPHY.body,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  instructions: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  instructionText: {
    ...TYPOGRAPHY.body,
    fontSize: 16,
  },
});
