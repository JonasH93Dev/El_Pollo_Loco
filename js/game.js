// js/game.js

let canvas;
let world;
let keyboard = new Keyboard();

// Speicherzustand direkt beim Laden übernehmen
let isMuted = JSON.parse(localStorage.getItem("isMuted") || "false");

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
function setDisplay(id, display) { $(id).style.display = display; }

/** Aktualisiert den Text/Zustand des Mute-Buttons passend zu `isMuted`. */
function updateMuteButtonUI() {
  const btn = $("muteBtn");
  if (!btn) return;
  btn.innerText = isMuted ? "UNMUTE - M" : "MUTE - M";
  btn.setAttribute("aria-pressed", String(isMuted));
}

/**
 * Sammelt alle bekannten AudioManager des Spiels (robust, defensiv).
 * So werden beim Mute/Unmute wirklich ALLE Sounds synchronisiert.
 */
function getAllAudioManagers() {
  const managers = new Set();

  if (!world) return managers;

  // World selbst
  if (world.audioManager) managers.add(world.audioManager);

  // Character
  if (world.character?.audioManager) managers.add(world.character.audioManager);

  // Level-Objekte (Enemies, Endboss, ggf. weitere)
  const lvl = world.level;
  if (lvl) {
    const arrays = [
      lvl.enemies,
      lvl.endboss,
      lvl.coins,
      lvl.bottles,
      lvl.clouds,
      lvl.backgroundObjects,
      lvl.throwables
    ];
    arrays.forEach(arr => {
      if (Array.isArray(arr)) {
        arr.forEach(obj => {
          if (obj?.audioManager) managers.add(obj.audioManager);
        });
      }
    });
  }

  // Eventuelle sonstige Sammlungen in world (throwableObjects etc.)
  const maybeArrays = [
    world.throwableObjects,
    world.projectiles
  ];
  maybeArrays.forEach(arr => {
    if (Array.isArray(arr)) {
      arr.forEach(obj => {
        if (obj?.audioManager) managers.add(obj.audioManager);
      });
    }
  });

  return managers;
}

/**
 * Wendet Mute/Unmute auf BG-Audio + alle AudioManager im Spiel an.
 * @param {boolean} muted
 */
function setMuted(muted) {
  // BG/Win/Lose stummschalten
  [background_sound, win_sound, game_over_sound].forEach(s => s.muted = muted);

  // Alle AudioManager synchronisieren
  const fn = muted ? "muteSounds" : "unmuteSounds";
  getAllAudioManagers().forEach(am => am?.[fn]?.());
}

/**
 * Initializes the game: level, world, mobile controls.
 */
function init() {
  startLevel();
  canvas = $("canvas");
  world = new World(canvas, keyboard);

  // Sounds (BG + ALLE SFX) auf gespeicherten Status setzen + Button-UI syncen
  setMuted(isMuted);
  updateMuteButtonUI();

  mobileButtons();
}

/** Maps keyCodes to keyboard flags (and mute toggle). */
const keyMap = {37:"LEFT",38:"UP",39:"RIGHT",40:"DOWN",32:"SPACE",68:"D",77:"M"};

window.addEventListener("keydown",(e)=>{
  const k = keyMap[e.keyCode]; if(!k) return;
  if(k==="M") toggleMute(); else keyboard[k]=true;
});

window.addEventListener("keyup",(e)=>{
  const k = keyMap[e.keyCode]; if(!k||k==="M") return;
  keyboard[k]=false;
});

/**
 * Wires touch buttons to keyboard flags; blocks context menu.
 */
function mobileButtons() {
  [["btnLeft","LEFT"],["btnRight","RIGHT"],["btnJump","SPACE"],["btnThrow","D"]]
  .forEach(([id,flag])=>{
    const el=$(id);
    el.addEventListener("touchstart",(e)=>{e.preventDefault();keyboard[flag]=true;});
    el.addEventListener("touchend",(e)=>{e.preventDefault();keyboard[flag]=false;});
    el.addEventListener("contextmenu",(e)=>e.preventDefault());
  });
}

/**
 * Pauses global sounds and resets playback head.
 */
function pauseSounds() {
  [background_sound,win_sound,game_over_sound].forEach(s=>{s.pause();s.currentTime=0;});
}

/** Starts the level setup. */
function startLevel(){ initLevel(); }

/**
 * Starts the game, hides screens, plays background music.
 */
function startGame() {
  init();
  background_sound.play(); // spielt gemuted, falls isMuted=true
  setDisplay("startScreen","none");
  setDisplay("endScreenWin","none");
  setDisplay("endScreenLose","none");
}

/**
 * Restarts the game after clearing loops and resetting audio.
 */
function restartGame() {
  clearAllIntervals();
  pauseSounds();
  ["endScreenWin","endScreenLose","startScreen"].forEach(id=>setDisplay(id,"none"));
  init();
  background_sound.play();
}

/**
 * Returns to the main menu and pauses audio.
 */
function goToMenu() {
  clearAllIntervals();
  pauseSounds();
  setDisplay("endScreenWin","none");
  setDisplay("endScreenLose","none");
  setDisplay("startScreen","block");
}

/**
 * Shows win screen and plays win sound.
 */
function openWinScreen() {
  clearAllIntervals();
  pauseSounds();
  background_sound.pause();
  win_sound.play();
  setDisplay("endScreenWin","flex");
}

/**
 * Shows lose screen and plays game-over sound.
 */
function openLoseScreen() {
  clearAllIntervals();
  background_sound.pause();
  game_over_sound.play();
  setDisplay("endScreenLose","flex");
}

/**
 * Clears all active intervals to stop running loops.
 */
function clearAllIntervals(){ for(let i=1;i<9999;i++) window.clearInterval(i); }

/**
 * Toggles global mute state and updates UI + AudioManagers.
 */
function toggleMute() {
  isMuted = !isMuted;
  setMuted(isMuted);
  localStorage.setItem("isMuted", String(isMuted));
  updateMuteButtonUI();
}

/**
 * Adjusts UI for narrow landscape/portrait screens; keeps overlay visible.
 */
function checkOrientation() {
  const narrow = window.innerWidth < 1200;
  const portrait = window.innerHeight > window.innerWidth;
  if(narrow && portrait){
    setDisplay("landscapeScreen","flex");
    document.querySelector(".game-container").style.display="none";
  } else {
    setDisplay("landscapeScreen","none");
    document.querySelector(".game-container").style.display="block";
  }
  document.querySelector(".overlay").style.display="flex";
}

window.addEventListener("resize",checkOrientation);
window.addEventListener("orientationchange",checkOrientation);
window.addEventListener("load",()=>{
  checkOrientation();
  // Button-Text beim Seitenstart zum gespeicherten Zustand synchronisieren
  updateMuteButtonUI();
});
