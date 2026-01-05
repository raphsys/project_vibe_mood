# VibeMood - Structure Complète du Projet

## 📁 Architecture des Fichiers

```
vibemood/
│
├── 📱 app/                          # Navigation & Screens (Expo Router)
│   ├── _layout.tsx                  # Root layout avec Stack navigator
│   ├── +not-found.tsx              # 404 screen
│   ├── index.tsx                   # 🎯 Écran 1: Mood Picker
│   ├── activity.tsx                # 🎯 Écran 2: Tap Activity
│   └── result.tsx                  # 🎯 Résultat avec preview
│
├── 🎨 components/                   # Composants réutilisables
│   ├── MoodBubble.tsx              # Bulle animée pour chaque mood
│   ├── Particle.tsx                # Particule qui monte + fade
│   └── CloudShape.tsx              # Nuage SVG (shape custom)
│
├── 🎭 constants/                    # Design System
│   ├── colors.ts                   # Palette complète (moods + bg)
│   └── typography.ts               # Styles de texte
│
├── 📊 data/                         # Données statiques
│   └── moods.ts                    # Liste des 5 moods + quotes
│
├── 🛠️ services/                     # Logique métier
│   ├── haptics.ts                  # Vibrations (iOS/Android only)
│   └── audio.ts                    # Son ASMR (expo-av)
│
├── 📝 types/                        # TypeScript
│   └── mood.ts                     # Interface Mood
│
├── 🖼️ assets/                       # Ressources (TODO)
│   ├── images/
│   │   ├── favicon.png
│   │   └── icon.png
│   ├── lottie/                     # Animations Lottie (à ajouter)
│   │   ├── cloud_tap.json
│   │   └── particles_soft.json
│   ├── audio/                      # Sons ASMR (à ajouter)
│   │   └── tap_chime.wav
│   └── video/                      # Fonds vidéo (à ajouter)
│       └── bg_rain_10s.mp4
│
└── 📄 Config files
    ├── package.json                # Dependencies
    ├── tsconfig.json               # TypeScript config
    ├── app.json                    # Expo config
    └── .env                        # Supabase keys (non utilisés pour MVP)
```

---

## 🎯 Flow de Navigation

```
┌──────────────┐
│ index.tsx    │ Mood Picker
│ (Écran 1)    │ → Choix mood via bulles animées
└──────┬───────┘
       │ router.push('/activity?mood=calm')
       ▼
┌──────────────┐
│ activity.tsx │ Tap Activity
│ (Écran 2)    │ → 10 sec de tap + particules
└──────┬───────┘
       │ router.replace('/result?mood=calm&quote=...')
       ▼
┌──────────────┐
│ result.tsx   │ Preview vidéo
│ (Écran 3)    │ → Partage / Sauvegarde
└──────────────┘
```

---

## 🧩 Fichiers Clés - Détails

### 1. `app/index.tsx` - Mood Picker
**Rôle**: Écran d'accueil avec 5 bulles flottantes

**Composants**:
- `MoodBubble` (x5)
- FlatList en grille 2 colonnes

**Logique**:
- 1 seul mood actif (calm/stressé)
- Les autres sont grisés (opacity 0.3)
- Tap → navigation vers `/activity?mood=calm`

**Animations**:
- Bulles qui pulsent en boucle (withRepeat)
- Scale 1.0 → 1.05 sur 3-4 secondes

---

### 2. `app/activity.tsx` - Tap Activity
**Rôle**: Activité apaisante (10 sec de taps)

**Composants**:
- `CloudShape` (nuage SVG au centre)
- `Particle` (généré dynamiquement à chaque tap)
- Timer + barre de progression

**Logique**:
```typescript
const handleTap = () => {
  HapticsService.light();          // Vibration
  setTapCount((prev) => prev + 1); // Compteur

  // Génère 6 particules à positions aléatoires
  const particles = Array.from({ length: 6 }, ...);
  setParticles([...particles]);
};
```

**Timer**:
- 10 secondes (countdown)
- Auto-navigation vers `/result` à la fin
- Sélectionne une quote aléatoire

---

### 3. `app/result.tsx` - Result Preview
**Rôle**: Preview "vidéo" + partage

