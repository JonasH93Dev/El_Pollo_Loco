class Endboss extends MovableObject {
  height = 400;
  width = 300;
  y = 50;
  offset = {
    top: 80,
    bottom: 80,
    left: 60,
    right: 10
};

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Creates an instance of the end boss.
   * Initializes the end boss with the first walking image, audio manager, and properties such as position and speed.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.audioManager = new AudioManager();
    this.loadAllImages();
    this.x = 2500;
    this.speed = 0.5;
    this.animate();
  }

  /**
   * Loads all images for the end boss (walking, dead, hurt, attack, alert).
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_ALERT);
  }

  /**
   * Animates the end boss by calling its movement and state-based animations.
   * This is repeatedly called via an interval to update the animation.
   */
  animate() {
    let intervalEndboss = setInterval(() => {
      this.endbossMove();
      this.endbossAnimationDeadWalkHurtAttack();
    }, 100);
  }

  /**
   * Updates the end boss's state, switching between attack, hurt, walking, and dead states.
   * This method checks the health and other conditions to determine the appropriate animation.
   */
  endbossAnimationDeadWalkHurtAttack() {
    this.endbossIsAlert();
    if (this.isDead()) {
      this.endbossDead();
      openWinScreen();
    } else if (this.isHurt() && this.energy <= 80) {
      this.endbossIsHurt();
    } else if (this.energy <= 80 && !this.isDead()) {
      this.endbossAttack();
    }
  }

  /**
   * Moves the end boss left and plays the walking animation.
   */
  endbossMove() {
    this.audioManager.stopEndbossSound();
    this.moveLeft();
    this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Triggered when the end boss is hurt. Changes its speed, plays the hurt animation, and plays a sound.
   */
  endbossIsHurt() {
    this.audioManager.playEndbossSound();
    this.speed = 8;
    this.moveLeft();
    this.playAnimation(this.IMAGES_HURT);
  }

  /**
   * Checks if the end boss is alerted, stops its movement, and plays the alert animation.
   */
  endbossIsAlert() {
    if (this.world && this.world.endbossAlert === true) {
      this.audioManager.playEndbossSound();
      this.speed = 0;
      this.playAnimation(this.IMAGES_ALERT);
    }
  }

  /**
   * Handles the attack state of the end boss. Increases speed and plays the attack animation.
   */
  endbossAttack() {
    this.audioManager.stopEndbossSound();
    this.speed = 12;
    this.moveLeft;
    this.playAnimation(this.IMAGES_ATTACK);
  }

  /**
   * Triggered when the end boss dies. Stops movement, plays the death animation, and plays a sound.
   */
  endbossDead() {
    this.audioManager.playChickenSound();
    this.speed = 0;
    this.playAnimation(this.IMAGES_DEAD);
  }
}
