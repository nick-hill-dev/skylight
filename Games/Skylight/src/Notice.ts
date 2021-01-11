class Notice {

    public constructor(public text: string, public outlineColor: string, public backgroundColor: string, public foregroundColor: string, public endTick: number) {
    }

    public static createRedNotice(text: string, endTick: number): Notice {
        return new Notice(text,
            new Color(255, 170, 170).toString(),
            new Color(100, 30, 30).toString(),
            'white',
            endTick);
    }

    public static createGreenNotice(text: string, endTick: number): Notice {
        return new Notice(text,
            new Color(170, 255, 170).toString(),
            new Color(30, 100, 30).toString(),
            'white',
            endTick);
    }

    public static createBlueNotice(text: string, endTick: number): Notice {
        return new Notice(text,
            new Color(170, 170, 255).toString(),
            new Color(30, 30, 100).toString(),
            'white',
            endTick);
    }

    public static createWhiteNotice(text: string, endTick: number): Notice {
        return new Notice(text,
            new Color(255, 255, 255).toString(),
            new Color(100, 100, 100).toString(),
            'white',
            endTick);
    }

    public static createBlackNotice(text: string, endTick: number) {
        return new Notice(text,
            new Color(0, 0, 0).toString(),
            new Color(30, 30, 30).toString(),
            'white',
            endTick);
    }

    public render(context: CanvasRenderingContext2D, left: number, top: number, width: number, height: number) {
        const Padding: number = 4;
        context.fillStyle = this.backgroundColor;
        context.fillRect(left, top, width, height);
        context.strokeStyle = this.outlineColor;
        context.strokeRect(left, top, width, height);
        context.fillStyle = this.foregroundColor;
        context.font = Math.floor(height * 0.7) + 'px Verdana';
        context.textBaseline = 'top';
        context.fillText(this.text, left + Padding, top + Padding);
    }

}