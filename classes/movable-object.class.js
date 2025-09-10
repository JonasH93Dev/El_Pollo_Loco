class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 1;
  energy = 100;
  lastHit = 0;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }

  /**
   * Applies gravity to the character, making it fall or move upwards.
   * The method adjusts the vertical position of the character over time based on its speed.
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
   * Checks if the character is above the ground.
   * @returns {boolean} - True if the character is above the ground (y < 140), or always true for throwable objects.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      // trhowable object should always fall
      return true;
    } else {
      return this.y < 140;
    }
  }

  /**
   * Checks if this object is colliding with another object.
   * @param {Object} mo - The object to check for a collision with.
   * @returns {boolean} - True if the objects are colliding, otherwise false.
   */
  isColliding(mo) {
    return this.x + this.width - this.offset.right >= mo.x + mo.offset.left &&
          this.y + this.height - this.offset.bottom >= mo.y + mo.offset.top &&
          this.x + this.offset.left <= mo.x + mo.height - mo.offset.right &&
          this.y + this.offset.top <= mo.y + mo.width - mo.offset.bottom;
  }

  /**
   * Reduces the character's energy by 5 when it gets hit.
   * Ensures that energy doesn't go below zero and records the time of the hit.
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
   * Sets the character's energy to 0 when it collides with an enemy.
   */
  hitEnemy() {
    this.energy = 0;
  }

  /**
   * Reduces the character's energy by 20 when it gets hit by the endboss.
   * Ensures that energy doesn't go below zero and records the time of the hit.
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
   * Reduces the character's energy by 100 when it gets hit by the endboss.
   * Ensures that energy doesn't go below zero and records the time of the hit.
   */
  hitByEndboss() {
    // Logik, was passiert, wenn der Charakter den Endboss trifft
    this.energy -= 100; // Beispiel: Energie um 100 reduzieren
    if (this.energy < 0) {
      this.energy = 0; // Energie kann nicht unter 0 fallen
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Determines if the character is currently hurt.
   * Checks if less than one second has passed since the last hit.
   * @returns {boolean} - True if the character is hurt (time since last hit < 1 second), otherwise false.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Checks if the character is dead.
   * @returns {boolean} - True if the character's energy is 0, otherwise false.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays a walking animation by cycling through the provided image paths.
   * @param {Array<string>} images - An array of image paths to display during the animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length; // let i = 0 % 6; % = rest
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the character to the right by a specified speed.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the character to the left by a specified speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the character jump by setting its vertical speed.
   */
  jump() {
    this.speedY = 20;
  }

  /**
   * Makes the character jump off of an enemy by setting its vertical speed.
   * The jump of an enemy could be a special mechanic, hence a separate function.
   */
  jumpOfEnemy() {
    this.speedY = 20;
  }
}
