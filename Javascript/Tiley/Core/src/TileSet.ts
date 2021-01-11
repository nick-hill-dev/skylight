module Tiley {

    export class TileSet {

        public tileTypes: { [i: number]: TileTypeInfo } = {};

        constructor(public tileWidth: number, public tileHeight: number) {
        }

        public getData(i: number): string {
            let tileType = this.tileTypes[i];
            return tileType == undefined ? null : tileType.data;
        }

    }

}
