class DrawableObject {
  img;
  imageCache = {}; // JSON/Objekt um bilder abzuspeichern, charachter und chicken animieren
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  /**
   * Loads an image from the provided path and stores it in the `img` property.
   * @param {string} path - The file path to the image to be loaded (e.g., 'img/image.png').
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the loaded image onto the canvas context at the object's position and size.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas where the image will be drawn.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Loads multiple images from an array of paths and stores them in the `imageCache` for later use.
   * @param {Array<string>} arr - An array of image file paths (e.g., ['img/image1.png', 'img/image2.png', ...]).
   * @example
   * loadImages(['img/image1.png', 'img/image2.png']);
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
