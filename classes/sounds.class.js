/**
 * Centralized audio manager for handling game sound effects and background audio.
 * - Loads sounds, provides play/stop, and global mute/unmute.
 */
class AudioManager {
  constructor() {
    /** Helper to init audio with default volume. */
    const initSound = (path) => {
      const audio = new Audio(path);
      audio.volume = 0.1;
      return audio;
    };

    this.chicken_sound = initSound("audio/chicken_dead.mp3");
    this.endboss_sound = initSound("audio/endboss_dead.mp3");
    this.hurt_sound = initSound("audio/hurt_character.mp3");
    this.jump_sound = initSound("audio/jump.mp3");
    this.coin_sound = initSound("audio/coin.mp3");
    this.pop_sound = initSound("audio/pop_bottle.mp3");
    this.splash_sound = initSound("audio/bottle_splash.mp3");
    this.idle_sound = initSound("audio/idle.mp3");

    /** List of initialized sounds for mute/unmute. */
    this.allSounds = [
      this.chicken_sound, this.endboss_sound, this.hurt_sound,
      this.jump_sound, this.coin_sound, this.pop_sound,
      this.splash_sound, this.idle_sound
    ];

    // gespeicherten Mute-Status sofort übernehmen
    const savedMuted = JSON.parse(localStorage.getItem("isMuted") || "false");
    this.allSounds.forEach(s => s.muted = savedMuted);
  }

  /** Mute/unmute all initialized sounds. */
  muteSounds()   { this.allSounds.forEach(s => s.muted = true); }
  unmuteSounds() { this.allSounds.forEach(s => s.muted = false); }

  /** Generic helpers. */
  play(sound) { sound?.play(); }
  stop(sound) { if (sound) sound.pause(); }

  /** Individual wrappers */
  playSplashSound() { this.play(this.splash_sound); }
  stopSplashSound() { this.stop(this.splash_sound); }
  playIdleSound() { this.play(this.idle_sound); }
  stopIdleSound() { this.stop(this.idle_sound); }
  playPopSound() { this.play(this.pop_sound); }
  stopPopSound() { this.stop(this.pop_sound); }
  playCoinSound() { this.play(this.coin_sound); }
  stopCoinSound() { this.stop(this.coin_sound); }
  playChickenSound() { this.play(this.chicken_sound); }
  stopChickenSound() { this.stop(this.chicken_sound); }
  playEndbossSound() { this.play(this.endboss_sound); }
  stopEndbossSound() { this.stop(this.endboss_sound); }
  playHurtSound() { this.play(this.hurt_sound); }
  stopHurtSound() { this.stop(this.hurt_sound); }
  playJumpSound() { this.play(this.jump_sound); }
  stopJumpSound() { this.stop(this.jump_sound); }
}
