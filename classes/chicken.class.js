/**
 * Normal chicken enemy that extends {@link MovableObject}.
 *
 * Responsibilities:
 * - Moves left continuously at a (randomized) horizontal speed.
 * - Plays walking frames while alive; switches to a single dead frame when dead.
 * - Triggers a chicken sound effect upon death.
 *
 * Units & timing:
 * - Positions/dimensions are in pixels.
 * - Intervals:
 *   - Movement: ~60 FPS (every ~16.67 ms).
 *   - Animation state check: 10 FPS (every 100 ms).
 *
 * Notes on intervals:
 * - `chickenMove()` stores the interval ID in a local `intervalMove` variable (function scope).
 *   The class also declares an instance field `intervalMove`, but it is never assigned.
 *   Therefore, `clearInterval(this.intervalMove)` in `chickenAnimationDeadWalk()` will not
 *   clear the running movement interval. This comment documents the current behavior;
 *   no code changes are made.
 */
class Chicken extends MovableObject {
  /** Absolute start Y position (px). */
  y = 340;

  /** Sprite height (px). */
  height = 80;

  /** Sprite width (px). */
  width = 80;

  /**
   * Intended holder for the movement interval ID.
   * Note: In the current implementation this field is never assigned;
   * the interval ID is kept in a local variable inside `chickenMove()`.
   */
  intervalMove;

  /** Frame list for the walking animation. */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /** Single-frame list for the dead state. */
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Initializes a new Chicken instance:
   * - Sets the initial image (first walking frame).
   * - Preloads animation frames.
   * - Creates an `AudioManager` for SFX.
   * - Randomizes start X position and horizontal speed.
   * - Starts movement and animation loops.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadAllImages();
    this.audioManager = new AudioManager();
    this.x = 800 + Math.random() * 1200;     // random spawn range on the X axis
    this.speed = 0.15 + Math.random() * 0.5; // random horizontal speed
    this.animate();
  }

  /**
   * Preloads all images used for walking and dead animations.
   * Helps avoid hitches the first time an animation plays.
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Entry point that wires up behavior:
   * - Starts continuous leftward movement (~60 FPS).
   * - Starts periodic state-based animation selection (10 FPS).
   */
  animate() {
    this.chickenMove();
    this.chickenAnimationDeadWalk();
  }

  /**
   * Moves the chicken left at its current speed on a fixed interval.
   * Implementation detail:
   * - The interval ID is stored in a local `intervalMove` variable (function scope),
   *   not in the instance field `this.intervalMove`. Therefore, other methods
   *   cannot clear this interval via `this.intervalMove`.
   */
  chickenMove() {
    let intervalMove = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }

  /**
   * Switches between walking and dead animations based on the chicken's state.
   *
   * Behavior:
   * - When dead:
   *   - Plays the chicken death sound.
   *   - Attempts to stop movement using `clearInterval(this.intervalMove)`.
   *     (Note: As documented above, the actual movement interval is not stored
   *      in `this.intervalMove`, so movement may continue.)
   *   - Plays the dead frame.
   *   - Clears this animation-check interval.
   * - When alive:
   *   - Plays the walking animation frames.
   */
  chickenAnimationDeadWalk() {
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
