/**
 * Status bar showing the end boss's health. Extends {@link DrawableObject}.
 * - Preloads bar images (0–100%).
 * - Starts filled (100%).
 * - Updates displayed image based on percentage.
 */
class StatusBarEndboss extends DrawableObject {
  x = 500; y = 75; width = 200; height = 60; percentage = 100;

  /** Status bar images for 0–100%. */
  IMAGES = [
    "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
  ];

  /** Loads all images and initializes with 100%. */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
  }

  /**
   * Sets health percentage and updates displayed image.
   * @param {number} percentage - Value 0–100.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Maps percentage to image index.
   * @returns {number} Index in {@link IMAGES}.
   */
  resolveImageIndex() {
    const p = this.percentage;
    if (p == 100) return 5;
    return p > 80 ? 4 : p > 60 ? 3 : p > 40 ? 2 : p > 20 ? 1 : 0;
  }
}
