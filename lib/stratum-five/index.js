const ControlStation = require('./control-station');
const Helpers = require('./helpers');
const Validations = require('./validations');

const StratumFive = class StratumFive extends ControlStation {
  constructor(props) {
    super(props);

    const t = this;

    t.line = 0;
  }

  /**
   * @description
   * Set up vorpal cmd
   *
   * Enter 'controlstation' to begin positioning
   * & instructional commands.
   */
  init() {
    const t = this;

    t.vorpal
      .mode('controlstation')
      .description('Enter the user into a control station.')
      .delimiter('controlstation:')
      .action(t.controlstation.bind(t));

    t.vorpal
      .command('start', 'Sequentially process ships from input file.')
      .action(t.start.bind(t));

    t.vorpal
      .delimiter('StratumFive$')
      .show();
  }

  /**
   * @description
   * Toggles the active command type.
   *
   * 0: grid boundary assignment
   * 1: ship initial positioning
   * 2: ship instructions
   */
  toggle() {
    const t = this;

    if (t.line < 2) {
      t.line += 1;
    } else {
      t.line = 1;
    }
  }

  /**
   * @description
   * Invokes command validation.
   * Invokes positioning/instructions promises.
   * Toggles line to determine active command type.
   *
   * @param command
   * @param callback
   * @returns {Promise<*>}
   */
  async controlstation(command, callback) {
    const t = this;

    const validations = ['boundaries', 'position', 'instructions'];

    const validation = await Validations.controlstation(command, validations[t.line])
      .then(response => response)
      .catch(error => error);

    if (!validation.valid) {
      t.vorpal.activeCommand.log(validation.message);
      return callback();
    }

    const props = ['setboundries', 'positioning', 'instructions'];

    const exe = await t[props[t.line]](command)
      .then(response => response)
      .catch(error => error);

    if (!exe.valid) {
      return callback();
    }

    t.toggle();

    return callback();
  }

  /**
   * @param args
   * @param callback
   */
  async start(args, callback) {
    const t = this;

    const input = await Helpers.readfile(`${__dirname}/input`, 'utf8')
      .then(response => response)
      .catch(error => error);

    if (!input) throw new Error(input);

    t.vorpal.activeCommand.log(input);

    const validate = await Validations.start(input)
      .then(response => response)
      .catch(error => error);

    if (!validate.valid) {
      t.vorpal.activeCommand.log(validate.message);
      callback();
    }

    console.log(validate);

    callback();
  }
};

module.exports = StratumFive;
