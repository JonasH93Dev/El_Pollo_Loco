class Chicken extends MovableObject {
  y = 340;
  height = 80;
  width = 80;
  intervalMove;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Initializes a new Chicken instance with a random position and speed.
   * Loads the first image, preloads all animation images, and starts animations.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadAllImages();
    this.audioManager = new AudioManager();
    this.x = 800 + Math.random() * 1200;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  /**
   * Preloads all images used in walking and dead animations.
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Starts movement and animation intervals for the chicken.
   */
  animate() {
    this.chickenMove();
    this.chickenAnimatiionDeadWalk();
  }

  /**
   * Continuously moves the chicken left based on its speed.
   */
  chickenMove() {
    let intervalMove = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }

  /**
   * Plays either the walking or dead animation based on chicken's status.
   * Plays death sound and stops movement when dead.
   */
  chickenAnimatiionDeadWalk() {
    let intervalDeadMove = setInterval(() => {
      if (this.isDead()) {
        this.audioManager.playChickenSound();
        clearInterval(this.intervalMove);
        this.playAnimation(this.IMAGES_DEAD);
        clearInterval(intervalDeadMove);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }
}
