class GameProfile {

    public humanTemplate: PlayerTemplate = new PlayerTemplate();

    public aiTemplate: PlayerTemplate = new PlayerTemplate();

    public maxPowerups: number = 5;

    public powerupFrequency: number = 700;

    public rapidModeEnabled: boolean = false;

    public onSetupGame: (context: IGameContext) => void = null;

    public onKill: (context: IGameContext, sourcePlayer: Player, targetPlayer: Player, weapon: Weapon) => void = null;

    public onGetProgress: (context: IGameContext) => string = null;

    public onComplete: (context: IGameContext, humanVictory: boolean) => void = null;

}