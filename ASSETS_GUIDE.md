# VibeMood - Guide Complet des Assets Sensoriels

## 🎨 Vue d'ensemble

VibeMood utilise des **assets génératifs** pour créer une expérience sensorielle unique pour chaque mood. Tout est généré en temps réel : sons, vibrations, animations, lumières.

---

## 🎵 Sons (Web Audio API)

### Architecture
- **Moteur**: `services/soundEngine.ts`
- **Technologie**: Web Audio API native (aucune dépendance externe)
- **Format**: Oscillateurs synthétiques (fréquences Solfeggio)

### Sons par Mood

#### 😰 Calm (Stressé)
- **Fréquences**: 528 Hz (réparation ADN)
- **Timbre**: Onde sinusoïdale pure
- **Durée**: 0.15s par tap, 0.4s à la fin
- **Effet**: Son cristallin, apaisant

#### 🔥 Energy (Énergique)
- **Fréquences**: 800-1600 Hz (montantes)
- **Timbre**: Onde carrée (aggressive)
- **Durée**: 0.1s en rafale (double tap)
- **Effet**: Percussion électronique, énergisant

#### 🌀 Dream (Perdu)
- **Fréquences**: 432 Hz + 648 Hz (harmoniques)
- **Timbre**: Onde sinusoïdale douce
- **Durée**: 0.3s avec délai de 100ms
- **Effet**: Écho mystique, flottant

#### 🥰 Love (Amoureux)
- **Fréquences**: 639 Hz (connexion) + 852 Hz (intuition)
- **Timbre**: Onde sinusoïdale chaleureuse
- **Durée**: 0.2s avec rythme de battement de cœur (80ms)
- **Effet**: Pulsation douce, tendre

#### 💤 Focus (Fatigué)
- **Fréquences**: 396 Hz (libération peur)
- **Timbre**: Onde triangulaire (méditative)
- **Durée**: 0.25s, espacée (200ms)
- **Effet**: Ton grave, apaisant, ralentissement

### Son Ambiant
Chaque mood a 3 fréquences harmoniques qui jouent en continu pendant l'activité (volume 5%, durée 10s).

---

## 📳 Vibrations (Haptics)

### Architecture
- **Service**: `services/haptics.ts`
- **Technologie**: Expo Haptics (iOS/Android uniquement)
- **Patterns**: Séquences rythmiques uniques

### Patterns par Mood

#### 😰 Calm
```
▪️ (Light)
Simple tap léger
```

#### 🔥 Energy
```
▪️▪️ (Heavy → Medium)
Double impact explosif (50ms entre)
```

#### 🌀 Dream
```
▪️ ··· ▪️ (Light → Light)
Double tap éthéré (100ms entre)
```

#### 🥰 Love
```
▪️▫️▪️ (Medium → Light → Medium)
Rythme de cœur : 80ms / 80ms
```

#### 💤 Focus
```
▪️ ······ ▪️ (Light → Light)
Respiration lente (200ms)
```

### Vibrations de Fin d'Activité

Chaque mood a une **séquence de célébration** unique :

- **Calm**: 1x Success notification
- **Energy**: 3x Heavy impacts rapides (100ms)
- **Dream**: Light → Medium → Light (150ms chaque)
- **Love**: 2x battements de cœur complets
- **Focus**: 2x Medium espacés (300ms)

---

## 🎆 Particules

### Architecture
- **Composant**: `components/MoodParticle.tsx`
- **Technologie**: react-native-reanimated
- **Physique**: Gravité inverse, rotation, ondulation

### Système par Mood

#### 😰 Calm
- **Quantité**: 6 particules
- **Forme**: Petits cercles (6px)
- **Mouvement**: Montée douce, fade progressif
- **Durée**: 1.8s
- **Effet**: Bulles d'air qui s'élèvent

#### 🔥 Energy
- **Quantité**: 12 particules (explosif)
- **Forme**: Carrés (10px)
- **Mouvement**: Trajectoires chaotiques + rotation 360°
- **Durée**: 0.8s
- **Effet**: Étincelles qui éclatent

#### 🌀 Dream
- **Forme**: Grands cercles flous (12px, opacity 0.7)
- **Quantité**: 8 particules
- **Mouvement**: Ondulation sinusoïdale + rotation lente
- **Durée**: 2.5s
- **Effet**: Confettis flottants en apesanteur

#### 🥰 Love
- **Quantité**: 10 particules
- **Forme**: Cercles moyens (8px)
- **Mouvement**: Bonds élastiques (spring physics)
- **Durée**: 1.8s
- **Effet**: Cœurs qui rebondissent

#### 💤 Focus
- **Quantité**: 4 particules (minimaliste)
- **Forme**: Petits points (4px)
- **Mouvement**: Montée linéaire + clignotement
- **Durée**: 2s
- **Effet**: Respiration lumineuse

---

## 🌊 Fonds Animés

### Architecture
- **Composant**: `components/AmbientBackground.tsx`
- **Technologie**: LinearGradient + reanimated
- **Effet**: Blobs morphing (à la macOS Big Sur)

### Animation par Mood

#### 😰 Calm
- **Durée cycle**: 4s (lent)
- **Mouvement**: Scale 1.0 → 1.5, fade opacity
- **Effet**: Respiration douce

#### 🔥 Energy
- **Durée cycle**: 1.5s (rapide)
- **Mouvement**: Scale pulsatif rapide
- **Effet**: Battements cardiaques intenses

#### 🌀 Dream
- **Durée cycle**: 6s (très lent)
- **Mouvement**: Scale + rotation 360° continue
- **Effet**: Nébuleuses tournantes

