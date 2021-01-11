abstract class Entity {

    public constructor(public x: number, public y: number, public direction: Direction, public size: number, public speed: number) {
    }

    public abstract move(areaWidth: number, areaHeight: number, border: BorderType);

}