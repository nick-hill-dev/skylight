/// <reference path="../States/MenuState.ts" />

class NewClassicGameMenu extends MenuState {

    protected setupMenu(context: Menus.Menu) {
        var options = Options.load();
        context.title = 'Skylight';
        context.subtitle = 'New Classic Game';
        context.addItem('4 Triangles').whenActivated(() => {
            return new GameState(this.createProfile(3, 2.0, 2.0, { what: Unlocks.classic16, description: '16 Triangles Mode' }));
        });
        context.addItem('8 Triangles').whenActivated(() => {
            return new GameState(this.createProfile(7, 1.5, 1.5, { what: Unlocks.classic16, description: '16 Triangles Mode' }));
        });
        context.addItem('16 Triangles').enabled(options.isUnlocked(Unlocks.classic16)).whenActivated(() => {
            return new GameState(this.createProfile(15, 1.0, 1.0, { what: Unlocks.classic32, description: '32 Triangles Mode' }));
        });
        context.addItem('32 Triangles').enabled(options.isUnlocked(Unlocks.classic32)).whenActivated(() => {
            return new GameState(this.createProfile(31, 1.0, 1.0, { what: Unlocks.classic64, description: '64 Triangles Mode' }));
        });
        context.addItem('64 Triangles').enabled(options.isUnlocked(Unlocks.classic64)).whenActivated(() => {
            return new GameState(this.createProfile(63, 0.9, 0.9, { what: Unlocks.classic128, description: '128 Triangles Mode' }));
        });
        context.addItem('128 Triangles').enabled(options.isUnlocked(Unlocks.classic128)).whenActivated(() => {
            return new GameState(this.createProfile(127, 0.7, 0.7, { what: Unlocks.classic256, description: '256 Triangles Mode' }));
        });
        context.addItem('256 Triangles').enabled(options.isUnlocked(Unlocks.classic256)).whenActivated(() => {
            return new GameState(this.createProfile(255, 0.5, 0.5, null));
        });
        context.addItem('Back').whenActivated(() => {
            return new NewGameMenu();
        });
    }

    public exitState() {
    }

    private createProfile(aiCount: number, size: number, speed: number, unlocks: { what: Unlocks; description: string }): GameProfile {

        // Create a game profile
        var profile = new GameProfile();
        profile.powerupFrequency = -1;

        // Adjust human player template
        profile.humanTemplate.initialSpeed = 0;
        profile.humanTemplate.initialSize = Math.floor(Player.DefaultSize * size);
        profile.humanTemplate.initialSpeed = Math.floor(Player.DefaultSpeed * speed);

        // Adjust AI player template
        profile.aiTemplate.initialSize = profile.humanTemplate.initialSize;
        profile.aiTemplate.initialSpeed = profile.humanTemplate.initialSpeed;

        // This is how the game should be set up
        profile.onSetupGame = (context: IGameContext) => {

            // Add human player
            context.addPlayer(profile.humanTemplate, Math.random() * context.width, Math.random() * context.height, randomDirection());

            // Add AI players
            for (var i = 0; i < aiCount; i++) {

                // Select a random location for the AI player
                var x = Math.floor(Math.random() * context.width);
                var y = Math.floor(Math.random() * context.height);
                var direction = randomDirection();

                // Create the AI player
                var enemyPlayer = context.addPlayer(profile.aiTemplate, x, y, direction);
                enemyPlayer.setRandomColor();
                enemyPlayer.aiHandler = new AIHandler(enemyPlayer);
            }
        };

        // Allow other game modes to be unlocked
        profile.onComplete = (context: IGameContext, humanVictory: boolean) => {
            if (unlocks != null) {
                context.considerUnlock(unlocks.what, unlocks.description, function () { return humanVictory; });
            }            
        };
        return profile;
    }

}