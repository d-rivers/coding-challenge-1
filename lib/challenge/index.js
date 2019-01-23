const es = require('event-stream');

const ControlStation = require('./control-station');
const Helpers = require('./helpers');

const Challenge = class Challenge extends ControlStation {
  /**
   * @description
   * Streams contents of input file.
   */
  start() {
    const t = this;

    return Helpers
      .readstream(`${__dirname}/input`)
      .pipe(es.split())
      .pipe(es.map(t.run.bind(t)))
      .on('error', error => new Error(error));
  }
};

module.exports = Challenge;
