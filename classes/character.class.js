/**
 * Playable character that extends {@link MovableObject}.
 * - Reads input from `world.keyboard`.
 * - Uses gravity from base class.
 * - Plays animations by state (dead/hurt/jump/walk/idle).
 * - Updates camera follow offset.
 */
class Character extends MovableObject {
  y = 50;
  height = 280;
  width = 150;
  speed = 10;
  lastMove = Date.now();
  world;

  /** Collision box offsets (px). */
  offset = { top: 120, bottom: 12, left: 30, right: 40 };

  /** Animation frame lists. */
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  /** Duplicate kept intentionally to preserve original shape. */
  world;

  // --- Added state for robust jump/animation handling ---
  isJumping = false;
  canJump = true;
  _animKey = null;

  /**
   * Sets initial sprite, audio, images; enables gravity & loops.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.audioManager = new AudioManager();
    this.loadAllImages();
    this.applyGravity();
    this.animate();
  }

  /** Preloads all animation frames to avoid stutter. */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
  }

  /**
   * Starts movement & animation state loops.
   */
  animate() {
    setInterval(() => this.characterMove(), 1000 / 60);
    setInterval(() => this.characterHurtDeadJumpAnimation(), 100);
  }

  /**
   * Selects animation by priority: dead → hurt → jump → walk → idle.
   * Uses guarded state switch to avoid restarting sequences mid-air.
   */
  characterHurtDeadJumpAnimation() {
    if (this.isDead()) { this.setAnimation('dead', this.IMAGES_DEAD); openLoseScreen(); return; }
    if (this.isHurt()) { this.setAnimation('hurt', this.IMAGES_HURT); this.audioManager.playHurtSound(); return; }
    if (this.isAboveGround() || this.isJumping || this.speedY > 0) { this.setAnimation('jump', this.IMAGES_JUMPING); return; }
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) { this.setAnimation('walk', this.IMAGES_WALKING); return; }
    this.characterIdle();
  }

  /**
   * Reads inputs, moves character, updates camera.
   */
  characterMove() {
    this.handleMoveRight();
    this.handleMoveLeft();
    this.tryJump();
    this.updateCamera();
  }

  /** Move right if allowed; set facing and timestamp. */
  handleMoveRight() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight(); this.otherDirection = false; this.lastMove = Date.now();
    }
  }

  /** Move left if allowed; set facing and timestamp. */
  handleMoveLeft() {
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft(); this.otherDirection = true; this.lastMove = Date.now();
    }
  }

  /** Jump when grounded (edge-triggered); play sound; update timestamp. */
  tryJump() {
    if (this.world.keyboard.SPACE && this.canJump && !this.isAboveGround()) {
      this.jump(); this.audioManager.playJumpSound(); this.lastMove = Date.now();
    }
  }

  /** Camera follow offset. */
  updateCamera() { this.world.camera_x = -this.x + 100; }

  /**
   * Plays idle vs. long-idle (threshold: 10s inactivity).
   */
  characterIdle() {
    if (Date.now() - this.lastMove >= 10000) this.setAnimation('long_idle', this.IMAGES_LONG_IDLE);
    else this.setAnimation('idle', this.IMAGES_IDLE);
  }

  /** Assigns upward vertical speed and refreshes lastMove. */
  jump() { 
    this.speedY = 20; 
    this.lastMove = Date.now(); 
    this.isJumping = true; 
    this.canJump = false; 
  }

  // --- Animation switch guard: reset frame index ONLY when sequence changes ---
  setAnimation(key, images) {
    if (this._animKey !== key) {
      this._animKey = key;
      this.currentImage = 0;
    }
    this.playAnimation(images);
  }

  // --- Called by MovableObject when landing is detected ---
  onLand() {
    this.isJumping = false;
    this.canJump = true;
   
    if (this._animKey === 'jump') {
      this._animKey = null;  
      this.currentImage = 0;
    }
  }
}
