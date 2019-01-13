const Grid = require('./grid');

const Navigation = class Navigation extends Grid {
  constructor(props) {
    super(props.grid);

    const t = this;

    t.ship = null;
  }

  setup() {
    const t = this;

    return new Promise((resolve) => {
      const array = t.ship.position.split(' ');

      if (array.length === 3) {
        t.set('orientation')(array.pop());
        t.set('direction')(t.ship.orientation);
      }

      t.ship.coordinates = array.map(Number);

      return resolve({ valid: true });
    });
  }

  set(prop) {
    const t = this;

    const valid = prop === 'orientation' || prop === 'direction';

    if (!valid) {
      throw new Error(`${prop} isn't a supported property.`);
    }

    return function from(value) {
      const io = prop === 'orientation';

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

  move(instructions) {
    const t = this;

    return new Promise((resolve) => {
      const array = Array.from(instructions);

      let i = 0;
      let forward = { valid: true };

      while (i < array.length && forward.valid) {
        switch (array[i]) {
          case 'L':
            t.turn(t.ship.orientation -= 90);
            break;
          case 'R':
            t.turn(t.ship.orientation += 90);
            break;
          case 'F':
            forward = t.forward();
            break;
          default:
            throw new Error(`${array[i]} is an invalid instruction.`);
        }

        i += 1;
      }

      resolve(forward);
    });
  }

  turn(orientation) {
    const t = this;

    switch (true) {
      case orientation === -90:
        t.ship.orientation = 270;
        break;
      case orientation === 360:
        t.ship.orientation = 0;
        break;
      default:
        t.ship.orientation = orientation;
    }

    t.set('direction')(t.ship.orientation);
  }

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
