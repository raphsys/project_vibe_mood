import { Audio } from 'expo-av';

export class AudioService {
  private static sounds: Map<string, Audio.Sound> = new Map();

  static async load(name: string, uri: any) {
    try {
      const { sound } = await Audio.Sound.createAsync(uri);
      this.sounds.set(name, sound);
    } catch (error) {
      console.warn('Failed to load sound:', name, error);
    }
  }

  static async play(name: string, volume: number = 0.3) {
    try {
      const sound = this.sounds.get(name);
      if (sound) {
        await sound.setVolumeAsync(volume);
        await sound.replayAsync();
      }
    } catch (error) {
      console.warn('Failed to play sound:', name, error);
    }
  }

  static async unloadAll() {
    for (const sound of this.sounds.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.warn('Failed to unload sound:', error);
      }
    }
    this.sounds.clear();
  }
}
