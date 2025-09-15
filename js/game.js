// js/game.js

let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = JSON.parse(localStorage.getItem("isMuted") || "false");
let background_sound = new Audio("audio/background_sound.mp3");
let win_sound = new Audio("audio/win.mp3");
let game_over_sound = new Audio("audio/game_over.mp3");
background_sound.volume = 0.01;

/** @type {(id:string)=>HTMLElement} Shorthand for getElementById. */
const $ = (id) => document.getElementById(id);

/**
 * Sets the display style on an element by id.
 * @param {string} id
 * @param {string} display
 */
function setDisplay(id, display) { $(id).style.display = display; }

/**
 * Focuses the canvas so Space does not activate focused buttons.
 */
function focusCanvas() {
  const c = $("canvas"); if (!c) return;
  if (!c.hasAttribute("tabindex")) c.setAttribute("tabindex", "0");
  if (document.activeElement) document.activeElement.blur();
  c.focus();
}

/**
 * Updates the mute button label/state according to `isMuted`.
 */
function updateMuteButtonUI() {
  const btn = $("muteBtn"); if (!btn) return;
  btn.innerText = isMuted ? "UNMUTE - M" : "MUTE - M";
  btn.setAttribute("aria-pressed", String(isMuted));
}

/**
 * Detects if the device supports touch input.
 * @returns {boolean}
 */
function hasTouch() {
  return ("ontouchstart" in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}

/**
 * Collects all known AudioManager instances in the game.
 * @returns {Set<any>}
 */
function getAllAudioManagers() {
  const managers = new Set();
  if (!world) return managers;
  if (world.audioManager) managers.add(world.audioManager);
  if (world.character?.audioManager) managers.add(world.character.audioManager);
  const lvl = world.level; if (!lvl) return managers;
  const arrays = [lvl.enemies, lvl.endboss, lvl.coins, lvl.bottles, lvl.clouds, lvl.backgroundObjects, lvl.throwables];
  arrays.forEach(arr => { if (Array.isArray(arr)) arr.forEach(o => { if (o?.audioManager) managers.add(o.audioManager); }); });
  const maybeArrays = [world.throwableObjects, world.projectiles];
  maybeArrays.forEach(arr => { if (Array.isArray(arr)) arr.forEach(o => { if (o?.audioManager) managers.add(o.audioManager); }); });
  return managers;
}

/**
 * Applies mute/unmute to background audio + all AudioManagers.
 * @param {boolean} muted
 */
function setMuted(muted) {
  [background_sound, win_sound, game_over_sound].forEach(s => s.muted = muted);
  const fn = muted ? "muteSounds" : "unmuteSounds";
  getAllAudioManagers().forEach(am => am?.[fn]?.());
}

/**
 * Initializes the game: level, world, and mobile controls.
 */
function init() {
  startLevel();
  canvas = $("canvas");
  world = new World(canvas, keyboard);
  setMuted(isMuted);
  updateMuteButtonUI();
  mobileButtons();
}

/** Key map: codes → flags. */
const keyMap = {37:"LEFT",38:"UP",39:"RIGHT",40:"DOWN",32:"SPACE",68:"D",77:"M"};

window.addEventListener("keydown",(e)=>{
  if (e.code === "Space") e.preventDefault();
  const k = keyMap[e.keyCode]; if(!k) return;
  if (k === "M") toggleMute(); else keyboard[k] = true;
});

window.addEventListener("keyup",(e)=>{
  const k = keyMap[e.keyCode]; if(!k || k === "M") return;
  keyboard[k] = false;
});

/**
 * Wires touch buttons to keyboard flags and blocks context menu.
 */
function mobileButtons() {
  [["btnLeft","LEFT"],["btnRight","RIGHT"],["btnJump","SPACE"],["btnThrow","D"]]
  .forEach(([id,flag])=>{
    const el = $(id); if (!el) return;
    el.addEventListener("touchstart", e => { e.preventDefault(); keyboard[flag] = true; });
    el.addEventListener("touchend",   e => { e.preventDefault(); keyboard[flag] = false; });
    el.addEventListener("contextmenu", e => e.preventDefault());
  });
}

/**
 * Pauses global sounds and resets playback heads.
 */
function pauseSounds() { [background_sound, win_sound, game_over_sound].forEach(s => { s.pause(); s.currentTime = 0; }); }

/** Starts the level setup. */
function startLevel() { initLevel(); }

/**
 * Starts the game, hides screens, and plays background music.
 */
function startGame() {
  init();
  background_sound.play();
  setDisplay("startScreen","none"); setDisplay("endScreenWin","none"); setDisplay("endScreenLose","none");
  focusCanvas();
}

/**
 * Restarts the game after clearing loops and resetting audio.
 */
function restartGame() {
  clearAllIntervals();
  pauseSounds();
  ["endScreenWin","endScreenLose","startScreen"].forEach(id => setDisplay(id,"none"));
  init();
  background_sound.play();
  focusCanvas();
}

/**
 * Returns to the main menu and pauses audio.
 */
function goToMenu() {
  clearAllIntervals(); pauseSounds();
  setDisplay("endScreenWin","none"); setDisplay("endScreenLose","none"); setDisplay("startScreen","block");
}

/**
 * Shows the win screen and plays the win sound.
 */
function openWinScreen() {
  clearAllIntervals(); pauseSounds(); background_sound.pause(); win_sound.play();
  setDisplay("endScreenWin","flex");
}

/**
 * Shows the lose screen and plays the game-over sound.
 */
function openLoseScreen() {
  clearAllIntervals(); background_sound.pause(); game_over_sound.play();
  setDisplay("endScreenLose","flex");
}

/**
 * Clears all active intervals to stop running loops.
 */
function clearAllIntervals() { for (let i = 1; i < 9999; i++) window.clearInterval(i); }

/**
 * Toggles the global mute state and updates UI + AudioManagers.
 */
function toggleMute() {
  isMuted = !isMuted;
  setMuted(isMuted);
  localStorage.setItem("isMuted", String(isMuted));
  updateMuteButtonUI();
}

/**
 * Adjusts UI for orientation and touch-capable devices.
 */
function checkOrientation() {
  const narrow = window.innerWidth < 1200;
  const portrait = window.innerHeight > window.innerWidth;
  const touch = hasTouch();
  if (narrow && portrait) {
    setDisplay("landscapeScreen","flex");
    const game = document.querySelector(".game-container"); if (game) game.style.display = "none";
  } else {
    setDisplay("landscapeScreen","none");
    const game = document.querySelector(".game-container"); if (game) game.style.display = "block";
  }
  const panel = document.querySelector(".panel-moving"); if (panel) panel.style.display = touch ? "flex" : "none";
  const overlay = document.querySelector(".overlay"); if (overlay) overlay.style.display = "flex";
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("load", () => { checkOrientation(); updateMuteButtonUI(); });
