class StatusBar extends DrawableObject {
  x = 50;
  y = 0;
  width = 200;
  height = 60;
  percentage = 100;

  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  /**
   * Initializes the ProgressImage instance.
   * Loads all images into the cache and sets the initial display to 100%.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
  }

  /**
   * Sets the current percentage and updates the displayed image based on the percentage.
   * @param {number} percentage - The progress or health level, ranging from 0 to 100.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the appropriate image index based on the percentage.
   * Returns an index to select the right image from the `IMAGES` array.
   * @returns {number} - The index of the appropriate image for the current percentage.
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
