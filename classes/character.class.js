/**
 * Playable character that extends {@link MovableObject}.
 *
 * Responsibilities:
 * - Reads input from `world.keyboard` to move left/right and jump.
 * - Uses base-class physics (`applyGravity`) to simulate vertical motion.
 * - Chooses and plays animations based on current state (dead/hurt/jump/walk/idle).
 * - Triggers side effects: sounds (jump/hurt) and lose screen on death.
 * - Updates camera follow offset via `world.camera_x`.
 *
 * Units & timing:
 * - Positions/dimensions are in pixels.
 * - Time values are in milliseconds.
 *
 * Intervals:
 * - Two `setInterval` loops are started in `animate()` and are not cleared (no cleanup).
 */
class Character extends MovableObject {
  /** Absolute start Y position (px). */
  y = 50;

  /** Sprite height (px). */
  height = 280;

  /** Sprite width (px). */
  width = 150;

  /**
   * Horizontal movement scalar used by `moveLeft`/`moveRight`.
   * The exact unit depends on base-class implementation (typically px per tick).
   */
  speed = 10;

  /**
   * Timestamp of the last player-initiated action (movement or jump).
   * Used to decide between idle and long-idle animations.
   */
  lastMove = Date.now();

  /**
   * Reference to the current game world.
   * Note: This property is declared twice in this class; both declarations are kept intentionally to preserve original structure.
   */
  world;

  /**
   * Collision box offsets relative to sprite edges (px).
   * These values shrink/expand the hitbox used for collisions.
   */
  offset = {
    top: 120,
    bottom: 12,
    left: 30,
    right: 40
  }

  /**
   * Frame list for the walking animation.
   * The first frame is also used as the initial image in the constructor.
   */
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  /** Frame list for the jumping animation (played while the character is airborne). */
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  /** Frame list for the death animation. Also triggers the lose screen. */
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  /** Frame list for the hurt animation (plays along with a hurt sound). */
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  /** Frame list for the short idle animation (used during inactivity < 10 s). */
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  /** Frame list for the long idle animation (used during inactivity ≥ 10 s). */
  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  /** Duplicate declaration preserved to keep the original shape of the class. */
  world;

  /**
   * Initializes the character:
   * - Sets the initial image (first walking frame).
   * - Instantiates `AudioManager` for SFX.
   * - Preloads all animation frames.
   * - Enables gravity and starts animation/movement loops.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.audioManager = new AudioManager();
    this.loadAllImages();
    this.applyGravity();
    this.animate();
  }

  /**
   * Preloads all sprite frames for every animation state.
   * This avoids hitches when animations first play.
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
  }

  /**
   * Starts the update loops:
   * - ~60 FPS: reads input & moves character (`characterMove`).
   * - 10 FPS: selects & plays state animation (`chracterHurtDeadJumpAnimation`).
   *
   * Note: Intervals are not cleared; there is no teardown logic.
   */
  animate() {
    setInterval(() => {
      this.characterMove();
    }, 1000 / 60);

    setInterval(() => {
      this.chracterHurtDeadJumpAnimation();
    }, 100);
  }

  /**
   * Chooses and plays the current animation using the following priority:
   * 1) Dead  → play death frames and call `openLoseScreen()`.
   * 2) Hurt  → play hurt frames and play hurt sound.
   * 3) Airborne (`isAboveGround()`) → play jump frames.
   * 4) Walking (LEFT/RIGHT pressed) → play walk frames.
   * 5) Otherwise → idle/long-idle based on inactivity time.
   *
   * Side effects:
   * - Calls `openLoseScreen()` when dead.
   * - Plays a hurt sound while in the hurt state.
   */
  chracterHurtDeadJumpAnimation() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      openLoseScreen();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.audioManager.playHurtSound();
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.characterIdle();
    }
  }

  /**
   * Handles input-based movement and camera follow:
   * - RIGHT: move right while x < `level_end_x`; face right.
   * - LEFT:  move left while x > 0; face left.
   * - SPACE: jump if currently grounded.
   *
   * Additional effects:
   * - Updates `lastMove` on any action (move or jump).
   * - Plays jump sound on jump.
   * - Sets `world.camera_x` so the camera follows the character.
   */
  characterMove() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.lastMove = Date.now();
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.lastMove = Date.now();
    }
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.audioManager.playJumpSound();
      this.lastMove = Date.now();
    }
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Plays idle or long-idle animation depending on inactivity duration.
   * Threshold: 10,000 ms since `lastMove`.
   */
  characterIdle() {
    if (Date.now() - this.lastMove >= 10000) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Initiates a jump by assigning an upward vertical speed.
   * Also refreshes `lastMove` to mark recent activity.
   */
  jump() {
    this.speedY = 20;
    this.lastMove = Date.now();
  }
}
