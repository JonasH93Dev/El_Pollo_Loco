/**
 * Throwable bottle object that can be thrown by the character.
 * Extends {@link MovableObject}.
 * - Rotates while flying.
 * - Breaks on collision with ground or enemies.
 * - Plays splash sound and shows splash animation once broken.
 */
class ThrowableObject extends MovableObject {
  width = 60;
  height = 60;
  isBroken = false;
  intervalThrow;
  intervalBottle;
  offset = { top: 10, bottom: 10, left: 10, right: 10 };

  IMAGES_BOTTLE_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Creates a new throwable bottle at the given position.
   * @param {number} x - Initial X position.
   * @param {number} y - Initial Y position.
   */
  constructor(x, y) {
    super().loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
    this.audioManager = new AudioManager();
    this.loadAllImages();
    this.x = x;
    this.y = y;
    this.throw();
    this.animate();
  }

  /**
   * Loads rotation and splash images.
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
  }

  /**
   * Starts the throwing motion with gravity and horizontal movement.
   */
  throw() {
    this.speedY = 15;
    this.applyGravity();
    this.intervalThrow = setInterval(() => {
      this.bottleOnTheGround();
      if (this.isBroken) this.stopBottleAnimate();
      else this.x += 2;
    }, 10);
  }

  /**
   * Stops active throw intervals.
   */
  stopBottleAnimate() {
    clearInterval(this.applyGravity);
    clearInterval(this.intervalThrow);
  }

  /**
   * Animates the bottle rotation or splash depending on state.
   * Calls {@link handleSplashSound} once when broken.
   */
  animate() {
    this.intervalBottle = setInterval(() => {
      this.handleSplashSound();
      if (this.isBroken && this.isAboveGround())
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
      else
        this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    }, 50);
  }

  /**
   * Plays splash sound exactly once when the bottle breaks.
   */
  handleSplashSound() {
    if (this.isBroken && !this._splashPlayed) {
      if (this.audioManager?.playSplashSound) {
        this.audioManager.playSplashSound();
      }
      this._splashPlayed = true;
    }
  }

  /**
   * Handles ground collision and marks bottle as broken.
   */
  bottleOnTheGround() {
    if (this.y >= 360 && !this.isBroken) {
      this.isBroken = true;
      this.speed = 0;
      this.speedY = 0;
      this.acceleration = 0;
      setTimeout(() => { this.x = -5000; }, 350);
    }
  }

  /**
   * Breaks the bottle immediately, stopping movement.
   */
  breakNow() {
    if (this.isBroken) return;
    this.isBroken = true;
    this.speed = 0;
    this.speedY = 0;
    this.acceleration = 0;
  }

  /**
   * Marks bottle as broken when colliding with enemies.
   */
  bottleHitEnemys() {
    world.enemies.forEach(enemy => {
      if (this.isColliding(enemy)) this.isBroken = true;
    });
  }
}
