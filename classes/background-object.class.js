/**
 * Represents a static background object in the game world.
 * Extends {@link MovableObject}.
 *
 * Responsibilities:
 * - Loads and displays a background image.
 * - Positions the object at a given X coordinate.
 * - Anchors the object to the bottom of the canvas (Y aligned with ground).
 *
 * Notes:
 * - Width and height match the game’s viewport (720 × 480).
 * - Typically used for parallax scrolling layers or scenery.
 */
class BackgroundObject extends MovableObject {
  /** Width of the background object (px). */
  width = 720;

  /** Height of the background object (px). */
  height = 480;

  /**
   * Creates a new background object.
   *
   * @param {string} imagePath - Path to the background image.
   * @param {number} x - X position where the object will be placed.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
