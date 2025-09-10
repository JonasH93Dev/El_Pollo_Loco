class StatusBarCoin extends DrawableObject {
  x = 50;
  y = 50;
  width = 200;
  height = 60;

  IMAGES = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  /**
   * Initializes the ProgressImage instance.
   * Loads all images into the cache and sets the initial display to 100%.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(0);
  }

  /**
   * Sets the current percentage and updates the image accordingly.
   * @param {number} percentage - The percentage to set (0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the appropriate image index based on the current percentage.
   * @returns {number} - The index of the image in the IMAGES array.
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
