# VibeMood - Guide des Activités Ludiques

## 🎮 Vue d'ensemble

VibeMood propose **5 activités interactives** que l'utilisateur peut choisir selon son humeur et ses préférences. Chaque activité a ses propres interactions sensorielles (sons, vibrations, animations).

---

## 🎯 Flow Utilisateur

```
Mood Picker → Select Activity → Activity (8-15s) → Result
   (5 moods)     (5 activités)    (expérience)     (vidéo)
```

1. **Choisir son mood** (Stressé, Énergique, Perdu, Amoureux, Fatigué)
2. **Choisir son activité** parmi 5 options
3. **Vivre l'expérience sensorielle** pendant X secondes
4. **Recevoir sa vidéo** avec quote personnalisée

---

## 🎨 Les 5 Activités

### 1. 👆 Tapoter (Tap)
**Durée**: 10 secondes

**Interaction**:
- Tapote un nuage doux au centre de l'écran
- Chaque tap génère des particules colorées
- Son + vibration à chaque tap

**Particules par mood**:
- **Calm**: 6 bulles qui montent doucement
- **Energy**: 12 étincelles explosives
- **Dream**: 8 confettis qui ondulent
- **Love**: 10 cœurs qui rebondissent
- **Focus**: 4 points minimalistes

**Idéal pour**: Libération rapide, satisfaction tactile

---

### 2. 🫁 Respirer (Breathe)
**Durée**: 15 secondes

**Interaction**:
- Un cercle grandit (inspire) et rétrécit (expire)
- Suis le rythme de respiration guidée
- Son et vibration à chaque cycle

**Rythme par mood**:
- **Calm**: 4s inspire / 6s expire (relaxation profonde)
- **Energy**: 2s / 2s (respiration rapide, énergisante)
- **Dream**: 5s / 7s (respiration lente, méditative)
- **Love**: 3.5s / 3.5s (respiration équilibrée)
- **Focus**: 4s / 4s (respiration box)

**Idéal pour**: Ancrage, gestion du stress, méditation

---

### 3. ✏️ Tracer (Draw)
**Durée**: 12 secondes

**Interaction**:
- Trace des formes libres avec ton doigt
- Les traits restent à l'écran et s'estompent progressivement
- Son + vibration à chaque trait

**Style par mood**:
- **Calm**: Traits fins (3px), 5 max à l'écran
- **Energy**: Traits épais (8px), 15 max (traçage rapide)
- **Dream**: Traits moyens (5px), 8 max avec transparence
- **Love**: Traits doux (6px), 10 max
- **Focus**: Traits très fins (2px), 3 max (précision)

**Idéal pour**: Expression créative, lâcher-prise

---

### 4. 👋 Balayer (Swipe)
**Durée**: 10 secondes

**Interaction**:
- Des formes apparaissent aléatoirement sur l'écran
- Fais-les disparaître en les balayant avec ton doigt
- Son + vibration à chaque balayage

**Spawn par mood**:
- **Calm**: Cercles 60px, spawn toutes les 2s, max 5
- **Energy**: Carrés 40px, spawn toutes les 0.8s, max 12
- **Dream**: Grands cercles flous 80px, spawn toutes les 3s, max 4
- **Love**: Cercles moyens 50px, spawn toutes les 1.5s, max 8
- **Focus**: Petits carrés arrondis 30px, spawn toutes les 2.5s, max 3

**Idéal pour**: Libération d'énergie, satisfaction immédiate

---

### 5. 🤲 Maintenir (Hold)
**Durée**: Variable (3-7s selon mood)

**Interaction**:
- Appuie longuement sur le cercle central
- Un cercle de progression se remplit progressivement
- Relâche trop tôt → recommence
- Complète → son + vibration de célébration

**Durée par mood**:
- **Calm**: 5s (patience modérée)
- **Energy**: 3s (intensité courte)
- **Dream**: 7s (lenteur contemplative)
- **Love**: 4s (douceur)
- **Focus**: 6s (concentration prolongée)

**Idéal pour**: Patience, pleine conscience, ancrage

---

## 🎵 Sons par Activité

Chaque activité utilise les mêmes fréquences que pour "Tap", mais avec des variations :

