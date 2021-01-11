/// <reference path="../States/MenuState.ts" />

class InstructionsMenu extends MenuState {

    private instructions: string[][] =
    [
        ['You start each game as a triangle in the middle of the screen.',
            'Use the up, down, left and right keys to move around the screen.',
            'Shoot ammunition at enemies until they explode.'],
        ['In some game modes, powerups may be available.',
            'Pick them up to strengthen and heal yourself.',
            'Some game modes get harder as they progress.'],
        ['There are multiple types of ammunition.',
            'Missiles fire in a straight line until they hit a triangle.',
            'Mines seek out other triangles and destroy them immediately.',
            'Bombs clear the playing field and give you a short break.']
    ];

    private activePage = 0;

    public constructor(pageNumber: number) {
        super();
        this.activePage = pageNumber;
    }

    protected setupMenu(context: Menus.Menu) {
        context.title = 'Skylight';
        context.subtitle = 'Game Instructions';
        var list = this.instructions[this.activePage];
        for (var i = 0; i < list.length; i++) {
            context.addItem(list[i]).asParagraph();
        }
        if (this.activePage < this.instructions.length - 1) {
            context.addItem('Next Page').whenActivated(() => { return new InstructionsMenu(this.activePage + 1); });
        } else {
            context.addItem('Return to Main Menu').whenActivated(() => { return new MainMenu(); });
        }
    }

    public exitState() {
    }

}