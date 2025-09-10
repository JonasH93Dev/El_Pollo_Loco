/**
 * Normal chicken enemy that extends {@link MovableObject}.
 *
 * Behavior:
 * - Moves left continuously at a randomized speed.
 * - Plays walking frames while alive; shows a dead frame when dead.
 * - Plays a chicken sound effect upon death.
 *
 * Interval note:
 * - `chickenMove()` saves its interval in a local variable (not in `this.intervalMove`).
 *   Thus, `clearInterval(this.intervalMove)` in `chickenAnimationDeadWalk()` won't stop movement.
 */
class Chicken extends MovableObject {
  /** Start Y position and sprite size (px). */
  y = 340; height = 80; width = 80;

  /** Placeholder for movement interval (never assigned in current logic). */
  intervalMove;

  /** Animation frames. */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Sets initial image, preloads frames, creates audio, randomizes spawn & speed, starts loops.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadAllImages();
    this.audioManager = new AudioManager();
    this.x = 800 + Math.random() * 1200;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  /** Preloads walking and dead frames. */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
  }

  /** Starts movement (~60 FPS) and animation checks (10 FPS). */
  animate() {
    this.chickenMove();
    this.chickenAnimationDeadWalk();
  }

  /**
   * Moves left at current speed on a fixed interval.
   * Interval ID is local (not assigned to `this.intervalMove`).
   */
  chickenMove() {
    let intervalMove = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }

  /**
   * Chooses between walking and dead frames; plays death SFX once.
   * Attempts to stop movement via `clearInterval(this.intervalMove)` (no-op here).
   */
  chickenAnimationDeadWalk() {
    let intervalDeadMove = setInterval(() => {
      if (this.isDead()) {
        this.audioManager.playChickenSound();
        clearInterval(this.intervalMove); // not actually set (documented)
        this.playAnimation(this.IMAGES_DEAD);
        clearInterval(intervalDeadMove);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }
}