### Tap
- Son court (0.15-0.3s) à chaque tap
- Fréquence selon mood

### Breathe
- Son d'inspiration (0.5s, fréquence montante)
- Son d'expiration (0.5s, fréquence descendante)
- Cycles continus

### Draw
- Son de "brush" léger à chaque début de trait
- Très subtil (volume 20%)

### Swipe
- Son de "whoosh" à chaque balayage
- Plus fort et satisfaisant

### Hold
- Son continu pendant le maintien (drone)
- Son de célébration à la fin

---

## 📳 Vibrations par Activité

### Tap
- Pattern mood (défini dans `haptics.ts`)

### Breathe
- Light au début de l'inspiration
- Light au début de l'expiration

### Draw
- Light au début de chaque trait

### Swipe
- Medium à chaque balayage (satisfaction)

### Hold
- Medium au début
- Heavy + Success à la fin

---

## 🎨 Design de l'Écran de Sélection

### Layout
```
┌─────────────────┐
│     😰          │ ← Emoji du mood
│ Choisis ton     │ ← Titre
│   activité      │
│  (Stressé)      │ ← Label du mood
│                 │
│ ┌─────────────┐ │
│ │ 👆 Tapoter  │ │ ← Card activité 1
│ │ Tapote...   │ │
│ │ 10s         │ │
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │ 🫁 Respirer │ │ ← Card activité 2
│ │ Suis...     │ │
│ │ 15s         │ │
│ └─────────────┘ │
│                 │
│ ... (3 autres) │
└─────────────────┘
```

### Animations
- Cards entrent avec FadeIn staggeré (100ms entre chaque)
- Scale 0.95 au tap
- Gradient de la couleur du mood

---

## 🚀 Avantages du Système Multi-Activités

### Pour l'Utilisateur
1. **Choix et contrôle**: Adapte l'expérience à son état
2. **Variété**: Ne se lasse pas de l'app
3. **Découverte**: Teste différentes approches de régulation
4. **Engagement**: Plus ludique et interactif

### Pour l'App
1. **Rétention**: Plus de raisons de revenir
2. **Viralité**: Plus de contenus à partager (5 types de vidéos)
3. **Premium**: Possibilité de débloquer des activités exclusives
4. **Data**: Comprendre quelles activités fonctionnent le mieux

---

## 📊 Metrics par Activité

Tu peux tracker :
- Activité préférée par mood
- Taux de complétion par activité
- Temps moyen par activité
- Partages par type d'activité

---

## 🎯 Activités Premium (Futures)

### Phase 2
- **Shake** (Secouer): Secoue ton téléphone pour libérer l'énergie
- **Blow** (Souffler): Souffle dans le micro pour faire voler des feuilles
- **Wave** (Vague): Balance ton téléphone comme une vague

### Phase 3
- **Puzzle**: Reconstitue une image apaisante
- **Match**: Associe des couleurs/formes
- **Rhythm**: Tape en rythme sur une mélodie

---

## 🛠️ Technique

### Structure
```
components/activities/
├── TapActivity.tsx       # Activité originale
├── BreatheActivity.tsx   # Respiration guidée
├── DrawActivity.tsx      # Traçage libre
├── SwipeActivity.tsx     # Balayage d'éléments
└── HoldActivity.tsx      # Appui long

data/activities.ts        # Définition des 5 activités

app/select-activity.tsx   # Écran de sélection
```

### Props Communes
Toutes les activités reçoivent :
```typescript
interface ActivityProps {
  mood: MoodType;         // Pour adapter le comportement
  color: string;          // Couleur du mood
  onAction: () => void;   // Callback pour sons/vibrations
}
```

---

## 🎥 Contenu TikTok

### Idées de Vidéos
1. "5 façons d'apaiser ton stress en 10 secondes"
2. "Choisis ton activité selon ton mood"
3. "POV: tu découvres l'activité Breathe" (méditative)
4. "L'activité Swipe quand t'as besoin de TOUT balayer"
5. "Comparaison: Tap vs Hold vs Draw"

### Hooks
- "Quelle activité te correspond le plus ?"
- "Tu es plutôt Tap ou Breathe ?"
- "L'activité secrète pour calmer l'anxiété"

---

**Fait avec ❤️ pour une expérience personnalisable**
