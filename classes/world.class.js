/**
 * Main game world: handles game entities, updates, drawing, and interactions.
 * Uses requestAnimationFrame for rendering and setInterval for logic updates.
 */
class World {
  /** Current level (default: level1). */ level = level1;
  canvas; ctx; keyboard; camera_x = 0; lastThrowTime = 0;
  character = new Character();
  statusBar = new StatusBar();
  statusBarCoin = new StatusBarCoin();
  statusBarBottles = new StatusBarBottles();
  statusBarEndboss = new StatusBarEndboss();
  setHitBottles = new Set();
  throwableObject = [];
  coins = [];
  bottles = [];
  endbossAlert = false;
  _winTriggered = false;

  /**
   * @param {HTMLCanvasElement} canvas - Game canvas element.
   * @param {Keyboard} keyboard - Keyboard input handler.
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

  /** Assign world reference to character. */
  setWorld() { this.character.world = this; }

  /** Starts main logic loops for collisions, interactions, and win condition. */
  run() {
    setInterval(() => {
      this.checkThrowObjects();
      this.checkCollisionsCoins();
      this.checkCollisionsBottles();
      this.jumpOnEnemy();
      this.checkBottleCollisionWithAllEnemies();
      this.checkWinCondition();
    }, 20);

    setInterval(() => {
      this.checkCollisions();
      this.checkCollisionsByEndboss();
    }, 120);
  }

  /** Renders world and all entities, character is drawn last. */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    [this.level.clouds, this.level.endboss, this.level.enemies,
     this.level.coins, this.level.bottles, this.throwableObject]
      .forEach(g => this.addObjectsToMap(g));
    this.ctx.restore();
    [this.statusBar, this.statusBarCoin, this.statusBarBottles, this.statusBarEndboss]
      .forEach(o => this.addToMap(o));
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.ctx.restore();
    requestAnimationFrame(() => this.draw());
  }

  /** Handles bottle throwing with cooldown and updates bottle bar. */
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

  /** Checks collisions of all bottles with enemies and end boss. */
  checkBottleCollisionWithAllEnemies() {
    const bottlesSnapshot = this.throwableObject.filter(b => !b.isBroken);
    bottlesSnapshot.forEach(bottle => {
      if (this.setHitBottles.has(bottle)) return;
      this.checkBottleCollisionWithEnemies(bottle);
      this.checkBottleCollisionWithEndBoss(bottle);
    });
    this.setHitBottles.clear();
  }

  /**
   * Handles bottle vs enemy collision.
   * Removes enemy after short delay to allow death animation.
   * @param {ThrowableObject} bottle
   */
  checkBottleCollisionWithEnemies(bottle) {
    if (bottle.isBroken) return;
    for (let i = this.level.enemies.length - 1; i >= 0; i--) {
      const enemy = this.level.enemies[i];
      if (enemy?._dying) continue;
      if (bottle.isColliding(enemy)) {
        enemy.hitEnemy();
        enemy._dying = true;
        this.scheduleRemovalFromArray(this.level.enemies, enemy, 400);
        if (typeof bottle.breakNow === 'function') bottle.breakNow();
        else bottle.isBroken = true;
        setTimeout(() => this.deleteBottleByRef(bottle), 400);
        this.setHitBottles.add(bottle);
        break;
      }
    }
  }

  /**
   * Handles bottle vs end boss collision.
   * Prevents duplicate hits with setHitBottles.
   * @param {ThrowableObject} bottle
   */
  checkBottleCollisionWithEndBoss(bottle) {
    if (bottle.isBroken || this.setHitBottles.has(bottle)) return;
    for (let i = 0; i < this.level.endboss.length; i++) {
      const endboss = this.level.endboss[i];
      if (bottle.isColliding(endboss)) {
        if (typeof endboss.hitEndboss === 'function') endboss.hitEndboss();
        else {
          endboss.energy = Math.max(0, (endboss.energy ?? 100) - 20);
          endboss.lastHit = Date.now();
        }
        this.statusBarEndboss.setPercentage(endboss.energy);
        if (typeof bottle.breakNow === 'function') bottle.breakNow();
        else bottle.isBroken = true;
        setTimeout(() => this.deleteBottleByRef(bottle), 400);
        this.setHitBottles.add(bottle);
        break;
      }
    }
  }

  /** Handles stomp kill when character jumps on enemies. */
  jumpOnEnemy() {
    for (let i = this.level.enemies.length - 1; i >= 0; i--) {
      const enemy = this.level.enemies[i];
      if (enemy?._dying) continue;
      if (this.character.isColliding(enemy) && this.character.isAboveGround() && this.character.speedY < 0) {
        this.character.jumpOfEnemy();
        enemy.hitEnemy();
        enemy._dying = true;
        this.scheduleRemovalFromArray(this.level.enemies, enemy, 400);
      }
    }
  }

  /** Handles collisions between character and enemies on the ground. */
  checkCollisions() {
    this.level.enemies.forEach(enemy => {
      if (enemy?._dying) return;
      if (this.character.isColliding(enemy) && !this.character.isAboveGround()) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  /** Handles collisions between character and bottles on the ground. */
  checkCollisionsBottles() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.audioManager.playPopSound();
        this.collectBottles(bottle, index);
        this.statusBarBottles.setPercentage(this.statusBarBottles.percentage + 12.5);
      }
    });
  }

  /** Handles collisions between character and coins. */
  checkCollisionsCoins() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.audioManager.playCoinSound();
        this.collectCoins(coin, index);
        this.statusBarCoin.setPercentage(this.statusBarCoin.percentage + 12.5);
      }
    });
  }

  /** Handles collisions between character and the end boss. */
  checkCollisionsByEndboss() {
    this.level.endboss.forEach(endboss => {
      if (this.character.isColliding(endboss)) {
        this.character.hitByEndboss();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  /** Checks win condition: all end bosses defeated. */
  checkWinCondition() {
    if (this._winTriggered) return;
    const bosses = this.level.endboss || [];
    if (bosses.length > 0 && bosses.every(b => (b.energy ?? 100) <= 0)) {
      this._winTriggered = true;
      setTimeout(() => { openWinScreen(); }, 600);
    }
  }

  /**
   * Adds multiple objects to the map.
   * @param {DrawableObject[]} objects
   */
  addObjectsToMap(objects) { objects.forEach(o => this.addToMap(o)); }

  /**
   * Adds a single object to the map, flipping if required.
   * @param {DrawableObject} mo
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /** Flips image horizontally. */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /** Restores image orientation after flip. */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /** Collects a bottle and removes it from level. */
  collectBottles(bottle, index) {
    this.bottles.push(bottle);
    this.level.bottles.splice(index, 1);
  }

  /** Collects a coin and removes it from level. */
  collectCoins(coin, index) {
    this.coins.push(coin);
    this.level.coins.splice(index, 1);
  }

  /**
   * Deletes an enemy by index.
   * @param {number} index
   */
  deleteEnemy(index) {
    if (index >= 0 && index < this.level.enemies.length) this.level.enemies.splice(index, 1);
  }

  /**
   * Deletes a thrown bottle by index.
   * @param {number} index
   */
  deleteBottle(index) { setTimeout(() => { this.throwableObject.splice(index, 1); }, 100); }

  /** Deletes a thrown bottle by reference. */
  deleteBottleByRef(bottle) {
    const idx = this.throwableObject.indexOf(bottle);
    if (idx >= 0) this.throwableObject.splice(idx, 1);
  }

  /**
   * Removes an item from an array after a delay.
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
