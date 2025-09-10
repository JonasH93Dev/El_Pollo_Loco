/**
 * Static background element (e.g., scenery) extending {@link MovableObject}.
 *
 * - Loads an image and positions it at a given X.
 * - Anchored to the bottom (Y = canvasHeight - height).
 * - Dimensions: 720×480 px (viewport size).
 */
class BackgroundObject extends MovableObject {
  width = 720; height = 480;

  /**
   * @param {string} imagePath - Path to background image.
   * @param {number} x - X coordinate for placement.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
