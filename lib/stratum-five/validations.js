const { REGEX } = require('./constants');

const Validations = Object.create({});

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
 *
 * @param input
 * @returns {Promise<any>}
 */
Validations.start = input => new Promise((resolve) => {
  const data = input.split(REGEX.NEW_LINE);
  const boundaries = data.shift();
  const positions = [];
  const instructions = [];
  const commands = [];

  const valid = data.every((value, index) => {
    let result;

    switch (true) {
      case index % 3 === 0:
        result = Validations.regex(value, REGEX.POSITION);
        if (result) positions.push(value);
        return result;
      case index % 3 === 1:
        result = Validations.regex(value, REGEX.INSTRUCTION);
        if (result) instructions.push(value);
        return result;
      case index % 3 === 2:
        return value === '';
      default:
        return false;
    }
  });

  if (!Validations.boundaries(boundaries)
    || positions.length !== instructions.length || !valid) {
    return resolve({ valid: false, message: 'Invalid Input' });
  }

  positions.map((item, index) => commands.push({
    position: item,
    instructions: instructions[index],
  }));

  return resolve({
    valid: true,
    data: { boundaries, commands },
  });
});

/**
 * @description
 * Validates the initial input for grid boundaries.
 *
 * @param boundaries
 */
Validations.boundaries = (boundaries) => {
  const array = boundaries.split(' ');
  const max = Math.max(...array);
  const nan = Number.isNaN(max);

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
