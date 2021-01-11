class ZoomableView {

    public viewWidth: number = 0;

    public viewHeight: number = 0;

    public currentView: ZoomPoint = { x: 0, y: 0, zoom: 0 };

    public targetView: ZoomPoint = { x: 0, y: 0, zoom: 0 };

    public zoomRange: Bounds = null;

    public zoomPower: number = 0;

    public viewMovementTicks: number = 5;

    public viewZoomTicks: number = 7;

    constructor(viewWidth: number, viewHeight: number, initialView: ZoomPoint, zoomPower: number, zoomRange: Bounds) {
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.currentView = { x: initialView.x, y: initialView.y, zoom: initialView.zoom };
        this.targetView = { x: initialView.x, y: initialView.y, zoom: initialView.zoom };
        this.zoomRange = zoomRange;
        this.zoomPower = zoomPower;
    }

    public tick() {
        var differenceView = new ZoomPoint(this.targetView.x - this.currentView.x, this.targetView.y - this.currentView.y, this.targetView.zoom - this.currentView.zoom);
        this.currentView.x += differenceView.x / this.viewMovementTicks;
        this.currentView.y += differenceView.y / this.viewMovementTicks;
        this.currentView.zoom += differenceView.zoom / this.viewZoomTicks;
    }

    public resize(newWidth: number, newHeight: number) {
        this.viewWidth = newWidth;
        this.viewHeight = newHeight;
    }

    public addX(amount: number) {
        this.targetView.x += amount;
    }

    public addY(amount: number) {
        this.targetView.y += amount;
    }

    public set(currentView: ZoomPoint, targetView: ZoomPoint) {
        this.currentView = currentView;
        this.targetView = targetView;
    }

    public setCenter(newX: number, newY: number) {
        this.targetView.x = newX;
        this.targetView.y = newY;
    }

    public setZoomLevel(newZoomLevel: number) {
        this.targetView.zoom = newZoomLevel;
    }

    public zoomAdd(amount: number) {
        this.targetView.zoom += amount;
        if (this.targetView.zoom < this.zoomRange.min) this.targetView.zoom = this.zoomRange.min;
        if (this.targetView.zoom > this.zoomRange.max) this.targetView.zoom = this.zoomRange.max;
    }

    public getZoomRatio(): number {
        return (this.currentView.zoom - this.zoomRange.min) / (this.zoomRange.max - this.zoomRange.min);
    }

    public worldToScreen(worldX: number, worldY: number): Point {
        var aspect = this.viewWidth / this.viewHeight;
        var zoom = Math.pow(this.zoomPower, this.zoomRange.max - this.currentView.zoom);
        var relX = worldX - this.currentView.x;
        var relY = worldY - this.currentView.y;
        var x = relX * zoom * this.viewWidth + this.viewWidth / 2;
        var y = aspect * relY * zoom * this.viewHeight + this.viewHeight / 2;
        return new Point(Math.floor(x), Math.floor(y));
    }

    public worldToScreenWidth(worldWidth: number): number {
        var zoom = Math.pow(this.zoomPower, this.zoomRange.max - this.currentView.zoom);
        var screenWidth = worldWidth * zoom * this.viewWidth;
        return Math.floor(screenWidth);
    }

    public worldToScreenHeight(worldHeight: number): number {
        var zoom = Math.pow(this.zoomPower, this.zoomRange.max - this.currentView.zoom);
        var screenHeight = worldHeight * zoom * this.viewHeight;
        return Math.floor(screenHeight);
    }

    public screenToWorld(screenX: number, screenY: number): Point {
        var aspect = this.viewWidth / this.viewHeight;
        var zoom = Math.pow(this.zoomPower, this.zoomRange.max - this.currentView.zoom);
        var x = (screenX / this.viewWidth - 0.5) / zoom + this.currentView.x;
        var y = ((screenY / this.viewHeight - 0.5) / aspect) / zoom + this.currentView.y;
        return new Point(x, y);
    }

    public screenToWorldWidth(screenWidth: number): number {
        var zoom = Math.pow(this.zoomPower, this.zoomRange.max - this.currentView.zoom);
        return screenWidth / this.viewWidth / zoom;
    }

    public screenToWorldHeight(screenHeight: number): number {
        var zoom = Math.pow(this.zoomPower, this.zoomRange.max - this.currentView.zoom);
        return screenHeight / this.viewHeight / zoom;
    }

}