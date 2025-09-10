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
  /** Reference to the level’s end boss. */
  endboss;

  /** Array of enemy objects (e.g., chickens, small chickens). */
  enemies;

  /** Array of cloud objects used for background animation. */
  clouds;

  /** Array of background objects (e.g., scenery layers). */
  backgroundObjects;

  /** Array of collectible coin objects. */
  coins;

  /** Array of throwable bottle objects. */
  bottles;

  /**
   * X coordinate where the level ends (px).
   * Used as a right boundary for character movement and camera scrolling.
   */
  level_end_x = 2250;

  /**
   * Creates an instance of a game level with the provided entities.
   *
   * @param {Object[]} enemies - Enemy objects in the level.
   * @param {Object} endboss - The final boss object for the level.
   * @param {Object[]} coins - Collectible coin objects.
   * @param {Object[]} bottles - Throwable bottle objects.
   * @param {Object[]} clouds - Cloud objects for the background.
   * @param {Object[]} backgroundObjects - Background layer objects for scenery.
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
