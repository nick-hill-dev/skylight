module Tiley {

    export class ExportedMap {

        public layers: ExportedMapLayer[] = [];

        public tileInfo: { [i: number]: TileInfo } = undefined;

        public repetition: MapRepetition = undefined;

        public constructor(public width: number, public height: number) {
        }

        public static fromJson(json: any): ExportedMap {
            let map = new ExportedMap(Number(json.width), Number(json.height));
            for (let layer of json.layers) {
                map.layers.push(ExportedMapLayer.fromJson(layer));
            }
            if (json.tileInfo != undefined) {
                map.tileInfo = {};
                for (let i in json.tileInfo) {
                    map.tileInfo[i] = new ExportedTileInfo(String(json.tileInfo[i].data));
                }
            }
            if (json.repetition != undefined) {
                map.repetition = json.repetition;
            }
            return map;
        }

        public getData(index: number): string {
            let tile = this.tileInfo == undefined ? undefined : this.tileInfo[index];
            return tile == undefined ? undefined : tile.data;
        }

        public setData(index: number, data: string) {
            if (data != null && data != '') {
                if (this.tileInfo == undefined) {
                    this.tileInfo = {};
                }
                let info = new ExportedTileInfo(data);
                this.tileInfo[index] = info;
            } else if (this.tileInfo != undefined && this.tileInfo[index] != undefined) {
                delete this.tileInfo[index];
                if (!this.hasTileInfos()) {
                    this.tileInfo = undefined;
                }
            }
        }

        public hasTileInfos(): boolean {
            if (this.tileInfo == undefined) {
                return false;
            }
            for (let _i in this.tileInfo) {
                return true;
            }
            return false;
        }

    }

}
