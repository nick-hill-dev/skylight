module State {

    export abstract class State {

        public enterState(context: Context) {
        }

        public exitState() {
        }

        public handleMouseDown(e: MouseEvent) {
        }

        public handleMouseMove(e: MouseEvent) {
        }

        public handleMouseUp(e: MouseEvent) {
        }

        public handleLeftClick(e: MouseEvent) {
        }

        public handleRightClick(e: PointerEvent) {
        }

        public handleMouseWheel(e: MouseWheelEvent) {
        }

        public handleKeyDown(e: KeyboardEvent) {
        }

        public handleKeyUp(e: KeyboardEvent) {
        }

        public handleKeyPress(e: KeyboardEvent) {
        }

        public handleResize(e: UIEvent) {
        }

        public regularRendering(context: CanvasRenderingContext2D) {
        }

        /**
         * Called 60 times a second, if regular processing has been enabled.
         * @param elapsed The amount of time that has elapsed since the previous call, in seconds.
         */
        public regularProcessing(elapsed: number) {
        }

    }

}