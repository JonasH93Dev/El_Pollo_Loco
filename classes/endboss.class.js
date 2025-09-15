/**
 * End boss enemy extending {@link MovableObject}.
 * - Cycles animations: walking, alert, attack, hurt, dead.
 * - State order: alert → dead → hurt → attack.
 * - Triggers SFX via {@link AudioManager}.
 * - Spawns at X=2500, speed adjusted per state.
 */
class Endboss extends MovableObject {
  height = 400; width = 300; y = 50;
  offset = { top: 80, bottom: 80, left: 60, right: 10 };

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

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.audioManager = new AudioManager();
    this.loadAllImages();
    this.x = 2500;
    this.speed = 0.5;
    this.energy = 100;
    this.animate();
  }

  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_ALERT);
  }

  animate() {
    let intervalEndboss = setInterval(() => {
      this.endbossMove();
      this.endbossAnimationDeadWalkHurtAttack();
    }, 100);
  }

  endbossAnimationDeadWalkHurtAttack() {
    this.endbossIsAlert();

    if (this.energy <= 0) {
      this.endbossDead();
      return;
    }

    if (this.isHurt() && this.energy <= 80) {
      this.endbossIsHurt();
    } else if (this.energy <= 80) {
      this.endbossAttack();
    }
  }

  endbossMove() {
    this.audioManager.stopEndbossSound();
    this.moveLeft();
    this.playAnimation(this.IMAGES_WALKING);
  }

  endbossIsHurt() {
    this.audioManager.playEndbossSound();
    this.speed = 8;
    this.moveLeft();
    this.playAnimation(this.IMAGES_HURT);
  }

  endbossIsAlert() {
    if (this.world && this.world.endbossAlert === true) {
      this.audioManager.playEndbossSound();
      this.speed = 0;
      this.playAnimation(this.IMAGES_ALERT);
    }
  }

  endbossAttack() {
    this.audioManager.stopEndbossSound();
    this.speed = 12;
    this.moveLeft;
    this.playAnimation(this.IMAGES_ATTACK);
  }

  endbossDead() {
    this.audioManager.playChickenSound();
    this.speed = 0;
    this.playAnimation(this.IMAGES_DEAD);
  }

  /**
   * Apply a hit from a thrown bottle: minus 20 energy and mark time for "hurt" state.
   */
  hitEndboss() {
    this.energy = Math.max(0, (this.energy ?? 100) - 20);
    this.lastHit = new Date().getTime();
  }
}
