class AudioManager {
  constructor() {
    this.chicken_sound = new Audio("audio/chicken_dead.mp3");
    this.chicken_sound.volume = 0.1;

    this.endboss_sound = new Audio("audio/endboss_dead.mp3");
    this.endboss_sound.volume = 0.1;

    this.hurt_sound = new Audio("audio/hurt_character.mp3");
    this.hurt_sound.volume = 0.1;

    this.jump_sound = new Audio("audio/jump.mp3");
    this.jump_sound.volume = 0.1;

    this.coin_sound = new Audio("audio/coin.mp3");
    this.coin_sound.volume = 0.1;

    this.pop_sound = new Audio("audio/pop_bottle.mp3");
    this.pop_sound.volume = 0.1;

    this.splash_sound = new Audio("audio/bottle_splash.mp3");
    this.splash_sound.volume = 0.1;

    this.idle_sound = new Audio("audio/idle.mp3");
    this.idle_sound.volume = 0.1;
  }

  /**
   * Mutes all sounds in the game.
   */
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

  /**
   * Unmutes all sounds in the game.
   */
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

  playSplashSound() {
    this.splash_sound.play();
  }

  stopSplashSound() {
    this.splash_sound.pause();
  }

  playIdleSound() {
    this.idle_sound.play();
  }

  stopIdleSound() {
    this.idle_sound.pause();
  }

  playPopSound() {
    this.pop_sound.play();
  }

  stopPopSound() {
    this.pop_sound.pause();
  }

  stopCoinSound() {
    this.coin_sound.pause();
  }

  playCoinSound() {
    this.coin_sound.play();
  }

  playBackgroundSound() {
    this.background_sound.play();
  }

  stopBackgroundSound() {
    this.background_sound.pause();
  }

  playChickenSound() {
    this.chicken_sound.play();
  }

  stopChickenSound() {
    this.chicken_sound.pause();
  }

  playEndbossSound() {
    this.endboss_sound.play();
  }

  stopEndbossSound() {
    this.endboss_sound.pause();
  }

  playGameOverSound() {
    this.game_over_sound.play();
  }

  stopGameOverSound() {
    this.game_over_sound.pause();
  }

  playHurtSound() {
    this.hurt_sound.play();
  }

  stopHurtSound() {
    this.hurt_sound.pause();
  }

  playJumpSound() {
    this.jump_sound.play();
  }

  stopJumpSound() {
    this.jump_sound.pause();
  }

  playWinSound() {
    this.win_sound.play();
  }

  stopWinSound() {
    this.win_sound.pause();
  }
}
