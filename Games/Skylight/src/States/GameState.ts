class GameState extends State.State {

    static readonly InitialRapidIncrement: number = 1024;
    static readonly RapidThreshold: number = GameState.InitialRapidIncrement * 4;
    static readonly RapidDecrement: number = 6;

    private data: GameData = null;

    public width: number = 0;
    public height: number = 0;
    public tick: number = 0;
    public options: Options = Options.load();

    private sound: Sound.SoundEngine = null;
    private keys: Keys = new Keys();

    public players: Player[] = [];
    private missiles: Missile[] = [];
    private mines: Mine[] = [];
    private bombs: Bomb[] = [];
    private powerups: Powerup[] = [];
    private powerupRenderer: Tiley.Rendering.Canvas.CanvasImageMapRenderer = null;
    private particles: ParticleList = new ParticleList();
    private summary: Summary = null;
    private notices: Notice[] = [];
    private rapidValue: number = 0;
    private rapidIncrement: number = GameState.InitialRapidIncrement;
    private rapidMode: boolean = false;
    private numberAlive: number = 0;
    private stateChangeTick: number = -1;

    public constructor(public profile: GameProfile) {
        super();
    }

    public enterState(context: State.Context) {
        this.data = <GameData>context;
        this.width = this.data.canvas.clientWidth;
        this.height = this.data.canvas.clientHeight;
        this.sound = this.data.sound;

        // Setup powerup image renderer
        var powerupImageMap = new Tiley.ImageMap(this.data.powerupsImage, 31, 31);
        this.powerupRenderer = new Tiley.Rendering.Canvas.CanvasImageMapRenderer(powerupImageMap, this.data.canvas);

        // Use profile to set up game
        this.profile.onSetupGame(this);

        // Create summary object
        var aiCount = 0;
        for (var player of this.players) {
            if (player.aiHandler != null) {
                aiCount++;
            }
        }
        this.summary = new Summary(this.profile, aiCount);
    }

    public handleKeyDown(e: KeyboardEvent) {
        this.keys.setKeyDown(e.keyCode);
        /*
        if (e.key == 'b') {
            this.players[0].bombs++;
        }
        if (e.key == 'm') {
            this.players[0].mines++;
        }
        */
    }

    public handleKeyUp(e: KeyboardEvent) {
        this.keys.setKeyUp(e.keyCode);
    }

    public regularRendering(context: CanvasRenderingContext2D) {

        // Start with a black screen
        context.fillStyle = this.rapidMode ? context.getRgba(100, 50, 50, 255) : context.getRgba(21, 16, 15, 255);
        context.fillRect(0, 0, this.width, this.height);

        // Draw bombs
        for (var bomb of this.bombs) {
            bomb.render(context);
        }

        // Move and draw particles
        this.particles.render(context);

        // Draw powerups
        for (var powerup of this.powerups) {
            this.powerupRenderer.render(powerup.x - powerup.size, powerup.y - powerup.size, powerup.type);
        }

        // Draw missiles
        for (var missile of this.missiles) {
            missile.render(context);
        }

        // Draw mines
        for (var mine of this.mines) {
            mine.render(context);
        }

        // Draw players
        for (var player of this.players) {
            if (player.lives > 0 && player.isOnBoard(this.width, this.height)) {
                player.render(context, this.tick);
            }
        }

        // Draw interface            
        if (this.players.length > 0) {

            // Draw human indicator
            var human = this.players[0];
            if (human.speed == 0 || this.tick <= 90) {
                context.fillStyle = 'white';
                context.font = '20px Verdana';
                context.fillTextCenter('You', human.x, human.y - human.size - 30);
            }

            // Draw rapid kill bar
            if (this.rapidValue > 0) {
                const LeftMargin: number = 8;
                const Margin: number = 120;
                const Size: number = 5;
                var ratio = this.rapidValue / GameState.RapidThreshold;
                var height = this.height - Margin * 2;
                var y = Margin + Math.floor((1.0 - ratio) * height);
                var color = this.rapidMode && (this.tick % 8 < 4) ? 'red' : '#444';
                context.fillStyle = color;
                context.fillRect(LeftMargin, y, Size, this.height - y - Margin);
                context.strokeStyle = color;
                context.strokeRect(LeftMargin, Margin, Size, height);
            }
        }

        // Draw active notices
        this.renderNotices(context);

        // Draw progress
        if (this.profile.onGetProgress != null) {
            var progress = this.profile.onGetProgress(this);
            if (progress != null && progress != '') {
                this.summary.progress = progress;
                context.textBaseline = 'top';
                context.font = '10px Arial Narrow';
                context.fillStyle = '#ccc';
                context.fillText(progress, 10, 10);
            }
        }
    }

    public regularProcessing() {
        this.tick++;

        // Handle keys that directly change the player's state
        var human = this.players[0];
        if (human.lives > 0) {

            // Change direction
            if (this.keys.isKeyDown(37)) {
                human.direction = Direction.left;
                if (human.speed == 0) human.speed = Player.DefaultSpeed;
            }
            if (this.keys.isKeyDown(38)) {
                human.direction = Direction.up;
                if (human.speed == 0) human.speed = Player.DefaultSpeed;
            }
            if (this.keys.isKeyDown(39)) {
                human.direction = Direction.right;
                if (human.speed == 0) human.speed = Player.DefaultSpeed;
            }
            if (this.keys.isKeyDown(40)) {
                human.direction = Direction.down;
                if (human.speed == 0) human.speed = Player.DefaultSpeed;
            }
        }

        // Allow human player to fire
        var human = this.players.length > 0 && this.players[0].lives > 0 ? this.players[0] : null;
        if (human != null) {
            if (this.options.continuousFire && human.getActiveWeapon() == Weapon.missile || this.keys.isKeyDown(32)) {
                this.fire(human);
            }
        }

        // Ensure active bombs continue to explode and kill other players
        var bombsToDelete: Bomb[] = [];
        for (var bomb of this.bombs) {
            bomb.expand();
            for (var player of this.players) {
                var distance = calculateDistance(bomb.centerX, bomb.centerY, player.x, player.y);
                if (player.lives > 0 && player != bomb.owner && distance < bomb.radius) {
                    this.kill(bomb.owner, player, Weapon.bomb);
                }
            }
            if (bomb.radius > bomb.maxRadius) {
                bombsToDelete.push(bomb);
            }
        }

        // Create new powerups regularly
        if (this.profile.powerupFrequency >= 0 && this.tick % this.profile.powerupFrequency == 0 && human != null && this.powerups.length < this.profile.maxPowerups) {
            this.addRandomPowerup();
        }

        // Ensure powerups move about, and when hit by players are consumed
        var powerupsToDelete: Powerup[] = [];
        for (var powerup of this.powerups) {

            // Move the powerup
            powerup.move(this.width, this.height, this.options.borderTypePowerup);

            // Is the powerup within the human player?
            if (human != null) {
                if (human.x + human.size > powerup.x - powerup.size &&
                    human.y + human.size > powerup.y - powerup.size &&
                    human.x - human.size < powerup.x + powerup.size &&
                    human.y - human.size < powerup.y + powerup.size) {

                    // The human player gets the powerup
                    var powerupUsed = this.givePowerupToPlayer(powerup);
                    if (powerupUsed) {
                        powerupsToDelete.push(powerup);

                        // Play sound
                        this.sound.play(SoundEffect.mePickupPowerup);
                    }
                }
            } else {

                // This is awkward! Delete the powerup
                powerupsToDelete.push(powerup);
            }
        }

        // Delete powerups that have been collected or are no longer necessary
        for (var powerup of powerupsToDelete) {
            this.powerups.splice(this.powerups.indexOf(powerup), 1);
        }

        // Move missiles and check whether or not they hit the borders
        var missilesToDelete: Missile[] = [];
        for (var missile of this.missiles) {
            var deleteMissile = missile.move(this.width, this.height, this.options.borderTypeMissile);
            if (deleteMissile) missilesToDelete.push(missile);
        }

        // Ensure mines seek other triangles and blow them up   
        var minesToDelete: Mine[] = [];
        var targetedPlayers: Player[] = [];
        for (var mine of this.mines) {

            // Try to find the closest untargeted player, while also checking whether that player has been hit
            var closestPlayer: Player = null;
            var closestDistance = Number.MAX_VALUE;
            for (var player of this.players) {
                if (mine.owner != player && player.isOnBoard(this.width, this.height) && player.lives > 0 && targetedPlayers.indexOf(player) == -1) {

                    // Is this player closer than the previous player?
                    var distance = calculateDistance(player.x, player.y, mine.x, mine.y);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestPlayer = player;
                    }

                    // Does the the mine hit a player?
                    if (mine.x >= player.x - Mine.Size && mine.y >= player.y - Mine.Size &&
                        mine.x < player.x + Mine.Size && mine.y < player.y + Mine.Size) {

                        // The player dies
                        minesToDelete.push(mine);
                        this.kill(mine.owner, player, Weapon.mine);
                    }
                }
            }

            // Accelerate the mine in the direction of the closest player
            if (closestPlayer == null) {
                mine.stop();
            } else {
                targetedPlayers.push(closestPlayer);
                mine.accX = (closestPlayer.x - mine.x) / 20;
                mine.accY = (closestPlayer.y - mine.y) / 20;
            }

            // Move the mine
            mine.move();

            // Delete the mine if it has run out of steam
            if (mine.life <= 0) {
                for (var i = 0; i < 720; i++) {
                    this.particles.add(Math.floor(mine.x), Math.floor(mine.y), 'white', 1, (i / 720 * 2 * Math.PI), 15);
                }
                minesToDelete.push(mine);
            }
        }

        // Delete mines that have been active too long
        for (var mine of minesToDelete) {
            this.mines.splice(this.mines.indexOf(mine), 1);
        }

        // Process players
        for (var player of this.players) {
            if (player.lives > 0) {

                // Move the player
                player.move(this.width, this.height, this.options.borderTypeTriangle);

                // Further processing requires that the player be on the board
                if (player.isOnBoard(this.width, this.height)) {

                    // Detect collisions with missiles
                    if (player.invulnerability <= 0) {
                        for (var missile of this.missiles) {

                            // Perform appropriate collision detection based on the presence of a shield
                            if (player.shields > 0) {

                                // Bounce off shields
                                var distance = calculateDistance(missile.x, missile.y, player.x, player.y);
                                if (distance < Player.ShieldRadius) {
                                    missile.reverseDirection();
                                    player.shields -= 1;
                                    if (player == this.players[0]) {
                                        this.sound.play(SoundEffect.aiHitMeShield);
                                    }
                                }

                            } else {

                                // Are we inside the player?
                                if (missile.x > player.x - player.size && missile.x < player.x + player.size &&
                                    missile.y > player.y - player.size && missile.y < player.y + player.size &&
                                    player.lives > 0) {
                                    missilesToDelete.push(missile);
                                    this.hit(missile.owner, player, Weapon.missile, missile.power);
                                }
                            }
                        }
                    }

                    // Process artificial intelligence
                    if (player.aiHandler != null) {
                        player.aiHandler.process(this);
                    }
                }
            }
        }

        // Delete bombs that have grown too large
        for (var bomb of bombsToDelete) {
            this.bombs.splice(this.bombs.indexOf(bomb), 1);
        }

        // Delete missiles that we have deemed to have been used, or have gone outside the playing area
        for (var missile of missilesToDelete) {
            this.missiles.splice(this.missiles.indexOf(missile), 1);
        }

        // Decrement rapid kill bar
        this.rapidValue = Math.max(0, this.rapidValue - GameState.RapidDecrement);
        if (this.rapidMode && this.rapidValue == 0) {
            this.rapidMode = false;
        }

        // Consider moving on to a new state
        if (this.stateChangeTick == -1) {

            // End the game if the main player has died
            if (this.players[0].lives <= 0) {
                this.notices.push(Notice.createRedNotice("You have died!", this.tick + 150));
                this.endGame(false);
                this.stateChangeTick = this.tick + 210;
            }

            // End the game if the human is the only triangle alive
            if (this.players[0].lives > 0 && this.numberAlive == 1) {
                this.notices.push(Notice.createGreenNotice("There are no more triangles to defeat!", this.tick + 150));
                this.endGame(true);
                this.stateChangeTick = this.tick + 210;
            }
        }

        // All done?
        if (this.stateChangeTick == this.tick) {
            this.data.stateEngine.changeState(new SummaryState(this.summary));
        }
    }

    public addPlayer(template: PlayerTemplate, x: number, y: number, direction: Direction): Player {
        var player = new Player(x, y, direction);
        player.size = template.initialSize;
        player.speed = template.initialSpeed;
        player.lives = template.initialLives;
        player.maxLives = template.initialMaxLives;
        player.shields = template.initialShields;
        player.missileBanks = template.initialMissileBanks;
        player.missilePower = template.initialMissilePower;
        player.mines = template.initialMines;
        player.bombs = template.initialBombs;
        this.players.push(player);
        this.numberAlive++;
        return player;
    }

    public addPowerup(powerupType: PowerupType, x: number, y: number, direction: Direction): Powerup {
        var powerup = new Powerup(powerupType, x, y, direction);
        this.powerups.push(powerup);
        return powerup;
    }

    public addPowerupAtRandomLocation(powerupType: PowerupType): Powerup {

        // Create the powerup, ensuring it isn't too close to the player
        var tooClose = false;
        var powerup: Powerup = null;
        do {

            // Determine a position for the powerup
            var x = randomBetween(Powerup.FixedSize * 2, this.width - Powerup.FixedSize * 2 - 1);
            var y = randomBetween(Powerup.FixedSize * 2, this.height - Powerup.FixedSize * 2 - 1);
            var direction = randomDirection();

            // Add the powerup to the list if it isn't too close to the player
            const MinDistance: number = 80;
            tooClose = this.players.length == 0 || calculateDistance(this.players[0].x, this.players[0].y, x, y) < MinDistance;
            if (!tooClose) {
                powerup = this.addPowerup(powerupType, x, y, direction);
            }
        }
        while (tooClose);
        return powerup;
    }

    public addRandomPowerup() {

        // Build up a partition of available powerups
        var selector = new Partition<PowerupType>();
        selector.Add(PowerupType.life, 9);
        if (this.tick >= this.profile.powerupFrequency * 1) selector.Add(PowerupType.invulnerability, 4);
        if (this.tick >= this.profile.powerupFrequency * 1) selector.Add(PowerupType.shields, 4);
        if (this.tick >= this.profile.powerupFrequency * 2) selector.Add(PowerupType.mines, 9);
        if (this.tick >= this.profile.powerupFrequency * 3) selector.Add(PowerupType.banks, 9);
        if (this.tick >= this.profile.powerupFrequency * 4) selector.Add(PowerupType.power, 5);
        if (this.tick >= this.profile.powerupFrequency * 5) selector.Add(PowerupType.bomb, 2);

        // Are we able to select anything at all?
        if (selector.total == 0) return;

        // Select a type
        var reselect = false;
        var powerupType: PowerupType = null;
        do {
            powerupType = selector.select(randomBetween(0, selector.total - 1));
            reselect = powerupType == PowerupType.power && this.players.length > 0 && this.players[0].missilePower == Player.MaxPower;
        }
        while (reselect);

        // Add to board
        this.addPowerupAtRandomLocation(powerupType);
    }

    private givePowerupToPlayer(powerup: Powerup): boolean {

        var result = true;
        var human = this.players[0];

        switch (powerup.type) {
            case PowerupType.banks:
                human.missileBanks += 1;
                break;

            case PowerupType.bomb:
                human.bombs += 1;
                break;

            case PowerupType.invulnerability:
                human.invulnerability += Player.InvulnerabilityAmount;
                break;

            case PowerupType.mines:
                human.mines += 5;
                break;

            case PowerupType.power:
                if (human.missilePower < Player.MaxPower) {
                    human.missilePower = Math.min(Player.MaxPower, human.missilePower + 1);
                }
                else {
                    human.missileBanks += 1;
                }
                break;

            case PowerupType.shields:
                if (human.shields == Player.MaxShields) result = false; else human.shields = Player.MaxShields;
                break;

            case PowerupType.life:
                if (human.lives == human.maxLives) result = false; else human.lives = human.maxLives;
                break;

            default:
                throw 'Unknown powerup: ' + powerup;

        }
        if (result == true) this.summary.powerupsPickedUp += 1;
        return result;

    }

    public fire(player: Player) {

        // Can the player shoot?
        if (player.canFire(this.tick)) {
            player.lastFireTick = this.tick;

            // Fire a bomb
            if (player.bombs > 0) {
                if (player == this.players[0]) this.summary.bombsUsed += 1;
                player.bombs -= 1;
                var bomb = new Bomb(player, player.x, player.y, Bomb.LargeRadius);
                this.bombs.push(bomb);

                // Play sound
                this.sound.play(SoundEffect.meStartBomb);

                // Launch the associated particles
                for (var i = 1; i < 250; i++) {
                    this.particles.add(player.x, player.y, randomColor().toString(), 2, (Math.random() * 2 * Math.PI), Bomb.ExpansionSpeed * 15 + Math.random() * 3);
                }
                for (var i = 1; i < 800; i++) {
                    this.particles.add(player.x, player.y, randomColor().toString(), 2, (Math.random() * 2 * Math.PI), Bomb.ExpansionSpeed * 5 + Math.random() * 2);
                }

            } else if (player.mines > 0) {

                // Fire a mine
                if (player == this.players[0]) this.summary.minesUsed += 1;
                player.mines -= 1;
                var mine = new Mine(player);
                this.mines.push(mine);

                // It comes out of the backside
                const InitialSpeed: number = 20;
                const InitialAcc: number = 1;
                switch (player.direction) {
                    case Direction.left:
                        mine.accX = InitialAcc;
                        mine.speedX = -player.speed + InitialSpeed;
                        break;
                    case Direction.up:
                        mine.accY = InitialAcc;
                        mine.speedY = -player.speed + InitialSpeed;
                        break;
                    case Direction.right:
                        mine.accX = -InitialAcc;
                        mine.speedX = player.speed - InitialSpeed;
                        break;
                    case Direction.down:
                        mine.accY = -InitialAcc;
                        mine.speedY = player.speed - InitialSpeed;
                        break;
                }

                // Play sound
                this.sound.play(SoundEffect.meStartMine);

            } else {

                // Fire a missile
                if (player == this.players[0]) {
                    this.summary.missilesUsed += 1;
                }
                var spacing = Math.floor(Math.max(2, ((player.size * 2) / player.missileBanks)));
                for (var i = 0; i < player.missileBanks; i++) {
                    var halfRange = (spacing * (player.missileBanks - 1)) / 2;
                    var offset = i * spacing - halfRange;
                    var missile = new Missile(player);
                    if (player.direction == Direction.up || player.direction == Direction.down) {
                        missile.x += offset;
                    } else {
                        missile.y += offset;
                    }
                    this.missiles.push(missile);
                }
            }
        }
    }

    private hit(sourcePlayer: Player, targetPlayer: Player, weapon: Weapon, power: number) {

        // Player loses a life
        var originalLives = targetPlayer.lives;
        targetPlayer.lives = Math.max(0, targetPlayer.lives - power);

        // Is this the human player?
        if (sourcePlayer == this.players[0]) {

            // Play sound
            if (targetPlayer.lives > 0) {
                this.sound.play(SoundEffect.meHitAI);
            }

            // Add hits to the summary
            this.summary.hits += originalLives - targetPlayer.lives;

            // In rapid kill mode, the player is killed instantly
            if (this.rapidMode) targetPlayer.lives = 0;

        } else if (targetPlayer != this.players[0]) {

            // Play sound when AI hits AI
            this.sound.play(SoundEffect.aiHitAI);
        }

        // Has the human lost a life?
        if (targetPlayer == this.players[0]) {
            this.summary.livesLost += 1;

            // Play sound
            this.sound.play(SoundEffect.aiHitMe);
        }

        // Does the player die?
        if (targetPlayer.lives <= 0) {
            this.kill(sourcePlayer, targetPlayer, weapon);
        } else {

            // Particle effect
            var startAngle = Math.random() * 2 * Math.PI;
            var amount = 20 * sourcePlayer.missilePower * sourcePlayer.missileBanks;
            for (var i = 1; i < amount; i++) {
                this.particles.add(targetPlayer.x, targetPlayer.y, targetPlayer.outlineColor, 1, startAngle + i / amount * 2 * Math.PI, 2.5 + Math.random() * 1.5, randomBetween(5, 20));
            }
        }
    }

    private kill(sourcePlayer: Player, targetPlayer: Player, weapon: Weapon) {

        // Ensure the target player no longer has any lives
        if (targetPlayer.lives > 0) {
            targetPlayer.lives = 0;
        }
        this.numberAlive -= 1;
        if (targetPlayer.isOnBoard(this.width, this.height)) {

            // Award the kill to the killing player
            if (sourcePlayer != null && sourcePlayer == this.players[0]) {
                this.summary.kills += 1;

                // Play sound
                if (weapon == Weapon.missile) this.sound.play(SoundEffect.meKillAI);
                if (weapon == Weapon.mine) this.sound.play(SoundEffect.meMineAI);
                if (weapon == Weapon.bomb) this.sound.play(SoundEffect.meBombAI);

                // Activate rapid kill mode if necessary
                if (this.profile.rapidModeEnabled && !this.rapidMode && weapon == Weapon.missile) {
                    this.rapidValue += this.rapidIncrement;
                    if (this.rapidValue > GameState.RapidThreshold) {
                        this.rapidIncrement = Math.max(1, this.rapidIncrement / 2);
                        this.rapidValue = GameState.RapidThreshold;
                        this.rapidMode = true;
                    }
                }
                //#warning Improved AI for simple modes

            } else if (sourcePlayer != this.players[0] && targetPlayer != this.players[0]) {
                this.sound.play(SoundEffect.aiKillAI);
            }

            // In rapid kill mode the player becomes a detonated bomb
            if (this.rapidMode && sourcePlayer == this.players[0] && weapon != Weapon.bomb) {
                this.bombs.push(new Bomb(this.players[0], targetPlayer.x, targetPlayer.y, Bomb.SmallRadius));
            }

            // Show the explosion
            for (var i = 1; i < 100; i++) {
                this.particles.add(targetPlayer.x, targetPlayer.y, targetPlayer.color, randomBetween(1, 5), (Math.random() * 2 * Math.PI), (Math.random() * 2 + 5));
            }
        }

        // Custom handling
        if (this.profile.onKill != null) {
            this.profile.onKill(this, sourcePlayer, targetPlayer, weapon);
        }
    }

    private endGame(humanVictory: boolean) {

        // Kill all the players
        for (var player of this.players) {
            if (player.lives > 0) {
                this.kill(null, player, Weapon.bomb);
            }
        }

        // Play sound
        this.sound.play(humanVictory ? SoundEffect.gameWon : SoundEffect.gameLost);

        // Activate custom event
        if (this.profile.onComplete != null) {
            this.profile.onComplete(this, humanVictory);
        }
    }

    public notify(notice: Notice) {
        this.notices.push(notice);
    }

    public considerUnlock(what: Unlocks, description: string, test: () => boolean) {
        if (test()) {
            var options = Options.load();
            if (!options.isUnlocked(what)) {
                options.setUnlocked(what, true);
                options.save();
                this.notify(Notice.createGreenNotice('Unlocked: ' + description, this.tick + 150));
            }
        }
    }

    private renderNotices(context: CanvasRenderingContext2D) {
        const Margin: number = 16;
        const Height: number = 40;
        var y = Margin;
        for (var notice of this.notices) {
            var width = this.width - Margin * 2;
            notice.render(context, Margin, y, width, Height);
            if (this.tick >= notice.endTick) {
                this.notices.splice(this.notices.indexOf(notice), 1);
            }
            y += Height + Margin;
        }
    }

}