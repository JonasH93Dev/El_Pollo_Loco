/**
 * End boss enemy extending {@link MovableObject}.
 * - Cycles animations: walking, alert, attack, hurt, dead.
 * - State order: alert → dead → hurt → attack.
 * - Triggers SFX via {@link AudioManager}; win screen on death.
 * - Spawns at X=2500, speed adjusted per state.
 */
class Endboss extends MovableObject {
  /** Dimensions/position (px). */ 
  height = 400; width = 300; y = 50;

  /** Hitbox offsets (px). */
  offset = { top: 80, bottom: 80, left: 60, right: 10 };

  /** Animation frames. */
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

  /** Loads first sprite, audio, frames; sets spawn & base speed; starts loop. */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.audioManager = new AudioManager();
    this.loadAllImages();
    this.x = 2500;
    this.speed = 0.5;
    this.animate();
  }

  /** Preload all animation frame sets. */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_ALERT);
  }

  /** 10 FPS loop: movement + state animation. */
  animate() {
    let intervalEndboss = setInterval(() => {
      this.endbossMove();
      this.endbossAnimationDeadWalkHurtAttack();
    }, 100);
  }

  /** State evaluation: alert → dead (win) → hurt → attack. */
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

  /** Default: stop SFX, move left, play walking. */
  endbossMove() {
    this.audioManager.stopEndbossSound();
    this.moveLeft();
    this.playAnimation(this.IMAGES_WALKING);
  }

  /** Hurt: play SFX, speed=8, move left, play hurt. */
  endbossIsHurt() {
    this.audioManager.playEndbossSound();
    this.speed = 8;
    this.moveLeft();
    this.playAnimation(this.IMAGES_HURT);
  }

  /** Alert: if flagged, play SFX, freeze (speed=0), play alert. */
  endbossIsAlert() {
    if (this.world && this.world.endbossAlert === true) {
      this.audioManager.playEndbossSound();
      this.speed = 0;
      this.playAnimation(this.IMAGES_ALERT);
    }
  }

  /**
   * Attack: stop SFX, speed=12, (BUG preserved) references moveLeft without calling, play attack.
   * Note: `this.moveLeft;` is intentionally not invoked to keep original behavior.
   */
  endbossAttack() {
    this.audioManager.stopEndbossSound();
    this.speed = 12;
    this.moveLeft; // preserve original (not executed)
    this.playAnimation(this.IMAGES_ATTACK);
  }

  /** Dead: play chicken SFX, freeze, play dead. */
  endbossDead() {
    this.audioManager.playChickenSound();
    this.speed = 0;
    this.playAnimation(this.IMAGES_DEAD);
  }
}
