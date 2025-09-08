class World {
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  lastThrowTime = 0;
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

  /**
   * Creates a new world instance.
   * @param {HTMLCanvasElement} canvas - The canvas element where the world will be drawn.
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

  /**
   * Sets the world context for the character.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Main game loop that checks for various collisions and actions.
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
   * Draws the world and all its objects to the canvas.
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
    // ------- Space for fixed objrcts -------
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
   * Handles throwing objects (bottles) based on keyboard input.
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

  /**
   * Checks if a bottle colliding with an enemy
   *
   */
  checkBottleCollisionWithAllEnemies() {
    this.throwableObject.forEach((bottle, bottleIndex) => {
      this.checkBottleCollisionWithEnemies(bottle, bottleIndex);
      this.checkBottleCollisionWithEndBoss(bottle, bottleIndex);
    });
  }

  /**
   * Checks if a bottle collides with an enemy.
   * @param {ThrowableObject} bottle - The bottle object.
   * @param {number} bottleIndex - The index of the bottle in the throwable objects array.
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
   * Checks if a bottle collides with the end boss.
   * @param {ThrowableObject} bottle - The bottle object.
   * @param {number} bottleIndex - The index of the bottle in the throwable objects array.
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
   * Makes the character jump on an enemy and defeat it.
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

  /**
   * Checks for collisions between the character and enemies.
   */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !this.character.isAboveGround()) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  /**
   * Checks for collisions between the character and bottles.
   */
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

  /**
   * Checks for collisions between the character and coins.
   */
  checkCollisionsCoins() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.audioManager.playCoinSound();
        this.collectCoins(coin, index);
        this.statusBarCoin.setPercentage(this.statusBarCoin.percentage + 12.5);
      }
    });
  }

  /**
   * Checks for collisions between the character and the end boss.
   */
  checkCollisionsByEndboss() {
    this.level.endboss.forEach((endboss) => {
      if (this.character.isColliding(endboss)) {
        this.character.hitByEndboss();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  /**
   * Adds multiple objects to the map for drawing.
   * @param {Array} objects - The objects to be added to the map.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Draws an object on the map and handles its direction if needed.
   * @param {Object} mo - The object to be added to the map.
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
   * Flips the image for objects facing the opposite direction.
   * @param {Object} mo - The object to be flipped.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the image orientation after flipping.
   * @param {Object} mo - The object whose orientation will be restored.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Collects a bottle when the character collides with it.
   * @param {Object} bottle - The bottle object.
   * @param {number} index - The index of the bottle in the level's bottles array.
   */
  collectBottles(bottle, index) {
    this.bottles.push(bottle);
    this.level.bottles.splice(index, 1);
  }

  /**
   * Collects a coin when the character collides with it.
   * @param {Object} coin - The coin object.
   * @param {number} index - The index of the coin in the level's coins array.
   */
  collectCoins(coin, index) {
    this.coins.push(coin);
    this.level.coins.splice(index, 1);
  }

  /**
   * Deletes an enemy from the level's enemies array.
   * @param {number} index - The index of the enemy to delete.
   */
  deleteEnemy(index) {
    setTimeout(() => {
      level1.enemies.splice(index, 1);
    }, 400);
  }

  /**
   * Deletes a bottle from the throwable objects array.
   * @param {number} index - The index of the bottle to delete.
   */
  deleteBottle(index) {
    setTimeout(() => {
      this.throwableObject.splice(index, 1);
    }, 100);
  }
}
