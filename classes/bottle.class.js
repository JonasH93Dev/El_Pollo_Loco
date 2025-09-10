/**
 * Collectible salsa bottle extending {@link DrawableObject}.
 * - Spawns at random X (400–1900 px), Y = 340.
 * - Loads one of two ground images, preloads both.
 * - Uses smaller collision box via `offset`.
 */
class Bottle extends DrawableObject {
  y = 340; width = 60; height = 80;
  offset = { top: 50, bottom: 50, left: 50, right: 50 };

  IMAGES = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
  ];

  constructor() {
    super();
    let img = this.IMAGES[Math.floor(Math.random() * this.IMAGES.length)];
    this.x = 400 + Math.random() * 1500;
    this.loadImage(img);
    this.loadImages(this.IMAGES);
  }
}
