import output from '../../core/io/output.js';
import prompt from '../../core/io/prompt.js';

const EXIT_OPTION = 'x';

class Menu {
    items: {};
    title: string;
    constructor(title: string) {
        this.items = {};
        this.title = title;
    }

    display() {
        const toArr = (obj: any) => {
            return Object.keys(obj).map((key) => obj[key]);
        }

        output.default("\n" + (this.title ?? 'Menu'));
        toArr(this.items).forEach((item) => { output.default(` ${item.opt}. ${item.text}`); });
    }

    run() {
        let choice = '';
        while (true && choice !== EXIT_OPTION) {
            this.display();
            // TODO: This prompt input chars should be read from the game file
            choice = prompt(':> ');

            if (!this.items[choice]) {
                // TODO: This text should be read from the game file
                output.default('Invalid choice. Please try again.\n');
                continue;
            }

            this.items[choice].action();
        }
    }

    register(opt: string, text: string, action: () => void) {
        this.items[opt] = { opt, text, action };
    }
}

export { Menu, EXIT_OPTION };