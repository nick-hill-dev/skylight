module Tiley {

    export class RenderedMap {

        constructor(public map: Map, public mapImageMap: ImageMap, public spriteImageMaps: ImageMap[], public view: MapView) {
        }

        public getSpriteRenderInfo(sprite: Tiley.Sprite): { x: number; y: number; width: number; height: number } {
            return {
                x: sprite.x * this.view.scaleX - this.view.left - (sprite.type.frameWidth * this.view.scaleX) / 2,
                y: sprite.y * this.view.scaleY - this.view.top - (sprite.type.frameHeight * this.view.scaleY) / 2,
                width: sprite.type.frameWidth * this.view.scaleX,
                height: sprite.type.frameHeight * this.view.scaleY
            }
        }

    }

}
