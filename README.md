# VibeMood 🌸

Une app minimaliste et aesthetic pour réguler tes émotions via des micro-interactions apaisantes. Chaque mood a son univers sensoriel unique : sons, vibrations, lumières, et particules.

## 🎯 Features Complètes

### 5 Moods Uniques
- 😰 **Calm (Stressé)**: Sons apaisants 528 Hz, particules douces, vibrations légères
- 🔥 **Energy (Énergique)**: Sons explosifs, 12 particules chaotiques, vibrations intenses
- 🌀 **Dream (Perdu)**: Sons harmoniques mystiques, particules ondulantes, rotation hypnotique
- 🥰 **Love (Amoureux)**: Rythme de battement de cœur, particules rebondissantes, glow chaleureux
- 💤 **Focus (Fatigué)**: Sons méditatifs, particules minimalistes, respiration lente

### 5 Activités Ludiques
- 👆 **Tapoter**: Tapote un nuage, génère des particules (10s)
- 🫁 **Respirer**: Respiration guidée avec cercle animé (15s)
- ✏️ **Tracer**: Dessine des formes apaisantes (12s)
- 👋 **Balayer**: Fais disparaître des éléments (10s)
- 🤲 **Maintenir**: Appui long pour la pleine conscience (3-7s)

### Expérience Sensorielle
- ✅ **Sons génératifs** via Web Audio API (fréquences Solfeggio)
- ✅ **Vibrations haptiques** uniques par mood (patterns rythmiques)
- ✅ **Particules intelligentes** avec physique réaliste
- ✅ **Fonds animés** avec blobs morphing
- ✅ **Effets de lumière** (glow pulsatif)
- ✅ **Animations fluides** 60 FPS avec Reanimated
- ✅ **Sélection d'activité** personnalisable par mood
- ✅ **Preview vidéo** avec quote personnalisée
- ✅ **Partage** via Web Share API ou screenshot

## Tech Stack

- **Framework**: Expo + React Native
- **Navigation**: Expo Router
- **Animations**: react-native-reanimated (60 FPS)
- **Graphics**: react-native-svg
- **Audio**: Web Audio API (sons génératifs)
- **Haptics**: expo-haptics (patterns rythmiques)
- **Effects**: expo-linear-gradient, expo-blur

## Project Structure

```
vibemood/
├── app/                        # Screens (Expo Router)
│   ├── index.tsx              # Mood picker (5 bulles)
│   ├── activity.tsx           # Tap activity (expérience sensorielle)
│   └── result.tsx             # Result preview
├── components/                # Reusable UI
│   ├── MoodBubble.tsx        # Bulle animée pulsante
│   ├── MoodParticle.tsx      # Particule avec physique unique
│   ├── CloudShape.tsx        # Nuage SVG
│   ├── AmbientBackground.tsx # Blobs morphing
│   └── GlowEffect.tsx        # Halo lumineux
├── constants/                 # Theme
│   ├── colors.ts             # Palette 5 moods
│   └── typography.ts
├── data/                      # Static data
│   └── moods.ts              # 5 moods + 50 quotes
├── services/                  # Logic
│   ├── soundEngine.ts        # Web Audio API
│   └── haptics.ts            # Patterns vibratoires
└── types/                     # TypeScript
    └── mood.ts
```

## Design System

### Colors (5 Moods)
- **Background Global**: `#0F0F13` (warm dark)
- **Calm**: `#A8D8EA` (sky blue) → Respiration douce
- **Energy**: `#FF9E7D` (corail) → Feu explosif
- **Dream**: `#C9A0FF` (lavande) → Mystique flottant
- **Love**: `#FFA6C3` (rose poudré) → Chaleur tendre
- **Focus**: `#8FE3CF` (menthe) → Clarté méditative

### Typography
- **UI**: System (Inter-like)
- **Quotes**: System avec poids variables
- **Tailles**: Title 48px, Quote 28px, Body 16px

