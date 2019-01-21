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
   * @returns {boolean}
   */
  move(instructions) {
    const t = this;
    const iterator = instructions[Symbol.iterator]();

    let char = iterator.next();
    let result = true;

    while (!char.done && result) {
      switch (char.value) {
        case 'L':
          t.turn(t.ship.direction -= 1);
          break;
        case 'R':
          t.turn(t.ship.direction += 1);
          break;
        case 'F':
          result = t.forward();
          break;
        default:
          throw new Error(`${char.value} is an invalid instruction.`);
      }

      char = iterator.next();
    }

    return result;
  }

  /**
   * @description
   * Updates a ships direction/orientation.
   *
   * @param direction
   */
  turn(direction) {
    const t = this;

    switch (true) {
      case t.ship.direction < 0:
        t.ship.direction = 3;
        break;
      case t.ship.direction > 3:
        t.ship.direction = 0;
        break;
      default:
        t.ship.direction = direction;
    }

    t.ship.orientation = t.orientations[t.ship.direction];
  }

  /**
   * @description
   * Updates a ships coordinates.
   *
   * Stores warning coordinates, ensuring ships
   * cannot be lost from the same place.
   *
   * @returns {boolean}
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
        return true;
      case incr < 0 && (coordinates[axis] - 1) >= 0:
        coordinates[axis] -= 1;
        return true;
      default:
        warning = coordinates.join('');

        if (t.warnings.indexOf(warning) > -1) {
          return true;
        }

        t.warnings.push(warning);

        return false;
    }
  }
};

module.exports = Navigation;
