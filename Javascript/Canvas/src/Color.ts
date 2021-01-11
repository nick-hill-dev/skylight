class Color {

    public a: number = 0;
    public r: number = 0;
    public g: number = 0;
    public b: number = 0;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public toString() {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }

}