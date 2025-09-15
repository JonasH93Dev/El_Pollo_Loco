/**
 * Status bar that visualizes collected coins. Extends {@link DrawableObject}.
 * - Preloads bar images (0/20/40/60/80/100%).
 * - Updates image based on a 0–100 percentage.
 */
class StatusBarCoin extends DrawableObject {
  x = 0; y = 40; width = 200; height = 60;

  /** Status bar images for 0%, 20%, 40%, 60%, 80%, 100%. */
  IMAGES = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  /** Loads all images and initializes with 0%. */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(0);
  }
}
