module Tiley {

    export abstract class MapLayer {

        public width: number = 0;

        public height: number = 0;

        public tiles: Array<number[]> = [];

        public sprites: Sprite[] = [];

        public plugins: IMapLayerPlugin[] = [];

        public tick(elapsed: number) {
            for (let plugin of this.plugins) {
                plugin.tick(this, elapsed);
            }
        }

        public getTileAt(x: number, y: number): number {
            return this.tiles[y][x];
        }

        public setTileAt(x: number, y: number, value: number) {
            this.tiles[y][x] = value;
        }

        public clear(value: number) {
            this.fill(0, 0, this.width, this.height, value);
        }

        public resize(width: number, height: number) {

            // Set width and height
            this.width = width;
            this.height = height;

            // Remove excessive rows
            if (this.tiles.length > height) {
                this.tiles.splice(height, this.tiles.length - height);
            }

            // Add new rows
            let rowsToAdd = height - this.tiles.length;
            for (let i = 1; i <= rowsToAdd; i++) {
                let row: number[] = [];
                this.tiles.push(row);
            }

            // Resize all rows to have the correct width
            for (let y = 0; y < this.tiles.length; y++) {
                let row: number[] = this.tiles[y];
                if (row.length > width) {
                    row.splice(width, row.length - width);
                }
                while (row.length < width) {
                    row.push(0);
                }
            }
        }

        public flip() {
            let halfHeight = Math.floor(this.height / 2);
            for (let y = 0; y < halfHeight; y++) {
                let bottomY = this.height - 1 - y;
                for (let x = 0; x < this.width; x++) {
                    let temp = this.tiles[y][x];
                    this.tiles[y][x] = this.tiles[bottomY][x];
                    this.tiles[bottomY][x] = temp;
                }
            }
        }

