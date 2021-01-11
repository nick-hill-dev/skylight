module State {

    export class StateEngine {

        private state: State = null;

        private lastFrameTime: Date = null;

        public constructor(private readonly options: StateEngineOptions, public readonly context: Context) {
        }

        public start<S extends State>(firstState: S) {

            // Assign canvas to the context
            let canvas = this.options.canvas;
            this.context.canvas = canvas;

            // Attach event handlers
            if (this.options.inputHandling) {

                // Mouse events
                canvas.addEventListener('mousedown', (e: MouseEvent) => this.handleMouseDown(e), false);
                canvas.addEventListener('mousemove', (e: MouseEvent) => this.handleMouseMove(e), false);
                canvas.addEventListener('mouseup', (e: MouseEvent) => this.handleMouseUp(e), false);
                canvas.addEventListener('click', (e: MouseEvent) => this.handleLeftClick(e), false);
                canvas.addEventListener('contextmenu', (e: PointerEvent) => this.handleRightClick(e), false);
                document.addEventListener('wheel', (e: WheelEvent) => this.handleMouseWheel(e), false);

                // Keyboard events
                document.addEventListener('keydown', (e: KeyboardEvent) => this.handleKeyDown(e), false);
                document.addEventListener('keyup', (e: KeyboardEvent) => this.handleKeyUp(e), false);
                document.addEventListener('keypress', (e: KeyboardEvent) => this.handleKeyPress(e), false);

                // Resize event
                window.addEventListener('resize', (e: UIEvent) => this.handleResize(e), false);
            }

            // Resize canvas if necessary
            if (this.options.autoResizeCanvas) {
                this.resizeCanvas();
            }

            // Initial state
            this.changeState(firstState);

            // Start regular processing
            if (this.options.ticking) {
                setInterval(() => this.regularProcessing(), 16.6666667);
            }

            // Start regular rendering
            if (this.options.canvas !== null) {
                let canvasContext = this.options.canvas.getContext('2d');
                let thisClass = this;
                let renderLoop = function () {
                    window.requestAnimationFrame(renderLoop);
                    thisClass.regularRendering(canvasContext);
                }
                renderLoop();
            }
        }

        public changeState(newState: State) {
            if (this.state != null) {
                this.state.exitState();
            }
            this.state = newState;
            if (this.state != null) {
                this.state.enterState(this.context);
            }
        }

        private handleMouseDown(e: MouseEvent) {
            if (this.state != null) {
                this.state.handleMouseDown(e);
            }
            e.preventDefault();
        }

        private handleMouseMove(e: MouseEvent) {
            if (this.state != null) {
                this.state.handleMouseMove(e);
            }
            e.preventDefault();
        }

        private handleMouseUp(e: MouseEvent) {
            if (this.state != null) {
                this.state.handleMouseUp(e);
            }
            e.preventDefault();
        }

        private handleLeftClick(e: MouseEvent) {
            if (this.state != null) {
                this.state.handleLeftClick(e);
            }
            e.preventDefault();
        }

        private handleRightClick(e: PointerEvent) {
            if (this.state != null) {
                this.state.handleRightClick(e);
            }
            e.preventDefault();
        }

        private handleMouseWheel(e: WheelEvent) {
            if (this.state != null) {
                this.state.handleMouseWheel(e);
            }
            e.preventDefault();
        }

        private handleKeyDown(e: KeyboardEvent) {
            if (this.state != null) {
                this.state.handleKeyDown(e);
            }
            e.preventDefault();
        }

        private handleKeyUp(e: KeyboardEvent) {
            if (this.state != null) {
                this.state.handleKeyUp(e);
            }
            e.preventDefault();
        }

        private handleKeyPress(e: KeyboardEvent) {
            if (this.state != null) {
                this.state.handleKeyPress(e);
            }
            e.preventDefault();
        }

        private handleResize(e: UIEvent) {
            if (this.options.autoResizeCanvas) {
                this.resizeCanvas();
            }
            if (this.state != null) {
                this.state.handleResize(e);
            }
            e.preventDefault();
        }

        private regularProcessing() {
            if (this.state != null) {
                let currentFrameTime = new Date();
                if (this.lastFrameTime == null) {
                    this.lastFrameTime = currentFrameTime;
                }
                let duration = (currentFrameTime.getTime() - this.lastFrameTime.getTime()) / 1000;
                this.state.regularProcessing(duration);
                this.lastFrameTime = currentFrameTime;
            }
        }

        private regularRendering(canvasContext: CanvasRenderingContext2D) {

            // Clear the canvas if necessary
            if (this.options.backgroundColor != null) {
                canvasContext.fillStyle = this.options.backgroundColor;
                canvasContext.fillRect(0, 0, canvasContext.canvas.clientWidth, canvasContext.canvas.clientHeight);
            }

            // State rendering
            if (this.state != null) {
                this.state.regularRendering(canvasContext);
            }
        }

        private resizeCanvas() {
            let canvas = this.context.canvas;
            canvas.style.position = 'absolute';
            canvas.style.overflow = 'hidden';
            canvas.style.left = '0';
            canvas.style.top = '0';
            canvas.style.background = 'black';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

    }

}