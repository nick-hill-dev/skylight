namespace State {

    export class StateEngineOptions {

        public inputHandling: boolean = true;

        public backgroundColor: string = null;

        public ticking: boolean = false;

        public autoResizeCanvas: boolean = false;

        public constructor(public readonly canvas: HTMLCanvasElement) {
        }

    }

}