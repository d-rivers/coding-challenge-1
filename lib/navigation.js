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

    if (orientation === -90) {
      t.ship.orientation = 270;
    } else if (orientation === 360) {
      t.ship.orientation = 0;
    } else {
      t.ship.orientation = orientation;
    }

    t.set('direction')(t.ship.orientation);
  }

  forward() {
    const t = this;
    const i = t.ship.displacement[0];

    if (t.ship.displacement[1] > 0) {
      t.ship.coordinates[t.ship.displacement[0]] += 1;
    } else {
      t.ship.coordinates[t.ship.displacement[0]] -= 1;
    }

    if (t.ship.coordinates[i] > t.boundaries[i] || t.ship.coordinates[i] < 0) {
      return {
        valid: false,
        message: `${i === 0 ? 'x' : 'y'} coordinate is outside grid.`,
      };
    }

    return { valid: true };
  }
};

module.exports = Navigation;
