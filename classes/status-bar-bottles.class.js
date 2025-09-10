class StatusBarBottles extends DrawableObject {
  x = 50;
  y = 100;
  width = 200;
  height = 60;

  IMAGES = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];

  /**
   * Initializes the ImageLoader with images and sets the default percentage.
   * Loads all images into the cache on instantiation.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(0);
  }

  /**
   * Sets the current percentage and updates the image accordingly.
   * @param {number} percentage - A value from 0 to 100 representing the progress or health level.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the index of the image in IMAGES array based on the current percentage.
   * @returns {number} - Index of the appropriate image for the given percentage.
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
