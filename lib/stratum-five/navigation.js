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
   * Invokes orientation/direction update.
   * Assigns coordinates to ship.
   *
   * @returns {Promise<any>}
   */
  setup() {
    const t = this;

    return new Promise((resolve) => {
      const array = t.ship.position.split(' ');

      t.ship.orientation = array.pop();
      t.ship.direction = t.orientations.indexOf(t.ship.orientation);
      t.ship.coordinates = array.map(Number);

      t.ship.updatedisplacement();

      return resolve({ valid: true });
    });
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

    t.ship.updatedisplacement();
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
    const { displacement, coordinates } = t.ship;
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
};

module.exports = Navigation;
