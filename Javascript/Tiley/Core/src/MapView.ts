module Tiley {

    export class MapView {

        public left: number = 0;

        public top: number = 0;

        public scaleX: number = 1;

        public scaleY: number = 1;

        constructor(public map: Map, public width: number, public height: number) {
        }

        public center() {
            this.left = Math.floor(-this.width / 2 + (this.map.widthInPixels * this.scaleX) / 2);
            this.top = Math.floor(-this.height / 2 + (this.map.heightInPixels * this.scaleY) / 2);
        }

        public move(amountX: number, amountY: number) {
            this.left += amountX;
            this.top += amountY;
        }

        public restrict(orientation: Orientation = Orientation.both) {
            if ((orientation & Orientation.left) && this.left < 0) {
                this.left = 0;
            }
            if ((orientation & Orientation.right) && this.left + this.width >= this.map.widthInPixels * this.scaleX) {
                this.left = this.map.widthInPixels * this.scaleX - this.width;
            }
            if ((orientation & Orientation.up) && this.top < 0) {
                this.top = 0;
            }
            if ((orientation & Orientation.down) && this.top + this.height >= this.map.heightInPixels * this.scaleY) {
                this.top = this.map.heightInPixels * this.scaleY - this.height;
            }
        }

        public setScale(scaleX: number, scaleY: number) {
            this.scaleX = scaleX;
            this.scaleY = scaleY;
        }

        /** Converts world tile co-ordinates into screen co-ordinates, taking into account the location and size of the view. */
        public tileToScreen(tileX: number, tileY: number): IPoint {
            return {
                x: tileX * this.map.tileSet.tileWidth * this.scaleX - this.left,
                y: tileY * this.map.tileSet.tileHeight * this.scaleY - this.top
            };
        }

        /** Converts world co-ordinates into screen co-ordinates, which may extend beyond the range of the view. */
        public worldToScreen(worldX: number, worldY: number): IPoint {
            return {
                x: worldX - this.left,
                y: worldY - this.top
            };
        }

        /** Converts screen co-ordinates into world co-ordinates. */
        public screenToWorld(screenX: number, screenY: number): IPoint {
            return {
                x: Math.floor((this.left + screenX) / this.scaleX),
                y: Math.floor((this.top + screenY) / this.scaleY)
            };
        }

        /**
         * Converts screen co-ordinates into world tile co-ordinates.
         * @param constrain Indicates whether or not to force the resulting co-ordinates to fit the bounds of the map.
         */
        public screenToWorldTile(screenX: number, screenY: number, constrain: boolean = true): IPoint {
            let result = {
                x: Math.floor((this.left + screenX) / (this.map.tileSet.tileWidth * this.scaleX)),
                y: Math.floor((this.top + screenY) / (this.map.tileSet.tileHeight * this.scaleY))
            };
            if (constrain) {
                result.x = Math.max(0, Math.min(this.map.width - 1, result.x));
                result.y = Math.max(0, Math.min(this.map.height - 1, result.y));
            }
            return result;
        }

        /** Returns information that describes which tiles are visible, based on the location and size of the view. */
        public getVisibleTileBounds(): IBounds {
            let topLeft = this.screenToWorldTile(0, 0);
            let bottomRight = this.screenToWorldTile(this.width - 1, this.height - 1);
            let bounds = {
                left: topLeft.x,
                top: topLeft.y,
                right: bottomRight.x - 1,
                bottom: bottomRight.y - 1,
                width: 0,
                height: 0
            };
            bounds.width = bounds.right - bounds.left + 1;
            bounds.height = bounds.bottom - bounds.top + 1;
            return bounds;
        }

    }

}
