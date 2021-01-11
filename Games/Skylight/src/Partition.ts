class Partition<T> {

    private items: Array<{ key: T; value: number }> = [];

    public Add(item: T, size: number) {
        if (size <= 0) {
            throw 'Size must be greater than or equal to 1.';
        }
        this.total += size;
        this.items.push({ key: item, value: size });
    }

    public total: number = 0;

    public select(value: number): T {
        var cursor = 0;
        for (var item of this.items) {
            cursor += item.value;
            if (cursor > value) return item.key;
        }
        throw 'Could not select anything in the partition. The value is out of range.';
    }

}