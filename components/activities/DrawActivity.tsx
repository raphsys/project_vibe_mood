import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { MoodType } from '@/types/mood';

const { width, height } = Dimensions.get('window');

interface Pattern {
  id: number;
  path: string;
  points: { x: number; y: number }[];
}

interface DrawActivityProps {
  mood: MoodType;
  color: string;
  onStroke: () => void;
}

export function DrawActivity({ mood, color, onStroke }: DrawActivityProps) {
  const [currentPath, setCurrentPath] = useState('');
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [completedPatterns, setCompletedPatterns] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const feedbackOpacity = useSharedValue(0);
  const scoreScale = useSharedValue(1);
  const patternOpacity = useSharedValue(1);

  useEffect(() => {
    generateNewPattern();
  }, []);

  const generateNewPattern = () => {
    const pattern = createPattern(mood);
    setCurrentPattern(pattern);
    setPatterns([pattern]);

    patternOpacity.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(0.6, { duration: 500 })
    );
  };

  const gesture = Gesture.Pan()
    .onStart((event) => {
      const newPath = `M ${event.x} ${event.y}`;
      runOnJS(setCurrentPath)(newPath);
    })
    .onUpdate((event) => {
      runOnJS(setCurrentPath)((prev: string) => `${prev} L ${event.x} ${event.y}`);
    })
    .onEnd(() => {
      if (currentPath && currentPattern) {
        const accuracy = calculateAccuracy(currentPath, currentPattern);
        const points = Math.floor(accuracy * 100);

        setScore((prev) => prev + points);

        if (accuracy > 0.7) {
          setFeedback('Excellent!');
          setCompletedPatterns((prev) => prev + 1);
          setTimeout(() => generateNewPattern(), 800);
        } else if (accuracy > 0.5) {
          setFeedback('Bien!');
        } else {
          setFeedback('Recommence');
        }

        feedbackOpacity.value = withSequence(
          withTiming(1, { duration: 100 }),
          withTiming(0, { duration: 600 })
        );

        scoreScale.value = withSequence(
          withSpring(1.2),
          withSpring(1)
        );

        onStroke();
      }
      setCurrentPath('');
    });

  const feedbackAnimatedStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
  }));

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  const patternAnimatedStyle = useAnimatedStyle(() => ({
    opacity: patternOpacity.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <Animated.View style={[styles.scoreContainer, scoreAnimatedStyle]}>
          <Text style={[styles.score, { color }]}>{score}</Text>
          <Text style={[styles.completed, { color }]}>
            {completedPatterns} figures
          </Text>
        </Animated.View>

        <Svg width={width} height={height} style={styles.svg}>
          {patterns.map((pattern) => (
            <Animated.G key={pattern.id} style={patternAnimatedStyle}>
              <Path
                d={pattern.path}
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="10 5"
                fill="none"
                opacity={0.4}
              />
              {pattern.points.map((point, index) => (
                <SvgCircle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r={6}
                  fill={color}
                  opacity={0.6}
                />
              ))}
            </Animated.G>
          ))}

          {currentPath && (
            <Path
              d={currentPath}
              stroke={color}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={1}
            />
          )}
        </Svg>

        <Animated.View style={[styles.feedbackContainer, feedbackAnimatedStyle]}>
          <Text style={[styles.feedback, { color }]}>{feedback}</Text>
        </Animated.View>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>Suis la figure pointillée</Text>
        </View>
      </View>
    </GestureDetector>
  );
}

function createPattern(mood: MoodType): Pattern {
  const centerX = width / 2;
  const centerY = height / 2;
  const size = 120;

  const patterns = [
    {
      type: 'circle',
      path: `M ${centerX - size} ${centerY} A ${size} ${size} 0 1 1 ${centerX - size - 0.1} ${centerY}`,
      points: generateCirclePoints(centerX, centerY, size, 8),
    },
    {
      type: 'heart',
      path: createHeartPath(centerX, centerY, size),
      points: generateHeartPoints(centerX, centerY, size),
    },
    {
      type: 'infinity',
      path: createInfinityPath(centerX, centerY, size),
      points: generateInfinityPoints(centerX, centerY, size),
    },
    {
      type: 'star',
      path: createStarPath(centerX, centerY, size),
      points: generateStarPoints(centerX, centerY, size),
    },
    {
      type: 'spiral',
      path: createSpiralPath(centerX, centerY, size),
      points: generateSpiralPoints(centerX, centerY, size),
    },
  ];

  const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];

  return {
    id: Date.now(),
    path: selectedPattern.path,
    points: selectedPattern.points,
  };
}

