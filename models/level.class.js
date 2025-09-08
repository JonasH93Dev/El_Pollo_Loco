class level {
  endboss;
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  level_end_x = 2250;

  /**
   * Creates an instance of the game world, initializing all game entities.
   * @param {Array} enemies - An array of enemy objects in the game.
   * @param {Object} endboss - The endboss object that represents the final boss in the game.
   * @param {Array} coins - An array of coin objects that the player can collect.
   * @param {Array} bottles - An array of bottle objects that are scattered around the game world.
   * @param {Array} clouds - An array of cloud objects for the background or environmental effects.
   * @param {Array} backgroundObjects - An array of background objects used for visual effects or environment elements.
   */
  constructor(enemies, endboss, coins, bottles, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.endboss = endboss;
    this.coins = coins;
    this.bottles = bottles;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
  }
}
