const vorpal = require('vorpal')();
const Navigation = require('./lib/navigation');

const StratumFive = class StratumFive {
  constructor() {
    const t = this;

    t.navigation = new Navigation({});
  }

  init() {
    const t = this;

    vorpal
      .mode('navigation')
      .description('Enter the user into navigation mode.')
      .delimiter('navigation:')
      .action(t.action.bind(t));

    vorpal
      .delimiter('StratumFive$')
      .show();
  }

  async action(command, callback) {
    const t = this;
    const { activeCommand } = vorpal;

    const validation = await t.navigation
      .validate(command)
      .then(response => response)
      .catch(error => error);

    if (!validation.valid) {
      callback();
    }

    const next = t.navigation.line === 0 ? 'positioning' : 'instructions';

    const exe = await t.navigation[next](command)
      .then(response => response)
      .catch(error => error);

    activeCommand.log('exe', exe);

    t.navigation.toggle();

    callback();
  }
};

const stratumFive = new StratumFive();

stratumFive.init();
