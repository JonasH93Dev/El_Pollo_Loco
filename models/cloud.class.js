class Cloud extends MovableObject {
  width = 500;
  height = 250;

  /**
   * Initializes a new Cloud instance with a random position and starts the animation.
   */
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 2400; // cloud range
    this.y = 10 + Math.random() * 30;
    this.animate();
  }

  /**
   * Starts a continuous animation moving the cloud to the left.
   * The animation updates 60 times per second to create smooth movement.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
