function randomDirection(): Direction {
    return <Direction>Math.floor(Math.random() * 4);
}

function randomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(): Color {
    return new Color(randomBetween(0, 255), randomBetween(0, 255), randomBetween(0, 255));
}

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    var distanceX = x2 - x1;
    var distanceY = y2 - y1;
    return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
}

window.onload = () => {

    // Set state engine options
    let canvas = <HTMLCanvasElement>document.getElementById('game-canvas');
    let options = new State.StateEngineOptions(canvas);
    options.backgroundColor = '#000';
    options.ticking = true;

    // Start the state engine
    let context = new GameData();
    context.stateEngine = new State.StateEngine(options, context);
    let state = new LoadingState();
    context.stateEngine.start(state);
};