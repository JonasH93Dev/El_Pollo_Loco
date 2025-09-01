let canvas;
let world;
let keyboard = new Keyboard();

function init(){
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    
 
    console.log('MY character is', world.character);
}

window.addEventListener('keydown', (e) => {
    console.log(e);
    if (e.key == 'ArrowRight') {
        keyboard.RIGHT = true;
    }

    if (e.key == 'ArrowLeft') {
        keyboard.LEFT = true;
    }

    if (e.key == 'ArrowUp') {
        keyboard.UP = true;
    }

    if (e.key == 'ArrowDown') {
        keyboard.DOWN = true;
    }
    if (e.key == ' ') {
        keyboard.SPACE = true;
    }
});

window.addEventListener('keyup', (e) => {
    console.log(e);
    if (e.key == 'ArrowRight') {
        keyboard.RIGHT = false;
    }

    if (e.key == 'ArrowLeft') {
        keyboard.LEFT = false;
    }

    if (e.key == 'ArrowUp') {
        keyboard.UP = false;
    }

    if (e.key == 'ArrowDown') {
        keyboard.DOWN = false;
    }
    if (e.key == ' ') {
        keyboard.SPACE = false;
    }
});