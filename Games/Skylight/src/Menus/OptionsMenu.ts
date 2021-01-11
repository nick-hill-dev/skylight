/// <reference path="../States/MenuState.ts" />

class OptionsMenu extends MenuState {

    private options: Options = null;

    private soundOption: Menus.MenuItem = null;

    private continuousOption: Menus.MenuItem = null;

    private triangleBorderOption: Menus.MenuItem = null;

    private missileBorderOption: Menus.MenuItem = null;

    private powerupBorderOption: Menus.MenuItem = null;

    protected setupMenu(context: Menus.Menu) {
        this.options = Options.load();
        context.title = 'Skylight';
        context.subtitle = 'Game Options';

        // Option for sound effects
        this.soundOption = context.addItem('Enable Sound Effects').toggleable().value(this.options.soundEffects);

        // Option for continuous fire
        this.continuousOption = context.addItem('Enable Continuous Fire').toggleable().value(this.options.continuousFire);

        // Options for border type
        var choices: Menus.MenuItemChoice[] = [
            new Menus.MenuItemChoice('Solid', BorderType.solid),
            new Menus.MenuItemChoice('Reflect', BorderType.reflect),
            new Menus.MenuItemChoice('Phase', BorderType.phase),
            new Menus.MenuItemChoice('Random', BorderType.random)
        ];
        this.triangleBorderOption = context.addItem('Border Type (Triangles)').choices(choices).value(this.options.borderTypeTriangle);
        this.missileBorderOption = context.addItem('Border Type (Missiles)').choices(choices).value(this.options.borderTypeMissile);
        this.powerupBorderOption = context.addItem('Border Type (Powerups)').choices(choices).value(this.options.borderTypePowerup);

        // Back menu item
        context.addItem('Back').whenActivated(() => { return new MainMenu(); });
    }

    public exitState() {
        this.options.soundEffects = <boolean>this.soundOption.getSelectedChoice().value;
        this.options.continuousFire = <boolean>this.continuousOption.getSelectedChoice().value;
        this.options.borderTypeTriangle = <BorderType>this.triangleBorderOption.getSelectedChoice().value;
        this.options.borderTypeMissile = <BorderType>this.missileBorderOption.getSelectedChoice().value;
        this.options.borderTypePowerup = <BorderType>this.powerupBorderOption.getSelectedChoice().value;
        this.options.save();
        for (let sound of this.data.sound.getSounds()) {
            sound.enabled = this.options.soundEffects;
        }
    }

}