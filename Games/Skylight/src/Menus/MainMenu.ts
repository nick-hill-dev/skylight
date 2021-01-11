/// <reference path="../States/MenuState.ts" />

class MainMenu extends MenuState {

    protected setupMenu(context: Menus.Menu) {
        context.title = 'Skylight';
        context.subtitle = 'Main Menu';
        context.addItem('Start New Game').whenActivated(() => { return new NewGameMenu(); });
        context.addItem('Learn How to Play').whenActivated(() => { return new InstructionsMenu(0); });
        context.addItem('Redefine Controls').whenActivated(() => { return new RedefineControlsMenu(); });
        context.addItem('Options').whenActivated(() => { return new OptionsMenu(); });
        context.addItem('Reddit Community').whenActivated(() => {
            window.open('https://www.reddit.com/r/skylightwebgame/');
            return null;
        });
        context.addItem('Use the cursor keys to navigate, and the space key to select.').asParagraph();
        context.addItem('Version 1 written by Nicholas Hill.').asParagraph().size(0.5);
    }

    public exitState() {
    }

}