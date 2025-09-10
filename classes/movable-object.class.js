/**
 * Base class for movable game objects. Extends {@link DrawableObject}.
 * - Adds gravity, collision, energy, movement helpers, and frame cycling.
 */
class MovableObject extends DrawableObject {
  /** Movement/physics & state. */
  speed = 0.15; otherDirection = false; speedY = 0; acceleration = 1.75;
  energy = 100; lastHit = 0;
  offset = { top: 0, bottom: 0, left: 0, right: 0 };

  /** Applies gravity at 25 FPS; updates y and vertical speed. */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * True if object should be considered airborne.
   * ThrowableObject always falls; others use y < 140.
   * @returns {boolean}
   */
  isAboveGround() { return this instanceof ThrowableObject ? true : this.y < 140; }

  /**
   * Axis-aligned bounding-box collision with offsets.
   * @param {Object} mo
   * @returns {boolean}
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right >= mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom >= mo.y + mo.offset.top &&
      this.x + this.offset.left <= mo.x + mo.height - mo.offset.right &&
      this.y + this.offset.top <= mo.y + mo.width - mo.offset.bottom
    );
  }

  /** Applies small hit (-5). */
  hit() { this.applyDamage(5); }

  /** Collision with enemy → energy to 0. */
  hitEnemy() { this.energy = 0; }

  /** Endboss ranged hit (-20). */
  hitEndboss() { this.applyDamage(20); }

  /** Endboss contact (-100). */
  hitByEndboss() { this.applyDamage(100); }

  /**
   * Reduces energy by `amount`, clamps to 0, sets lastHit if > 0.
   * @param {number} amount
   */
  applyDamage(amount) {
    this.energy -= amount;
    if (this.energy < 0) this.energy = 0;
    else this.lastHit = Date.now();
  }

  /**
   * Hurt for 1 second after last hit.
   * @returns {boolean}
   */
  isHurt() { return (Date.now() - this.lastHit) / 1000 < 1; }

  /** @returns {boolean} True if energy is 0. */
  isDead() { return this.energy == 0; }

  /**
   * Cycles frames: sets {@link img} to next cached frame.
   * @param {string[]} images
   */
  playAnimation(images) {
    const i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
  }

  /** Move right by speed. */  moveRight() { this.x += this.speed; }
  /** Move left by speed. */   moveLeft()  { this.x -= this.speed; }
  /** Jump upward. */          jump()      { this.speedY = 13; }
  /** Bounce off enemy. */     jumpOfEnemy(){ this.speedY = 10; }
}
