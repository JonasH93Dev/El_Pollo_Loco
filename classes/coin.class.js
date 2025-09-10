/**
 * Collectible coin that extends {@link MovableObject}.
 *
 * Behavior:
 * - Spawns at random X (250–2050 px) and Y (50–350 px).
 * - Uses reduced collision box (`offset`).
 * - Cycles between two frames every 250 ms for a blinking effect.
 * - Sound effects are handled externally via {@link AudioManager}.
 */
class Coin extends MovableObject {
  /** Dimensions & hitbox offsets. */
  width = 120; height = 120;
  offset = { top: 50, bottom: 50, left: 50, right: 50 };

  /** Frames for blinking animation. */
  IMAGES = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /** Sets up sprite, preloads frames, randomizes spawn, and starts blinking. */
  constructor() {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.audioManager = new AudioManager();
    this.x = 250 + Math.random() * 1800;
    this.y = 50 + Math.random() * 300;
    this.animate();
  }

  /** Starts the blinking animation loop. */
  animate() { this.coinBlink(); }

  /** Alternates frames every 250 ms for blinking effect. */
  coinBlink() { setInterval(() => this.playAnimation(this.IMAGES), 250); }
}
