module Tiley {

    export abstract class Map {

        public width: number = 0;

        public height: number = 0;

        public widthInPixels: number = 0;

        public heightInPixels: number = 0;

        public layers: MapLayer[] = [];

        public tileInfo: { [i: number]: TileInfo } = {};

        public repetition: MapRepetition = MapRepetition.none;

        private lastTime: number = -1;

        constructor(public tileSet: TileSet, public spriteTypes: SpriteType[] = [], config: { layerCount: number, width: number, height: number } = undefined) {
            if (config != undefined && config != null) {
                this.resize(config.layerCount, config.width, config.height);
            }
        }

        public tick() {
            let oldTime = this.lastTime;
            this.lastTime = new Date().getTime();
            let framesElapsed = oldTime == -1 ? 0 : (this.lastTime - oldTime) / 1000 * 60;
            for (let layer of this.layers) {
                layer.tick(framesElapsed);
            }
        }

        public getTileAt(layerIndex: number, x: number, y: number): number {
            return this.layers[layerIndex].getTileAt(x, y);
        }

        public setTileAt(layerIndex: number, x: number, y: number, value: number) {
            this.layers[layerIndex].setTileAt(x, y, value);
        }

        public getTilesAt(x: number, y: number): number[] {
            let tiles = [];
            if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
                for (let layer of this.layers) {
                    tiles.push(layer.tiles[y][x]);
                }
            }
            return tiles;
        }

        public getTileLocation(pixelX: number, pixelY: number): IPoint {
            return {
                x: Math.floor(pixelX / this.tileSet.tileWidth),
                y: Math.floor(pixelY / this.tileSet.tileHeight)
            };
        }

        public getTileOffset(pixelX: number, pixelY: number): IPoint {
            return {
                x: pixelX % this.tileSet.tileWidth,
                y: pixelY % this.tileSet.tileHeight
            };
        }

        public clear(value: number) {
            this.fill(0, this.layers.length - 1, 0, 0, this.width, this.height, value);
        }

        public fill(startLayerIndex: number, endLayerIndex: number, x: number, y: number, width: number, height: number, value: number) {
            for (let i = startLayerIndex; i <= endLayerIndex; i++) {
                this.layers[i].fill(x, y, width, height, value);
            }
        }

        public resize(layerCount: number, width: number, height: number) {

            // Set width and height
            this.width = width;
            this.height = height;
            this.widthInPixels = this.tileSet.tileWidth * width;
            this.heightInPixels = this.tileSet.tileHeight * height;

            // Remove excessive layers
            if (this.layers.length > layerCount) {
                this.layers.splice(layerCount, this.layers.length - layerCount);
            }

            // Resize all existing layers
            for (let i = 0; i < Math.min(this.layers.length, layerCount); i++) {
                this.layers[i].resize(width, height);
            }

            // Add new layers
            let layersToAdd = layerCount - this.layers.length;
            for (let i = 1; i <= layersToAdd; i++) {
                let layer = this.createMapLayer();
                layer.resize(width, height);
                this.layers.push(layer);
            }
        }

        public flip() {
            for (let i = 0; i < this.layers.length; i++) {
                this.layers[i].flip();
            }
        }

        public mirror() {
            for (let i = 0; i < this.layers.length; i++) {
                this.layers[i].mirror();
            }
        }

        public rotate(rotationCount: number) {
            for (let i = 0; i < this.layers.length; i++) {
                this.layers[i].rotate(rotationCount);
            }
        }

        public copy(startLayerIndex: number, endLayerIndex: number, x: number, y: number, width: number, height: number): Map {
            let result = this.createMap();
            result.resize(endLayerIndex - startLayerIndex + 1, width, height);
            for (let actualI = startLayerIndex; actualI <= endLayerIndex; actualI++) {
                for (let currentY = 0; currentY < height; currentY++) {
                    for (let currentX = 0; currentX < width; currentX++) {
                        result.layers[actualI - startLayerIndex].tiles[currentY][currentX] = this.layers[actualI].tiles[y + currentY][x + currentX];
                    }
                }
            }
            return result;
        }