**Structure**:
```
┌─────────────────┐
│                 │
│    Gradient     │ ← Fond coloré (mood)
│    Background   │
│                 │
│   "Respire."    │ ← Quote centré
│                 │
│  @username  VM  │ ← Username + Watermark
└─────────────────┘
   [🔄] [💾] [📤]   ← Actions
```

**Actions**:
- 🔄 Refaire: retour à `/activity`
- 💾 Sauver: alerte "Fais un screenshot"
- 📤 Partager: Web Share API (si dispo)

**Animations**:
- Backdrop qui pulse (opacity 0.3 → 0.8)
- LinearGradient avec couleurs du mood

---

## 🎨 Design System

### Couleurs (`constants/colors.ts`)

```typescript
COLORS = {
  background: '#0F0F13',  // Fond global
  text: 'rgba(255, 255, 255, 0.9)',

  moods: {
    calm: {
      primary: '#A8D8EA',      // Bleu ciel
      gradient: ['#A8D8EA', '#7BC4E0'],
    },
    energy: {
      primary: '#FF9E7D',      // Corail
      gradient: ['#FF9E7D', '#FF7B54'],
    },
    // ... 3 autres moods
  }
}
```

### Typography (`constants/typography.ts`)

```typescript
TYPOGRAPHY = {
  title: { fontSize: 32, fontWeight: '700' },
  quote: { fontSize: 28, fontWeight: '600' },
  body: { fontSize: 16 },
  caption: { fontSize: 12 },
}
```

---

## 🧠 Logique Métier

### Services

**`services/haptics.ts`**
```typescript
HapticsService.light()   // Tap léger
HapticsService.medium()  // Sélection
HapticsService.success() // Succès
```

**`services/audio.ts`**
```typescript
AudioService.load('tap', require('...'))
AudioService.play('tap', volume: 0.3)
```

---

## 📊 Data Layer

### `data/moods.ts`
```typescript
export const MOODS: Mood[] = [
  {
    id: 'calm',
    emoji: '😰',
    label: 'Stressé',
    enabled: true,      // ← Seul mood actif en MVP
    quotes: [
      'Respire. Tout va bien.',
      'Tu mérites du calme',
      // ... 8 autres
    ],
  },
  // ... 4 autres moods (enabled: false)
]
```

---

## 🔧 Dépendances Clés

```json
{
  "expo": "^54",
  "expo-router": "~6",
  "react-native-reanimated": "~4",
  "react-native-svg": "15.12.1",
  "expo-linear-gradient": "~15",
  "expo-haptics": "~15",
  "expo-av": "~14",
  "lucide-react-native": "^0.544"
}
```

---

## 🚀 Comment Lancer

```bash
# Installation
npm install

# Dev (web)
npm run dev

# Build web
npm run build:web

# Mobile (Expo Go)
# Scanne le QR code avec l'app Expo Go
```

---

## 📝 TODO Assets (pour améliorer le rendu)

### Priorité 1 (MVP complet)
- [ ] **Son**: `assets/audio/tap_chime.wav`
  - Format: WAV ou MP3
  - Durée: 0.2-0.5 sec
  - Volume faible (ASMR-style)

- [ ] **Lottie Cloud**: `assets/lottie/cloud_tap.json`
  - Animation: idle (pulse) + tap (burst)
  - Couleur: blanc/transparent
  - Export via After Effects + Bodymovin

### Priorité 2 (Post-MVP)
- [ ] **Fond vidéo**: `assets/video/bg_rain_10s.mp4`
  - 1080x1920 (vertical)
  - 10 secondes en boucle
  - Pas de son (overlay seulement)

- [ ] **Font custom**: Satisfy (pour quotes)
  - Google Font: `Satisfy-Regular.ttf`
  - À placer dans `assets/fonts/`

---

## 🔮 Roadmap Post-MVP

### Phase 2: Vraie Génération Vidéo
**Problème actuel**: Preview = animation React, pas un fichier MP4

**Solutions**:

#### Option A: Backend (Recommandé)
```
Frontend → API (Supabase Edge Function)
         → FFmpeg compose vidéo
         → Upload Storage
         → Return URL
```

