/**
 * Small chicken enemy that extends {@link MovableObject}.
 *
 * Responsibilities:
 * - Moves left continuously at a (randomized) horizontal speed.
 * - Plays walking frames while alive; switches to a single dead frame when dead.
 * - Triggers a chicken sound effect upon death.
 *
 * Units & timing:
 * - Positions/dimensions are in pixels.
 * - Intervals:
 *   - Movement: ~60 FPS (every 16.67 ms).
 *   - Animation state check: 10 FPS (every 100 ms).
 *
 * Notes on intervals:
 * - `smallChickenMove()` creates an interval in a local variable `intervalMove`.
 *   The class also declares an instance field `intervalMove`, but it is not assigned.
 *   As a result, `clearInterval(this.intervalMove)` in `smallChickenAnimationDeadWalk()`
 *   will not clear the running movement interval. This comment documents the current behavior;
 *   no code changes are made.
 */
class ChickenSmall extends MovableObject {
  /** Absolute start Y position (px). */
  y = 370;

  /** Sprite height (px). */
  height = 50;

  /** Sprite width (px). */
  width = 50;

  /**
   * Intended holder for the movement interval ID.
   * Note: In the current implementation this field is never assigned;
   * the interval ID is stored in a local variable inside `smallChickenMove()`.
   */
  intervalMove;

  /** Frame list for the walking animation. */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /** Single-frame list for the dead state. */
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /**
   * Initializes a new SmallChicken instance:
   * - Sets the initial image (first walking frame).
   * - Creates an `AudioManager` for SFX.
   * - Preloads walking and dead frames.
   * - Randomizes start X position and horizontal speed.
   * - Starts movement and animation loops.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.audioManager = new AudioManager();
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 400 + Math.random() * 1200;   // random spawn range on the X axis
    this.speed = 0.12 + Math.random() * 0.4; // random horizontal speed
    this.animate();
  }

  /**
   * Entry point that wires up behavior:
   * - Starts continuous leftward movement (~60 FPS).
   * - Starts periodic state-based animation selection (10 FPS).
   */
  animate() {
    this.smallChickenMove();
    this.smallChickenAnimationDeadWalk();
  }

  /**
   * Moves the chicken left at its current speed on a fixed interval.
   * Implementation detail:
   * - The interval ID is stored in a local `intervalMove` variable (function scope),
   *   not in the instance field `this.intervalMove`. Therefore, other methods
   *   cannot clear this interval via `this.intervalMove`.
   */
  smallChickenMove() {
    let intervalMove = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60); // movement tick (~60 FPS)
  }

  /**
   * Switches between dead and walking animations based on the chicken's state.
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
  smallChickenAnimationDeadWalk() {
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
