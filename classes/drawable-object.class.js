/**
 * Base class for drawable game objects.
 * - Stores position, size, and current image.
 * - Can load one or multiple images.
 * - Draws the current image to a canvas.
 * - Provides shared percentage → image index logic (for status bars).
 */
class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  /** Load a single image into {@link img}. */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /** Draw current image at (x,y) with given size. */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /** Preload multiple images into {@link imageCache}. */
  loadImages(arr) {
    arr.forEach((p) => {
      let i = new Image();
      i.src = p;
      this.imageCache[p] = i;
    });
  }

  /**
   * Sets percentage and updates displayed image.
   * Works for all status bar classes that define {@link IMAGES}.
   * @param {number} percentage - Value 0–100
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage));
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Maps percentage to image index (0–5).
   * Expects 6 IMAGES in the subclass.
   * @returns {number} Index in {@link IMAGES}.
   */
  resolveImageIndex() {
    const p = Math.max(0, Math.min(100, this.percentage ?? 0));
    if (p >= 100) return 5;
    return p > 80 ? 4 : p > 60 ? 3 : p > 40 ? 2 : p > 20 ? 1 : 0;
  }
}
