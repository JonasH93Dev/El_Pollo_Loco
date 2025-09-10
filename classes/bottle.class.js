/**
 * Collectible salsa bottle object.
 * Extends {@link DrawableObject}.
 *
 * Responsibilities:
 * - Spawns at a random X position within the game world.
 * - Loads a random bottle image on creation.
 * - Preloads all available bottle images for later animations.
 *
 * Notes:
 * - Collision box is smaller than the sprite (`offset` used for hit detection).
 * - Images represent bottles lying on the ground.
 */
class Bottle extends DrawableObject {
  /** Y position of the bottle (px). */
  y = 340;

  /** Width of the bottle (px). */
  width = 60;

  /** Height of the bottle (px). */
  height = 80;

  /**
   * Collision box offsets relative to sprite edges (px).
   * Shrinks the hitbox to better fit the bottle sprite.
   */
  offset = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
  };

  /** Array of bottle image paths (lying on the ground). */
  IMAGES = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates a new salsa bottle instance:
   * - Chooses a random bottle image (variation on the ground).
   * - Spawns at a random X position between 400–1900 px.
   * - Loads the chosen image.
   * - Preloads all bottle images for later use.
   */
  constructor() {
    super();
    let randomBottlesImage =
      this.IMAGES[Math.floor(Math.random() * this.IMAGES.length)];
    this.x = 400 + Math.random() * 1500;
    this.loadImage(randomBottlesImage);
    this.loadImages(this.IMAGES);
  }
}
