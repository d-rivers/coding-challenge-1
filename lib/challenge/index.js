const ControlStation = require('./control-station');
const Helpers = require('./helpers');

const Challenge = class Challenge extends ControlStation {
  constructor(props) {
    super(props);

    const t = this;

    t.vorpal = props.vorpal() || null;
    t.es = props.es || null;
  }

  /**
   * @description
   * Set up vorpal
   *
   * Enter 'start' to begin processing
   * ships from input file.
   */
  init() {
    const t = this;

    t.vorpal
      .command('start', 'Sequentially process ships from input file.')
      .action(t.start.bind(t));

    t.vorpal
      .delimiter('challenge$')
      .show();
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
      .pipe(t.es.split())
      .pipe(t.es.map(t.run.bind(t)))
      .on('error', error => new Error(error))
      .on('end', () => t.end(callback));
  }

  end(callback) {
    const t = this;

    t.vorpal.activeCommand.log(t.output.join('\n'));
    callback();
  }
};

module.exports = Challenge;
