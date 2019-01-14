const vorpal = require('vorpal')();
const ControlStation = require('./control-station');
const Validations = require('./validations');

const StratumFive = class StratumFive extends ControlStation {
  constructor(props) {
    super(props);

    const t = this;

    t.vorpal = vorpal;
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
      .action(t.action.bind(t));

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
  async action(command, callback) {
    const t = this;

    const validations = ['grid', 'position', 'instruction'];

    const validation = await Validations[validations[t.line]](command)
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
};

module.exports = StratumFive;
