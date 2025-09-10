/**
 * Centralized audio manager for handling game sound effects and background audio.
 *
 * Responsibilities:
 * - Loads and stores audio files for game events (e.g., jump, coin, hurt, chicken death).
 * - Provides play/stop methods for each sound.
 * - Provides global mute/unmute functionality.
 *
 * Notes:
 * - All sounds initialized in the constructor have a default volume of 0.1.
 * - Some sounds (`background_sound`, `game_over_sound`, `win_sound`) are referenced
 *   but not initialized in the constructor. Attempting to call their play/stop
 *   methods without initialization will cause runtime errors.
 */
class AudioManager {
  constructor() {
    /** Chicken death sound. */
    this.chicken_sound = new Audio("audio/chicken_dead.mp3");
    this.chicken_sound.volume = 0.1;

    /** End boss sound (hurt/dead). */
    this.endboss_sound = new Audio("audio/endboss_dead.mp3");
    this.endboss_sound.volume = 0.1;

    /** Character hurt sound. */
    this.hurt_sound = new Audio("audio/hurt_character.mp3");
    this.hurt_sound.volume = 0.1;

    /** Jump sound. */
    this.jump_sound = new Audio("audio/jump.mp3");
    this.jump_sound.volume = 0.1;

    /** Coin pickup sound. */
    this.coin_sound = new Audio("audio/coin.mp3");
    this.coin_sound.volume = 0.1;

    /** Bottle throw/pop sound. */
    this.pop_sound = new Audio("audio/pop_bottle.mp3");
    this.pop_sound.volume = 0.1;

    /** Bottle splash sound. */
    this.splash_sound = new Audio("audio/bottle_splash.mp3");
    this.splash_sound.volume = 0.1;

    /** Idle background sound. */
    this.idle_sound = new Audio("audio/idle.mp3");
    this.idle_sound.volume = 0.1;

    // ⚠️ Sounds like background_sound, game_over_sound, win_sound are referenced
    // in methods but not defined here.
  }

  /** Mutes all initialized sounds. */
  muteSounds() {
    this.chicken_sound.muted = true;
    this.endboss_sound.muted = true;
    this.hurt_sound.muted = true;
    this.jump_sound.muted = true;
    this.coin_sound.muted = true;
    this.pop_sound.muted = true;
    this.splash_sound.muted = true;
    this.idle_sound.muted = true;
  }

  /** Unmutes all initialized sounds. */
  unmuteSounds() {
    this.chicken_sound.muted = false;
    this.endboss_sound.muted = false;
    this.hurt_sound.muted = false;
    this.jump_sound.muted = false;
    this.coin_sound.muted = false;
    this.pop_sound.muted = false;
    this.splash_sound.muted = false;
    this.idle_sound.muted = false;
  }

  /** Plays the splash sound. */
  playSplashSound() {
    this.splash_sound.play();
  }

  /** Stops (pauses) the splash sound. */
  stopSplashSound() {
    this.splash_sound.pause();
  }

  /** Plays the idle sound. */
  playIdleSound() {
    this.idle_sound.play();
  }

  /** Stops (pauses) the idle sound. */
  stopIdleSound() {
    this.idle_sound.pause();
  }

  /** Plays the bottle pop sound. */
  playPopSound() {
    this.pop_sound.play();
  }

  /** Stops (pauses) the bottle pop sound. */
  stopPopSound() {
    this.pop_sound.pause();
  }

  /** Stops (pauses) the coin sound. */
  stopCoinSound() {
    this.coin_sound.pause();
  }

  /** Plays the coin sound. */
  playCoinSound() {
    this.coin_sound.play();
  }

  /** Plays the background sound (⚠️ not initialized in constructor). */
  playBackgroundSound() {
    this.background_sound.play();
  }

  /** Stops (pauses) the background sound (⚠️ not initialized). */
  stopBackgroundSound() {
    this.background_sound.pause();
  }

  /** Plays the chicken sound. */
  playChickenSound() {
    this.chicken_sound.play();
  }

  /** Stops (pauses) the chicken sound. */
  stopChickenSound() {
    this.chicken_sound.pause();
  }

  /** Plays the end boss sound. */
  playEndbossSound() {
    this.endboss_sound.play();
  }

  /** Stops (pauses) the end boss sound. */
  stopEndbossSound() {
    this.endboss_sound.pause();
  }

  /** Plays the game over sound (⚠️ not initialized in constructor). */
  playGameOverSound() {
    this.game_over_sound.play();
  }

  /** Stops (pauses) the game over sound (⚠️ not initialized). */
  stopGameOverSound() {
    this.game_over_sound.pause();
  }

  /** Plays the hurt sound. */
  playHurtSound() {
    this.hurt_sound.play();
  }

  /** Stops (pauses) the hurt sound. */
  stopHurtSound() {
    this.hurt_sound.pause();
  }

  /** Plays the jump sound. */
  playJumpSound() {
    this.jump_sound.play();
  }

  /** Stops (pauses) the jump sound. */
  stopJumpSound() {
    this.jump_sound.pause();
  }

  /** Plays the win sound (⚠️ not initialized in constructor). */
  playWinSound() {
    this.win_sound.play();
  }

  /** Stops (pauses) the win sound (⚠️ not initialized). */
  stopWinSound() {
    this.win_sound.pause();
  }
}
