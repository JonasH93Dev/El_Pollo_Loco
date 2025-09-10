/**
 * Main game world: manages entities, updates, drawing, and interactions.
 * - rAF for drawing; setInterval (~10 FPS) for logic.
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

  /** Inject world reference into character. */
  setWorld() { this.character.world = this; }

  /** Main logic loop (~10 FPS). */
  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkCollisionsBottles();
      this.checkCollisionsCoins();
      this.checkCollisionsByEndboss();
      this.checkBottleCollisionWithAllEnemies();
      this.jumpOnEnemy();
    }, 100);
  }

  /** Draws world & UI via rAF. */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    [this.level.clouds, this.level.endboss, this.level.enemies,
     this.level.coins, this.level.bottles, this.throwableObject]
     .forEach(group => this.addObjectsToMap(group));
    this.ctx.translate(-this.camera_x, 0);
    [this.statusBar, this.statusBarCoin, this.statusBarBottles, this.statusBarEndboss]
      .forEach(o => this.addToMap(o));
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Handle throwing bottles (cooldown 800 ms) + update bottle bar.
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
    this.throwableObject.forEach((bottle, i) => {
      this.checkBottleCollisionWithEnemies(bottle, i);
      this.checkBottleCollisionWithEndBoss(bottle, i);
    });
  }

  /**
   * Bottle vs. normal enemies.
   * @param {ThrowableObject} bottle
   * @param {number} bottleIndex
   */
  checkBottleCollisionWithEnemies(bottle, bottleIndex) {
    this.level.enemies.forEach((enemy, enemyIndex) => {
      if (bottle.isColliding(enemy)) {
        enemy.hitEnemy();
        this.deleteEnemy(enemyIndex);
        this.deleteBottle(bottleIndex);
      }
    });
  }

  /**
   * Bottle vs. end boss (no double count via set).
   * @param {ThrowableObject} bottle
   * @param {number} bottleIndex
   */
  checkBottleCollisionWithEndBoss(bottle, bottleIndex) {
    this.level.endboss.forEach((endboss) => {
      if (bottle.isColliding(endboss) && !this.setHitBottles.has(bottle)) {
        endboss.hitEndboss();
        this.statusBarEndboss.setPercentage(endboss.energy);
        this.setHitBottles.add(bottle);
        this.deleteBottle(bottleIndex);
      }
    });
  }

  /** Stomp-kill enemies when falling onto them. */
  jumpOnEnemy() {
    this.level.enemies.forEach((enemy, index) => {
      if (this.character.isColliding(enemy) &&
          this.character.isAboveGround() &&
          this.character.speedY < 0) {
        this.character.jumpOfEnemy();
        enemy.hitEnemy();
        this.deleteEnemy(index);
      }
    });
  }

  /** Character vs. enemies (ground collision → damage). */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
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
   * Delete enemy (uses global level1 per original behavior).
   * @param {number} index
   */
  deleteEnemy(index) { setTimeout(() => { level1.enemies.splice(index, 1); }, 400); }

  /**
   * Delete thrown bottle from active list.
   * @param {number} index
   */
  deleteBottle(index) { setTimeout(() => { this.throwableObject.splice(index, 1); }, 100); }
}
