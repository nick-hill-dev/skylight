module Tiley.Rendering.Canvas {

    export class CanvasRenderingConfig {

        /**
         * Specifies whether or not to automatically resize the canvas to fit the entire window width and height, and to keep resizing the canvas whenever the window is resized.
         * The default is false.
         */
        public autoFillScreen: boolean = false;

        /** 
         * Specifies whether or not to automatically render the UI. 
         * Doing so will likely interfere with any other attempt to render onto the canvas. 
         * The default is false.
         */
        public autoRender: boolean = false;

        constructor(public readonly canvas: HTMLCanvasElement) {
        }

    }

}