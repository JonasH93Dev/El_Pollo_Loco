/**
 * Collectible coin that extends {@link MovableObject}.
 *
 * Responsibilities:
 * - Spawns at a random X and Y position within the game area.
 * - Uses a bounding box (`offset`) for collision detection.
 * - Cycles between two images to create a blinking effect.
 * - Plays sounds via `AudioManager` when collected (triggered externally).
 *
 * Units & timing:
 * - Positions/dimensions are in pixels.
 * - Blink animation switches frame every 250 ms.
 *
 * Notes:
 * - The interval started in `coinBlink()` is never cleared (runs for the lifetime of the coin).
 */
class Coin extends MovableObject {
  /** Coin sprite width (px). */
  width = 120;

  /** Coin sprite height (px). */
  height = 120;

  /**
   * Collision box offsets relative to the sprite edges (px).
   * These values reduce the hitbox size so it better fits the visible coin.
   */
  offset = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
  }

  /** Frames for the coin animation (two blinking states). */
  IMAGES = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * Initializes a new Coin instance:
   * - Loads the first image as the default.
   * - Preloads both animation frames.
   * - Creates an `AudioManager` for SFX.
   * - Starts the blinking animation.
   * - Randomizes spawn position:
   *   - X: between 250–2050 px
   *   - Y: between 50–350 px
   */
  constructor() {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.audioManager = new AudioManager();
    this.animate();
    this.x = 250 + Math.random() * 1800;
    this.y = 50 + Math.random() * 300;
  }

  /**
   * Entry point to start the coin's animation.
   * Delegates to {@link coinBlink}.
   */
  animate() {
    this.coinBlink();
  }

  /**
   * Animates the coin by alternating between two frames every 250 ms.
   * Creates a blinking effect to visually attract the player.
   */
  coinBlink() {
    setInterval(() => {
      this.playAnimation(this.IMAGES);
    }, 250);
  }
}
