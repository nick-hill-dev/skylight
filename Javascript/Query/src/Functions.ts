function $id(id: string): HTMLElement | null {
    return document.getElementById(id);
}

function $name(name: string): HTMLElement | null {
    let elements = document.getElementsByName(name);
    return elements.length == 0 ? null : elements[0];
}

function $names(name: string): HTMLElement[] {
    let result: HTMLElement[] = [];
    let elements = document.getElementsByName(name);
    for (let i = 0; i < elements.length; i++) {
        result.push(elements[i]);
    }
    return result;
}

function $classes(name: string): Element[] {
    let result: Element[] = [];
    let elements = document.getElementsByClassName(name);
    for (let i = 0; i < elements.length; i++) {
        result.push(elements[i]);
    }
    return result;
}

function $first<T>(list: T[], f: (item: T) => boolean, errorMessage: string | undefined = undefined): T {
    for (let i in list) {
        let currentItem = list[i];
        if (f(currentItem)) {
            return currentItem;
        }
    }
    throw errorMessage === undefined ? 'Could not find the item.' : errorMessage;
}

function $firstOrNull<T>(list: T[], f: (item: T) => boolean): T | null {
    for (let i in list) {
        let currentItem = list[i];
        if (f(currentItem)) {
            return currentItem;
        }
    }
    return null;
}

function $any<T>(list: T[], f: (item: T) => boolean): boolean {
    for (let i in list) {
        let currentItem = list[i];
        if (f(currentItem)) {
            return true;
        }
    }
    return false;
}

function $all<T>(list: T[], f: (item: T) => boolean): boolean {
    for (let i in list) {
        let currentItem = list[i];
        if (!f(currentItem)) {
            return false;
        }
    }
    return true;
}

function $where<T>(list: T[], f: (item: T) => boolean): T[] {
    let result: T[] = [];
    for (let i in list) {
        let currentItem = list[i];
        if (f(currentItem)) {
            result.push(currentItem);
        }
    }
    return result;
}

function $min<T>(list: T[], f: (item: T) => number): number {
    let first = true;
    let result = 0;
    for (let i in list) {
        let currentItem = list[i];
        if (first) {
            result = f(currentItem);
            first = false;
        } else {
            result = Math.min(result, f(currentItem));
        }
    }
    return result;
}

function $max<T>(list: T[], f: (item: T) => number): number {
    let first = true;
    let result = 0;
    for (let i in list) {
        let currentItem = list[i];
        if (first) {
            result = f(currentItem);
            first = false;
        } else {
            result = Math.max(result, f(currentItem));
        }
    }
    return result;
}

function $sum<T>(list: T[], f: (item: T) => number): number {
    let result = 0;
    for (let i in list) {
        let currentItem = list[i];
        result += f(currentItem);
    }
    return result;
}

function $select<T, U>(list: T[], f: (item: T) => U): U[] {
    let result: U[] = [];
    for (let i in list) {
        let currentItem = list[i];
        let selection = f(currentItem);
        result.push(selection);
    }
    return result;
}

function $distinct<T, U>(list: T[], f: (item: T) => U): U[] {
    let result: U[] = [];
    for (let i in list) {
        let currentItem = list[i];
        let currentValue = f(currentItem);
        if (result.indexOf(currentValue) == -1) {
            result.push(currentValue);
        }
    }
    return result;
}

function $notNullIf<T>(item: T, f: (item: T) => boolean): T | null {
    return f(item) ? item : null;
}

function $arrayToObject<T>(list: T[], keyName: string, valueName: string) {
    let result = [];
    for (let itemKey in list) {
        let itemValue = list[itemKey];
        let convertedItem: any = {};
        convertedItem[keyName] = itemKey;
        convertedItem[valueName] = itemValue;
        result.push(convertedItem);
    }
    return result;
}