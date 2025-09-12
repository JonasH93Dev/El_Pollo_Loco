/**
 * Main game world: manages entities, updates, drawing, and interactions.
 * - rAF for drawing; setInterval for logic.
 */
class World {
  /** Current level (default: level1). */ level = level1;
  canvas; ctx; keyboard; camera_x = 0; lastThrowTime = 0;
  character = new Character();
  statusBar = new StatusBar(); statusBarCoin = new StatusBarCoin();
  statusBarBottles = new StatusBarBottles(); statusBarEndboss = new StatusBarEndboss();
  setHitBottles = new Set(); throwableObject = []; coins = []; bottles = [];
  endbossAlert = false;

  /**
   * @param {HTMLCanvasElement} canvas - Canvas to draw on.
   * @param {Keyboard} keyboard - Input state provider.
   */
  constructor(canvas, keyboard) {
    this.audioManager = new AudioManager();
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  /** Injects world reference into the character. */
  setWorld() { this.character.world = this; }

  /** Main logic loops. */
  run() {
    // Fast loop (~50 FPS) → responsive actions
    setInterval(() => {
      this.checkThrowObjects();                  // Player throws bottle
      this.checkCollisionsCoins();               // Collect coins
      this.checkCollisionsBottles();             // Collect bottles
      this.jumpOnEnemy();                        // Stomp from above
      this.checkBottleCollisionWithAllEnemies(); // Bottle hits enemy/boss
    }, 20);

    // Slower loop (~8 FPS) → damage from enemies/boss
    setInterval(() => {
      this.checkCollisions();          // Player vs. regular enemies
      this.checkCollisionsByEndboss(); // Player vs. end boss
    }, 120);
  }

  /** Draws world & UI via requestAnimationFrame. Character is drawn last (on top of everything). */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1) World behind character (with camera)
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    [this.level.clouds, this.level.endboss, this.level.enemies,
     this.level.coins, this.level.bottles, this.throwableObject]
     .forEach(group => this.addObjectsToMap(group));
    this.ctx.restore();

    // 2) UI (status bars) — will be under the character
    [this.statusBar, this.statusBarCoin, this.statusBarBottles, this.statusBarEndboss]
      .forEach(o => this.addToMap(o));

    // 3) Character on top of everything (with camera)
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.ctx.restore();

