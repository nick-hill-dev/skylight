module Tiley {

    export class Environment {

        public name: string = '';
        
        public basePath: string = '';

        public tileSet: ExportedTileSet = undefined;

        public spriteTypes: ExportedSpriteType[] = undefined;

        public maps: IExportedMapWithName = undefined;

        public static fromJson(json: any, basePath: string): Environment {
            let environment = new Environment();
            environment.basePath = basePath;
            environment.name = String(json.name);
            if (json.tileSet != undefined) {
                environment.tileSet = ExportedTileSet.fromJson(json.tileSet);
            }
            if (json.spriteTypes != undefined) {
                for (let o of json.spriteTypes) {
                    environment.addSpriteType(ExportedSpriteType.fromJson(o));
                }
            }
            if (json.maps != undefined) {
                for (let mapName in json.maps) {
                    environment.setMap(mapName, ExportedMap.fromJson(json.maps[mapName]));
                }
            }
            return environment;
        }

        public compileTileSet(): TileSet {
            let result = new TileSet(this.tileSet.tileWidth, this.tileSet.tileHeight);
            if (this.tileSet.tileTypes != undefined) {
                for (let i in this.tileSet.tileTypes) {
                    let info = new TileTypeInfo();
                    info.data = this.tileSet.tileTypes[i].data;
                    result.tileTypes[i] = info;
                }
            }
            return result;
        }

        public addSpriteType(spriteType: ExportedSpriteType) {
            if (this.spriteTypes == undefined) {
                this.spriteTypes = [];
            }
            this.spriteTypes.push(spriteType);
        }

        public hasSpriteTypes(): boolean {
            return this.spriteTypes != undefined && this.spriteTypes.length > 0;
        }

        public compileSpriteTypes(): SpriteType[] {
            let result: SpriteType[] = [];
            if (this.spriteTypes != undefined) {
                for (let index = 0; index < this.spriteTypes.length; index++) {
                    let source = this.spriteTypes[index];
                    result.push(source.toSpriteType(index));
                }
            }
            return result;
        }

        public deleteSpriteType(spriteType: ExportedSpriteType) {

            // Delete all sprites referencing this type
            let index = this.spriteTypes.indexOf(spriteType);
            for (let mapName in this.maps) {
                for (let layer of this.maps[mapName].layers) {
                    if (layer.sprites != undefined) {
                        for (let i = layer.sprites.length - 1; i >= 0; i--) {
                            let sprite = layer.sprites[i];
                            if (sprite.t == index) {
                                layer.sprites.splice(i, 1);
                            }
                        }
                    }
                }
            }

            // Delete the sprite type
            this.spriteTypes.splice(index, 1);
            if (this.spriteTypes.length == 0) {
                this.spriteTypes = undefined;
            }
        }

        public setMap(name: string, map: ExportedMap) {
            if (this.maps == undefined) {
                this.maps = {};
            }
            this.maps[name] = map;
        }

        public hasMaps(): boolean {
            if (this.maps == undefined) {
                return false;
            }
            for (let _mapName in this.maps) {
                return true;
            }
            return false;
        }

        public deleteMap(name: string) {
            delete this.maps[name];
            if (!this.hasMaps()) {
                this.maps = undefined;
            }
        }

        public toJson(): string {
            return JSON.stringify(this);
        }

    }

}