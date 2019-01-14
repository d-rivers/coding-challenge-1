const Validations = Object.create({});

const { REGEX } = require('./constants');

/**
 * @description
 * Validates the initial input for grid boundaries.
 *
 * @param command
 * @returns {Promise<any>}
 */
Validations.grid = command => new Promise((resolve) => {
  const array = command.split(' ');
  const max = Math.max(...array);
  const nan = Number.isNaN(max);

  switch (true) {
    case array.length !== 2:
      return resolve({
        valid: false,
        message: 'To create a grid, you need two coordinates.',
      });
    case nan:
      return resolve({
        valid: false,
        message: 'Ensure your coordinates are numbers.',
      });
    case max > 50:
      return resolve({
        valid: false,
        message: 'A grid coordinate cannot exceed 50.',
      });
    default:
      return resolve({ valid: true });
  }
});

/**
 * @description
 * Validates the positioning command.
 *
 * @param command
 * @returns {Promise<any>}
 */
Validations.position = command => new Promise((resolve) => {
  const valid = new RegExp(REGEX.POSITION).test(command);

  if (!valid) {
    return resolve({
      valid: false,
      message: 'Positioning command is invalid.',
    });
  }

  return resolve({ valid: true });
});

/**
 * @description
 * Validates the instructional command.
 *
 * @param command
 * @returns {Promise<any>}
 */
Validations.instruction = command => new Promise((resolve) => {
  const valid = new RegExp(REGEX.INSTRUCTION).test(command);

  if (!valid) {
    return resolve({
      valid: false,
      message: 'Instructional command is invalid.',
    });
  }

  return resolve({ valid: true });
});

module.exports = Validations;
