class Keys {

    public down: number[] = [];

    public setKeyDown(key: number) {
        if (this.down.indexOf(key) == -1) {
            this.down.push(key);
        }
    }

    public setKeyUp(key: number) {
        var index = this.down.indexOf(key);
        if (index != -1) {
            this.down.splice(index, 1);
        }
    }

    public isKeyDown(key: number): boolean {
        var index = this.down.indexOf(key);
        return index != -1;
    }

}