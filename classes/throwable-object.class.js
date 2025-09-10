/**
 * Throwable bottle object. Extends {@link MovableObject}.
 *
 * Responsibilities:
 * - Simulates bottle throw with gravity and horizontal motion.
 * - Cycles through rotation frames while airborne.
 * - Switches to splash animation when broken (ground impact or enemy collision).
 * - Plays splash sound when hitting the ground.
 *
 * Units & timing:
 * - Position/dimensions in pixels.
 * - Throw interval: every 10 ms (horizontal motion & ground check).
 * - Animation interval: every 50 ms (rotation/splash frames).
 * - Gravity interval inherited from {@link MovableObject} (~25 FPS).
 *
 * Notes:
 * - `stopBottleAnimate()` calls `clearInterval(this.applyGravity)`,
 *   but `applyGravity()` does not store its interval ID, so this has no effect.
 * - The bottle is hidden after breaking by moving its `x` to -5000.
 */
class ThrowableObject extends MovableObject {
  /** Width of the bottle (px). */
  width = 60;

  /** Height of the bottle (px). */
  height = 60;

  /** Flag indicating whether the bottle is broken. */
  isBroken = false;

  /** Interval ID for throw logic (movement + ground check). */
  intervalThrow;

  /** Interval ID for animation loop (rotation or splash). */
  intervalBottle;

  /**
   * Collision box offsets relative to sprite edges (px).
   * Shrinks hitbox to better match the visible bottle.
   */
  offset = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
  };

  /** Frames for bottle rotation (airborne state). */
  IMAGES_BOTTLE_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /** Frames for bottle splash animation (ground impact). */
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
   *
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

  /** Preloads all rotation and splash animation frames into cache. */
  loadAllImages() {
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
  }

  /**
   * Initiates the throw:
   * - Sets vertical speed (upwards).
   * - Applies gravity (from parent).
   * - Starts horizontal motion and ground check loop (every 10 ms).
   */
  throw() {
    this.speedY = 15;
    this.applyGravity();
    this.intervalThrow = setInterval(() => {
      this.bottleOnTheGround();
      if (this.isBroken) {
        this.stopBottleAnimate();
      } else {
        this.x += 2;
      }
    }, 10);
  }

  /**
   * Stops throw and animation intervals.
   *
   * Notes:
   * - `clearInterval(this.applyGravity)` has no effect since `applyGravity`
   *   doesn’t store its interval ID. Gravity will continue unless refactored.
   */
  stopBottleAnimate() {
    clearInterval(this.applyGravity);
    clearInterval(this.intervalThrow);
  }

  /**
   * Handles bottle animation:
   * - Rotation while unbroken.
   * - Splash animation when broken and above ground.
   */
  animate() {
    this.intervalBottle = setInterval(() => {
      if (this.isBroken && this.isAboveGround()) {
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
      } else {
        this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
      }
    }, 50);
  }

  /**
   * Ground collision check:
   * - If Y ≥ 360, marks bottle as broken.
   * - Plays splash sound.
   * - Moves bottle off-screen after 100 ms.
   */
  bottleOnTheGround() {
    if (this.y >= 360) {
      this.isBroken = true;
      this.audioManager.playSplashSound();
      setTimeout(() => {
        this.x = -5000;
      }, 100);
    }
  }

  /**
   * Checks collision with enemies and breaks bottle on impact.
   * Iterates over `world.enemies` and tests each with {@link isColliding}.
   */
  bottleHitEnemys() {
    world.enemies.forEach((enemy) => {
      if (this.isColliding(enemy)) {
        this.isBroken = true;
      }
    });
  }
}
