/**
 * Represents the main game world.
 *
 * Responsibilities:
 * - Manages all game entities (character, enemies, boss, collectibles).
 * - Runs the main update loop for collisions and interactions.
 * - Handles drawing to the canvas.
 * - Provides logic for throwing bottles and resolving hits.
 *
 * Notes:
 * - Uses `requestAnimationFrame` for continuous drawing.
 * - Uses `setInterval` for logic updates (~10 FPS).
 * - Relies on `level1` as the current level, but allows multiple level objects.
 */
class World {
  /** The current level (default: `level1`). */
  level = level1;

  /** HTML canvas element. */
  canvas;

  /** Canvas 2D rendering context. */
  ctx;

  /** Keyboard input handler. */
  keyboard;

  /** Camera offset along the X axis (px). */
  camera_x = 0;

  /** Timestamp (ms) of the last bottle throw. */
  lastThrowTime = 0;

  /** Main player character. */
  character = new Character();

  /** Status bar for player health. */
  statusBar = new StatusBar();

  /** Status bar for collected coins. */
  statusBarCoin = new StatusBarCoin();

  /** Status bar for collected bottles. */
  statusBarBottles = new StatusBarBottles();

  /** Status bar for end boss health. */
  statusBarEndboss = new StatusBarEndboss();

  /** Tracks bottles that have already hit the end boss (prevent double-count). */
  setHitBottles = new Set();

  /** Active throwable objects (bottles currently flying). */
  throwableObject = [];

  /** Collected coins. */
  coins = [];

  /** Collected bottles. */
  bottles = [];

  /** Flag indicating whether the end boss has been alerted. */
  endbossAlert = false;

  /**
   * Creates a new world instance.
   *
   * @param {HTMLCanvasElement} canvas - The canvas element where the world is drawn.
   * @param {Keyboard} keyboard - The keyboard input handler.
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

  /** Sets the world context inside the character object. */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Main game logic loop.
   * Runs every 100 ms (~10 FPS).
   */
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

  /**
   * Draws the entire world to the canvas.
   * Uses `requestAnimationFrame` for smooth updates.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.endboss);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObject);

    this.ctx.translate(-this.camera_x, 0);

    // ------- Fixed objects (UI elements) -------
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarBottles);
    this.addToMap(this.statusBarEndboss);

    this.ctx.translate(this.camera_x, 0);
    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Handles throwing bottles when `D` is pressed.
   * - Enforces a cooldown of 800 ms.
   * - Updates the bottle status bar.
   */
  checkThrowObjects() {
    let now = Date.now();
    if (
      this.keyboard.D &&
      this.bottles.length > 0 &&
      now - this.lastThrowTime >= 800
    ) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObject.push(bottle);
      this.bottles.pop();
      this.statusBarBottles.setPercentage(
        this.statusBarBottles.percentage - 12.5
      );
      this.lastThrowTime = now;
    }
  }

  /** Checks if bottles collide with any enemies or the end boss. */
  checkBottleCollisionWithAllEnemies() {
    this.throwableObject.forEach((bottle, bottleIndex) => {
      this.checkBottleCollisionWithEnemies(bottle, bottleIndex);
      this.checkBottleCollisionWithEndBoss(bottle, bottleIndex);
    });
  }

  /**
   * Checks for collisions between a bottle and regular enemies.
   *
   * @param {ThrowableObject} bottle - The thrown bottle.
   * @param {number} bottleIndex - Index of the bottle in the throwable array.
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
   * Checks for collisions between a bottle and the end boss.
   *
   * @param {ThrowableObject} bottle - The thrown bottle.
   * @param {number} bottleIndex - Index of the bottle in the throwable array.
   */
  checkBottleCollisionWithEndBoss(bottle, bottleIndex) {
    this.level.endboss.forEach((endboss, endbossIndex) => {
      if (bottle.isColliding(endboss) && !this.setHitBottles.has(bottle)) {
        endboss.hitEndboss();
        this.statusBarEndboss.setPercentage(endboss.energy);
        this.setHitBottles.add(bottle);
        this.deleteBottle(bottleIndex);
      }
    });
  }

  /**
   * Lets the character jump on enemies to defeat them.
   * Requires collision + downward velocity + above-ground state.
   */
  jumpOnEnemy() {
    this.level.enemies.forEach((enemy, index) => {
      if (
        this.character.isColliding(enemy) &&
        this.character.isAboveGround() &&
        this.character.speedY < 0
      ) {
        this.character.jumpOfEnemy();
        enemy.hitEnemy();
        this.deleteEnemy(index);
      }
    });
  }

  /** Checks collisions between the character and regular enemies. */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !this.character.isAboveGround()) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  /** Checks collisions between the character and bottles on the ground. */
  checkCollisionsBottles() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.audioManager.playPopSound();
        this.collectBottles(bottle, index);
        this.statusBarBottles.setPercentage(
          this.statusBarBottles.percentage + 12.5
        );
      }
    });
  }

  /** Checks collisions between the character and coins. */
  checkCollisionsCoins() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.audioManager.playCoinSound();
        this.collectCoins(coin, index);
        this.statusBarCoin.setPercentage(this.statusBarCoin.percentage + 12.5);
      }
    });
  }

  /** Checks collisions between the character and the end boss. */
  checkCollisionsByEndboss() {
    this.level.endboss.forEach((endboss) => {
      if (this.character.isColliding(endboss)) {
        this.character.hitByEndboss();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  /**
   * Draws multiple objects to the map.
   * @param {Object[]} objects - Array of drawable objects.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Draws a single object to the canvas.
   * Handles flipping if the object is facing left.
   *
   * @param {DrawableObject} mo - Object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips an object’s image horizontally.
   * @param {DrawableObject} mo - Object to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores an object’s image orientation after flipping.
   * @param {DrawableObject} mo - Object to restore.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Collects a bottle when picked up by the character.
   * @param {Object} bottle - The bottle object.
   * @param {number} index - Index in the level's bottle array.
   */
  collectBottles(bottle, index) {
    this.bottles.push(bottle);
    this.level.bottles.splice(index, 1);
  }

  /**
   * Collects a coin when picked up by the character.
   * @param {Object} coin - The coin object.
   * @param {number} index - Index in the level's coin array.
   */
  collectCoins(coin, index) {
    this.coins.push(coin);
    this.level.coins.splice(index, 1);
  }

  /**
   * Deletes an enemy from the level after a short delay.
   * @param {number} index - Index of the enemy to delete.
   *
   * ⚠️ Note: Uses `level1.enemies` directly, not `this.level.enemies`.
   */
  deleteEnemy(index) {
    setTimeout(() => {
      level1.enemies.splice(index, 1);
    }, 400);
  }

  /**
   * Deletes a thrown bottle from the world after a short delay.
   * @param {number} index - Index of the bottle to delete.
   */
  deleteBottle(index) {
    setTimeout(() => {
      this.throwableObject.splice(index, 1);
    }, 100);
  }
}
