/*
  # VibeMood Gaming System

  ## New Tables
  
  ### `user_profiles`
  Stores user progression, XP, levels, and statistics
  - `id` (uuid, primary key) - User ID
  - `username` (text) - Display name
  - `level` (integer) - Current level
  - `xp` (integer) - Experience points
  - `total_sessions` (integer) - Total activity sessions completed
  - `total_score` (bigint) - Lifetime score
  - `streak_days` (integer) - Current daily streak
  - `last_played` (timestamptz) - Last session timestamp
  - `created_at` (timestamptz) - Account creation
  
  ### `activity_sessions`
  Records every activity session with detailed metrics
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Reference to user
  - `mood` (text) - Mood type (calm, energy, dream, love, focus)
  - `activity_type` (text) - Activity ID (tap, draw, swipe, breathe, hold)
  - `score` (integer) - Session score
  - `accuracy` (numeric) - Average accuracy percentage
  - `max_combo` (integer) - Highest combo achieved
  - `duration` (integer) - Session duration in seconds
  - `completed_at` (timestamptz) - When session finished
  
  ### `achievements`
  Master list of all possible achievements
  - `id` (text, primary key) - Achievement ID
  - `name` (text) - Achievement name
  - `description` (text) - What it unlocks
  - `icon` (text) - Emoji or icon
  - `category` (text) - Type (score, combo, streak, mastery)
  - `requirement` (integer) - Value needed to unlock
  - `xp_reward` (integer) - XP given when unlocked
  
  ### `user_achievements`
  Tracks which achievements users have unlocked
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `achievement_id` (text, foreign key)
  - `unlocked_at` (timestamptz)
  - `progress` (integer) - Current progress toward achievement
  
  ### `unlockables`
  Items users can unlock (patterns, colors, effects)
  - `id` (text, primary key)
  - `name` (text)
  - `type` (text) - pattern, color, effect, theme
  - `data` (jsonb) - Configuration data
  - `unlock_level` (integer) - Level required
  - `unlock_xp` (integer) - XP cost to unlock
  
  ### `user_unlockables`
  Tracks what each user has unlocked
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `unlockable_id` (text, foreign key)
  - `unlocked_at` (timestamptz)
  - `is_equipped` (boolean) - Currently using this item
  
  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Achievements and unlockables are readable by all
*/

-- User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text DEFAULT 'Player',
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  total_sessions integer DEFAULT 0,
  total_score bigint DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_played timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Activity Sessions
CREATE TABLE IF NOT EXISTS activity_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  mood text NOT NULL,
  activity_type text NOT NULL,
  score integer DEFAULT 0,
  accuracy numeric DEFAULT 0,
  max_combo integer DEFAULT 0,
  duration integer DEFAULT 0,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE activity_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON activity_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON activity_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Achievements Master List
CREATE TABLE IF NOT EXISTS achievements (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL,
  requirement integer DEFAULT 1,
  xp_reward integer DEFAULT 100
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_id text REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  progress integer DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON user_achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Unlockables Master List
CREATE TABLE IF NOT EXISTS unlockables (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  unlock_level integer DEFAULT 1,
  unlock_xp integer DEFAULT 0
);

ALTER TABLE unlockables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view unlockables"
  ON unlockables FOR SELECT
  TO authenticated
  USING (true);

-- User Unlockables
CREATE TABLE IF NOT EXISTS user_unlockables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  unlockable_id text REFERENCES unlockables(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  is_equipped boolean DEFAULT false,
  UNIQUE(user_id, unlockable_id)
);

ALTER TABLE user_unlockables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own unlockables"
  ON user_unlockables FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own unlockables"
  ON user_unlockables FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own unlockables"
  ON user_unlockables FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert default achievements
INSERT INTO achievements (id, name, description, icon, category, requirement, xp_reward) VALUES
  ('first_steps', 'Premiers Pas', 'Complete ta premiere activite', '🌟', 'progress', 1, 50),
  ('score_1000', 'Novice', 'Atteins 1000 points', '🎯', 'score', 1000, 100),
  ('score_5000', 'Expert', 'Atteins 5000 points', '🏆', 'score', 5000, 250),
  ('score_10000', 'Maitre', 'Atteins 10000 points', '👑', 'score', 10000, 500),
  ('combo_10', 'En Feu', 'Fais un combo de 10', '🔥', 'combo', 10, 100),
  ('combo_25', 'Inarretable', 'Fais un combo de 25', '⚡', 'combo', 25, 250),
  ('combo_50', 'Legendaire', 'Fais un combo de 50', '💫', 'combo', 50, 500),
  ('streak_3', 'Regulier', 'Joue 3 jours consecutifs', '📅', 'streak', 3, 150),
  ('streak_7', 'Devoue', 'Joue 7 jours consecutifs', '🌈', 'streak', 7, 300),
  ('perfect_20', 'Precision', 'Fais 20 taps parfaits', '🎪', 'mastery', 20, 200),
  ('zen_master', 'Maitre Zen', 'Complete 50 sessions', '🧘', 'mastery', 50, 1000)
ON CONFLICT (id) DO NOTHING;

-- Insert default unlockables
INSERT INTO unlockables (id, name, type, data, unlock_level, unlock_xp) VALUES
  ('aurora', 'Aurore Boreale', 'theme', '{"colors": ["#00ff88", "#0088ff", "#ff00ff"]}', 5, 500),
  ('galaxy', 'Galaxie', 'theme', '{"colors": ["#1a0033", "#4a0080", "#8000ff"]}', 10, 1000),
  ('sunset', 'Coucher de Soleil', 'theme', '{"colors": ["#ff6b35", "#f7931e", "#fbb040"]}', 15, 1500),
  ('ocean', 'Ocean Profond', 'theme', '{"colors": ["#006994", "#0099cc", "#00ccff"]}', 20, 2000),
  ('trail_sparkle', 'Trainee Etincelante', 'effect', '{"type": "sparkle"}', 8, 800),
  ('trail_rainbow', 'Arc-en-ciel', 'effect', '{"type": "rainbow"}', 12, 1200),
  ('explosion_stars', 'Explosion Etoiles', 'effect', '{"type": "stars"}', 18, 1800),
  ('pattern_flower', 'Fleur de Vie', 'pattern', '{"shape": "flower"}', 7, 700),
  ('pattern_mandala', 'Mandala', 'pattern', '{"shape": "mandala"}', 14, 1400)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_sessions_user_id ON activity_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_sessions_completed_at ON activity_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_unlockables_user_id ON user_unlockables(user_id);
