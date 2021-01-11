module Menus {

    export class MenuItem {

        public data: MenuItemData = new MenuItemData();

        public constructor(text: string) {
            this.data.text = text;
        }

        public enabled(enabled: boolean): MenuItem {
            this.data.enabled = enabled;
            return this;
        }

        public toggleable(): MenuItem {
            this.choices([new MenuItemChoice('Yes', true), new MenuItemChoice('No', false)]);
            return this;
        }

        public choices(choices: MenuItemChoice[]): MenuItem {
            for (var choice of choices) {
                this.data.choices.push(choice);
            }
            this.data.selectedIndex = 1;
            this.data.onActivate = () => {
                this.data.selectedIndex = (this.data.selectedIndex + 1) % this.data.choices.length;
                return null;
            };
            return this;
        }

        public value(value: any): MenuItem {
            this.data.selectedIndex = -1;
            for (var i = 0; i < this.data.choices.length; i++) {
                if (this.data.choices[i].value == value) {
                    this.data.selectedIndex = i;
                    return this;
                }
            }
            return this;
        }

        public asParagraph(): MenuItem {
            this.data.itemType = MenuItemType.paragraph;
            return this;
        }

        public size(ratio: number) {
            this.data.size = ratio;
        }

        public whenActivated<T>(callback: (context: Menu) => T): MenuItem {
            this.data.onActivate = callback;
            return this;
        }

        public canHighlight(): boolean {
            return (this.data.itemType == MenuItemType.selectable && this.data.enabled);
        }

        public getSelectedChoice(): MenuItemChoice {
            return this.data.selectedIndex < 0 || this.data.selectedIndex >= this.data.choices.length
                ? null
                : this.data.choices[this.data.selectedIndex];
        }

    }

}