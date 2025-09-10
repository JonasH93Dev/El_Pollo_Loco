// js/game.js

let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;

let background_sound = new Audio("audio/background_sound.mp3");
let win_sound = new Audio("audio/win.mp3");
let game_over_sound = new Audio("audio/game_over.mp3");

background_sound.volume = 0.01;

/** Shorthand for getElementById. */
const $ = (id) => document.getElementById(id);

/**
 * Sets display style on an element by id.
 * @param {string} id - Element id.
 * @param {string} display - CSS display value.
 */
function setDisplay(id, display) {
  $(id).style.display = display;
}

/**
 * Initializes the game:
 * - Builds level, world, and mobile controls.
 */
function init() {
  startLevel();
  canvas = $("canvas");
  world = new World(canvas, keyboard);
  mobileButtons();
}

/* ---------- Keyboard handling ---------- */

/** Maps legacy keyCodes to keyboard flags (and mute toggle). */
const keyMap = { 37: "LEFT", 38: "UP", 39: "RIGHT", 40: "DOWN", 32: "SPACE", 68: "D", 77: "M" };

window.addEventListener("keydown", (e) => {
  const key = keyMap[e.keyCode];
  if (!key) return;
  if (key === "M") toggleMute();
  else keyboard[key] = true;
});

window.addEventListener("keyup", (e) => {
  const key = keyMap[e.keyCode];
  if (!key || key === "M") return;
  keyboard[key] = false;
});

/* ---------- Mobile touch controls ---------- */

/**
 * Wires touch buttons to keyboard flags (LEFT/RIGHT/SPACE/D).
 */
function mobileButtons() {
  [
    ["btnLeft", "LEFT"],
    ["btnRight", "RIGHT"],
    ["btnJump", "SPACE"],
    ["btnThrow", "D"],
  ].forEach(([id, flag]) => {
    $(id).addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard[flag] = true;
    });
    $(id).addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard[flag] = false;
    });
  });
}

/* ---------- Audio helpers ---------- */

/**
 * Pauses background/win/game-over audio and resets playback head.
 */
function pauseSounds() {
  [background_sound, win_sound, game_over_sound].forEach((s) => {
    s.pause();
    s.currentTime = 0;
  });
}

/* ---------- Game lifecycle ---------- */

/** Starts the level setup. */
function startLevel() {
  initLevel();
}

/**
 * Starts the game, hides screens, and plays background music.
 */
function startGame() {
  init();
  background_sound.play();
  setDisplay("startScreen", "none");
  setDisplay("endScreenWin", "none");
  setDisplay("endScreenLose", "none");
}

/**
 * Restarts the game after clearing loops and resetting audio.
 */
function restartGame() {
  clearAllIntervals();
  pauseSounds();
  ["endScreenWin", "endScreenLose", "startScreen"].forEach((id) =>
    setDisplay(id, "none")
  );
  init();
  background_sound.play();
}

/**
 * Returns to the main menu and pauses audio.
 */
function goToMenu() {
  clearAllIntervals();
  pauseSounds();
  setDisplay("endScreenWin", "none");
  setDisplay("endScreenLose", "none");
  setDisplay("startScreen", "block");
}

/**
 * Shows win screen and plays win sound.
 */
function openWinScreen() {
  clearAllIntervals();
  pauseSounds();
  background_sound.pause();
  win_sound.play();
  setDisplay("endScreenWin", "flex");
}

/**
 * Shows lose screen and plays game-over sound.
 */
function openLoseScreen() {
  clearAllIntervals();
  background_sound.pause();
  game_over_sound.play();
  setDisplay("endScreenLose", "flex");
}

/**
 * Clears all active intervals to stop running loops.
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

/**
 * Toggles global mute state and updates UI + AudioManagers.
 */
function toggleMute() {
  const btn = $("muteBtn");
  isMuted = !isMuted;
  btn.innerText = isMuted ? "UNMUTE - M" : "MUTE - M";
  setMuted(isMuted);
}

/**
 * Applies mute/unmute to global and in-world sounds.
 * @param {boolean} muted - Whether sounds should be muted.
 */
function setMuted(muted) {
  [background_sound, win_sound, game_over_sound].forEach((s) => (s.muted = muted));
  const fn = muted ? "muteSounds" : "unmuteSounds";
  world.audioManager[fn]();
  world.character.audioManager[fn]();
  world.level.endboss.forEach((eb) => eb.audioManager[fn]());
}

/* ---------- Orientation handling ---------- */

/**
 * Adjusts UI for narrow landscape/portrait screens; keeps overlay visible.
 */
function checkOrientation() {
  const narrow = window.innerWidth < 1200;
  const portrait = window.innerHeight > window.innerWidth;
  if (narrow && portrait) {
    setDisplay("landscapeScreen", "flex");
    document.querySelector(".game-container").style.display = "none";
  } else {
    setDisplay("landscapeScreen", "none");
    document.querySelector(".game-container").style.display = "block";
  }
  document.querySelector(".overlay").style.display = "flex";
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("load", checkOrientation);
