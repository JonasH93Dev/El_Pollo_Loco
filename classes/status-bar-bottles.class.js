/**
 * Status bar that visualizes collected bottles. Extends {@link DrawableObject}.
 * - Preloads bar images (0/20/40/60/80/100%).
 * - Updates image based on a 0–100 percentage.
 */
class StatusBarBottles extends DrawableObject {
  x = 0; y = 90; width = 200; height = 60;

  /** Status bar images for 0%, 20%, 40%, 60%, 80%, 100%. */
  IMAGES = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];

  /** Loads all images and initializes with 0%. */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(0);
  }
}
