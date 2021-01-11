module Tiley {

    export class Bounds implements IBounds {

        public readonly width: number;

        public readonly height: number;

        constructor(
            public readonly left: number,
            public readonly top: number,
            public readonly right: number,
            public readonly bottom: number
        ) {
            this.width = right - left + 1;
            this.height = bottom - top + 1;
        }

        public contains(x: number, y: number): boolean {
            return x >= this.left && y >= this.top && x <= this.right && y <= this.bottom;
        }

        public except(other: Bounds): IPoint[] {
            let result: IPoint[] = [];
            for (let x = this.left; x <= this.right; x++) {
                for (let y = this.top; y <= this.bottom; y++) {
                    if (!other.contains(x, y)) {
                        result.push({ x: x, y: y });
                    }
                }
            }
            return result;
        }

    }

}