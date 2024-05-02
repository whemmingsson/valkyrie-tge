
const welcome = require('./shell/ui/welcome');
const about = require('./shell/ui/about');
const shellMenu = require('./shell/ui/menu');

const setupMenu = () => {
    shellMenu.register('About', () => {
        about.display();
    });
}

const run = () => {
    setupMenu();
    welcome.display();
    shellMenu.run();
};

run();