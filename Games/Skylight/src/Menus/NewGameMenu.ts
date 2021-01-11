/// <reference path="../States/MenuState.ts" />

class NewGameMenu extends MenuState {

    protected setupMenu(context: Menus.Menu) {
        context.title = 'Skylight';
        context.subtitle = 'Start New Game';
        context.addItem('Endurance').whenActivated(() => { return new NewEnduranceGameMenu(); });
        context.addItem('Triangles enter through all sides of the screen in greater numbers as more time progresses.').asParagraph().size(0.5);
        context.addItem('Dual').whenActivated(() => { return new NewDualGameMenu(); });
        context.addItem('Kill one, spawn two until the limit is reached.').asParagraph().size(0.5);
        context.addItem('Classic').whenActivated(() => { return new NewClassicGameMenu(); });
        context.addItem('A simple game where the last triangle standing wins.').asParagraph().size(0.5);
        context.addItem('Back').whenActivated(() => { return new MainMenu(); });
    }

    public exitState() {
    }

}