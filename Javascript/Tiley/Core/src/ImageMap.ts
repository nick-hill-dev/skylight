module Tiley {

    export class ImageMap {

        public readonly tilesWide: number = 0;

        public readonly tilesHigh: number = 0;

        public readonly count: number = 0;

        constructor(public readonly image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, public readonly tileWidth: number, public readonly tileHeight: number) {
            this.tilesWide = image.width / tileWidth;
            this.tilesHigh = image.height / tileHeight;
            this.count = this.tilesWide * this.tilesHigh;
        }

    }

}
