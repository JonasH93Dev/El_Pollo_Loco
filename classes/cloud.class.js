/**
 * Cloud background element that extends {@link MovableObject}.
 *
 * Behavior:
 * - Loads a cloud image.
 * - Spawns at a random X (0–2400 px) and Y (10–40 px).
 * - Moves left continuously for parallax scrolling.
 *
 * Notes:
 * - Runs on a 60 FPS interval.
 * - The movement interval is never cleared (clouds scroll forever).
 */
class Cloud extends MovableObject {
  /** Dimensions (px). */
  width = 500; height = 250;

  /**
   * Loads the cloud sprite, sets random position, and starts movement.
   */
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 2400;
    this.y = 10 + Math.random() * 30;
    this.animate();
  }

  /** Moves left continuously at ~60 FPS. */
  animate() {
    setInterval(() => this.moveLeft(), 1000 / 60);
  }
}
