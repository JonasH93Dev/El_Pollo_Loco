/**
 * Status bar visualizing player's health. Extends {@link DrawableObject}.
 * - Preloads health images (0–100%).
 * - Starts filled (100%).
 * - Updates image based on percentage.
 */
class StatusBar extends DrawableObject {
  x = 50; y = 0; width = 200; height = 60; percentage = 100;

  /** Health bar images for 0–100%. */
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  /** Loads images and initializes at 100%. */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
  }

  /**
   * Updates bar percentage and displayed image.
   * @param {number} percentage - Health level (0–100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Returns image index for current percentage.
   * @returns {number} Index in {@link IMAGES}.
   */
  resolveImageIndex() {
    const p = this.percentage;
    if (p == 100) return 5;
    return p > 80 ? 4 : p > 60 ? 3 : p > 40 ? 2 : p > 20 ? 1 : 0;
  }
}
