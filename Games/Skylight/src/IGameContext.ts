interface IGameContext {

    width: number;

    height: number;

    tick: number;

    addPlayer(template: PlayerTemplate, x: number, y: number, direction: Direction): Player;

    considerUnlock(what: Unlocks, description: string, test: () => boolean);

    notify(notice: Notice);

}