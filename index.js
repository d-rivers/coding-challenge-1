const vorpal = require('vorpal')();
const ControlCenter = require('./lib/control-center');

const StratumFive = class StratumFive extends ControlCenter {
  constructor(props) {
    super(props);

    const t = this;

    t.vorpal = props.vorpal;
  }

  init() {
    const t = this;

    t.vorpal
      .mode('controlcenter')
      .description('Enter the user into a control centre.')
      .delimiter('controlcenter:')
      .action(t.action.bind(t));

    t.vorpal
      .delimiter('StratumFive$')
      .show();
  }

  async action(command, callback) {
    const t = this;

    const validation = await t.validate(command)
      .then(response => response)
      .catch(error => error);

    if (!validation.valid) {
      t.vorpal.activeCommand.log(validation.message);
      return callback();
    }

    const next = t.line === 0 ? 'positioning' : 'instructions';

    const exe = await t[next](command)
      .then(response => response)
      .catch(error => error);

    if (!exe.valid) {
      t.vorpal.activeCommand.log(exe.message);
      return callback();
    }

    t.toggle();

    return callback();
  }
};

const stratumFive = new StratumFive({
  vorpal,
  grid: { boundaries: [50, 50] },
});

stratumFive.init();
