const vorpal = require('vorpal')();
const ControlStation = require('./control-station');

const StratumFive = class StratumFive extends ControlStation {
  constructor(props) {
    super(props);

    const t = this;

    t.vorpal = vorpal;
  }

  /**
   * @description
   * Set up vorpal cmd
   *
   * Enter 'controlcenter' to begin positioning
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

    const validation = await t.validate(command)
      .then(response => response)
      .catch(error => error);

    if (!validation.valid) {
      t.vorpal.activeCommand.log(validation.message);
      return callback();
    }

    const next = t.line ? 'positioning' : 'instructions';

    const exe = await t[next](command)
      .then(response => response)
      .catch(error => error);

    if (!exe.valid) {
      return callback();
    }

    t.line = !t.line;

    return callback();
  }
};

module.exports = StratumFive;
