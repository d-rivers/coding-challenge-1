const { REGEX } = require('../constants');

const Navigation = class Navigation {
  constructor() {
    const t = this;

    t.line = 0;
  }

  validate(input) {
    const t = this;

    return new Promise((resolve) => {
      const response = {};

      if (t.line === 0) {
        response.valid = new RegExp(REGEX.POSITION).test(input);
        response.message = 'Positioning command is invalid.';
      } else {
        response.valid = new RegExp(REGEX.INSTRUCTION).test(input);
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

  positioning() {
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
