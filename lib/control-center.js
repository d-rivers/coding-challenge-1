const Navigation = require('./navigation');
const Ship = require('./ship');

const { REGEX } = require('../constants');

const ControlCenter = class ControlCenter extends Navigation {
  constructor(props) {
    super(props);

    const t = this;

    t.line = 0;
  }

  validate(command) {
    const t = this;

    return new Promise((resolve) => {
      const response = {};

      if (t.line === 0) {
        response.valid = new RegExp(REGEX.POSITION).test(command);
        response.message = 'Positioning command is invalid.';
      } else {
        response.valid = new RegExp(REGEX.INSTRUCTION).test(command);
        response.message = 'Instructional command is invalid.';
      }

      return resolve(response);
    });
  }

  toggle() {
    const t = this;

    if (t.line === 0) {
      t.line = 1;
    } else {
      t.line = 0;
    }
  }

  positioning(position) {
    const t = this;

    return new Promise(async (resolve) => {
      t.ship = new Ship({ position });

      const setup = await t.setup()
        .then(response => response)
        .catch(error => error);

      return resolve(setup);
    });
  }

  instructions(instructions) {
    const t = this;

    return new Promise(async (resolve) => {
      const move = await t.move(instructions)
        .then(response => response)
        .catch(error => error);

      if (!move.valid) {
        console.log(move.message);
        move.valid = true;
      }

      resolve(move);
    });
  }
};

module.exports = ControlCenter;
