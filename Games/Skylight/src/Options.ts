class Options {

    public soundEffects: boolean = true;

    public continuousFire: boolean = false;

    public unlocks: Unlocks[] = [];

    public borderTypeTriangle: BorderType = BorderType.reflect;

    public borderTypeMissile: BorderType = BorderType.solid;

    public borderTypePowerup: BorderType = BorderType.reflect;

    private constructor() {
    }

    public static load(): Options {
        var options = new Options();
        options.soundEffects = Options.getBoolean('options.soundEffects', options.soundEffects);
        options.continuousFire = Options.getBoolean('options.continuousFire', options.continuousFire);
        options.unlocks = Options.getArray('options.unlocks', options.unlocks);
        options.borderTypeTriangle = Options.getBorderType('options.borderTypeTriangle', options.borderTypeTriangle);
        options.borderTypeMissile = Options.getBorderType('options.borderTypeMissile', options.borderTypeMissile);
        options.borderTypePowerup = Options.getBorderType('options.borderTypePowerup', options.borderTypePowerup);
        return options;
    }

    public save() {
        Options.setBoolean('options.soundEffects', this.soundEffects);
        Options.setBoolean('options.continuousFire', this.continuousFire);
        Options.setArray('options.unlocks', this.unlocks);
        Options.setBorderType('options.borderTypeTriangle', this.borderTypeTriangle);
        Options.setBorderType('options.borderTypeMissile', this.borderTypeMissile);
        Options.setBorderType('options.borderTypePowerup', this.borderTypePowerup);
    }

    public isUnlocked(what: Unlocks): boolean {
        return this.unlocks.indexOf(what) != -1;
    }

    public setUnlocked(what: Unlocks, isUnlocked: boolean) {
        var existingIndex = this.unlocks.indexOf(what);
        if (existingIndex != -1) {
            this.unlocks.splice(existingIndex, 1);
        }
        if (isUnlocked) {
            this.unlocks.push(what);
        }
    }

    private static getBoolean(name: string, defaultValue: boolean): boolean {
        var value = localStorage.getItem(name);
        return value == null ? defaultValue : value == 'true';
    }

    private static setBoolean(name: string, value: boolean) {
        localStorage.setItem(name, value ? 'true' : 'false');
    }

    private static getArray<T>(name: string, defaultValue: T[]): T[] {
        var value = localStorage.getItem(name);
        return value == null ? defaultValue : <T[]>JSON.parse(value);
    }

    private static setArray<T>(name: string, value: T[]) {
        var encoded = JSON.stringify(value);
        localStorage.setItem(name, encoded);
    }

    private static getBorderType(name: string, defaultValue: BorderType): BorderType {
        var value = localStorage.getItem(name);
        if (value == 'solid') {
            return BorderType.solid;
        } else if (value == 'reflect') {
            return BorderType.reflect;
        } else if (value == 'phase') {
            return BorderType.phase;
        } else if (value == 'random') {
            return BorderType.random;
        } else {
            return defaultValue;
        }
    }

    private static setBorderType(name: string, value: BorderType) {
        localStorage.setItem(name, BorderType[value]);
    }

}