import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { CloudShape } from '@/components/CloudShape';
import { MoodParticle } from '@/components/MoodParticle';
import { GlowEffect } from '@/components/GlowEffect';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { MoodType } from '@/types/mood';

const { width } = Dimensions.get('window');

interface TapActivityProps {
  mood: MoodType;
  color: string;
  onTap: () => void;
}

export function TapActivity({ mood, color, onTap }: TapActivityProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [targetTime, setTargetTime] = useState(0);
  const [nextBeatTime, setNextBeatTime] = useState(1000);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState<string>('');

  const beatInterval = getBeatInterval(mood);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0);
  const feedbackOpacity = useSharedValue(0);
  const scoreScale = useSharedValue(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setTargetTime((prev) => prev + 100);
    }, 100);

    const beatTimer = setInterval(() => {
      ringScale.value = withSequence(
        withTiming(1.5, { duration: 200 }),
        withTiming(1, { duration: beatInterval - 200 })
      );
      ringOpacity.value = withSequence(
        withTiming(0.8, { duration: 100 }),
        withTiming(0, { duration: beatInterval - 100 })
      );
      setNextBeatTime((prev) => prev + beatInterval);
    }, beatInterval);

    return () => {
      clearInterval(timer);
      clearInterval(beatTimer);
    };
  }, [mood]);

  const handleTap = () => {
    const timeDiff = Math.abs(targetTime - nextBeatTime + beatInterval);
    const accuracy = Math.max(0, 100 - (timeDiff / beatInterval) * 100);

    let points = 0;
    let feedbackText = '';

    if (accuracy > 90) {
      points = 100;
      feedbackText = 'Parfait!';
      setCombo((prev) => prev + 1);
    } else if (accuracy > 70) {
      points = 50;
      feedbackText = 'Bien!';
      setCombo((prev) => prev + 1);
    } else if (accuracy > 50) {
      points = 25;
      feedbackText = 'Ok';
      setCombo(0);
    } else {
      feedbackText = 'Raté';
      setCombo(0);
    }

    const bonusPoints = Math.floor(points * (1 + combo * 0.1));
    setScore((prev) => prev + bonusPoints);

    setFeedback(feedbackText);
    feedbackOpacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 400 })
    );

    scoreScale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );

    onTap();

    const particleCount = getParticleCount(mood);
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 100,
      y: 0,
      delay: i * (mood === 'energy' ? 30 : 50),
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, mood === 'energy' ? 1000 : 3000);
  };

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const feedbackAnimatedStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
  }));

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        <Animated.View style={[styles.scoreContainer, scoreAnimatedStyle]}>
          <Text style={[styles.score, { color }]}>{score}</Text>
          {combo > 2 && (
            <Text style={[styles.combo, { color }]}>x{combo} combo!</Text>
          )}
        </Animated.View>

        <View style={styles.gameArea}>
          <GlowEffect mood={mood} color={color} size={300} />

          <Animated.View style={[styles.beatRing, { borderColor: color }, ringAnimatedStyle]} />

          <View style={styles.centerArea}>
            <CloudShape color={color} size={250} />
            {particles.map((particle) => (
              <MoodParticle
                key={particle.id}
                x={particle.x}
                y={particle.y}
                delay={particle.delay}
                color={color}
                mood={mood}
              />
            ))}
          </View>

          <Animated.View style={[styles.feedbackContainer, feedbackAnimatedStyle]}>
            <Text style={[styles.feedback, { color }]}>{feedback}</Text>
          </Animated.View>
        </View>

        <View style={styles.instructions}>
          <View style={[styles.beatIndicator, { backgroundColor: color }]} />
          <Text style={styles.instructionText}>Tape au rythme!</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function getBeatInterval(mood: MoodType): number {
  switch (mood) {
    case 'calm':
      return 1200;
    case 'energy':
      return 600;
    case 'dream':
      return 1500;
    case 'love':
      return 900;
    case 'focus':
      return 1000;
    default:
      return 1000;
  }
}

function getParticleCount(mood: MoodType): number {
  switch (mood) {
    case 'calm':
      return 6;
    case 'energy':
      return 12;
    case 'dream':
      return 8;
    case 'love':
      return 10;
    case 'focus':
      return 4;
    default:
      return 6;
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
  combo: {
    ...TYPOGRAPHY.body,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beatRing: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 4,
  },
  centerArea: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 100,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  beatIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  instructionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSubtle,
    fontSize: 16,
  },
});
