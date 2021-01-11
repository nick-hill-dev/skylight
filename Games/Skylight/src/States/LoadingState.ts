class LoadingState extends State.State {

    private data: GameData = null;

    public enterState(context: State.Context) {
        this.data = <GameData>context;

        // Start by loading sounds asynchronously
        this.data.sound = new Sound.SoundEngine();
        this.data.sound.addFiles([
            'sounds/menuMove.wav',
            'sounds/menuSelect.wav',
            'sounds/borderBounce.wav',
            'sounds/mePickupPowerup.wav',
            'sounds/meHitAI.wav',
            'sounds/meStartBomb.wav',
            'sounds/meBombAI.wav',
            'sounds/meStartMine.wav',
            'sounds/meMineAI.wav',
            'sounds/meKillAI.wav',
            'sounds/aiHitAI.wav',
            'sounds/aiKillAI.wav',
            'sounds/aiHitMe.wav',
            'sounds/aiHitMeShield.wav',
            'sounds/gameLost.wav',
            'sounds/gameWon.wav'
        ],
            (items: Sound.SoundItem[]) => this.soundsLoaded(items),
            (errorMessage: string) => this.fileLoadError(errorMessage)
        );
    }

    private soundsLoaded(items: Sound.SoundItem[]) {

        // Now load images asynchronously
        $httpGetImage('images/powerups.png',
            (image: HTMLImageElement) => this.imagesLoaded(image),
            (errorMessage: string) => this.fileLoadError(errorMessage));
    }

    private imagesLoaded(image: HTMLImageElement) {
        this.data.powerupsImage = image;

        // Sound enabled?
        for (let sound of this.data.sound.getSounds()) {
            sound.enabled = Options.load().soundEffects;
        }

        // Move on to the next state
        let nextState = new SplashScreenState();
        this.data.stateEngine.changeState(nextState);
    }

    private fileLoadError(errorMessage: string) {
        alert('Could not load file: ' + errorMessage);
    }

}