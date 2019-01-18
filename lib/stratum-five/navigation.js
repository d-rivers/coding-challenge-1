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
    const displacement = Navigation.displacement(orientation);
    const i = displacement[0];

    let warning;

    switch (true) {
      case displacement[1] > 0 && (coordinates[i] + 1) <= t.boundaries[i]:
        coordinates[i] += 1;
        return { valid: true };
      case displacement[1] < 0 && (coordinates[i] - 1) >= 0:
        coordinates[i] -= 1;
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

  /**
   * @description
   * Returns an array containing correct displacement.
   *
   * 0: index, [x, y]
   * 1: increment/decrement
   *
   * @param orientation
   * @returns {number[]}
   */
  static displacement(orientation) {
    let displacement;

    switch (orientation) {
      case 'N':
        displacement = [1, 1];
        break;
      case 'E':
        displacement = [0, 1];
        break;
      case 'S':
        displacement = [1, -1];
        break;
      case 'W':
        displacement = [0, -1];
        break;
      default:
        throw new Error(`${orientation} isn't a valid orientation.`);
    }

    return displacement;
  }
};

module.exports = Navigation;
