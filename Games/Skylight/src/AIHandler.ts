class AIHandler {

    static readonly MinTicksPerTurn: number = 90;
    static readonly MinTicksNoFirePerTurn: number = 30;
    static readonly MinTicksPerFire: number = 15;
    static readonly NormalFireChance: number = 0.035;
    static readonly EasyFireChance: number = 0.015;
    static readonly NormalTurnChance: number = 0.05;
    static readonly EasyTurnChance: number = 0.02;

    public difficulty: Difficulty = Difficulty.normal;
    private lastTurnTick: number = 0;
    private lastFireTick: number = 0;

    public constructor(private player: Player) {
    }

    public process(context: GameState) {

        // Turn
        var turnChance = this.difficulty == Difficulty.normal ? AIHandler.NormalTurnChance : AIHandler.EasyTurnChance;
        if (Math.random() < turnChance) {
            if (context.tick >= this.lastTurnTick + AIHandler.MinTicksPerTurn) {
                this.player.direction = this.changeDirection(this.player.direction);
                this.lastTurnTick = context.tick;
            }
        }

        // Fire
        var fireChance = this.difficulty == Difficulty.normal ? AIHandler.NormalFireChance : AIHandler.EasyFireChance;
        if (Math.random() < fireChance) {
            if (context.tick >= this.lastTurnTick + AIHandler.MinTicksNoFirePerTurn &&
                context.tick >= this.lastFireTick + AIHandler.MinTicksPerFire) {
                context.fire(this.player);
                this.lastFireTick = context.tick;
            }
        }

        // Ensure the triangle always returns to the playing area
        var border = this.player.size + 7;
        if (this.player.x < border) {
            this.player.direction = Direction.right;
        } else if (this.player.x > context.width - border - 1) {
            this.player.direction = Direction.left;
        } else if (this.player.y < border) {
            this.player.direction = Direction.down;
        } else if (this.player.y > context.height - border - 1) {
            this.player.direction = Direction.up;
        }
    }

    private changeDirection(currentDirection: Direction): Direction {
        var newDirection = Direction.left;
        do {
            newDirection = randomDirection();
        } while (newDirection == currentDirection);
        return newDirection;
    }

}