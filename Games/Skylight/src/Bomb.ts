class Bomb {

    static readonly LargeRadius: number = 1024;
    static readonly SmallRadius: number = 200;
    static readonly ExpansionSpeed: number = 5;

    public radius: number = 1;
    public tick: number = 0;

    public constructor(public owner: Player, public centerX: number, public centerY: number, public maxRadius: number) {
    }

    public expand() {
        this.radius += Bomb.ExpansionSpeed;
    }

    public render(context: CanvasRenderingContext2D) {
        this.tick++;
        if (this.tick % 3 == 0) {
            context.fillStyle = this.owner.color;
            context.fillCircle(this.centerX, this.centerY, this.radius);
        }
    }

}