#### 🥰 Love
- **Durée cycle**: 3s (modéré)
- **Mouvement**: Scale pulsatif doux
- **Effet**: Lueur chaleureuse pulsante

#### 💤 Focus
- **Durée cycle**: 5s (méditatif)
- **Mouvement**: Scale + rotation lente
- **Effet**: Mandala hypnotique

### Couleurs des Blobs
- 2 blobs par écran (coins opposés)
- Gradients basés sur les couleurs du mood
- Opacity: 0.3 → 0.8 (respiration)
- Taille: 1.5x largeur d'écran

---

## ✨ Effets de Lumière

### Architecture
- **Composant**: `components/GlowEffect.tsx`
- **Technologie**: Shadow + reanimated
- **Effet**: Halo lumineux derrière le nuage

### Glow par Mood

#### 😰 Calm
- **Intensité**: 10-30% opacity
- **Pulsation**: 2s
- **Taille**: Scale 1.0 → 1.2
- **Effet**: Lueur douce et stable

#### 🔥 Energy
- **Intensité**: 30-70% opacity (intense)
- **Pulsation**: 0.5s (rapide)
- **Taille**: Scale 1.0 → 1.5
- **Effet**: Explosion de lumière

#### 🌀 Dream
- **Intensité**: 5-25% opacity (subtil)
- **Pulsation**: 3s (très lent)
- **Taille**: Scale 1.0 → 1.3
- **Effet**: Aura mystique

#### 🥰 Love
- **Intensité**: 20-50% opacity
- **Pulsation**: 1.5s (battement de cœur)
- **Taille**: Scale 1.0 → 1.4
- **Effet**: Halo chaud et enveloppant

#### 💤 Focus
- **Intensité**: 15-35% opacity
- **Pulsation**: 2.5s (respiration)
- **Taille**: Scale 1.0 → 1.1 (stable)
- **Effet**: Concentration centrée

---

## 🎭 Nuage SVG

### Architecture
- **Composant**: `components/CloudShape.tsx`
- **Technologie**: react-native-svg
- **Forme**: 4 ellipses superposées (forme de cumulus)

### Adaptations
- Couleur change selon le mood
- Taille: 200-250px selon l'écran
- Réagit aux taps (scale spring)

---

## 🎬 Écran de Résultat

### Composition
1. **Fond**: LinearGradient du mood (3 couleurs)
2. **Backdrop**: Overlay animé (pulse opacity)
3. **Quote**: Texte centré avec shadow
4. **Overlay**: Username + Watermark

### Export
Pour le moment : Screenshot-friendly (preview animée)

**Future**: Vraie génération vidéo MP4 avec:
- FFmpeg côté serveur (Supabase Edge Function)
- Ou module natif iOS/Android

---

## 📊 Récapitulatif Technique

| Feature | Technologie | Plateforme |
|---------|-------------|------------|
| Sons | Web Audio API | Web uniquement |
| Vibrations | Expo Haptics | iOS/Android |
| Particules | Reanimated 3 | Toutes |
| Fonds animés | LinearGradient + Reanimated | Toutes |
| Glow | Shadow + Reanimated | Toutes |
| SVG Cloud | react-native-svg | Toutes |

---

## 🚀 Performance

### Optimisations
- **Sons**: Générés à la volée (0 KB d'assets)
- **Particules**: Nettoyées après animation
- **Glow**: Single shared value par effet
- **Background**: 2 blobs max (pas de overdraw)

### Budget
- Particules simultanées max: ~20
- Sons simultanés: ~5 oscillateurs
- Animations: 60 FPS garanti avec Reanimated

---

## 🎯 Prochaines Étapes (Optionnel)

### Assets Réels (si besoin)
Si tu veux remplacer les assets génératifs par de vrais fichiers :

1. **Sons ASMR**
   - `assets/audio/calm_chime.wav` (528 Hz bol tibétain)
   - `assets/audio/energy_snap.wav` (claquement)
   - `assets/audio/dream_bell.wav` (carillon)
   - `assets/audio/love_heartbeat.wav` (battement)
   - `assets/audio/focus_breath.wav` (respiration)

2. **Animations Lottie**
   - `assets/lottie/calm_cloud.json` (nuage doux)
   - `assets/lottie/energy_fire.json` (flammes)
   - `assets/lottie/dream_spiral.json` (spirale)
   - `assets/lottie/love_heart.json` (cœur)
   - `assets/lottie/focus_dot.json` (point méditatif)

3. **Vidéos de Fond**
   - `assets/video/calm_rain.mp4` (pluie 1080x1920)
   - `assets/video/energy_neon.mp4` (néons cyberpunk)
   - `assets/video/dream_fog.mp4` (brouillard)
   - `assets/video/love_sakura.mp4` (pétales)
   - `assets/video/focus_stars.mp4` (étoiles)

### Sources d'Assets
- **Sons**: Freesound.org (CC0)
- **Lottie**: LottieFiles.com (gratuits)
- **Vidéos**: Pexels.com (stock gratuit)

---

## 📝 Notes pour TikTok

### Moments Viraux
1. **Tap Energy**: Les 12 particules qui explosent (très satisfaisant)
2. **Love Heartbeat**: Le rythme des vibrations (ASMR)
3. **Dream Swirl**: Les particules qui ondulent (hypnotique)
4. **Transition**: De l'activité au résultat (smooth)

### Caption Ideas
- "POV: tu apaises ton stress en 10 secondes"
- "Choisis ton vibe et ressens-le vraiment"
- "ASMR x wellness app"
- "Les vibrations de chaque émotion"

---

**Fait avec ❤️ pour une expérience sensorielle complète**
