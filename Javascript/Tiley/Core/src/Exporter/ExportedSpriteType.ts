module Tiley {

    export class ExportedSpriteType {

        public imageFileName: string = null;

        public frameWidth: number = 48;

        public frameHeight: number = 48;

        public frameCount: number = 1;

        public data: string = undefined;

        public static fromJson(json: any): ExportedSpriteType {
            let spriteType = new ExportedSpriteType();
            spriteType.imageFileName = String(json.imageFileName);
            spriteType.frameWidth = Number(json.frameWidth);
            spriteType.frameHeight = Number(json.frameHeight);
            spriteType.frameCount = json.frameCount == undefined ? 1 : Number(json.frameCount);
            spriteType.data = json.data == undefined ? undefined : String(json.data);
            return spriteType;
        }

        public toSpriteType(index: number): SpriteType {
            let result = new SpriteType(index, this.frameWidth, this.frameHeight, this.frameCount);
            result.data = this.data;
            return result;
        }

    }

}
