const firstline = require('firstline');

const { REGEX } = require('./constants');

const Validations = Object.create({});

const store = Object.create({
  i: -2,
  boundaries: true,
  positioning: true,
});

/**
 * @description
 * Validates manual input.
 *
 * @param input
 * @param type
 * @returns {Promise<any>}
 */
Validations.controlstation = (input, type) => new Promise((resolve) => {
  switch (type) {
    case 'boundaries':
      return resolve({
        valid: Validations.boundaries(input),
        message: `${input} is an invalid boundary.`,
      });
    case 'position':
      return resolve({
        valid: Validations.regex(input, REGEX.POSITION),
        message: `${input} is an invalid position.`,
      });
    case 'instructions':
      return resolve({
        valid: Validations.regex(input, REGEX.INSTRUCTION),
        message: `${input} are invalid instructions.`,
      });
    default:
      return resolve({ valid: false });
  }
});

/**
 * @description
 * Validates input file.
 * Skips valid instructions when position is invalid.
 *
 * @param line
 * @returns {Promise<any>}
 */
Validations.start = line => new Promise((resolve) => {
  const result = {};

  store.i += 1;

  switch (true) {
    case store.i === -1:
      result.method = 'setboundaries';
      result.valid = true;
      break;
    case store.i % 3 === 0:
      result.method = 'positioning';
      result.valid = Validations.regex(line, REGEX.POSITION);
      break;
    case store.i % 3 === 1 && store.positioning:
      result.method = 'instructions';
      result.valid = Validations.regex(line, REGEX.INSTRUCTION);
      break;
    default:
      result.valid = true;
      break;
  }

  store.valid = !(result.method === 'positioning' && !result.valid);

  resolve(result);
});

/**
 * @description
 * Validates the initial input for grid boundaries.
 *
 * @param command
 */
Validations.boundaries = async (command) => {
  const boundaries = command || await firstline(`${__dirname}/input`);
  const array = boundaries.split(' ');
  const max = Math.max(...array);
  const nan = Number.isNaN(max);

  store.boundaries = boundaries;

  switch (true) {
    case array.length !== 2:
      return false;
    case nan:
      return false;
    case max > 50:
      return false;
    default:
      return true;
  }
};

/**
 * @description
 * Validates the command from regex.
 *
 * @param command
 * @param regex
 */
Validations.regex = (command, regex) => new RegExp(regex).test(command);

module.exports = Validations;
