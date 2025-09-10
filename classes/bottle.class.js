class Bottle extends DrawableObject {
  y = 340;
  width = 60;
  height = 80;
  offset = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
}
  /**
   * Array containing paths to salsa bottle images.
   */
  IMAGES = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Initializes a new SalsaBottle instance with a random image and position.
   * Loads the random image and preloads all images in IMAGES array for animations.
   */
  constructor() {
    super();
    let randomBottlesImage =
      this.IMAGES[Math.floor(Math.random() * this.IMAGES.length)];
    this.x = 400 + Math.random() * 1500;
    this.loadImage(randomBottlesImage); // Zufälliges Bild laden
    this.loadImages(this.IMAGES); // Alle Bilder für Animationen vorladen
  }
}
