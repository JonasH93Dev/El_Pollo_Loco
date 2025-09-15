/**
 * Throwable bottle object that can be thrown by the character.
 * Extends {@link MovableObject}.
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
   * @param {number} x
   * @param {number} y
   * @param {boolean} facingRight
   */
  constructor(x, y, facingRight = true) {
    super().loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
    this.audioManager = new AudioManager();
    this.loadAllImages();
    this.x = x;
    this.y = y;
    this.throw(facingRight);
    this.animate();
  }

  loadAllImages() {
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
  }

  /**
   * @param {boolean} facingRight
   */
  throw(facingRight) {
    this.speedY = 15;
    this.applyGravity();
    const horizontalSpeed = facingRight ? 2 : -2;
    this.intervalThrow = setInterval(() => {
      this.bottleOnTheGround();
      if (this.isBroken) this.stopBottleAnimate();
      else this.x += horizontalSpeed;
    }, 10);
  }

  stopBottleAnimate() {
    clearInterval(this.applyGravity);
    clearInterval(this.intervalThrow);
  }

  animate() {
    this.intervalBottle = setInterval(() => {
      this.handleSplashSound();
      if (this.isBroken && this.isAboveGround())
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
      else
        this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    }, 50);
  }

  handleSplashSound() {
    if (this.isBroken && !this._splashPlayed) {
      if (this.audioManager?.playSplashSound) {
        this.audioManager.playSplashSound();
      }
      this._splashPlayed = true;
    }
  }

  bottleOnTheGround() {
    if (this.y >= 360 && !this.isBroken) {
      this.isBroken = true;
      this.speed = 0;
      this.speedY = 0;
      this.acceleration = 0;
      setTimeout(() => { this.x = -5000; }, 350);
    }
  }

  breakNow() {
    if (this.isBroken) return;
    this.isBroken = true;
    this.speed = 0;
    this.speedY = 0;
    this.acceleration = 0;
  }

  bottleHitEnemys() {
    world.enemies.forEach(enemy => {
      if (this.isColliding(enemy)) this.isBroken = true;
    });
  }
}
