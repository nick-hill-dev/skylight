/// <reference path="Map.ts" />

module Tiley {

    export class HexMap extends Map {

        public hexType: HexType = HexType.pointy;
        
        public getMapType(): MapType {
            return MapType.hex
        }

        public createMap(): HexMap {
            return new HexMap(this.tileSet, this.spriteTypes);
        }

        public createMapLayer(): HexMapLayer {
            return new HexMapLayer();
        }

    }

}