        public paste(otherMap: Map, layerIndex: number, x: number, y: number) {
            for (let sourceI = 0; sourceI < otherMap.layers.length; sourceI++) {
                let targetI = layerIndex + sourceI;
                if (targetI < this.layers.length) {
                    let otherLayer = otherMap.layers[sourceI];
                    this.layers[targetI].paste(otherLayer, x, y);
                }
            }
        }

        public collisionDetectionSprites(sprite: Sprite, startLayerIndex: number, endLayerIndex: number): ISpriteReference[] {
            let sprites: ISpriteReference[] = [];
            for (let layerIndex = startLayerIndex; layerIndex <= endLayerIndex; layerIndex++) {
                let layer = this.layers[layerIndex];
                for (let spriteIndex = 0; spriteIndex < layer.sprites.length; spriteIndex++) {
                    let layerSprite = layer.sprites[spriteIndex];
                    if (sprite != layerSprite && sprite.overlaps(layerSprite)) {
                        sprites.push({ layerIndex: layerIndex, spriteIndex: spriteIndex });
                    }
                }
            }
            return sprites;
        }

        public collisionDetectionTiles(sprite: Sprite, x: number = sprite.x, y: number = sprite.y): Bounds {
            return new Bounds(
                Math.floor((x - sprite.type.halfFrameWidth) / this.tileSet.tileWidth),
                Math.floor((y - sprite.type.halfFrameHeight) / this.tileSet.tileHeight),
                Math.floor((x + sprite.type.halfFrameWidth) / this.tileSet.tileWidth),
                Math.floor((y + sprite.type.halfFrameHeight) / this.tileSet.tileHeight)
            );
        }

        public collisionDetection(sprite: Sprite, startLayerIndex: number, endLayerIndex: number): CollisionInfo {
            let tiles = this.collisionDetectionTiles(sprite);
            let sprites = this.collisionDetectionSprites(sprite, startLayerIndex, endLayerIndex);
            return new CollisionInfo(tiles, sprites);
        }

        public getEnteredTiles(sprite: Sprite, movementX: number, movementY: number): IPoint[] {
            if (movementX == 0 && movementY == 0) {
                return [];
            }
            let currentBounds = this.collisionDetectionTiles(sprite);
            let count = Math.max(Math.ceil(Math.abs(movementX) / this.tileSet.tileWidth), Math.ceil(Math.abs(movementY) / this.tileSet.tileHeight));
            let addX = movementX / count;
            let addY = movementY / count;
            let result: IPoint[] = [];
            for (let n = 1; n <= count; n++) {
                let x = sprite.x + n * addX;
                let y = sprite.y + n * addY;
                let nextBounds = this.collisionDetectionTiles(sprite, x, y);
                for (let newTile of nextBounds.except(currentBounds)) {
                    result.push(newTile);
                }
                currentBounds = nextBounds;
            }
            return result;
        }

        public exportData(): ExportedMap {

            // Start the export
            let data = new ExportedMap(this.width, this.height);
            data.repetition = this.repetition;

            // Export all layers
            for (let i = 0; i < this.layers.length; i++) {
                let oldLayer = this.layers[i];
                let newLayer = new ExportedMapLayer();

                // Export tiles for this layer
                let unencodedTiles = [];
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        unencodedTiles.push(oldLayer.tiles[y][x]);
                    }
                }
                let encodedTiles = Map.runLengthEncoding(unencodedTiles);
                if (unencodedTiles.length > encodedTiles.length) {
                    newLayer.rle = true;
                    newLayer.tiles = encodedTiles;
                } else {
                    newLayer.rle = false;
                    newLayer.tiles = unencodedTiles;
                }

