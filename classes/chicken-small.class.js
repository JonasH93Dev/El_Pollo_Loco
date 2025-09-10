/**
 * Small chicken enemy that extends {@link MovableObject}.
 *
 * Behavior:
 * - Moves left continuously at a randomized speed.
 * - Plays walking frames while alive; shows a dead frame when dead.
 * - Plays a chicken sound effect upon death.
 *
 * Note on intervals:
 * - `smallChickenMove()` saves its interval in a local variable (`intervalMove`).
 *   The class field `this.intervalMove` is never assigned.
 *   Therefore, `clearInterval(this.intervalMove)` does not stop the movement.
 */
class ChickenSmall extends MovableObject {
  /** Start Y position and sprite size (px). */
  y = 370; height = 50; width = 50;

  /** Placeholder for movement interval (never assigned in current logic). */
  intervalMove;

  /** Animation frames. */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /**
   * Sets initial image/audio, preloads frames, randomizes spawn & speed, starts loops.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.audioManager = new AudioManager();
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 400 + Math.random() * 1200;
    this.speed = 0.12 + Math.random() * 0.4;
    this.animate();
  }

  /**
   * Starts movement (~60 FPS) and animation state checks (10 FPS).
   */
  animate() {
    this.smallChickenMove();
    this.smallChickenAnimationDeadWalk();
  }

  /**
   * Moves left at the current speed on a fixed interval.
   * Interval ID is stored in a local variable (not in `this.intervalMove`).
   */
  smallChickenMove() {
    let intervalMove = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }

  /**
   * Chooses between walking and dead frames; plays death SFX once.
   * Attempts to stop movement via `clearInterval(this.intervalMove)` (no-op here).
   */
  smallChickenAnimationDeadWalk() {
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
