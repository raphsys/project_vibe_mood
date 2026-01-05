import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { MOODS } from '@/data/moods';
import { MoodBubble } from '@/components/MoodBubble';
import { HapticsService } from '@/services/haptics';

export default function MoodPickerScreen() {
  const router = useRouter();

  const handleMoodSelect = (moodId: string) => {
    HapticsService.medium();
    router.push(`/select-activity?mood=${moodId}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>VibeMood</Text>
        <Text style={styles.subtitle}>Comment te sens-tu ?</Text>
      </View>

      <FlatList
        data={MOODS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item, index }) => (
          <MoodBubble
            mood={item}
            onPress={() => handleMoodSelect(item.id)}
            index={index}
          />
        )}
      />

      <Text style={styles.footer}>Choisis ton humeur</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSubtle,
  },
  grid: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: 'center',
  },
  footer: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSubtle,
    textAlign: 'center',
    paddingBottom: 40,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
