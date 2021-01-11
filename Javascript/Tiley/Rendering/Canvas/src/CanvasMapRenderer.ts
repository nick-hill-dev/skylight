module Tiley.Rendering.Canvas {

    export class CanvasMapRenderer extends MapRenderer {

        public readonly context: CanvasRenderingContext2D = null;

        constructor(config: CanvasRenderingConfig) {
            super(config.canvas);
            this.context = config.canvas.getContext('2d');

            if (config != null && config.autoFillScreen) {
                this.automaticallyResizeCanvas();
                window.addEventListener('resize', (e: UIEvent) => this.automaticallyResizeCanvas(), false);
            }

            let outer = this;
            function automaticallyRender() {
                window.requestAnimationFrame(automaticallyRender);
                outer.render();
            }
            if (config.autoRender) {
                automaticallyRender();
            }
        }

        public render() {

            // Clear screen
            let canvasWidth = this.canvas.clientWidth;
            let canvasHeight = this.canvas.clientHeight;
            this.context.clearRect(0, 0, canvasWidth, canvasHeight);

            // Render each map in the stack
            for (let current of this.maps) {
                switch (current.map.getMapType()) {

                    case MapType.square:
                        this.renderSquareMap(current);
                        break;

                    case MapType.hex:
                        this.renderHexMap(current);
                        break;

                    default:
                        throw 'Unknown map type.';
                }
            }
        }

        private renderSquareMap(current: RenderedMap) {
            let map: SquareMap = current.map;
            let mapImageMap = current.mapImageMap;
            let spriteImageMaps = current.spriteImageMaps;
            let view = current.view;

            // Determine actual size of rendered tiles due to scaling
            let tileWidth = map.tileSet.tileWidth;
            let tileHeight = map.tileSet.tileHeight;
            let renderedTileWidth = tileWidth * view.scaleX;
            let renderedTileHeight = tileHeight * view.scaleY;

            // Determine tile offset based on relative screen position within a single tile
            let offsetX = view.left % renderedTileWidth;
            if (offsetX < 0) {
                offsetX += renderedTileWidth;
            }
            let offsetY = view.top % renderedTileHeight;
            if (offsetY < 0) {
                offsetY += renderedTileHeight;
            }

            // Draw tiles on each layer
            for (let layer of map.layers) {

                // Handle rows of tiles with tiles on each row
                let x = view.left;
                let y = view.top;
                let maxX = view.left + view.width + renderedTileWidth;
                let maxY = view.top + view.height + renderedTileHeight;
                let tileX = Math.floor(x / renderedTileWidth);
                let tileY = Math.floor(y / renderedTileHeight);
                while (y < maxY && x < maxX) {

                    // What is the tile index of the tile at this location, taking into account map repeating?
                    let tileIndex = -1;
                    if (!(map.repetition & MapRepetition.none)) {
                        let mapX = tileX;
                        if (map.repetition & MapRepetition.horizontal) {
                            mapX = tileX % map.width;
                            if (mapX < 0) {
                                mapX += map.width;
                            }
                        }
                        let mapY = tileY;
                        if (map.repetition & MapRepetition.vertical) {
                            mapY = tileY % map.height;
                            if (mapY < 0) {
                                mapY += map.height;
                            }
                        }
                        if (layer.contains(mapX, mapY)) {
                            tileIndex = layer.tiles[mapY][mapX] - 1;
                        }
                    }

                    // Draw tile at this location
                    if (tileIndex > -1) {
                        let imageIndexX = tileIndex % mapImageMap.tilesWide;
                        let imageIndexY = Math.floor(tileIndex / mapImageMap.tilesWide);
                        this.context.drawImage(mapImageMap.image,
                                               imageIndexX * tileWidth,
                                               imageIndexY * tileHeight,
                                               tileWidth,
                                               tileHeight,
                                               (x - view.left) - offsetX,
                                               (y - view.top) - offsetY,
                                               renderedTileWidth,
                                               renderedTileHeight);
                    }

                    // Advance the drawing cursor
                    x += renderedTileWidth;
                    tileX++;
                    if (x >= maxX) {
                        x = view.left;
                        y += renderedTileHeight;
                        tileX = Math.floor(x / renderedTileWidth);
                        tileY++;
                    }
                }

                // Draw sprites on this layer
                for (let sprite of layer.sprites) {

                    // Compute some information
                    let spriteImageMap = spriteImageMaps[sprite.type.index];
                    let renderedSpriteWidth = spriteImageMap.tileWidth * view.scaleX;
                    let renderedSpriteHeight = spriteImageMap.tileHeight * view.scaleY;
                    let targetX = Math.floor(sprite.x * view.scaleX - view.left - renderedSpriteWidth / 2);
                    let targetY = Math.floor(sprite.y * view.scaleY - view.top - renderedSpriteHeight / 2);

                    // Determine whether or not to draw the image
                    if (targetX + renderedSpriteWidth >= 0 && targetY + renderedSpriteHeight >= 0 && targetX <= view.width && targetY <= view.height) {

                        // Draw the sprite - it is in view!                
                        let imageIndexX = sprite.frame % spriteImageMap.tilesWide;
                        let imageIndexY = Math.floor(sprite.frame / spriteImageMap.tilesWide);
                        this.context.drawImage(spriteImageMap.image,
                                               imageIndexX * spriteImageMap.tileWidth,
                                               imageIndexY * spriteImageMap.tileHeight,
                                               spriteImageMap.tileWidth,
                                               spriteImageMap.tileHeight,
                                               targetX,
                                               targetY,
                                               renderedSpriteWidth,
                                               renderedSpriteHeight);
                    }
                }
            }
        }

        private renderHexMap(current: RenderedMap) {
            let map: HexMap = <HexMap>current.map;
            //let mapImageMap = current.mapImageMap;
            //let spriteImageMaps = current.spriteImageMaps;
            let view = current.view;

            // Determine actual size of rendered tiles due to scaling
            let tileWidth = map.tileSet.tileWidth;
            //let tileHeight = map.tileSet.tileHeight;
            let renderedTileWidth = tileWidth * view.scaleX;
            //let renderedTileHeight = tileHeight * view.scaleY;

            let hexRadius = renderedTileWidth / 2;

            let hexSize = this.getHexSize(hexRadius, map.hexType);
            for (let y = 0; y < map.height; y++) {
                for (let x = 0; x < map.width; x++) {
                    let center = map.hexType == HexType.pointy ?
                        {
                            x: (y % 2 == 0 ? 0 : hexSize.width * 0.5) + x * hexSize.width,
                            y: y * hexSize.height * 0.75
                        } :
                        {
                            x: x * hexSize.width * 0.75,
                            y: (x % 2 == 0 ? 0 : hexSize.height * 0.5) + y * hexSize.height
                        }
                    this.renderHex(this.context, center, hexRadius, map.hexType);
                }
            }
        }

        public getHexCorner(center: Tiley.IPoint, radius: number, i: number, hexType: HexType): Tiley.IPoint {
            let angleDeg = 60 * i - (hexType == HexType.flat ? 0 : 30);
            let angleRad = Math.PI / 180 * angleDeg;
            return {
                x: center.x + radius * Math.cos(angleRad),
                y: center.y + radius * Math.sin(angleRad)
            };
        }
    
        public getHexSize(radius: number, hexType: HexType): Tiley.ISize {
            return hexType == HexType.flat
                ? { width: 2 * radius, height: Math.sqrt(3) * radius }
                : { width: Math.sqrt(3) * radius, height: 2 * radius };
        }
    
        public renderHex(context: CanvasRenderingContext2D, center: Tiley.IPoint, radius: number, hexType: HexType) {
            context.beginPath();
            for (let i = 0; i <= 5; i++) {
                let point = this.getHexCorner(center, radius, i, hexType);
                if (i == 0) {
                    context.moveTo(point.x, point.y);
                } else {
                    context.lineTo(point.x, point.y);
                }
            }
            context.closePath();
            context.stroke();
        }

        private automaticallyResizeCanvas() {
            let canvas = this.canvas;
            canvas.removeAttribute('style');
            canvas.style.position = 'absolute';
            canvas.style.overflow = 'hidden';
            canvas.style.left = '0';
            canvas.style.top = '0';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

    }

}
