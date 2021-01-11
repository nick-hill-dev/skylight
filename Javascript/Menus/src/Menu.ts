module Menus {

    export class Menu {

        public title: string = 'Menu';

        public subtitle: string = '';

        public items: MenuItem[] = [];

        public selectedIndex: number = -1;

        public onMove: () => void = null;

        public onSelect: () => void = null;

        private tick: number = 0;

        public addItem(text: string): MenuItem {
            var item = new MenuItem(text);
            this.items.push(item);
            return item;
        }

        public highlightableCount(): number {
            var result = 0;
            for (var item of this.items) {
                if (item.canHighlight()) {
                    result++;
                }
            }
            return result;
        }

        public selectFirstItem() {
            this.selectedIndex = -1;
            if (this.highlightableCount() > 0) {
                do {
                    this.selectedIndex++;
                } while (!this.items[this.selectedIndex].canHighlight())
            }
        }

        public handleKeyDown(e: KeyboardEvent) {

            // Handle up key
            var canHighlightOneMenuItem = this.highlightableCount() > 0;
            if (e.key == 'ArrowUp') {
                if (canHighlightOneMenuItem) {
                    do {
                        this.selectedIndex--;
                        if (this.selectedIndex < 0) {
                            this.selectedIndex = this.items.length - 1;
                        }
                    } while (!this.items[this.selectedIndex].canHighlight());

                    // Invoke custom notification handler
                    if (this.onMove != null) {
                        this.onMove();
                    }
                }
            }

            // Handle down key
            if (e.key == 'ArrowDown') {
                if (canHighlightOneMenuItem) {
                    do {
                        this.selectedIndex++;
                        if (this.selectedIndex >= this.items.length) {
                            this.selectedIndex = 0;
                        }
                    } while (!this.items[this.selectedIndex].canHighlight());

                    // Invoke custom notification handler
                    if (this.onMove != null) {
                        this.onMove();
                    }
                }
            }

            // Handle select key
            if (e.key == ' ') {
                var item = this.items[this.selectedIndex];

                // Invoke custom notification handler
                if (item.data.itemType == MenuItemType.selectable && this.onSelect != null) {
                    this.onSelect();
                }

                // Invoke custom menu item activation handler
                if (item.data.onActivate !== null) {
                    var result = item.data.onActivate(this);
                    if (result != null) {
                        return result;
                    }
                }
            }
            return null;
        }

        public render(context: CanvasRenderingContext2D) {
            this.tick++;

            const LeftMargin: number = 60;
            const TopMargin: number = 75;
            const RightMargin: number = 60;
            const TitleFontSize: number = 48;
            const SubtitleFontSize: number = 32;
            const ItemFontSize: number = 27;
            const ItemPadding: number = 6;
            const ItemSpacing: number = 12;

            // Clear screen
            context.fillStyle = 'black';
            context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);

            // Draw the title
            context.textBaseline = 'top';
            context.textAlign = 'left';
            context.fillStyle = 'white';
            var itemWidth = context.canvas.clientWidth - LeftMargin - RightMargin;
            var y = TopMargin;
            if (this.title != null && this.title != '') {
                var wrappedMetrics = context.measureTextWrapped(this.title, itemWidth, TitleFontSize, 'Verdana');
                context.fillTextWrapped(wrappedMetrics, LeftMargin, y);
                y += wrappedMetrics.height + ItemSpacing;
            }

            // Draw subtitle
            if (this.subtitle != null && this.subtitle != '') {
                var wrappedMetrics = context.measureTextWrapped(this.subtitle, itemWidth, SubtitleFontSize, 'Verdana');
                context.fillTextWrapped(wrappedMetrics, LeftMargin, y);
                y += wrappedMetrics.height + ItemSpacing;
            }

            // Draw the menu items
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];

                // Measure value
                var selectedChoice = item.getSelectedChoice();
                var maxItemTextWidth = itemWidth - 16;
                var itemValueWidth = 0;
                if (selectedChoice != null) {
                    itemValueWidth = context.measureText(selectedChoice.name).width;
                    maxItemTextWidth -= itemValueWidth - ItemPadding;
                }

                // Measure item text
                var fontSize = Math.floor(item.data.size * ItemFontSize);
                var wrappedMetrics = context.measureTextWrapped(item.data.text, maxItemTextWidth, fontSize, 'Arial');

                // Draw the rectangles around the menu item
                if (item.data.itemType == MenuItemType.selectable) {
                    var gradient = Math.floor(130 + 30 * Math.sin(this.tick / 10));
                    context.strokeStyle = this.selectedIndex == i ? 'white' : '#666';
                    context.fillStyle = this.selectedIndex == i ? new Color(gradient, gradient, gradient).toString() : 'black';
                    context.fillRect(LeftMargin, y, itemWidth, wrappedMetrics.height + ItemPadding * 2);
                    context.strokeRect(LeftMargin, y, itemWidth, wrappedMetrics.height + ItemPadding * 2);
                }

                // Render menu item text
                context.fillStyle = item.data.itemType == MenuItemType.selectable && !item.data.enabled ? '#444' : 'white';
                context.fillTextWrapped(wrappedMetrics, LeftMargin + 16, y + ItemPadding);

                // Render menu item value
                if (selectedChoice != null) {
                    context.fillStyle = '#444';
                    context.fillText(selectedChoice.name, LeftMargin + itemWidth - itemValueWidth - ItemPadding, y + ItemPadding);
                }
                y += ItemPadding + wrappedMetrics.height + ItemPadding + ItemSpacing;
            }
        }

    }

}