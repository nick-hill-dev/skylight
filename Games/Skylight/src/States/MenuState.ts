abstract class MenuState extends State.State {

    public data: GameData = null;

    public menu: Menus.Menu = new Menus.Menu();

    protected abstract setupMenu(context: Menus.Menu);

    public enterState(context: State.Context) {
        this.data = <GameData>context;

        // Create menu
        this.menu = new Menus.Menu();
        this.menu.onMove = () => {
            this.data.sound.play(SoundEffect.menuMove);
        };
        this.menu.onSelect = () => {
            this.data.sound.play(SoundEffect.menuSelect);
        };

        // Select first item in menu
        this.setupMenu(this.menu);
        this.menu.selectFirstItem();
    }

    abstract exitState();

    public handleKeyDown(e: KeyboardEvent) {
        let nextState = <State.State>this.menu.handleKeyDown(e);
        if (nextState != null) {
            this.data.stateEngine.changeState(nextState);
        }
    }

    public regularRendering(context: CanvasRenderingContext2D) {
        this.menu.render(context);
    }

}