class MovableObject extends DrawableObject {
   
    
   

    
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    lastHit = 0;

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



    hit() {
        this.energy -= 5;

        if(this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isDead() {

            return this.energy == 0;
           
        }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1 ;
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
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}