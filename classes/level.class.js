/**
 * Represents a game level, holding all entities and objects within it.
 *
 * Responsibilities:
 * - Stores references to all active game objects (enemies, boss, collectibles, environment).
 * - Defines the end boundary of the level (`level_end_x`).
 *
 * Notes:
 * - This class acts as a data container; it does not manage game logic directly.
 * - Entities (like `enemies`, `coins`, `bottles`) are expected to be initialized
 *   before being passed into the constructor.
 */
class level {
  endboss; enemies; clouds; backgroundObjects; coins; bottles;

  /** X coordinate where the level ends (px). */
  level_end_x = 2250;

  /**
   * Creates an instance of a game level with the provided entities.
   * @param {Object[]} enemies
   * @param {Object[]} endboss
   * @param {Object[]} coins
   * @param {Object[]} bottles
   * @param {Object[]} clouds
   * @param {Object[]} backgroundObjects
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
