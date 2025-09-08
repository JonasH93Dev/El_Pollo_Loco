class ThrowableObject extends MovableObject {
  width = 60;
  height = 60;
  isBrocken = false;
  intervalTrow;
  intervalBottle;
  offset = {
    top: 10, 
    bottom: 10,
    left: 10,
    right: 10
};

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
   * Creates a new Bottle instance.
   * @param {number} x - The x-coordinate of the bottle.
   * @param {number} y - The y-coordinate of the bottle.
   */
  constructor(x, y) {
    super().loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
    this.audioManager = new AudioManager();
    this.loadAllImages();
    this.x = x;
    this.y = y;
    this.trow();
    this.animate();
  }

  /**
   * Loads all images for the bottle's rotation and splash animation.
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
  }

  /**
   * Simulates the bottle being thrown and falling.
   */
  trow() {
    this.speedY = 15;
    this.applyGravity();
    this.intervalTrow = setInterval(() => {
      this.bottleOnTheGround();
      if (this.isBrocken) {
        this.stopBottleAnimate();
      } else {
        this.x += 2;
      }
    }, 10);
  }

  /**
   * Stops the bottle's animations.
   */
  stopBottleAnimate() {
    clearInterval(this.applyGravity);
    clearInterval(this.intervalTrow);
  }

  /**
   * Handles the bottle's animation (rotation or splash based on state).
   */
  animate() {
    this.intervalBottle = setInterval(() => {
      if (this.isBrocken && this.isAboveGround()) {
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
      } else {
        this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
      }
    }, 50);
  }

  /**
   * Checks if the bottle has hit the ground and plays splash sound.
   */
  bottleOnTheGround() {
    if (this.y >= 360) {
      this.isBrocken = true;
      this.audioManager.playSplashSound();
      setTimeout(() => {
        this.x = -5000;
      }, 100);
    }
  }

  /**
   * Checks if the bottle collides with any enemies and breaks.
   */
  bottleHitEnemys() {
    world.enemies.forEach((enemy) => {
      if (this.isColliding(enemy)) {
        this.isBrocken = true;
      }
    });
  }
}
