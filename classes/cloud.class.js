/**
 * Cloud background element that extends {@link MovableObject}.
 *
 * Responsibilities:
 * - Loads a cloud image.
 * - Spawns at a random X position within a horizontal range.
 * - Floats at a random Y height within a vertical band.
 * - Moves continuously to the left to create parallax scrolling.
 *
 * Units & timing:
 * - Positions/dimensions are in pixels.
 * - Animation interval runs ~60 FPS (every ~16.67 ms).
 *
 * Notes:
 * - Clouds never stop moving; the interval is not cleared.
 * - Multiple clouds can be instantiated to fill the background.
 */
class Cloud extends MovableObject {
  /** Cloud width (px). */
  width = 500;

  /** Cloud height (px). */
  height = 250;

  /**
   * Initializes a new Cloud instance:
   * - Loads the default cloud image.
   * - Places the cloud at a random horizontal position (0–2400 px).
   * - Places the cloud at a vertical offset between 10–40 px.
   * - Starts continuous leftward movement.
   */
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 2400;       // random horizontal spawn position
    this.y = 10 + Math.random() * 30;    // random vertical band near top
    this.animate();
  }

  /**
   * Starts continuous leftward movement for the cloud.
   * Updates at ~60 FPS to produce smooth scrolling.
   * The interval is never cleared (runs for the lifetime of the instance).
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
