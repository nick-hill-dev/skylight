class Summary {

    public hits: number = 0;
    public kills: number = 0;
    public missilesUsed: number = 0;
    public minesUsed: number = 0;
    public bombsUsed: number = 0;
    public powerupsPickedUp: number = 0;
    public livesLost: number = 0;
    public progress: string = '';

    public constructor(private profile: GameProfile, private aiCount: number) {
    }

    public render(context: CanvasRenderingContext2D) {
        const MarginLeft: number = 80;
        const MarginTop: number = 100;
        const ItemHeight: number = 40;
        const FontSize: number = ItemHeight * 0.7;

        var x = MarginLeft;
        var y = MarginTop;
        var writeLine = function (line: string = null) {
            if (line != null && line != '') {
                context.fillText(line, x, y);
            }
            y += ItemHeight;
        }

        // Display hits, kills and progress
        context.fillStyle = 'white';
        context.font = FontSize + 'px Verdana';
        writeLine('Hits: ' + this.hits);
        writeLine('Kills: ' + this.kills + " (" + Math.floor((this.kills * 100) / this.aiCount) + " %)");
        if (this.progress != null && this.progress != '') {
            writeLine('Progress: ' + this.progress);
        }

        // Display weapons and powerups used
        writeLine();
        writeLine('Missiles Used: ' + this.missilesUsed);
        if (this.profile.maxPowerups > 0 && this.profile.powerupFrequency >= 0) {
            writeLine('Mines Used: ' + this.minesUsed);
            writeLine('Bombs Used: ' + this.bombsUsed);
            writeLine('Powerups Picked Up: ' + this.powerupsPickedUp);
        }
    }

}