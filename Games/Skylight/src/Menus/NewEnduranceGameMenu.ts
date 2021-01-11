/// <reference path="../States/MenuState.ts" />

class NewEnduranceGameMenu extends MenuState {

    protected setupMenu(context: Menus.Menu) {
        var options = Options.load();
        context.title = 'Skylight';
        context.subtitle = 'New Endurance Game';
        context.addItem('Beginner').whenActivated(() => {
            return new GameState(this.createProfile(30000, 200, false, false, false));
        });
        context.addItem('Standard').whenActivated(() => {
            return new GameState(this.createProfile(100000, 1000, true, false, true));
        });
        context.addItem('Insane').enabled(options.isUnlocked(Unlocks.enduranceInsane)).whenActivated(() => {
            return new GameState(this.createProfile(80000, 5000, true, true, false));
        });
        context.addItem('Back').whenActivated(() => { return new NewGameMenu(); });
    }

    public exitState() {
    }
    //#warning Implement redefine controls
    //#warning Fix bug where you kill everyone but yet there is still more?

    private createProfile(voidSpaceLength: number, aiCount: number, powerfulAI: boolean, powerfulHuman: boolean, unlocksInsane: boolean): GameProfile {

        // Weaken AI players if in beginner mode
        var profile = new GameProfile();
        profile.rapidModeEnabled = true;
        if (!powerfulAI) {
            profile.aiTemplate.initialSpeed = profile.aiTemplate.initialSpeed / 10 * 7;
        }

        // Human player starts off stopped        
        profile.humanTemplate.initialSpeed = 0;

        // Adjustments for insane mode
        if (powerfulHuman) {
            profile.humanTemplate.initialShields = Player.MaxShields;
            profile.humanTemplate.initialMissileBanks = 7;
            profile.humanTemplate.initialMissilePower = 3;
            profile.humanTemplate.initialBombs = 1;
            profile.humanTemplate.initialMines = 5;
            profile.maxPowerups = 8;
            profile.powerupFrequency = 400;
        }

        // This is how the game should be set up
        profile.onSetupGame = (context: IGameContext) => {

            // Add human player
            context.addPlayer(profile.humanTemplate, context.width / 2, context.height / 2, randomDirection());

            // Add AI players
            for (var i = 0; i < aiCount; i++) {

                // Select a random location for the AI player
                const CornerMarginSize: number = 48;
                var marginPosition = voidSpaceLength - Math.floor(Math.pow(Math.random(), 3.6) * voidSpaceLength);
                var x = 0;
                var y = 0;
                var direction = randomDirection();
                var size = Player.DefaultSize;
                switch (direction) {
                    case Direction.left:
                        x = context.width + size + marginPosition;
                        y = randomBetween(CornerMarginSize, context.height - CornerMarginSize);
                        break;

                    case Direction.up:
                        x = randomBetween(CornerMarginSize, context.width - CornerMarginSize);
                        y = context.height + size + marginPosition;
                        break;

                    case Direction.right:
                        x = -size - marginPosition;
                        y = randomBetween(CornerMarginSize, context.height - CornerMarginSize);
                        break;

                    case Direction.down:
                        x = randomBetween(CornerMarginSize, context.width - CornerMarginSize);
                        y = -size - marginPosition;
                        break;
                }

                // Create the AI player
                var enemyPlayer = context.addPlayer(profile.aiTemplate, x, y, direction);
                enemyPlayer.setRandomColor();
                enemyPlayer.aiHandler = new AIHandler(enemyPlayer);
            }
        };

        // Progress handler
        profile.onGetProgress = (context: IGameContext): string => {
            return Math.floor(Math.min(100, (context.tick * profile.aiTemplate.initialSpeed * 100) / voidSpaceLength)) + '%';
        };

        // Allow other game modes to be unlocked
        profile.onComplete = (context: IGameContext, humanVictory: boolean) => {
            context.considerUnlock(Unlocks.enduranceInsane, 'Insane Game Mode', function () { return humanVictory && unlocksInsane; });
        };
        return profile;
    }

}