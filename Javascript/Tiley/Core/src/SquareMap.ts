module Tiley {

    export class SquareMap extends Map {

        public getMapType(): MapType {
            return MapType.square
        }

        public createMap(): SquareMap {
            return new SquareMap(this.tileSet, this.spriteTypes);
        }

        public createMapLayer(): SquareMapLayer {
            return new SquareMapLayer();
        }

    }

}