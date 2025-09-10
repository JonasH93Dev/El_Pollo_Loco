/**
 * Base class for all drawable objects in the game.
 *
 * Responsibilities:
 * - Stores position, size, and the current image.
 * - Provides functionality to load single or multiple images.
 * - Provides functionality to draw the current image to the canvas.
 *
 * Notes:
 * - The `imageCache` acts as a lookup table for preloaded images.
 * - Subclasses (e.g., characters, enemies, collectibles) typically
 *   cycle through cached images to create animations.
 */
class DrawableObject {
  /** Currently displayed image element. */
  img;

  /**
   * Image cache mapping file paths to `HTMLImageElement` objects.
   * Used for efficient image reuse in animations.
   * @type {Record<string, HTMLImageElement>}
   */
  imageCache = {};

  /**
   * Index of the current animation frame within an image array.
   * Subclasses update this to cycle animations.
   * @type {number}
   */
  currentImage = 0;

  /** Horizontal position on the canvas (px). */
  x = 120;

  /** Vertical position on the canvas (px). */
  y = 280;

  /** Display height on the canvas (px). */
  height = 150;

  /** Display width on the canvas (px). */
  width = 100;

  /**
   * Loads a single image from a given file path and assigns it to {@link img}.
   *
   * @param {string} path - File path of the image to load (e.g., "img/image.png").
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the currently loaded image onto the canvas at the object's position and size.
   *
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Loads multiple images from an array of paths and stores them in {@link imageCache}.
   * Useful for preloading animation frames.
   *
   * @param {string[]} arr - Array of image file paths (e.g., ["img/image1.png", "img/image2.png"]).
   * @example
   * this.loadImages(["img/hero_walk1.png", "img/hero_walk2.png"]);
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
