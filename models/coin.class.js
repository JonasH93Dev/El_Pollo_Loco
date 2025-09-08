class Coin extends MovableObject {
  width = 120;
  height = 120;
  offset = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
}

  IMAGES = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * Initializes a new Coin instance with a random position within the game area.
   * Loads the blinking animation images and starts the blink animation.
   */
  constructor() {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.audioManager = new AudioManager();
    this.animate();
    this.x = 250 + Math.random() * 1800;
    this.y = 50 + Math.random() * 300;
  }

  /**
   * Initiates the coin's blinking animation, making it alternate between images.
   */
  animate() {
    this.coinBlink();
  }

  /**
   * Animates the coin by switching between images every 250 milliseconds,
   * creating a blinking effect to make the coin stand out.
   */
  coinBlink() {
    setInterval(() => {
      this.playAnimation(this.IMAGES);
    }, 250);
  }
}
