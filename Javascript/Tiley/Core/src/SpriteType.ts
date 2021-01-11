module Tiley {

    export class SpriteType {

        public readonly halfFrameWidth: number;

        public readonly halfFrameHeight: number;

        public data: string = undefined;

        public constructor(public readonly index: number, public readonly frameWidth: number, public readonly frameHeight: number, public readonly frameCount: number) {
            this.halfFrameWidth = frameWidth / 2;
            this.halfFrameHeight = frameHeight / 2;
        }

    }

}
