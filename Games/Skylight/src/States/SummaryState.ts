class SummaryState extends State.State {

    private data: GameData = null;

    public constructor(private summary: Summary) {
        super();
    }

    public enterState(context: State.Context) {
        this.data = <GameData>context;
    }

    public handleKeyUp(e: KeyboardEvent) {
        this.data.stateEngine.changeState(new MainMenu());
    }

    public regularRendering(context: CanvasRenderingContext2D) {
        context.fillStyle = '#112233';
        context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
        this.summary.render(context);
    }

}