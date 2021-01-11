module Tiley {

    export class SquareMapLayer extends MapLayer {

        public createMapLayer(): MapLayer {
            return new SquareMapLayer();
        }

    }

}