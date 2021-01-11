module Tiley {

    export interface IMapLayerPlugin {

        tick(layer: MapLayer, elapsed: number): void;

    }

}