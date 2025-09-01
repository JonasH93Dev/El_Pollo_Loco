class MovableObject {
    x = 120;
    y = 280;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }

        }, 1000 / 25);
    }


    isAboveGround() {
        return this.y < 150;
    }




    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

    }

    drawFrame(ctx) {

        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.lineWidth = '5';

        ctx.stroke();
        }
    }



    isColliding(movableObject) {
        return this.x + this.width > movableObject.x &&
            this.y + this.height > movableObject.y &&
            this.x < movableObject.x &&
            this.y < movableObject.y + movableObject.height;
    }










    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveRight() {
        this.x += this.speed;

    }
    moveLeft() {
        this.x -= this.speed;

    }


    jump() {
        this.speedY = 30;
    }

    playAnimation(images) {
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}