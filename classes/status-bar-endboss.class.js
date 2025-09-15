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
}
