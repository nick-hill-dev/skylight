module Tiley {

    export interface TileValueFunction extends Function {
        (x: number, y: number, value: number): boolean;
    }

    export interface LoadSpriteDataCallback extends Function {
        (map: Map, layer: MapLayer, sprite: Sprite, data: string): void;
    }

}