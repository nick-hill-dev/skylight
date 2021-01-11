interface CanvasRenderingContext2D {
    getRgba(r: number, g: number, b: number, a: number): string;
    resizeToFitWindow();
    clear(fillStyle: string);
    strokeColor(r: number, g: number, b: number, a: number);
    fillColor(r: number, g: number, b: number, a: number);
    drawCircle(x: number, y: number, radius: number);
    fillCircle(x: number, y: number, radius: number);
    setPixel(x: number, y: number);
    fillTextCenter(text: string, x: number, y: number);
    measureTextWrapped(text: string, maxWidth: number, fontSize: number, fontName: string): WrappedTextMetrics;
    fillTextWrapped(data: WrappedTextMetrics, x: number, y: number);
    startRenderingLoop<T>(callback: (context: CanvasRenderingContext2D, state: T) => void, state: T);
}

CanvasRenderingContext2D.prototype.resizeToFitWindow = function () {
    var canvas = this.canvas;
    canvas.style.position = 'absolute';
    canvas.style.overflow = 'hidden';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

CanvasRenderingContext2D.prototype.clear = function (fillStyle: string) {
    this.fillStyle = fillStyle;
    this.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
};

CanvasRenderingContext2D.prototype.getRgba = function (r: number, g: number, b: number, a: number): string {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
};

CanvasRenderingContext2D.prototype.strokeColor = function (r: number, g: number, b: number, a: number) {
    this.strokeStyle = this.getRgba(r, g, b, a);
};

CanvasRenderingContext2D.prototype.fillColor = function (r: number, g: number, b: number, a: number) {
    this.fillStyle = this.getRgba(r, g, b, a);
};

CanvasRenderingContext2D.prototype.drawCircle = function (x: number, y: number, radius: number) {
    this.beginPath();
    this.arc(x, y, radius, 0, 2 * Math.PI);
    this.stroke();
};

CanvasRenderingContext2D.prototype.fillCircle = function (x: number, y: number, radius: number) {
    this.beginPath();
    this.arc(x, y, radius, 0, 2 * Math.PI);
    this.fill();
};

CanvasRenderingContext2D.prototype.setPixel = function (x: number, y: number) {
    this.fillRect(x, y, 1, 1);
};

CanvasRenderingContext2D.prototype.fillTextCenter = function (text: string, x: number, y: number) {
    var labelWidth = this.measureText(text).width;
    this.fillText(text, Math.floor(x - labelWidth / 2), y);
};

CanvasRenderingContext2D.prototype.measureTextWrapped = function (text: string, maxWidth: number, fontSize: number, fontName: string): WrappedTextMetrics {

    // Create some text metrics
    var metrics = new WrappedTextMetrics();
    metrics.fontName = fontName;
    metrics.fontSize = fontSize;

    // Enumerate each word in the specified text
    this.font = fontSize + 'px ' + fontName;
    var testLine = '';
    for (var word of text.split(' ')) {
        testLine = testLine == '' ? word : testLine + ' ' + word;
        var testWidth = this.measureText(testLine).width;
        if (testWidth > maxWidth) {

            // Add line
            var lineToUse = testLine.substring(0, testLine.length - word.length - 1);
            metrics.lines.push(lineToUse);
            metrics.width = Math.max(metrics.width, testWidth);
            metrics.height += fontSize;
            testLine = word;
        }
    }

    // Add last line
    var testWidth = this.measureText(testLine).width;
    metrics.lines.push(testLine);
    metrics.width = Math.max(metrics.width, testWidth);
    metrics.height += fontSize;
    return metrics;
};

CanvasRenderingContext2D.prototype.fillTextWrapped = function (data: WrappedTextMetrics, x: number, y: number) {
    this.font = data.fontSize + 'px ' + data.fontName;
    for (var line of data.lines) {
        this.fillText(line, x, y);
        y += data.fontSize;
    }
};

CanvasRenderingContext2D.prototype.startRenderingLoop = function <T>(callback: (context: CanvasRenderingContext2D, state: T) => void, state: T) {
    var context = this;
    var renderLoop = function () {
        window.requestAnimationFrame(renderLoop);
        callback(context, state);
    }
    renderLoop();
};