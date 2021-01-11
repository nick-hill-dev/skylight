module Tiley {

    export class ExportedTileSet {

        public imageFileName: string = null;

        public tileWidth: number = 48;

        public tileHeight: number = 48;

        public tileTypes: { [i: number]: ExportedTileTypeInfo } = undefined;

        public static fromJson(json: any): ExportedTileSet {
            let tileSet = new ExportedTileSet();
            tileSet.imageFileName = String(json.imageFileName);
            tileSet.tileWidth = Number(json.tileWidth);
            tileSet.tileHeight = Number(json.tileHeight);
            if (json.tileTypes != undefined) {
                tileSet.tileTypes = {};
                for (let i in json.tileTypes) {
                    tileSet.tileTypes[i] = new ExportedTileTypeInfo(String(json.tileTypes[i].data));
                }
            }
            return tileSet;
        }

        public getData(tileType: number): string {
            let type = this.tileTypes == undefined ? undefined : this.tileTypes[tileType];
            return type == undefined ? undefined : type.data;
        }

        public setData(tileType: number, data: string) {
            if (data != null && data != '') {
                if (this.tileTypes == undefined) {
                    this.tileTypes = {};
                }
                let info = new ExportedTileTypeInfo(data);
                this.tileTypes[tileType] = info;
            } else if (this.tileTypes != undefined && this.tileTypes[tileType] != undefined) {
                delete this.tileTypes[tileType];
                if (!this.hasTileTypes()) {
                    this.tileTypes = undefined;
                }
            }
        }

        public hasTileTypes(): boolean {
            if (this.tileTypes == undefined) {
                return false;
            }
            for (let _i in this.tileTypes) {
                return true;
            }
            return false;
        }

    }

}
