let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;

let background_sound = new Audio("audio/background_sound.mp3");
let win_sound = new Audio("audio/win.mp3");
let game_over_sound = new Audio("audio/game_over.mp3");

background_sound.volume = 0.01;

/**
 * Initializes the game:
 * - Starts the level setup.
 * - Creates the world instance.
 * - Activates mobile controls.
 */
function init() {
  startLevel();
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  mobileButtons();
}

/**
 * Keydown event listener:
 * Updates the keyboard object to reflect which keys are currently pressed.
 */
window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
  if (e.keyCode == 77) toggleMute(); // 'M' for mute toggle
});

/**
 * Keyup event listener:
 * Updates the keyboard object to reset key states.
 */
window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
});

/**
 * Initializes mobile button controls:
 * Maps touchstart/touchend events to keyboard flags
 * (left, right, jump, throw).
 */
function mobileButtons() {
  document.getElementById("btnLeft").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
  });
  document.getElementById("btnLeft").addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
  });
  document.getElementById("btnRight").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
  });
  document.getElementById("btnRight").addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
  });
  document.getElementById("btnJump").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.SPACE = true;
  });
  document.getElementById("btnJump").addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.SPACE = false;
  });
  document.getElementById("btnThrow").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.D = true;
  });
  document.getElementById("btnThrow").addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.D = false;
  });
}

/**
 * Pauses all global sounds (background, win, game over) and resets their playback.
 */
function pauseSounds() {
  background_sound.pause();
  background_sound.currentTime = 0;
  win_sound.pause();
  win_sound.currentTime = 0;
  game_over_sound.pause();
  game_over_sound.currentTime = 0;
}

/** Starts the game level setup. */
function startLevel() {
  initLevel();
}

/**
 * Starts the game:
 * - Hides start and end screens.
 * - Initializes the world.
 * - Plays background music.
 */
function startGame() {
  let startScreen = document.getElementById("startScreen");
  let endScreenWin = document.getElementById("endScreenWin");
  let endScreenLose = document.getElementById("endScreenLose");
  init();
  background_sound.play();
  startScreen.style.display = "none";
  endScreenWin.style.display = "none";
  endScreenLose.style.display = "none";
}

/**
 * Restarts the game:
 * - Clears all intervals.
 * - Resets sounds.
 * - Reinitializes world and level.
 */
function restartGame() {
  clearAllIntervals();
  pauseSounds();
  let endScreenWin = document.getElementById("endScreenWin");
  let endScreenLose = document.getElementById("endScreenLose");
  let startScreen = document.getElementById("startScreen");
  endScreenWin.style.display = "none";
  endScreenLose.style.display = "none";
  startScreen.style.display = "none";
  init();
  background_sound.play();
}

/**
 * Returns to the main menu:
 * - Clears intervals.
 * - Pauses sounds.
 * - Shows the start screen.
 */
function goToMenu() {
  clearAllIntervals();
  pauseSounds();
  let startScreen = document.getElementById("startScreen");
  let endScreenWin = document.getElementById("endScreenWin");
  let endScreenLose = document.getElementById("endScreenLose");
  endScreenWin.style.display = "none";
  endScreenLose.style.display = "none";
  startScreen.style.display = "block";
}

/**
 * Opens the win screen:
 * - Stops active intervals.
 * - Pauses sounds.
 * - Plays win sound.
 * - Displays win screen.
 */
function openWinScreen() {
  clearAllIntervals();
  pauseSounds();
  background_sound.pause();
  win_sound.play();
  let endScreenWin = document.getElementById("endScreenWin");
  endScreenWin.style.display = "flex";
}

/**
 * Opens the lose screen:
 * - Stops active intervals.
 * - Pauses background.
 * - Plays game over sound.
 * - Displays lose screen.
 */
function openLoseScreen() {
  clearAllIntervals();
  background_sound.pause();
  game_over_sound.play();
  let endScreenLose = document.getElementById("endScreenLose");
  endScreenLose.style.display = "flex";
}

/**
 * Clears all active intervals.
 * Used to fully stop all game loops.
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) {
    window.clearInterval(i);
  }
}

/**
 * Toggles mute state:
 * - Updates button text.
 * - Mutes/unmutes global sounds and audio managers.
 */
function toggleMute() {
  const mobileMuteBtn = document.getElementById("muteBtn");

  if (!isMuted) {
    mobileMuteBtn.innerText = "UNMUTE - M";
    background_sound.muted = true;
    win_sound.muted = true;
    game_over_sound.muted = true;
    world.audioManager.muteSounds();
    world.character.audioManager.muteSounds();
    world.level.endboss.forEach((endboss) => {
      endboss.audioManager.muteSounds();
    });
    isMuted = true;
  } else {
    mobileMuteBtn.innerText = "MUTE - M";
    background_sound.muted = false;
    win_sound.muted = false;
    game_over_sound.muted = false;
    world.audioManager.unmuteSounds();
    world.character.audioManager.unmuteSounds();
    world.level.endboss.forEach((endboss) => {
      endboss.audioManager.unmuteSounds();
    });
    isMuted = false;
  }
}

/**
 * Adjusts game display based on screen orientation:
 * - Handles landscape/portrait modes.
 * - Toggles overlays and containers.
 */
function checkOrientation() {
  const landscapeScreen = document.getElementById("landscapeScreen");
  const gameContainer = document.querySelector(".game-container");
  const overlay = document.querySelector(".overlay");

  if (window.innerWidth < 1200 && window.innerHeight < window.innerWidth) {
    landscapeScreen.style.display = "none";
    gameContainer.style.display = "block";
    overlay.style.display = "flex";
  } else if (
    window.innerWidth < 1200 &&
    window.innerHeight > window.innerWidth
  ) {
    landscapeScreen.style.display = "flex";
    gameContainer.style.display = "none";
    overlay.style.display = "flex";
  } else {
    landscapeScreen.style.display = "none";
    gameContainer.style.display = "block";
    overlay.style.display = "flex";
  }
}

// Handle screen resize and orientation events.
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("load", checkOrientation);
