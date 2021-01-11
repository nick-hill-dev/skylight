class Powerup extends Entity {

    static readonly FixedSize: number = 15;

    public constructor(public type: PowerupType, x: number, y: number, direction: Direction) {
        super(x, y, direction, Powerup.FixedSize, 1);
    }

    public move(areaWidth: number, areaHeight: number, borderType: BorderType) {

        // Move the powerup
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

        // What happens now depends on the board type
        switch (borderType) {
            case BorderType.solid:
                if (this.x < this.size) this.x = this.size;
                if (this.y < this.size) this.y = this.size;
                if (this.x >= areaWidth - this.size) this.x = areaWidth - this.size;
                if (this.y >= areaHeight - this.size) this.y = areaHeight - this.size;
                break;

            case BorderType.reflect:
                if (this.x <= this.size) {
                    this.x = this.size;
                    this.direction = Direction.right;
                }

                if (this.x > areaWidth - this.size) {
                    this.x = areaWidth - this.size;
                    this.direction = Direction.left;
                }

                if (this.y <= this.size) {
                    this.y = this.size;
                    this.direction = Direction.down;
                }

                if (this.y > areaHeight - this.size) {
                    this.y = areaHeight - this.size;
                    this.direction = Direction.up;
                }
                break;

            case BorderType.phase:
                if (this.x <= -this.size) this.x = areaWidth + this.size - 1;
                if (this.y <= -this.size) this.y = areaHeight + this.size - 1;
                if (this.x >= areaWidth + this.size) this.x = -this.size;
                if (this.y >= areaHeight + this.size) this.y = -this.size;
                break;

            case BorderType.random:
                if (this.x < -this.size || this.y < -this.size || this.x >= areaWidth + this.size || this.y >= areaHeight + this.size) {
                    this.direction = randomDirection();
                    this.x = randomBetween(0, areaWidth - 1);
                    this.y = randomBetween(0, areaHeight - 1);
                    if (this.direction == Direction.left) this.x = areaWidth + this.size - 1;
                    if (this.direction == Direction.up) this.y = areaHeight + this.size - 1;
                    if (this.direction == Direction.right) this.x = -this.size;
                    if (this.direction == Direction.down) this.y = -this.size;
                }
                break;
        }
    }

}