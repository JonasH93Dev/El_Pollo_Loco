class Character extends MovableObject {

    height = 280;
    y = 155;
    width = 120;
    IMAGES_WALKING = [ 
            './assets/img/2_character_pepe/2_walk/W-21.png',
            './assets/img/2_character_pepe/2_walk/W-22.png',
            './assets/img/2_character_pepe/2_walk/W-23.png',    
            './assets/img/2_character_pepe/2_walk/W-24.png',
            './assets/img/2_character_pepe/2_walk/W-25.png',
            './assets/img/2_character_pepe/2_walk/W-26.png'
        ];
    



    constructor() {
        super();
        this.loadImage('./assets/img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
           

        this.animate();
    }

    animate() {

        setInterval(() => {
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = this.IMAGES_WALKING[i];
        this.img = this.imageCache[path];
        this.currentImage++;
        }, 100);

    }

    jump() {
    }
}