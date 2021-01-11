class Point {

    public x: number = 0;

    public y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }

}