/**
 * Status bar that visualizes the player's health.
 * Extends {@link DrawableObject}.
 *
 * Responsibilities:
 * - Preloads status bar images representing health levels.
 * - Updates the displayed image according to a percentage value (0–100).
 *
 * Notes:
 * - Images are cached in `imageCache` for efficient reuse.
 * - Percentage thresholds: 0, 20, 40, 60, 80, 100.
 * - Starts fully filled (100%).
 */
class StatusBar extends DrawableObject {
  /** X position of the status bar (px). */
  x = 50;

  /** Y position of the status bar (px). */
  y = 0;

  /** Width of the status bar (px). */
  width = 200;

  /** Height of the status bar (px). */
  height = 60;

  /** Current health percentage (0–100). */
  percentage = 100;

  /** Status bar images for 0%, 20%, 40%, 60%, 80%, and 100%. */
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  /**
   * Creates a new health status bar:
   * - Loads all bar images into the cache.
   * - Initializes the display with 100%.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
  }

  /**
   * Updates the current percentage and switches the image accordingly.
   *
   * @param {number} percentage - Value between 0 and 100 representing health level.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves which image index corresponds to the current percentage.
   *
   * @returns {number} Index of the appropriate image in {@link IMAGES}.
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
