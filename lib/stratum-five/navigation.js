const Grid = require('./grid');

const Navigation = class Navigation extends Grid {
  constructor(props) {
    super(props);

    const t = this;

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

      t.set('direction')(array.pop());
      t.set('orientation')(t.ship.direction);

      t.ship.coordinates = array.map(Number);

      return resolve({ valid: true });
    });
  }

  /**
   * @description
   * Assigns displacement, orientation &
   * direction for a ship.
   *
   * @param prop
   * @returns {from}
   */
  set(prop) {
    const t = this;

    const valid = prop === 'orientation' || prop === 'direction';

    if (!valid) {
      throw new Error(`${prop} isn't a supported property.`);
    }

    return function from(value) {
      const io = prop === 'direction';

      switch (value) {
        case io ? 'N' : 0:
          t.ship[prop] = io ? 0 : 'N';
          t.ship.displacement = [1, 1];
          break;
        case io ? 'E' : 90:
          t.ship[prop] = io ? 90 : 'E';
          t.ship.displacement = [0, 1];
          break;
        case io ? 'S' : 180:
          t.ship[prop] = io ? 180 : 'S';
          t.ship.displacement = [1, -1];
          break;
        case io ? 'W' : 270:
          t.ship[prop] = io ? 270 : 'W';
          t.ship.displacement = [0, -1];
          break;
        default:
          throw new Error(`${value} isn't a valid value for ${prop}.`);
      }
    };
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
            t.turn(t.ship.direction -= 90);
            break;
          case 'R':
            t.turn(t.ship.direction += 90);
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

    switch (true) {
      case direction === -90:
        t.ship.direction = 270;
        break;
      case direction === 360:
        t.ship.direction = 0;
        break;
      default:
        t.ship.direction = direction;
    }

    t.set('orientation')(t.ship.direction);
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
