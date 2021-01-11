class SplashScreenState extends State.State {

    private tick: number = 0;

    private data: GameData = null;

    public enterState(context: State.Context) {
        this.data = <GameData>context;
    }

    public regularRendering(context: CanvasRenderingContext2D) {
        context.fillStyle = '#321';
        context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
        context.fillStyle = randomColor().toString();
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.font = this.tick < 30 ? '32px Candara' : '80px Candara';
        context.fillText('Skylight', context.canvas.clientWidth / 2 + Math.random() * 4 - 2, context.canvas.clientHeight / 2 + Math.random() * 4 - 2);
    }

    public regularProcessing() {
        this.tick++;
        if (this.tick >= 60) {
            this.data.stateEngine.changeState(new MainMenu());
        }
    }

}