### Assets Génératifs (0 KB)
Tous les assets sont générés en temps réel :
- Sons via Web Audio API (oscillateurs)
- Particules via Reanimated (physique)
- Fonds via LinearGradient (morphing)
- Glow via Shadow (pulsation)

## Next Steps (Post-MVP)

### Phase 2: Real Video Generation
Pour générer de vraies vidéos natives (MP4 avec overlays):

**Option 1: Native Module (Recommended)**
- Sortir du managed workflow Expo
- Utiliser `expo-media-library` + Canvas API
- Composer vidéo côté natif (AVFoundation iOS / MediaCodec Android)

**Option 2: Backend Service**
- Envoyer les données (mood, quote, username) à une API
- Composer vidéo avec FFmpeg côté serveur
- Retourner l'URL de la vidéo

**Option 3: Expo + RevenueCat**
- Si tu ajoutes un paywall, exporter le projet localement
- Intégrer RevenueCat pour subscriptions
- Activer la génération vidéo HD en premium

### Phase 3: Assets Réels (Optionnel)
Remplacer les assets génératifs par de vrais fichiers :
- Sons ASMR professionnels (bols tibétains, carillons)
- Animations Lottie custom
- Vidéos de fond 1080x1920 (pluie, néons, brouillard)

### Phase 4: Nouvelles Activités
Au-delà du "tap" :
- **Souffle** (via micro ou simulation)
- **Cercle** (tracer des formes apaisantes)
- **Vague** (mouvement de balancier)
- **Appui long** (pression méditative)

### Phase 5: Monétization
- **Gratuit**: 5 moods, watermark, screenshots
- **Premium** (1.99€): Sans watermark, vidéos HD, historique, packs exclusifs
- In-app purchase avec RevenueCat

## How to Run

```bash
npm install
npm run dev
```

Pour tester sur mobile, installe Expo Go et scanne le QR code.

## Notes Techniques

- **Sons**: Web Audio API (web seulement, 0 KB d'assets)
- **Vibrations**: Expo Haptics (iOS/Android uniquement)
- **Particules**: Reanimated native driver (60 FPS garanti)
- **Vidéo**: Preview animée (screenshot-friendly)
- **Permissions**: Aucune permission requise

## Documentation Détaillée

### `ASSETS_GUIDE.md`
- Spécifications complètes des sons par mood
- Patterns de vibrations détaillés
- Physique des particules
- Configuration des animations
- Guide pour ajouter de vrais assets (optionnel)

### `ACTIVITIES_GUIDE.md`
- Détails des 5 activités ludiques
- Interactions et durées par activité
- Sons et vibrations spécifiques
- Design et UX de chaque activité
- Idées de contenu TikTok par activité

### `STRUCTURE.md`
- Architecture complète du projet
- Flow de navigation
- Détails techniques par fichier

## Prompt Bolt.new

Si tu veux regénérer ce projet ailleurs:

```
Create "VibeMood" - an immersive sensory mood regulation app with Expo.

Core Experience:
1. Mood Picker: 5 animated pulsing bubbles (Calm, Energy, Dream, Love, Focus)
2. Activity: 10-second tap interaction with unique sensory feedback per mood:
   - Generative sounds (Web Audio API with Solfeggio frequencies)
   - Haptic patterns (rhythmic vibrations)
   - Mood-specific particle physics (6-12 particles)
   - Ambient morphing backgrounds (gradient blobs)
   - Glowing effects (pulsating halos)
3. Result: Animated preview with gradient bg + quote + share buttons

Stack:
- Expo Router, react-native-reanimated, react-native-svg
- expo-haptics (patterns), expo-blur, expo-linear-gradient
- Web Audio API for generative sound (no audio files)

Design:
- Dark warm bg (#0F0F13)
- 5 mood colors with gradients
- All assets generated in real-time (0 KB)
- 60 FPS animations, premium feel
- No login, instant immersion

Key: Each mood has unique sound frequencies, haptic rhythms, particle behaviors,
and animation speeds. Make it FEEL different for each mood.
```

---

Fait avec ❤️ pour TikTok
