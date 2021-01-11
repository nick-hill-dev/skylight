class Player extends Entity {

    static readonly DefaultSize: number = 14;
    static readonly ShieldRadius: number = 22;
    static readonly DefaultMaxLives: number = 10;
    static readonly MaxShields: number = 14;
    static readonly MaxPower: number = 5;
    static readonly FireInterval: number = 9;
    static readonly InvulnerabilityAmount: number = 600;
    static readonly DefaultSpeed: number = 3;

    public missileBanks: number = 1;
    public missilePower: number = 1;
    public mines: number = 0;
    public bombs: number = 0;
    public color: string = 'white';
    public outlineColor: string = 'white';
    public maxLives: number = Player.DefaultMaxLives;
    public lives: number = Player.DefaultMaxLives;
    public shields: number = 0;
    public invulnerability: number = 150;
    public lastFireTick: number = 0;

    public aiHandler: AIHandler = null;

    public constructor(x: number, y: number, direction: Direction) {
        super(x, y, direction, Player.DefaultSize, Player.DefaultSpeed);
        this.setColor(new Color(255, 255, 255));
    }

    public setColor(color: Color) {
        this.color = color.toString();
        this.outlineColor = new Color((color.r + 255) / 2, (color.g + 255) / 2, (color.b + 255) / 2).toString();
    }

    public setRandomColor() {
        this.setColor(new Color(randomBetween(64, 255), randomBetween(64, 255), randomBetween(64, 255)));
    }

    public move(areaWidth: number, areaHeight: number, border: BorderType) {

        // Are we a player moving into the board?
        var margin = this.shields > 0 ? Player.ShieldRadius : this.size;
        var right = areaWidth - margin - 1;
        var bottom = areaHeight - margin - 1;
        var skip = this.x < margin || this.y < margin || this.x > right || this.y > bottom;

        // Decrease invulnerability
        if (this.invulnerability > 0) this.invulnerability -= 1;

        // Move the player in the correct direction            
        if (this.direction == Direction.left) this.x -= this.speed;
        if (this.direction == Direction.up) this.y -= this.speed;
        if (this.direction == Direction.right) this.x += this.speed;
        if (this.direction == Direction.down) this.y += this.speed;

        // Don't do any further processing if the player wasn't on the board to begin with
        if (skip) return;

        // Handle the player going off the edge of the board, depending on border type
        switch (border) {

            case BorderType.solid:
                if (this.x < margin) this.x = margin;
                if (this.x > right) this.x = right - 1;
                if (this.y < margin) this.y = margin;
                if (this.y > bottom) this.y = bottom - 1;
                break;

            case BorderType.reflect:
                if (this.x < margin) { this.x = margin; this.reverseDirection(); }
                if (this.x > right) { this.x = right - 1; this.reverseDirection(); }
                if (this.y < margin) { this.y = margin; this.reverseDirection(); }
                if (this.y > bottom) { this.y = bottom - 1; this.reverseDirection(); }
                break;

            case BorderType.phase:
                if (this.x < margin) this.x = right - 1;
                if (this.x > right) this.x = margin;
                if (this.y < margin) this.y = bottom - 1;
                if (this.y > bottom) this.y = margin;
                break;

            case BorderType.random:
                if (this.x < margin || this.x > right || this.y < margin || this.y > bottom) {
                    var direction = randomDirection();
                    this.direction = direction;
                    this.x = randomBetween(margin, right);
                    this.y = randomBetween(margin, bottom);
                    if (direction == Direction.left) this.x = right;
                    if (direction == Direction.up) this.y = bottom;
                    if (direction == Direction.right) this.x = margin;
                    if (direction == Direction.down) this.y = margin;
                }
                break;
        }
    }

    public reverseDirection() {
        switch (this.direction) {
            case Direction.left: this.direction = Direction.right; break;
            case Direction.up: this.direction = Direction.down; break;
            case Direction.right: this.direction = Direction.left; break;
            case Direction.down: this.direction = Direction.up; break;
        }
    }

    public isOnBoard(areaWidth: number, areaHeight: number) {
        return (this.x >= 0 && this.x < areaWidth && this.y >= 0 && this.y < areaHeight);
    }

    public canFire(currentTick: number) {
        return this.speed > 0 && currentTick >= this.lastFireTick + Player.FireInterval;
    }

    public getActiveWeapon(): Weapon {
        if (this.bombs > 0) return Weapon.bomb;
        if (this.mines > 0) return Weapon.mine;
        return Weapon.missile;
    }

    public render(context: CanvasRenderingContext2D, tick: number) {

        // Draw shields around the player if the player's shield is active
        if (this.shields > 0) {
            if (this.invulnerability > 0) {
                context.fillStyle = randomColor().toString();
                context.fillCircle(this.x, this.y, Player.ShieldRadius);
                context.strokeStyle = randomColor().toString();
                context.drawCircle(this.x, this.y, Player.ShieldRadius);
            } else {
                var alpha = this.shields / Player.MaxShields * 200 + 55;
                var alphaOverFive = Math.floor(alpha / 5);
                var shieldColor = new Color(alpha, alpha, alpha).toString();
                context.fillStyle = new Color(alphaOverFive, alphaOverFive, alphaOverFive).toString();
                context.fillCircle(this.x, this.y, Player.ShieldRadius);
                context.strokeStyle = shieldColor;
                context.drawCircle(this.x, this.y, Player.ShieldRadius);
            }
        }

        if (this.bombs > 0) {

            // Draw a large circle around the player as the player has bombs
            if (tick % 2 == 0) {
                context.fillStyle = this.color;
                context.fillCircle(this.x, this.y, this.size * 4);
            }

        } else if (this.mines > 0) {

            // Draw particles around the player as the player has mines
            context.fillStyle = this.color;
            for (var mineNumber = 0; mineNumber <= this.mines; mineNumber++) {
                var angle = (2 * Math.PI) / this.mines * mineNumber + (tick / 90 * 2 * Math.PI);
                context.fillCircle((this.x + (this.size * 1.8 * Math.cos(angle))),
                    (this.y + (this.size * 1.8 * Math.sin(angle))),
                    Mine.SmallSize);
            }
        }

        // Draw the player triangle
        var livesRatio = (this.lives - 1) / (this.maxLives - 1);
        var fillColor = this.invulnerability > 0 ? randomColor().toString() : this.color;
        var outlineColor = this.invulnerability > 0 ? randomColor().toString() : this.outlineColor;
        switch (this.direction) {
            case Direction.left:
                Player.renderTriangle(context, this.x - this.size, this.y, this.direction, this.size, 1, outlineColor, 'black');
                if (livesRatio > 0) {
                    Player.renderTriangle(context, this.x - this.size, this.y, this.direction, this.size, livesRatio, outlineColor, fillColor);
                }
                break;

            case Direction.up:
                Player.renderTriangle(context, this.x, this.y - this.size, this.direction, this.size, 1, outlineColor, 'black');
                if (livesRatio > 0) {
                    Player.renderTriangle(context, this.x, this.y - this.size, this.direction, this.size, livesRatio, outlineColor, fillColor);
                }
                break;

            case Direction.right:
                Player.renderTriangle(context, this.x + this.size, this.y, this.direction, this.size, 1, outlineColor, 'black');
                if (livesRatio > 0) {
                    Player.renderTriangle(context, this.x + this.size, this.y, this.direction, this.size, livesRatio, outlineColor, fillColor);
                }
                break;

            case Direction.down:
                Player.renderTriangle(context, this.x, this.y + this.size, this.direction, this.size, 1, outlineColor, 'black');
                if (livesRatio > 0) {
                    Player.renderTriangle(context, this.x, this.y + this.size, this.direction, this.size, livesRatio, outlineColor, fillColor);
                }
                break;
        }
    }

    private static renderTriangle(context: CanvasRenderingContext2D, forwardX: number, forwardY: number, direction: Direction, size: number, ratio: number, strokeStyle: string, fillStyle: string) {
        if (fillStyle != null) {
            context.fillStyle = fillStyle;
        }
        if (strokeStyle != null) {
            context.strokeStyle = strokeStyle;
        }
        context.beginPath();
        var distance = size * ratio;
        switch (direction) {
            case Direction.left:
                var endX = forwardX + size * 2 * ratio;
                context.moveTo(forwardX, forwardY);
                context.lineTo(endX, forwardY - distance);
                context.lineTo(endX, forwardY + distance);
                context.lineTo(forwardX, forwardY);
                break;

            case Direction.up:
                var endY = forwardY + size * 2 * ratio;
                context.moveTo(forwardX, forwardY);
                context.lineTo(forwardX - distance, endY);
                context.lineTo(forwardX + distance, endY);
                context.lineTo(forwardX, forwardY);
                break;

            case Direction.right:
                var endX = forwardX - size * 2 * ratio;
                context.moveTo(forwardX, forwardY);
                context.lineTo(endX, forwardY - distance);
                context.lineTo(endX, forwardY + distance);
                context.lineTo(forwardX, forwardY);
                break;

            case Direction.down:
                var endY = forwardY - size * 2 * ratio;
                context.moveTo(forwardX, forwardY);
                context.lineTo(forwardX - distance, endY);
                context.lineTo(forwardX + distance, endY);
                context.lineTo(forwardX, forwardY);
                break;
        }
        if (fillStyle != null) {
            context.fill();
        }
        if (strokeStyle != null) {
            context.stroke();
        }
    }

}