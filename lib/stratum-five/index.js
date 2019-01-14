const vorpal = require('vorpal')();
const ControlCenter = require('./control-center');

const StratumFive = class StratumFive extends ControlCenter {
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
      .mode('controlcenter')
      .description('Enter the user into a control center.')
      .delimiter('controlcenter:')
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

    const next = t.line === 0 ? 'positioning' : 'instructions';

    const exe = await t[next](command)
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
