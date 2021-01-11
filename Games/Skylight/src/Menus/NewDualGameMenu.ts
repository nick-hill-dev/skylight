/// <reference path="../States/MenuState.ts" />

class NewDualGameMenu extends MenuState {

    protected setupMenu(context: Menus.Menu) {
        var options = Options.load();
        context.title = 'Skylight';
        context.subtitle = 'New Dual Game';
        context.addItem('Maximum 8 Triangles').whenActivated(() => {
            return new GameState(this.createProfile(8, 10, 10, { what: Unlocks.dual16, description: 'Maximum 16 Triangles Mode' }));
        });
        context.addItem('Maximum 16 Triangles').enabled(options.isUnlocked(Unlocks.dual16)).whenActivated(() => {
            return new GameState(this.createProfile(16, 10, 10, { what: Unlocks.dual32, description: 'Maximum 32 Triangles Mode' }));
        });
        context.addItem('Maximum 32 Triangles').enabled(options.isUnlocked(Unlocks.dual32)).whenActivated(() => {
            return new GameState(this.createProfile(32, 10, 10, { what: Unlocks.dual64, description: 'Maximum 64 Triangles Mode' }));
        });
        context.addItem('Maximum 64 Triangles').enabled(options.isUnlocked(Unlocks.dual64)).whenActivated(() => {
            return new GameState(this.createProfile(64, 20, 8, { what: Unlocks.dual128, description: 'Maximum 128 Triangles Mode' }));
        });
        context.addItem('Maximum 128 Triangles').enabled(options.isUnlocked(Unlocks.dual128)).whenActivated(() => {
            return new GameState(this.createProfile(128, 25, 5, { what: Unlocks.dual256, description: 'Maximum 256 Triangles Mode' }));
        });
        context.addItem('Maximum 256 Triangles').enabled(options.isUnlocked(Unlocks.dual256)).whenActivated(() => {
            return new GameState(this.createProfile(256, 30, 3, null));
        });
        context.addItem('Back').whenActivated(() => { return new NewGameMenu(); });
    }

    public exitState() {
        //#warning When triangles die in duel mode, need to ensure the remaining triangles do not spawn
    }

    private createProfile(maxTriangles: number, humanLives: number, aiLives: number, unlocks: { what: Unlocks; description: string }): GameProfile {

        // Create a game profile
        var profile = new GameProfile();
        profile.powerupFrequency = -1;
        profile.humanTemplate.initialSpeed = 0;
        profile.humanTemplate.initialMaxLives = humanLives;
        profile.humanTemplate.initialLives = humanLives;
        profile.aiTemplate.initialMaxLives = aiLives;
        profile.aiTemplate.initialLives = aiLives;

        // This is how the game should be set up
        profile.onSetupGame = (context: IGameContext) => {

            // Add human player
            var humanPlayer = context.addPlayer(profile.humanTemplate, context.width / 2, context.height / 2, randomDirection());
            humanPlayer.setColor(new Color(0, 0, 255));
            
            // Add AI player
            var enemyPlayer = context.addPlayer(profile.aiTemplate, Math.floor(Math.random() * context.width), Math.floor(Math.random() * context.height), randomDirection());
            enemyPlayer.setColor(new Color(255, 0, 0));
            enemyPlayer.aiHandler = new AIHandler(enemyPlayer);
        };

        // Handle enemy triangle deaths
        var count = 2;
        profile.onKill = (context: IGameContext, sourcePlayer: Player, targetPlayer: Player, weapon: Weapon) => {
            if (targetPlayer.aiHandler != null && count < maxTriangles) {
                count++;
                var directions = targetPlayer.direction == Direction.up || targetPlayer.direction == Direction.down ? [Direction.left, Direction.right] : [Direction.up, Direction.down];
                var p1 = context.addPlayer(profile.aiTemplate, targetPlayer.x - Player.DefaultSize, targetPlayer.y - Player.DefaultSize, directions[0]);
                p1.setColor(new Color(255, 0, 0));
                p1.aiHandler = new AIHandler(p1);
                var p2 = context.addPlayer(profile.aiTemplate, targetPlayer.x + Player.DefaultSize, targetPlayer.y + Player.DefaultSize, directions[1]);
                p2.setColor(new Color(255, 0, 0));
                p2.aiHandler = new AIHandler(p2);
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