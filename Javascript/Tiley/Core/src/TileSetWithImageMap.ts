module Tiley {

    export class TileSetWithImageMap {

        public readonly details: TileSet;

        public readonly imageMap: ImageMap;

        public readonly tileCount: number;

        constructor(tileWidth: number, tileHeight: number, image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement) {
            this.details = new TileSet(tileWidth, tileHeight);
            this.imageMap = new ImageMap(image, tileWidth, tileHeight);
            this.tileCount = this.imageMap.count;
        }

    }

}
