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
   * Enter 'controlstation' to begin manual entry.
   * 1st line: grid boundaries.
   * 2nd line: initial position.
   * 3rd line: instructions.
   *
   * Enter 'start' to begin processing
   * ships from input file.
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
   * Invokes positioning/instructions.
   * Toggles line.
   *
   * @param command
   * @param callback
   * @returns {Promise<*>}
   */
  async controlstation(command, callback) {
    const t = this;

    let methods = ['boundaries', 'position', 'instructions'];

    const validation = await Validations.controlstation(command, methods[t.line])
      .then(response => response)
      .catch(error => error);

    if (!validation.valid) {
      t.vorpal.activeCommand.log(validation.message);
      return callback();
    }

    methods = ['setboundries', 'positioning', 'instructions'];

    t[methods[t.line]](command);

    t.toggle();

    return callback();
  }

  /**
   * @description
   * Obtains contents of input file.
   * Validates input file.
   * Sets boundaries.
   * Promises all from formatted contents.
   *
   * @param args
   * @param callback
   */
  async start(args, callback) {
    const t = this;

    const input = await Helpers.readfile(`${__dirname}/input`, 'utf8')
      .then(response => response)
      .catch(error => error);

    if (input.code === 'ENOENT') {
      t.vorpal.activeCommand.log(input);
      callback();
    }

    const validate = await Validations.start(input)
      .then(response => response)
      .catch(error => error);

    if (!validate.valid) {
      t.vorpal.activeCommand.log(validate.message);
      callback();
    }

    t.setboundries(validate.data.boundaries);

    validate.data.commands.map(t.run.bind(t));

    callback();
  }
};

module.exports = StratumFive;
