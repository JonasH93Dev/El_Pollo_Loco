let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;

let background_sound = new Audio("audio/background_sound.mp3");
let win_sound = new Audio("audio/win.mp3");
let game_over_sound = new Audio("audio/game_over.mp3");

background_sound.volume = 0.01;

/**
 * Initializes the game by setting up the canvas, world, and mobile controls.
 */
function init() {
  startLevel();
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  mobileButtons();
}

/**
 * Event listener for keydown events. Updates the keyboard object with key states.
 */
window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }

  if (e.keyCode == 38) {
    keyboard.UP = true;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }

  if (e.keyCode == 68) {
    keyboard.D = true;
  }

  if (e.keyCode == 77) {
    // 'M' for Mute
    toggleMute();
  }
});

/**
 * Event listener for keyup events. Updates the keyboard object to reset key states.
 */
window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }

  if (e.keyCode == 38) {
    keyboard.UP = false;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }

  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});

/**
 * Sets up mobile button controls for left, right, jump, and throw actions.
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
 * Pauses all sounds in the game (background, win, game over).
 */
function pauseSounds() {
  background_sound.pause();
  background_sound.currentTime = 0;
  win_sound.pause();
  win_sound.currentTime = 0;
  game_over_sound.pause();
  game_over_sound.currentTime = 0;
}

/**
 * Starts the game level.
 */
function startLevel() {
  initLevel();
}

/**
 * Starts the game, hiding the start screen and showing the game world.
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
 * Restarts the game, resetting game states and sounds.
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
 * Navigates back to the main menu, showing the start screen.
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
 * Displays the win screen and plays the win sound.
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
 * Displays the lose screen and plays the game over sound.
 */
function openLoseScreen() {
  clearAllIntervals();
  background_sound.pause();
  game_over_sound.play();
  let endScreenLose = document.getElementById("endScreenLose");
  endScreenLose.style.display = "flex";
}

/**
 * Clears all active intervals to stop any running loops.
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) {
    window.clearInterval(i);
  }
}

/**
 * Toggles mute on and off, adjusting all sounds accordingly.
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
 * Checks the screen orientation and adjusts the display accordingly.
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

// Event listeners for screen resize and orientation change.
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("load", checkOrientation);