                // Export sprites for this layer
                if (oldLayer.sprites.length > 0) {
                    newLayer.sprites = [];
                    for (let oldSprite of oldLayer.sprites) {
                        newLayer.sprites.push({
                            x: oldSprite.x,
                            y: oldSprite.y,
                            t: this.spriteTypes.indexOf(oldSprite.type),
                            f: oldSprite.frame == 0 ? undefined : oldSprite.frame,
                            d: oldSprite.data
                        });
                    }
                }
                data.layers.push(newLayer);
            }

            // Export tile info objects
            for (let index in this.tileInfo) {
                data.setData(Number(index), this.tileInfo[index].data);
            }
            return data;
        }

        public importData(data: ExportedMap, spriteDataHandler: LoadSpriteDataCallback = undefined) {

            // Resize the map to be the appropriate size
            this.resize(data.layers.length, data.width, data.height);
            if (data.repetition != undefined) {
                this.repetition = data.repetition;
            }

            // Import all layers
            for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
                let sourceLayer = data.layers[layerIndex];
                let targetLayer = this.layers[layerIndex];
                let cursor = 0;
                let x = 0;
                let y = 0;

                // Import tiles for this layer
                while (cursor < sourceLayer.tiles.length) {
                    let count = sourceLayer.rle ? sourceLayer.tiles[cursor++] : 1;
                    let value = sourceLayer.tiles[cursor++];
                    for (let i = 0; i < count; i++) {
                        targetLayer.tiles[y][x] = value;
                        x++;
                        if (x >= this.width) {
                            x = 0;
                            y += 1;
                        }
                    }
                }

                // Import sprites for this layer
                targetLayer.sprites = [];
                if (sourceLayer.sprites != undefined) {
                    for (let sourceSprite of sourceLayer.sprites) {
                        let targetSpriteType = this.spriteTypes[sourceSprite.t];
                        let targetSprite = new Sprite(targetSpriteType);
                        targetSprite.x = sourceSprite.x;
                        targetSprite.y = sourceSprite.y;
                        targetSprite.frame = sourceSprite.f == undefined ? 0 : sourceSprite.f;
                        targetSprite.data = sourceSprite.d;
                        targetLayer.sprites.push(targetSprite);

                        // Parse data
                        if (targetSprite.data !== undefined && spriteDataHandler !== undefined && spriteDataHandler != null) {
                            spriteDataHandler(this, targetLayer, targetSprite, targetSprite.data);
                        }
                    }
                }
            }

            // Import tile info objects
            this.tileInfo = {};
            for (let index in data.tileInfo) {
                let info = new TileInfo();
                info.data = data.tileInfo[index].data;
                this.tileInfo[Number(index)] = info;
            }
        }

        public findSprite(f: (layer: MapLayer, sprite: Sprite) => boolean): Sprite {
            for (let layer of this.layers) {
                for (let sprite of layer.sprites) {
                    if (f(layer, sprite)) {
                        return sprite;
                    }
                }
            }
            return null;
        }

        public findSprites(f: (layer: MapLayer, sprite: Sprite) => boolean): Sprite[] {
            let result: Sprite[] = [];
            for (let layer of this.layers) {
                for (let sprite of layer.sprites) {
                    if (f(layer, sprite)) {
                        result.push(sprite);
                    }
                }
            }
            return result;
        }

        public first(startLayerIndex: number, endLayerIndex: number, x: number, y: number, width: number, height: number, f: TileValueFunction): ITileReference {
            for (let actualI = startLayerIndex; actualI <= endLayerIndex; actualI++) {
                let result = this.layers[actualI].first(x, y, width, height, f);
                if (result !== null) {
                    result.layerIndex = actualI;
                    return result;
                }
            }
            return null;
        }

        public all(startLayerIndex: number, endLayerIndex: number, x: number, y: number, width: number, height: number, f: TileValueFunction): boolean {
            for (let actualI = startLayerIndex; actualI <= endLayerIndex; actualI++) {
                if (this.layers[actualI].all(x, y, width, height, f) === false) return false;
            }
            return true;
        }

        public abstract getMapType(): MapType;
        
        public abstract createMap(): Map;

        public abstract createMapLayer(): MapLayer;

        private static runLengthEncoding(values: number[]): number[] {
            let encoding = [];
            let previous, count, i;
            for (count = 1, previous = values[0], i = 1; i < values.length; i++) {
                if (values[i] != previous) {
                    encoding.push(count, previous);
                    count = 1;
                    previous = values[i];
                } else {
                    count++;
                }
            }
            encoding.push(count, previous);
            return encoding;
        }

    }

}
