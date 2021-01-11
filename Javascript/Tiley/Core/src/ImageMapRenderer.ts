module Tiley.Rendering.Canvas {

    export abstract class ImageMapRenderer {

        public constructor(public imageMap: ImageMap, public canvas: HTMLCanvasElement) {
        }

        public abstract render(x: number, y: number, imageIndex: number);

    }

}