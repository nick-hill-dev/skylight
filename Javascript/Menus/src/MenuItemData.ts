module Menus {

    export class MenuItemData {

        public itemType: MenuItemType = MenuItemType.selectable;

        public text: string = '';

        public size: number = 1;

        public enabled: boolean = true;

        public choices: MenuItemChoice[] = [];

        public selectedIndex: number = -1;

        public onActivate: (context: Menu) => any = null;

    }

}