/// <reference path="../States/MenuState.ts" />

class ConfirmMenu extends MenuState {

    public constructor(private heading: string, private prompts: string[], private noState: MenuState, private yesAction: (context: Menus.Menu) => State.State) {
        super();
    }

    protected setupMenu(context: Menus.Menu) {
        context.title = 'Skylight';
        context.subtitle = this.heading;
        for (var prompt of this.prompts) {
            context.addItem(prompt).asParagraph();
        }
        context.addItem('No').whenActivated((context: Menus.Menu) => { return this.noState; });
        context.addItem('Yes').whenActivated((context: Menus.Menu) => { return this.yesAction(context); });
    }

    public exitState() {
    }

}