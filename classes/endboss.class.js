/**
 * End boss enemy that extends {@link MovableObject}.
 *
 * Responsibilities:
 * - Loads and cycles through animations for walking, alert, attack, hurt, and dead states.
 * - Switches state based on energy level, world conditions, and death flag.
 * - Triggers sounds via `AudioManager`.
 * - Signals win screen when defeated.
 *
 * Units & timing:
 * - Position/dimensions in pixels.
 * - Animation interval: every 100 ms (~10 FPS).
 *
 * Notes:
 * - State evaluation order: alert → dead → hurt → attack.
 * - Uses a fixed X spawn position (2500 px).
 * - Speed is dynamically modified per state.
 */
class Endboss extends MovableObject {
  /** Sprite height (px). */
  height = 400;

  /** Sprite width (px). */
  width = 300;

  /** Y position on canvas (px). */
  y = 50;

  /**
   * Collision box offsets relative to sprite edges (px).
   * Adjusted so the hitbox better matches the visible character.
   */
  offset = {
    top: 80,
    bottom: 80,
    left: 60,
    right: 10
  };

  /** Frames for walking animation. */
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

  /** Frames for alert animation (same as walking frames here). */
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

  /** Frames for attack animation. */
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

  /** Frames for hurt animation. */
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /** Frames for death animation. */
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Creates an instance of the end boss:
   * - Loads the initial image (first walking frame).
   * - Instantiates the audio manager.
   * - Preloads all animation frames.
   * - Sets starting position (X = 2500).
   * - Sets base speed (0.5).
   * - Starts the animation loop.
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
   * Preloads all animation frames:
   * - Walking
   * - Dead
   * - Hurt
   * - Attack
   * - Alert
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_ALERT);
  }

  /**
   * Main animation loop, called every 100 ms (~10 FPS).
   * Updates movement and state-based animation.
   */
  animate() {
    let intervalEndboss = setInterval(() => {
      this.endbossMove();
      this.endbossAnimationDeadWalkHurtAttack();
    }, 100);
  }

  /**
   * Evaluates and updates the end boss's state:
   * - Alert (if world flag set).
   * - Dead (triggers win screen).
   * - Hurt (if energy ≤ 80 and hurt flag).
   * - Attack (if energy ≤ 80 and not dead).
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
   * Default movement behavior:
   * - Stops any ongoing boss sound.
   * - Moves left at current speed.
   * - Plays walking animation.
   */
  endbossMove() {
    this.audioManager.stopEndbossSound();
    this.moveLeft();
    this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Hurt state:
   * - Plays end boss sound.
   * - Temporarily increases speed to 8.
   * - Moves left.
   * - Plays hurt animation.
   */
  endbossIsHurt() {
    this.audioManager.playEndbossSound();
    this.speed = 8;
    this.moveLeft();
    this.playAnimation(this.IMAGES_HURT);
  }

  /**
   * Alert state:
   * - Triggered when `world.endbossAlert` is true.
   * - Plays end boss sound.
   * - Freezes movement (speed = 0).
   * - Plays alert animation.
   */
  endbossIsAlert() {
    if (this.world && this.world.endbossAlert === true) {
      this.audioManager.playEndbossSound();
      this.speed = 0;
      this.playAnimation(this.IMAGES_ALERT);
    }
  }

  /**
   * Attack state:
   * - Stops end boss sound.
   * - Increases speed to 12.
   * - Moves left (note: currently `this.moveLeft` is referenced but not invoked).
   * - Plays attack animation.
   */
  endbossAttack() {
    this.audioManager.stopEndbossSound();
    this.speed = 12;
    this.moveLeft; // <— function is referenced but not executed
    this.playAnimation(this.IMAGES_ATTACK);
  }

  /**
   * Dead state:
   * - Plays chicken sound.
   * - Freezes movement (speed = 0).
   * - Plays death animation.
   */
  endbossDead() {
    this.audioManager.playChickenSound();
    this.speed = 0;
    this.playAnimation(this.IMAGES_DEAD);
  }
}
