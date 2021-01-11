class Particle {

    public constructor(public x: number, public y: number, public color: string, public size: number, public angle: number, public speed: number, public life: number = -1) {
    }

    public move() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.life != -1) {
            this.life--;
        }
    }

    public visible(left: number, top: number, width: number, height: number) {
        return (this.life == -1 || this.life > 0) &&
               (this.x >= left - this.size + 1 &&
                this.x < width + this.size - 1 &&
                this.y >= top - this.size + 1 &&
                this.y < height + this.size - 1);
    }

}