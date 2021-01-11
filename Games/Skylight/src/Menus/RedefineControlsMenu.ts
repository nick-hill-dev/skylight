/// <reference path="../States/MenuState.ts" />

class RedefineControlsMenu extends MenuState {

    protected setupMenu(context: Menus.Menu) {
        context.title = 'Skylight';
        context.subtitle = 'Redefine Controls';
        context.addItem('Face Up');
        context.addItem('Face Down');
        context.addItem('Face Left');
        context.addItem('Face Right');
        context.addItem('Fire');
        context.addItem('Pause');
        context.addItem('Back').whenActivated(() => { return new MainMenu(); });
    }

    public exitState() {
    }

}