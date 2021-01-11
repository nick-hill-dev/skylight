module Tiley {

    export class ExportedMapLayer {

        public rle: boolean = false;

        public tiles: number[] = [];

        public sprites: Array<{ x: number; y: number; t: number; f: number; d: string }> = undefined;

        public static fromJson(json: any): ExportedMapLayer {
            let layer = new ExportedMapLayer();
            layer.rle = Boolean(json.rle);
            for (let tile of json.tiles) {
                layer.tiles.push(Number(tile));
            }
            if (json.sprites != undefined && json.sprites != null) {
                layer.sprites = [];
                for (let sourceSprite of json.sprites) {
                    let targetSprite = {
                        x: Number(sourceSprite.x),
                        y: Number(sourceSprite.y),
                        t: Number(sourceSprite.t),
                        f: sourceSprite.f == undefined ? 0 : Number(sourceSprite.f),
                        d: sourceSprite.d == undefined ? undefined : String(sourceSprite.d)
                    };
                    layer.sprites.push(targetSprite);
                }
            }
            return layer;
        }

    }

} 