**Avantages**:
- Fonctionne sur tous devices
- Pas besoin de sortir du managed workflow
- Scalable

**Stack**:
- Supabase Edge Function + Deno
- FFmpeg.wasm (ou natif si Deno permet)
- Supabase Storage pour héberger les MP4

#### Option B: Natif (Plus complexe)
```
Expo → expo prebuild (sort du managed)
     → Module natif (Swift/Kotlin)
     → AVFoundation / MediaCodec
     → Compose vidéo côté device
```

**Avantages**:
- Offline
- Aucun serveur

**Inconvénients**:
- Complexe
- Maintenance iOS + Android

---

### Phase 3: Débloquer les Autres Moods

1. **Énergie** 🔥
   - Couleur: Corail (#FF9E7D)
   - Activité: Tapoter rapidement (rythme)

2. **Rêve** 🌀
   - Couleur: Lavande (#C9A0FF)
   - Activité: Tracer des cercles lents

3. **Amour** 🥰
   - Couleur: Rose poudré (#FFA6C3)
   - Activité: Appui long (heartbeat)

4. **Focus** 💤
   - Couleur: Menthe (#8FE3CF)
   - Activité: Souffle simulé

---

### Phase 4: Monétisation

```typescript
// Free vs Premium
{
  watermark: 'VibeMood',        // Free: visible
  videoQuality: '720p',         // Free: SD
  moodCount: 1,                 // Free: 1 mood
  quotesCount: 10,              // Free: 10 quotes
  backgrounds: 1,               // Free: 1 fond
}

{
  watermark: null,              // Premium: caché
  videoQuality: '1080p',        // Premium: HD
  moodCount: 5,                 // Premium: tous
  quotesCount: 100,             // Premium: plein
  backgrounds: 20,              // Premium: packs
}
```

**Outil**: RevenueCat (pour subscriptions natives Apple/Google)

---

## 🎬 Prompt Bolt.new (Full Version)

```
Project: VibeMood (Expo + React Native)

Goal: Build an aesthetic mood regulation app with 3 screens and beautiful animations.

Flow:
1. Mood Picker: 5 animated bubbles (only "Stressed" enabled). Each bubble pulses gently. Dark warm background (#0F0F13).

2. Activity: User taps a soft SVG cloud for 10 seconds. Each tap generates 6 particles that float upward and fade. Show timer + progress bar. Use expo-haptics for feedback.

3. Result: Display an animated "video preview" with:
   - LinearGradient background (mood colors)
   - Centered quote text (large, white, shadow)
   - Username bottom-right (@toi)
   - Watermark bottom-left (VibeMood)
   - 3 action buttons: Retry, Save, Share

Stack:
- Expo Router (Stack navigation)
- react-native-reanimated (animations)
- react-native-svg (cloud shape)
- expo-linear-gradient (backgrounds)
- expo-haptics (vibrations)
- expo-av (audio - optional)
- lucide-react-native (icons)

Design:
- Dark warm bg: #0F0F13
- Calm mood: #A8D8EA (sky blue)
- Typography: Title 32px, Quote 28px, Body 16px
- All animations soft (withRepeat, withTiming)
- No sharp edges, everything rounded

Structure:
app/index.tsx (mood picker)
app/activity.tsx (tap activity)
app/result.tsx (preview)
components/MoodBubble.tsx
components/Particle.tsx
components/CloudShape.tsx
constants/colors.ts
constants/typography.ts
data/moods.ts
services/haptics.ts
services/audio.ts
types/mood.ts

Important:
- Platform.select() for haptics (web unsupported)
- No login, no tutorial
- Clean, maintainable code
- Handle navigation with Expo Router params
- Build must succeed (no errors)

Deliverable: Full working MVP, ready to test in browser + Expo Go.
```

---

## 📞 Support

Pour toute question sur l'architecture:
1. Lis le `README.md` (overview)
2. Lis le `STRUCTURE.md` (ce fichier - détails)
3. Check le code des 3 screens principaux
4. Les commentaires inline expliquent les choix techniques

---

**Fait avec ❤️ pour TikTok** 🌸
