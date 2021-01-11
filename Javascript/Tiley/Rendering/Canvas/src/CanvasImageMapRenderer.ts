module Tiley.Rendering.Canvas {

    export class CanvasImageMapRenderer extends ImageMapRenderer {

        private context: CanvasRenderingContext2D = null;

        public constructor(imageMap: ImageMap, canvas: HTMLCanvasElement) {
            super(imageMap, canvas);
            this.context = canvas.getContext('2d');
        }

        public render(x: number, y: number, imageIndex: number) {
            let imageIndexX = imageIndex % this.imageMap.tilesWide;
            let imageIndexY = Math.floor(imageIndex / this.imageMap.tilesWide);
            this.context.drawImage(this.imageMap.image,
                                   imageIndexX * this.imageMap.tileWidth,
                                   imageIndexY * this.imageMap.tileHeight,
                                   this.imageMap.tileWidth,
                                   this.imageMap.tileHeight,
                                   x,
                                   y,
                                   this.imageMap.tileWidth,
                                   this.imageMap.tileHeight);
        }

    }

}