function generateCirclePoints(cx: number, cy: number, r: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    };
  });
}

function createHeartPath(cx: number, cy: number, size: number): string {
  const scale = size / 100;
  return `M ${cx} ${cy + 30 * scale}
          C ${cx - 40 * scale} ${cy - 10 * scale}, ${cx - 40 * scale} ${cy - 40 * scale}, ${cx} ${cy - 40 * scale}
          C ${cx + 40 * scale} ${cy - 40 * scale}, ${cx + 40 * scale} ${cy - 10 * scale}, ${cx} ${cy + 30 * scale}`;
}

function generateHeartPoints(cx: number, cy: number, size: number) {
  const scale = size / 100;
  return [
    { x: cx, y: cy + 30 * scale },
    { x: cx - 30 * scale, y: cy - 20 * scale },
    { x: cx, y: cy - 40 * scale },
    { x: cx + 30 * scale, y: cy - 20 * scale },
  ];
}

function createInfinityPath(cx: number, cy: number, size: number): string {
  const w = size;
  const h = size / 2;
  return `M ${cx - w} ${cy}
          C ${cx - w} ${cy - h}, ${cx - w / 2} ${cy - h}, ${cx} ${cy}
          C ${cx + w / 2} ${cy + h}, ${cx + w} ${cy + h}, ${cx + w} ${cy}
          C ${cx + w} ${cy - h}, ${cx + w / 2} ${cy - h}, ${cx} ${cy}
          C ${cx - w / 2} ${cy + h}, ${cx - w} ${cy + h}, ${cx - w} ${cy}`;
}

function generateInfinityPoints(cx: number, cy: number, size: number) {
  return [
    { x: cx - size, y: cy },
    { x: cx - size / 2, y: cy - size / 2 },
    { x: cx, y: cy },
    { x: cx + size / 2, y: cy + size / 2 },
    { x: cx + size, y: cy },
  ];
}

function createStarPath(cx: number, cy: number, size: number): string {
  const points = 5;
  const outerRadius = size;
  const innerRadius = size * 0.4;
  let path = '';

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    path += (i === 0 ? 'M' : 'L') + ` ${x} ${y} `;
  }
  return path + 'Z';
}

function generateStarPoints(cx: number, cy: number, size: number) {
  const points = 5;
  const outerRadius = size;
  return Array.from({ length: points }, (_, i) => {
    const angle = (i * 2 * Math.PI) / points - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * outerRadius,
      y: cy + Math.sin(angle) * outerRadius,
    };
  });
}

function createSpiralPath(cx: number, cy: number, size: number): string {
  let path = `M ${cx} ${cy}`;
  const turns = 3;
  const steps = 100;

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * turns * 2 * Math.PI;
    const radius = (i / steps) * size;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    path += ` L ${x} ${y}`;
  }
  return path;
}

function generateSpiralPoints(cx: number, cy: number, size: number) {
  const points = 8;
  const turns = 3;
  return Array.from({ length: points }, (_, i) => {
    const t = i / points;
    const angle = t * turns * 2 * Math.PI;
    const radius = t * size;
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    };
  });
}

function calculateAccuracy(userPath: string, pattern: Pattern): number {
  return Math.random() * 0.5 + 0.3;
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
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  feedbackContainer: {
    position: 'absolute',
    top: height / 2 + 150,
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
