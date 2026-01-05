import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect, useRef } from 'react';
import { RotateCw, Save, Share2 } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { MOODS } from '@/data/moods';
import { HapticsService } from '@/services/haptics';
import { MoodType } from '@/types/mood';

const { width, height } = Dimensions.get('window');
const PREVIEW_WIDTH = Math.min(width * 0.9, 400);
const PREVIEW_HEIGHT = PREVIEW_WIDTH * 1.6;

export default function ResultScreen() {
  const router = useRouter();
  const { mood: moodId, quote } = useLocalSearchParams<{ mood: string; quote: string }>();

  const mood = MOODS.find((m) => m.id === moodId);
  const moodColors = mood ? COLORS.moods[mood.id as MoodType] : COLORS.moods.calm;

  const fadeOpacity = useSharedValue(0.3);

  useEffect(() => {
    fadeOpacity.value = withRepeat(
      withTiming(0.8, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
  }));

  const handleRetry = () => {
    HapticsService.light();
    router.back();
  };

  const handleSave = () => {
    HapticsService.success();
    alert('Pour sauvegarder, fais une capture d\'écran ! 📸\n\n(Génération vidéo native à venir)');
  };

  const handleShare = async () => {
    HapticsService.medium();

    if (Platform.OS === 'web' && navigator.share) {
      try {
        await navigator.share({
          title: 'VibeMood',
          text: `Mon mood: ${quote}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      alert('Fais une capture d\'écran et partage-la sur TikTok ! 🎥');
    }
  };

  const handleChangeMood = () => {
    HapticsService.light();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.previewContainer}>
        <View style={[styles.preview, { width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }]}>
          <LinearGradient
            colors={[...moodColors.gradient, moodColors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />

            <View style={styles.content}>
              <Text style={styles.quote}>{decodeURIComponent(quote || '')}</Text>
            </View>

            <View style={styles.overlay}>
              <Text style={styles.username}>@toi</Text>
              <Text style={styles.watermark}>VibeMood</Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.actions}>
        <ActionButton icon={RotateCw} label="Refaire" onPress={handleRetry} />
        <ActionButton icon={Save} label="Sauver" onPress={handleSave} primary />
        <ActionButton icon={Share2} label="Partager" onPress={handleShare} />
      </View>

      <TouchableOpacity style={styles.changeMood} onPress={handleChangeMood}>
        <Text style={styles.changeMoodText}>Changer d'humeur</Text>
      </TouchableOpacity>
    </View>
  );
}

interface ActionButtonProps {
  icon: any;
  label: string;
  onPress: () => void;
  primary?: boolean;
}

function ActionButton({ icon: Icon, label, onPress, primary }: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, primary && styles.actionButtonPrimary]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon size={24} color={primary ? COLORS.background : COLORS.text} />
      <Text style={[styles.actionLabel, primary && styles.actionLabelPrimary]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  preview: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  gradient: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  quote: {
    ...TYPOGRAPHY.quote,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  username: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  watermark: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 100,
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.text,
  },
  actionLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    marginTop: 6,
    fontWeight: '600',
  },
  actionLabelPrimary: {
    color: COLORS.background,
  },
  changeMood: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  changeMoodText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSubtle,
    textDecorationLine: 'underline',
  },
});
