module Tiley {

    export class Sprite {

        public x: number = 0;

        public y: number = 0;

        public frame: number = 0;

        public data: string = undefined;

        public constructor(public type: SpriteType) {
        }

        public move(amountX: number, amountY: number) {
            this.x += amountX;
            this.y += amountY;
        }

        /**
         * Advances the frame index of this sprite by the specified amount, and if necessary ensures that the resulting frame index is within the valid range.
         * @param count The number of frames to advance. The default value is 1.
         * @param cycle Indicates whether or not to ensure the resulting frame index is within the valid range. The default value is true.
         */
        public addFrame(count: number = 1, cycle: boolean = true) {
            if (cycle) {
                this.frame = (this.frame + count) % this.type.frameCount;
                if (this.frame < 0) {
                    this.frame = this.type.frameCount - 1;
                }
            } else {
                this.frame = Math.max(0, Math.min(this.type.frameCount - 1, this.frame + count));
            }
        }

        public overlaps(otherSprite: Sprite) {
            return otherSprite.x + otherSprite.type.halfFrameWidth >= this.x - this.type.halfFrameWidth &&
                otherSprite.y + otherSprite.type.halfFrameHeight >= this.y - this.type.halfFrameHeight &&
                otherSprite.x - otherSprite.type.halfFrameWidth <= this.x + this.type.halfFrameWidth &&
                otherSprite.y - otherSprite.type.halfFrameHeight <= this.y + this.type.halfFrameHeight;
        }

        public restrict(map: Map, orientation: Orientation = Orientation.both): Orientation {
            let result: Orientation = Orientation.none;
            if (orientation & Orientation.left && this.x - this.type.halfFrameWidth < 0) {
                this.x = this.type.halfFrameWidth;
                result |= Orientation.left;
            }
            if (orientation & Orientation.right && this.x + this.type.halfFrameWidth >= map.widthInPixels) {
                this.x = map.widthInPixels - this.type.halfFrameWidth;
                result |= Orientation.right;
            }
            if (orientation & Orientation.up && this.y - this.type.halfFrameHeight < 0) {
                this.y = this.type.halfFrameHeight;
                result |= Orientation.up;
            }
            if (orientation & Orientation.down && this.y + this.type.halfFrameHeight >= map.heightInPixels) {
                this.y = map.heightInPixels - this.type.halfFrameHeight;
                result |= Orientation.down;
            }
            return result;
        }

        public getLayer(map: Map): MapLayer {
            for (let layer of map.layers) {
                if (layer.sprites.indexOf(this) != -1) {
                    return layer;
                }
            }
            return null;
        }

    }

}
