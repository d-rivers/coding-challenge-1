const Grid = require('./grid');

const Navigation = class Navigation extends Grid {
  constructor(props) {
    super(props);

    const t = this;

    t.orientations = ['N', 'E', 'S', 'W'];
    t.ship = null;
  }

  /**
   * @description
   * Invokes turn or forward based on instructions.
   *
   * @param instructions
   * @returns {Promise<any>}
   */
  move(instructions) {
    const t = this;

    return new Promise((resolve) => {
      const iterator = instructions[Symbol.iterator]();

      let char = iterator.next();
      let forward = { valid: true };

      while (!char.done && forward.valid) {
        switch (char.value) {
          case 'L':
            t.turn(t.ship.direction -= 1);
            break;
          case 'R':
            t.turn(t.ship.direction += 1);
            break;
          case 'F':
            forward = t.forward();
            break;
          default:
            throw new Error(`${char.value} is an invalid instruction.`);
        }

        char = iterator.next();
      }

      resolve(forward);
    });
  }

  /**
   * @description
   * Updates a ships orientation.
   * Invokes direction update.
   *
   * @param direction
   */
  turn(direction) {
    const t = this;

    t.ship.direction = direction;

    if (t.ship.direction < 0) t.ship.direction = 3;
    if (t.ship.direction > 3) t.ship.direction = 0;

    t.ship.orientation = t.orientations[t.ship.direction];
  }

  /**
   * @description
   * Updates a ships coordinates.
   *
   * Stores warning coordinates, ensuring ships
   * cannot be lost from the same place.
   *
   * @returns {{valid: boolean}}
   */
  forward() {
    const t = this;
    const { coordinates, orientation } = t.ship;
    const axis = orientation === 'N' || orientation === 'S' ? 1 : 0;
    const incr = orientation === 'N' || orientation === 'E' ? 1 : -1;

    let warning;

    switch (true) {
      case incr > 0 && (coordinates[axis] + 1) <= t.boundaries[axis]:
        coordinates[axis] += 1;
        return { valid: true };
      case incr < 0 && (coordinates[axis] - 1) >= 0:
        coordinates[axis] -= 1;
        return { valid: true };
      default:
        warning = coordinates.join('');

        if (t.warnings.indexOf(warning) > -1) {
          return { valid: true };
        }

        t.warnings.push(warning);

        return { valid: false };
    }
  }
};

module.exports = Navigation;
