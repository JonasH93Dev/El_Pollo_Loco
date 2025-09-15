/**
 * Throwable bottle object. Extends {@link MovableObject}.
 * - Simulates throw (gravity + horizontal move).
 * - Rotates in air; splashes when broken.
 * - Plays splash SFX on ground hit.
 *
 * Timing: throw loop 10 ms, animation 50 ms, gravity ~25 FPS.
 * Note: `stopBottleAnimate()` clears `this.applyGravity` (no stored ID → no effect).
 */
class ThrowableObject extends MovableObject {
  width = 60; height = 60; isBroken = false;
  intervalThrow; intervalBottle;
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
   * Creates a new bottle at (x,y), preloads frames, starts throw + animation.
   * @param {number} x - Initial X position.
   * @param {number} y - Initial Y position.
   */
  constructor(x, y) {
    super().loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
    this.audioManager = new AudioManager();
    this.loadAllImages();
    this.x = x; this.y = y;
    this.throw(); this.animate();
  }

  /** Preload rotation and splash frames. */
  loadAllImages() {
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
  }

  /**
   * Initiates the throw: set upward speed, apply gravity,
   * then move horizontally and check ground every 10 ms.
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
   * Stops throw & (tries to) stop gravity; clears throw interval.
   */
  stopBottleAnimate() {
    clearInterval(this.applyGravity);
    clearInterval(this.intervalThrow);
  }

  /**
   * Rotates while intact; plays splash frames when broken (and above ground).
   */
  animate() {
    this.intervalBottle = setInterval(() => {
      if (this.isBroken && this.isAboveGround())
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
      else
        this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    }, 50);
  }

  /**
   * Ground check: if y ≥ 360 → start splash SFX and animation at the same time,
   * stop movement, and hide after 350 ms so the splash is visible.
   */
  bottleOnTheGround() {
    if (this.y >= 360) {
      if (!this.isBroken) {
        this.isBroken = true;
        if (this.audioManager && typeof this.audioManager.playSplashSound === 'function') {
          this.audioManager.playSplashSound();
        }
        this.speed = 0;
        this.speedY = 0;
        this.acceleration = 0;
      }
      setTimeout(() => { this.x = -5000; }, 350);
    }
  }

  /**
   * Breaks the bottle immediately and triggers splash animation and sound simultaneously.
   */
  breakNow() {
    if (this.isBroken) return;
    this.isBroken = true;
    if (this.audioManager && typeof this.audioManager.playSplashSound === 'function') {
      this.audioManager.playSplashSound();
    }
    this.speed = 0;
    this.speedY = 0;
    this.acceleration = 0;
  }

  /**
   * Break when colliding with any enemy in `world.enemies`.
   */
  bottleHitEnemys() {
    world.enemies.forEach(enemy => {
      if (this.isColliding(enemy)) this.isBroken = true;
    });
  }
}
