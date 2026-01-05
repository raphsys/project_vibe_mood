import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { MoodType } from '@/types/mood';

const { width, height } = Dimensions.get('window');

interface PathElement {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  isCollected: boolean;
  isActive: boolean;
}

interface SwipeActivityProps {
  mood: MoodType;
  color: string;
  onSwipe: () => void;
}

export function SwipeActivity({ mood, color, onSwipe }: SwipeActivityProps) {
  const [elements, setElements] = useState<PathElement[]>([]);
  const [score, setScore] = useState(0);
  const [collected, setCollected] = useState(0);
  const [currentPath, setCurrentPath] = useState(0);
  const [feedback, setFeedback] = useState('');

  const feedbackOpacity = useSharedValue(0);
  const scoreScale = useSharedValue(1);

  useEffect(() => {
    generatePath();
  }, []);

  const generatePath = () => {
    const pathCount = 8;
    const newElements: PathElement[] = [];

    const startX = width * 0.2;
    const startY = height * 0.2;
    const endX = width * 0.8;
    const endY = height * 0.8;

    for (let i = 0; i < pathCount; i++) {
      const progress = i / (pathCount - 1);
      const x = startX + (endX - startX) * progress + (Math.random() - 0.5) * 80;
      const y = startY + (endY - startY) * progress + Math.sin(progress * Math.PI * 2) * 100;

      newElements.push({
        id: Date.now() + i,
        x,
        y,
        targetX: x,
        targetY: y,
        isCollected: false,
        isActive: i === 0,
      });
    }

    setElements(newElements);
    setCurrentPath(0);
    setScore(0);
    setCollected(0);
  };

  const collectElement = useCallback((index: number) => {
    setElements((prev) =>
      prev.map((el, i) => {
        if (i === index) {
          return { ...el, isCollected: true, isActive: false };
        }
        if (i === index + 1) {
          return { ...el, isActive: true };
        }
        return el;
      })
    );

    setScore((prev) => prev + 100);
    setCollected((prev) => prev + 1);
    setCurrentPath((prev) => prev + 1);

    scoreScale.value = withSequence(withSpring(1.2), withSpring(1));

    if (index >= 7) {
      setFeedback('Complete!');
      feedbackOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 600 })
      );
      setTimeout(() => generatePath(), 1000);
    } else {
      setFeedback('Parfait!');
      feedbackOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 300 })
      );
    }
  }, []);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      const currentElement = elements[currentPath];
      if (!currentElement || currentElement.isCollected) return;

      const distance = Math.sqrt(
        Math.pow(event.absoluteX - currentElement.x, 2) +
        Math.pow(event.absoluteY - currentElement.y, 2)
      );

      if (distance < 40) {
        runOnJS(collectElement)(currentPath);
      }
    })
    .onEnd(() => {
      runOnJS(onSwipe)();
    });

  const feedbackAnimatedStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
  }));

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <Animated.View style={[styles.scoreContainer, scoreAnimatedStyle]}>
          <Text style={[styles.score, { color }]}>{score}</Text>
          <Text style={[styles.collected, { color }]}>
            {collected} elements
          </Text>
        </Animated.View>

        <View style={styles.gameArea}>
          {elements.map((element, index) => (
            <PathElementView
              key={element.id}
              element={element}
              color={color}
              isNext={index === currentPath + 1}
            />
          ))}

          {elements.map((element, index) => {
            if (index === 0) return null;
            const prevElement = elements[index - 1];
            return (
              <PathLine
                key={`line-${element.id}`}
                from={{ x: prevElement.x, y: prevElement.y }}
                to={{ x: element.x, y: element.y }}
                color={color}
                isActive={prevElement.isCollected}
              />
            );
          })}
        </View>

        <Animated.View style={[styles.feedbackContainer, feedbackAnimatedStyle]}>
          <Text style={[styles.feedback, { color }]}>{feedback}</Text>
        </Animated.View>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>Suis le chemin lumineux</Text>
        </View>
      </View>
    </GestureDetector>
  );
}

function PathElementView({
  element,
  color,
  isNext,
}: {
  element: PathElement;
  color: string;
  isNext: boolean;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (element.isActive) {
      scale.value = withSequence(
        withSpring(1.3),
        withSpring(1.1),
        withSpring(1.3),
        withSpring(1.1)
      );
    }

    if (element.isCollected) {
      scale.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [element.isActive, element.isCollected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.element,
        {
          left: element.x - 20,
          top: element.y - 20,
          backgroundColor: element.isCollected
            ? `${color}40`
            : element.isActive
            ? color
            : `${color}60`,
          borderColor: element.isActive ? '#fff' : color,
          borderWidth: element.isActive ? 3 : 1,
        },
        animatedStyle,
      ]}
    />
  );
}

function PathLine({
  from,
  to,
  color,
  isActive,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  isActive: boolean;
}) {
  const length = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);

  const opacity = useSharedValue(isActive ? 0.8 : 0.3);

  useEffect(() => {
    opacity.value = withTiming(isActive ? 0.8 : 0.3, { duration: 300 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.line,
        {
          left: from.x,
          top: from.y,
          width: length,
          backgroundColor: color,
          transform: [{ rotate: `${angle}deg` }],
        },
        animatedStyle,
      ]}
    />
  );
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
  collected: {
    ...TYPOGRAPHY.body,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  gameArea: {
    flex: 1,
  },
  element: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  line: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
  },
  feedbackContainer: {
    position: 'absolute',
    top: height / 2,
    alignSelf: 'center',
  },
  feedback: {
    ...TYPOGRAPHY.title,
    fontSize: 32,
    fontWeight: '700',
  },
  instructions: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  instructionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSubtle,
    fontSize: 16,
  },
});
