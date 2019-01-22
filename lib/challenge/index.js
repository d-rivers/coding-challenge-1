const vorpal = require('vorpal')();
const es = require('event-stream');

const ControlStation = require('./control-station');
const Helpers = require('./helpers');
const Validations = require('./validations');

const Challenge = class Challenge extends ControlStation {
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

    vorpal
      .mode('controlstation')
      .description('Enter the user into a control station.')
      .delimiter('controlstation:')
      .action(t.controlstation.bind(t));

    vorpal
      .command('start', 'Sequentially process ships from input file.')
      .action(t.start.bind(t));

    vorpal
      .delimiter('challenge$')
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
      vorpal.activeCommand.log(validation.message);
      return callback();
    }

    methods = ['setboundaries', 'positioning', 'instructions'];

    t[methods[t.line]](command);

    if (methods[t.line] === 'instructions') {
      vorpal.activeCommand.log(t.output.join('\n'));
    }

    t.toggle();

    return callback();
  }

  /**
   * @description
   * Streams contents of input file.
   *
   * @param args
   * @param callback
   */
  start(args, callback) {
    const t = this;

    return Helpers
      .readstream(`${__dirname}/input`)
      .pipe(es.split())
      .pipe(es.map(t.run.bind(t)))
      .on('error', error => new Error(error))
      .on('end', t.end.bind({ output: t.output, callback }));
  }

  end() {
    const t = this;

    vorpal.activeCommand.log(t.output.join('\n'));
    t.callback();
  }
};

module.exports = Challenge;
