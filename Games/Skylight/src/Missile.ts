class Missile extends Entity {

    public power: number = 1;
    public color: string = 'white';

    public constructor(public owner: Player) {
        super(owner.x, owner.y, owner.direction, owner.size * 2 + 1, owner.speed * 4);
        this.power = owner.missilePower;

        // Place at the correct location
        switch (this.direction) {
            case Direction.left:
                this.x -= owner.shields == 0 ? owner.size - 1 : Player.ShieldRadius - 1;
                break;

            case Direction.up:
                this.y -= owner.shields == 0 ? owner.size - 1 : Player.ShieldRadius - 1;
                break;

            case Direction.right:
                this.x += owner.shields == 0 ? owner.size + 1 : Player.ShieldRadius + 1;
                break;

            case Direction.down:
                this.y += owner.shields == 0 ? owner.size + 1 : Player.ShieldRadius + 1;
                break;
        }

        // Perform processing for the color
        this.color = 'rgb(245, 245, 245)';
        if (this.power == 2) this.color = 'rgb(0, 0, 245)';
        if (this.power == 3) this.color = 'rgb(220, 220, 0)';
        if (this.power == 4) this.color = 'rgb(210, 105, 30)';
        if (this.power > 4) this.color = 'rgb(255, 0, 0)';
    }

    public move(areaWidth: number, areaHeight: number, border: BorderType): boolean {

        // Move the missile
        switch (this.direction) {
            case Direction.left:
                this.x -= this.speed;
                break;

            case Direction.up:
                this.y -= this.speed;
                break;

            case Direction.right:
                this.x += this.speed;
                break;

            case Direction.down:
                this.y += this.speed;
                break;
        }

        // Is the missile attempting to escape the board?
        if (this.x < -this.size || this.y < -this.size || this.x >= areaWidth + this.size || this.y >= areaHeight + this.size) {

            // What happens now depends on the board type
            switch (border) {
                case BorderType.solid:
                    return true;

                case BorderType.reflect:
                    this.reverseDirection();
                    break;

                case BorderType.phase:
                    if (this.x < -this.size) this.x = areaWidth + this.size - 1;
                    if (this.y < -this.size) this.y = areaHeight + this.size - 1;
                    if (this.x >= areaWidth + this.size) this.x = -this.size;
                    if (this.y >= areaHeight + this.size) this.y = -this.size;
                    break;

                case BorderType.random:
                    this.direction = randomDirection();
                    this.x = randomBetween(0, areaWidth - 1);
                    this.y = randomBetween(0, areaHeight - 1);
                    if (this.direction == Direction.left) this.x = areaWidth + this.size - 1;
                    if (this.direction == Direction.up) this.y = areaHeight + this.size - 1;
                    if (this.direction == Direction.right) this.x = -this.size;
                    if (this.direction == Direction.down) this.y = -this.size;
                    break;
            }
        }

        // Do not delete the missile
        return false;
    }

    public reverseDirection() {

        switch (this.direction) {
            case Direction.left:
                this.direction = Direction.right;
                this.x += this.size;
                break;

            case Direction.up:
                this.direction = Direction.down;
                this.y += this.size;
                break;

            case Direction.right:
                this.direction = Direction.left;
                this.x -= this.size;
                break;

            case Direction.down:
                this.direction = Direction.up;
                this.y -= this.size;
                break;
        }
    }

    public render(context: CanvasRenderingContext2D) {
        context.strokeStyle = this.color;
        context.beginPath();
        context.moveTo(this.x, this.y);        

        switch (this.direction) {
            case Direction.left:
                context.lineTo(this.x + this.size, this.y);
                break;

            case Direction.up:
                context.lineTo(this.x, this.y + this.size);
                break;

            case Direction.right:
                context.lineTo(this.x - this.size, this.y);
                break;

            case Direction.down:
                context.lineTo(this.x, this.y - this.size);
                break;
        }
        context.stroke();
    }

}