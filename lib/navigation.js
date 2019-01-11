const Grid = require('./grid');
const Ship = require('./ship');

const { REGEX } = require('../constants');

const Navigation = class Navigation extends Grid {
  constructor(props) {
    super(props.grid);

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

  async positioning(position) {
    const t = this;
    const ship = new Ship(position);

    await ship
      .setup()
      .then(response => response)
      .catch(error => error);

    super.addShip(ship);

    return new Promise((resolve, reject) => {
      resolve('positioned');
    });
  }

  instructions() {
    return new Promise((resolve, reject) => {
      resolve('instructed');
    });
  }
};

module.exports = Navigation;
