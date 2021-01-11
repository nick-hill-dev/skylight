module Tiley {

    export abstract class MapRenderer {

        public maps: RenderedMap[] = [];

        constructor(public canvas: HTMLCanvasElement) {
        }

        public clearMaps() {
            this.maps = [];
        }

        public pushMap(map: Map, mapImageMap: ImageMap, spriteImageMaps: ImageMap[]): RenderedMap {
            let view = new MapView(map, this.canvas.clientWidth, this.canvas.clientHeight);
            let renderedMap = new RenderedMap(map, mapImageMap, spriteImageMaps, view);
            this.maps.push(renderedMap);
            return renderedMap;
        }

        public abstract render(): void;

    }

}