        public mirror() {
            let halfWidth = Math.floor(this.width / 2);
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < halfWidth; x++) {
                    let temp = this.tiles[y][x];
                    let rightX = this.width - 1 - x;
                    this.tiles[y][x] = this.tiles[y][rightX];
                    this.tiles[y][rightX] = temp;
                }
            }
        }

        public rotate(rotationCount: number) {
            for (let r = 0; r < rotationCount; r++) {
                let tempLayer = this.copy(0, 0, this.width, this.height);
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        this.tiles[y][x] = tempLayer.tiles[tempLayer.height - 1 - x][y];
                    }
                }
            }
        }

        public rectangle(x: number, y: number, width: number, height: number, value: number) {
            for (let actualY = y; actualY < y + height; actualY++) {
                this.tiles[actualY][x] = value;
                this.tiles[actualY][x + width - 1] = value;
            }
            for (let actualX = x; actualX < x + width; actualX++) {
                this.tiles[y][actualX] = value;
                this.tiles[y + height - 1][actualX] = value;
            }
        }

        public fill(x: number, y: number, width: number, height: number, value: number) {
            for (let actualY = y; actualY < y + height; actualY++) {
                for (let actualX = x; actualX < x + width; actualX++) {
                    if (actualX < this.width && actualY < this.height) {
                        this.tiles[actualY][actualX] = value;
                    }
                }
            }
        }

        public floodFill(x: number, y: number, targetValue: number, replacementValue: number) {
            if (targetValue == replacementValue) {
                return;
            }
            let currentValue = this.tiles[y][x];
            if (currentValue != targetValue) {
                return;
            }
            this.tiles[y][x] = replacementValue;
            if (x > 0) {
                this.floodFill(x - 1, y, targetValue, replacementValue);
            }
            if (x < this.width - 1) {
                this.floodFill(x + 1, y, targetValue, replacementValue);
            }
            if (y > 0) {
                this.floodFill(x, y - 1, targetValue, replacementValue);
            }
            if (y < this.height - 1) {
                this.floodFill(x, y + 1, targetValue, replacementValue);
            }
        }

        public write(x: number, y: number, values: number[]) {
            let actualX = x;
            let actualY = y;
            for (let i in values) {
                let value = values[i];
                this.tiles[actualY][actualX] = value;
                actualX++;
                if (actualX >= this.width) {
                    actualX = 0;
                    actualY++;
                }
                if (actualY >= this.height) {
                    actualY = 0;
                }
            }
        }

        public animate(values: number[]) {
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    for (let i = 0; i < values.length; i++) {
                        let currentValue = values[i];
                        let nextValue = values[Math.floor((i + 1) % values.length)];
                        if (this.tiles[y][x] == currentValue) {
                            this.tiles[y][x] = nextValue;
                            break;
                        }
                    }
                }
            }
        }

        public copy(x: number, y: number, width: number, height: number) {
            let result = this.createMapLayer();
            result.resize(width, height);
            for (let currentY = 0; currentY < height; currentY++) {
                for (let currentX = 0; currentX < width; currentX++) {
                    result.tiles[currentY][currentX] = this.tiles[y + currentY][x + currentX];
                }
            }
            return result;
        }

        public paste(otherLayer: MapLayer, x: number, y: number) {
            for (let sourceY = 0; sourceY < otherLayer.height; sourceY++) {
                for (let sourceX = 0; sourceX < otherLayer.width; sourceX++) {
                    let targetX = x + sourceX;
                    let targetY = y + sourceY;
                    if (targetX < this.width && targetY < this.height) {
                        this.tiles[targetY][targetX] = otherLayer.tiles[sourceY][sourceX];
                    }
                }
            }
        }

        public replace(oldValue: number, newValue: number) {
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    if (this.tiles[y][x] == oldValue) {
                        this.tiles[y][x] = newValue;
                    }
                }
            }
        }

        public swap(oldValue: number, newValue: number) {
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    let currentValue = this.tiles[y][x];
                    if (currentValue == oldValue) {
                        this.tiles[y][x] = newValue;
                    } else if (currentValue == newValue) {
                        this.tiles[y][x] = oldValue;
                    }
                }
            }
        }

        public first(x: number, y: number, width: number, height: number, f: TileValueFunction): ITileReference {
            for (let actualY = y; actualY < y + height; actualY++) {
                for (let actualX = x; actualX < x + width; actualX++) {
                    if (actualX < this.width && actualY < this.height) {
                        let value = this.tiles[actualY][actualX];
                        if (f(actualX, actualY, value) === true) return { x: actualX, y: actualY, layerIndex: -1, value: value };
                    }
                }
            }
            return null;
        }

        public set(f: (x: number, y: number, value: number) => number) {
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    let newValue = f(x, y, this.tiles[y][x]);
                    this.tiles[y][x] = newValue;
                }
            }
        }

        public all(x: number, y: number, width: number, height: number, f: TileValueFunction): boolean {
            for (let actualY = y; actualY < y + height; actualY++) {
                for (let actualX = x; actualX < x + width; actualX++) {
                    if (actualX < this.width && actualY < this.height) {
                        if (f(actualX, actualY, this.tiles[actualY][actualX]) === false) return false;
                    }
                }
            }
            return true;
        }

        public valueOrDefault(x: number, y: number, defaultValue: number): number {
            if (!this.contains(x, y)) return defaultValue;
            return this.tiles[y][x];
        }

        public contains(x: number, y: number): boolean {
            return x >= 0 && y >= 0 && x < this.width && y < this.height;
        }

        public containsBox(x: number, y: number, width: number, height: number): boolean {
            return x >= 0 && y >= 0 && x + width - 1 < this.width && y + height - 1 < this.height;
        }

        public getSpriteAt(x: number, y: number): Sprite {
            for (let sprite of this.sprites) {
                let halfWidth = Math.floor(sprite.type.frameWidth / 2);
                let halfHeight = Math.floor(sprite.type.frameHeight / 2);
                if (x >= sprite.x - halfWidth && y >= sprite.y - halfHeight && x < sprite.x + halfWidth && y < sprite.y + halfHeight) {
                    return sprite;
                }
            }
            return null;
        }

        public replaceSprite(oldSprite: Sprite, newSprite: Sprite, setPosition: boolean = true) {
            this.deleteSprite(oldSprite);
            this.sprites.push(newSprite);
            if (setPosition) {
                newSprite.x = oldSprite.x;
                newSprite.y = oldSprite.y;
            }
        }

        public deleteSprite(sprite: Sprite) {
            let index = this.sprites.indexOf(sprite);
            if (index == -1) {
                throw 'Sprite is not on this layer.';
            }
            this.sprites.splice(index, 1);
        }

        public abstract createMapLayer(): MapLayer;

    }

}
