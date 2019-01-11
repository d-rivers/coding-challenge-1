const Grid = require('./grid');
const Ship = require('./ship');

const { REGEX } = require('../constants');

const Navigation = class Navigation extends Grid {
  constructor(props) {
    super(props.grid);

    const t = this;

    t.line = 0;
    t.active = null;
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
      t.active = new Ship(position);

      const setup = await t.active
        .setup()
        .then(response => response)
        .catch(error => error);

      super.addship(t.active);

      return resolve(setup);
    });
  }

  instructions(instructions) {
    const t = this;

    return new Promise((resolve) => {
      t.active.move(instructions);

      resolve({ valid: true });
    });
  }
};

module.exports = Navigation;
