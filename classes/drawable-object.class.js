/**
 * Base class for drawable game objects.
 * - Stores position, size, and current image.
 * - Can load one or multiple images.
 * - Draws the current image to a canvas.
 */
class DrawableObject {
  img; imageCache = {}; currentImage = 0;
  x = 120; y = 280; height = 150; width = 100;

  /** Load a single image into {@link img}. */
  loadImage(path) {
    this.img = new Image(); this.img.src = path;
  }

  /** Draw current image at (x,y) with given size. */
  draw(ctx) { ctx.drawImage(this.img, this.x, this.y, this.width, this.height); }

  /** Preload multiple images into {@link imageCache}. */
  loadImages(arr) {
    arr.forEach(p => { let i = new Image(); i.src = p; this.imageCache[p] = i; });
  }
}
