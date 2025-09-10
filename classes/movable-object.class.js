/**
 * Base class for all movable game objects. Extends {@link DrawableObject}.
 *
 * Responsibilities:
 * - Adds physics (gravity, vertical motion).
 * - Provides collision detection.
 * - Manages energy/health and reactions to hits.
 * - Provides helper methods for movement (left, right, jump).
 * - Supports animation frame cycling.
 *
 * Units & timing:
 * - Positions and dimensions in pixels.
 * - Gravity interval: 25 FPS (every 40 ms).
 * - Energy is reduced in steps (5, 20, or 100) depending on source of damage.
 */
class MovableObject extends DrawableObject {
  /** Horizontal movement speed (px per frame). */
  speed = 0.15;

  /**
   * Facing direction flag.
   * @type {boolean} `true` if facing left, `false` if facing right.
   */
  otherDirection = false;

  /** Current vertical speed (used by gravity and jumps). */
  speedY = 0;

  /** Downward acceleration applied during gravity. */
  acceleration = 1;

  /** Current health/energy points. */
  energy = 100;

  /** Timestamp (ms) of the last hit. */
  lastHit = 0;

  /**
   * Collision box offsets relative to sprite edges (px).
   * Allows fine-tuning of hitboxes.
   */
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };

  /**
   * Applies gravity to this object.
   * - Decreases vertical speed (`speedY`) over time.
   * - Moves the object up or down by adjusting `y`.
   * - Runs at 25 FPS.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks whether the object is above the ground level.
   * - Normal objects: `true` if `y < 140`.
   * - Throwable objects: always `true` (they always fall).
   *
   * @returns {boolean} True if above ground, otherwise false.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 140;
    }
  }

  /**
   * Checks whether this object is colliding with another.
   *
   * @param {Object} mo - The other object to test collision against.
   * @returns {boolean} True if collision occurs, otherwise false.
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right >= mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom >= mo.y + mo.offset.top &&
      this.x + this.offset.left <= mo.x + mo.height - mo.offset.right &&
      this.y + this.offset.top <= mo.y + mo.width - mo.offset.bottom
    );
  }

  /**
   * Applies damage from a normal hit (−5 energy).
   * - Energy is clamped at minimum 0.
   * - Records timestamp if still above 0.
   */
  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Applies damage from colliding with an enemy.
   * - Sets energy to 0 immediately.
   */
  hitEnemy() {
    this.energy = 0;
  }

  /**
   * Applies damage from being hit by the end boss (−20 energy).
   * - Energy is clamped at minimum 0.
   * - Records timestamp if still above 0.
   */
  hitEndboss() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Applies damage from direct contact with the end boss (−100 energy).
   * - Energy is clamped at minimum 0.
   * - Records timestamp if still above 0.
   */
  hitByEndboss() {
    this.energy -= 100;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Determines if the object is currently hurt.
   * Hurt state lasts for 1 second after the last hit.
   *
   * @returns {boolean} True if hurt, otherwise false.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Determines if the object is dead.
   * @returns {boolean} True if energy is 0, otherwise false.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays an animation sequence by cycling through image paths.
   * - Advances `currentImage` index modulo the frame count.
   * - Sets `img` to the next cached frame.
   *
   * @param {string[]} images - Array of image paths to cycle through.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /** Moves the object right by its `speed`. */
  moveRight() {
    this.x += this.speed;
  }

  /** Moves the object left by its `speed`. */
  moveLeft() {
    this.x -= this.speed;
  }

  /** Initiates a jump by setting upward vertical speed. */
  jump() {
    this.speedY = 20;
  }

  /**
   * Initiates a bounce/jump off an enemy.
   * Same as {@link jump}, but separated for clarity of game mechanics.
   */
  jumpOfEnemy() {
    this.speedY = 20;
  }
}
