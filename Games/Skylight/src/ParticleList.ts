class ParticleList {

    static readonly ArraySize: number = 16384;

    public particles: Particle[] = [];

    public constructor() {
        this.clear();
    }

    public clear() {
        this.particles = [];
    }

    public add(x: number, y: number, color: string, size: number, angle: number, speed: number, life: number = -1) {
        if (this.particles.length < ParticleList.ArraySize) {
            this.particles.push(new Particle(x, y, color, size, angle, speed, life));
        }
    }

    public render(context: CanvasRenderingContext2D) {

        // Process all of the particles
        for (var i = 0; i < this.particles.length; i++) {

            // Move the particle
            this.particles[i].move();

            // Is the particle still on the canvas?
            var particle = this.particles[i];
            if (!particle.visible(0, 0, context.canvas.clientWidth, context.canvas.clientHeight)) {

                // Remove the particle
                this.particles[i] = this.particles[this.particles.length - 1];
                this.particles.splice(this.particles.length - 1, 1);
                i -= 1;

            } else {

                // Render the particle
                context.fillStyle = particle.color;
                if (particle.size > 1) {
                    context.fillCircle(particle.x, particle.y, particle.size);
                } else {
                    context.setPixel(particle.x, particle.y);
                }
            }
        }
    }

}