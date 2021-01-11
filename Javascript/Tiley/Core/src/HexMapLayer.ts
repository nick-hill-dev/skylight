/// <reference path="MapLayer.ts" />

module Tiley {

    export class HexMapLayer extends MapLayer {

        public createMapLayer(): MapLayer {
            return new HexMapLayer();
        }

    }

}