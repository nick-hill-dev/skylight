class Mine {

    static readonly SmallSize: number = 4;
    static readonly Size: number = 12;
    static readonly InitialLife: number = 250;
    static readonly TerminalSpeed: number = 5;

    public accX: number = 0;
    public accY: number = 0;
    public speedX: number = 0;
    public speedY: number = 0;
    public x: number = 0;
    public y: number = 0;
    public life: number = Mine.InitialLife;

    public constructor(public owner: Player) {
        this.x = owner.x;
        this.y = owner.y;
    }

    public move() {
        this.speedX += this.accX;
        this.speedY += this.accY;
        this.speedX = this.speedX > Mine.TerminalSpeed ? Mine.TerminalSpeed : (this.speedX < -Mine.TerminalSpeed ? -Mine.TerminalSpeed : this.speedX);
        this.speedY = this.speedY > Mine.TerminalSpeed ? Mine.TerminalSpeed : (this.speedY < -Mine.TerminalSpeed ? -Mine.TerminalSpeed : this.speedY);
        this.x += this.speedX;
        this.y += this.speedY;
        this.life = Math.max(0, this.life - 1);
    }

    public stop() {
        this.speedX = 0;
        this.speedY = 0;
        this.accX = 0;
        this.accY = 0;
    }

    public render(context: CanvasRenderingContext2D) {
        context.strokeStyle = 'white';
        context.drawCircle(this.x, this.y, Mine.Size);
    }

}