    requestAnimationFrame(() => this.draw());
  }

  /**
   * Handles bottle throwing (cooldown 800 ms) + updates bottle bar.
   */
  checkThrowObjects() {
    const now = Date.now();
    if (this.keyboard.D && this.bottles.length > 0 && now - this.lastThrowTime >= 800) {
      const bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObject.push(bottle);
      this.bottles.pop();
      this.statusBarBottles.setPercentage(this.statusBarBottles.percentage - 12.5);
      this.lastThrowTime = now;
    }
  }

  /** Checks bottle collisions with enemies and end boss. */
  checkBottleCollisionWithAllEnemies() {
    // iterate over a shallow copy to avoid index drift while deleting
    const bottlesSnapshot = this.throwableObject.slice();
    bottlesSnapshot.forEach((bottle) => {
      if (this.setHitBottles.has(bottle)) return; // already used this tick
      this.checkBottleCollisionWithEnemies(bottle);
      this.checkBottleCollisionWithEndBoss(bottle);
    });
    this.setHitBottles.clear();
  }

  /**
   * Bottle vs. normal enemies — delayed removal by reference to allow death animation.
   * @param {ThrowableObject} bottle
   */
  checkBottleCollisionWithEnemies(bottle) {
    for (let i = this.level.enemies.length - 1; i >= 0; i--) {
      const enemy = this.level.enemies[i];
      if (enemy?._dying) continue; // ignore enemies already dying

      if (bottle.isColliding(enemy)) {
        enemy.hitEnemy();           // triggers enemy's own death state/animation
        enemy._dying = true;        // mark so it won't collide again

        // remove enemy after animation delay (by reference)
        this.scheduleRemovalFromArray(this.level.enemies, enemy, 400);

        // remove the bottle by reference immediately (so it can't hit others)
        this.deleteBottleByRef(bottle);

        this.setHitBottles.add(bottle);
        break; // one bottle → one enemy
      }
    }
  }

  /**
   * Bottle vs. end boss — prevents double counting with setHitBottles.
   * @param {ThrowableObject} bottle
   */
  checkBottleCollisionWithEndBoss(bottle) {
    if (this.setHitBottles.has(bottle)) return;

    for (let i = 0; i < this.level.endboss.length; i++) {
      const endboss = this.level.endboss[i];
      if (bottle.isColliding(endboss)) {
        endboss.hitEndboss();
        this.statusBarEndboss.setPercentage(endboss.energy);
        this.deleteBottleByRef(bottle);
        this.setHitBottles.add(bottle);
        break;
      }
    }
  }

  /** Stomp-kill enemies when falling onto them — delayed removal for stomp death animation. */
  jumpOnEnemy() {
    for (let i = this.level.enemies.length - 1; i >= 0; i--) {
      const enemy = this.level.enemies[i];
      if (enemy?._dying) continue;

      if (this.character.isColliding(enemy) &&
          this.character.isAboveGround() &&
          this.character.speedY < 0) {
        this.character.jumpOfEnemy();
        enemy.hitEnemy();
        enemy._dying = true;

        // allow stomp death animation, then remove by reference
        this.scheduleRemovalFromArray(this.level.enemies, enemy, 400);
      }
    }
  }

  /** Character vs. enemies (ground collision → damage). */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy?._dying) return; // ignore dying enemies
      if (this.character.isColliding(enemy) && !this.character.isAboveGround()) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  /** Character vs. bottles on ground (collect & update bar). */
  checkCollisionsBottles() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.audioManager.playPopSound();
        this.collectBottles(bottle, index);
        this.statusBarBottles.setPercentage(this.statusBarBottles.percentage + 12.5);
      }
    });
  }

  /** Character vs. coins (collect & update bar). */
  checkCollisionsCoins() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.audioManager.playCoinSound();
        this.collectCoins(coin, index);
        this.statusBarCoin.setPercentage(this.statusBarCoin.percentage + 12.5);
      }
    });
  }

  /** Character vs. end boss (direct hit → heavy damage). */
  checkCollisionsByEndboss() {
    this.level.endboss.forEach((endboss) => {
      if (this.character.isColliding(endboss)) {
        this.character.hitByEndboss();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  /**
   * Draw multiple objects.
   * @param {DrawableObject[]} objects
   */
  addObjectsToMap(objects) { objects.forEach(o => this.addToMap(o)); }

  /**
   * Draw one object and flip if needed.
   * @param {DrawableObject} mo
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /** Flip horizontally (for left-facing). */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /** Restore orientation after flip. */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /** Collect bottle from level. */
  collectBottles(bottle, index) {
    this.bottles.push(bottle);
    this.level.bottles.splice(index, 1);
  }

  /** Collect coin from level. */
  collectCoins(coin, index) {
    this.coins.push(coin);
    this.level.coins.splice(index, 1);
  }

  /**
   * Delete enemy (legacy signature kept; prefer scheduleRemovalFromArray with delay).
   * @param {number} index
   */
  deleteEnemy(index) {
    if (index >= 0 && index < this.level.enemies.length) {
      this.level.enemies.splice(index, 1);
    }
  }

  /**
   * Delete thrown bottle from active list by index (legacy).
   * @param {number} index
   */
  deleteBottle(index) { setTimeout(() => { this.throwableObject.splice(index, 1); }, 100); }

  /** Delete thrown bottle by reference (index-safe). */
  deleteBottleByRef(bottle) {
    const idx = this.throwableObject.indexOf(bottle);
    if (idx >= 0) this.throwableObject.splice(idx, 1);
  }

  /**
   * Schedules removal of `item` from `arr` after `delay` ms (by reference, index-safe).
   * @param {any[]} arr
   * @param {any} item
   * @param {number} delay
   */
  scheduleRemovalFromArray(arr, item, delay = 400) {
    setTimeout(() => {
      const i = arr.indexOf(item);
      if (i >= 0) arr.splice(i, 1);
    }, delay);
  }
}
