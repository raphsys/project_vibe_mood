import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { MOODS } from '@/data/moods';
import { ACTIVITIES } from '@/data/activities';
import { HapticsService } from '@/services/haptics';
import { MoodType, ActivityType } from '@/types/mood';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function SelectActivityScreen() {
  const router = useRouter();
  const { mood: moodId } = useLocalSearchParams<{ mood: string }>();

  const mood = MOODS.find((m) => m.id === moodId);
  const moodType = (mood?.id as MoodType) || 'calm';
  const moodColors = COLORS.moods[moodType];

  const handleActivitySelect = (activityId: ActivityType) => {
    HapticsService.medium();
    router.push(`/activity?mood=${moodId}&activity=${activityId}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.emoji}>{mood?.emoji}</Text>
        <Text style={styles.title}>Choisis ton activité</Text>
        <Text style={styles.subtitle}>{mood?.label}</Text>
      </View>

      <FlatList
        data={ACTIVITIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <ActivityCard
            activity={item}
            moodColors={moodColors}
            onPress={() => handleActivitySelect(item.id)}
            index={index}
          />
        )}
      />
    </View>
  );
}

interface ActivityCardProps {
  activity: any;
  moodColors: any;
  onPress: () => void;
  index: number;
}

function ActivityCard({ activity, moodColors, onPress, index }: ActivityCardProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      entering={FadeIn.delay(index * 100)}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={[styles.card, animatedStyle]}
    >
      <LinearGradient
        colors={[moodColors.gradient[0], moodColors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <Text style={styles.activityIcon}>{activity.icon}</Text>
        <View style={styles.cardContent}>
          <Text style={styles.activityLabel}>{activity.label}</Text>
          <Text style={styles.activityDescription}>{activity.description}</Text>
          <Text style={styles.activityDuration}>{activity.duration}s</Text>
        </View>
      </LinearGradient>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    ...TYPOGRAPHY.title,
    fontSize: 28,
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSubtle,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  activityIcon: {
    fontSize: 48,
    marginRight: 20,
  },
  cardContent: {
    flex: 1,
  },
  activityLabel: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.background,
    marginBottom: 4,
  },
  activityDescription: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: 'rgba(15, 15, 19, 0.8)',
    marginBottom: 8,
  },
  activityDuration: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(15, 15, 19, 0.6)',
    fontWeight: '600',
  },
});
