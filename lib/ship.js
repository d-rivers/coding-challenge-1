const Ship = class Ship {
  constructor(props) {
    const t = this;

    t.position = props.position;
    t.boundaries = props.boundaries;

    t.coordinates = [0, 0];
    t.orientation = 0;
    t.direction = 'N';
    t.activecoordinate = [1, 1];
  }

  setup() {
    const t = this;

    return new Promise((resolve) => {
      const array = t.position.split(' ');

      if (array.length === 3) {
        t.set('orientation')(array.pop());
      }

      t.coordinates = array.map(Number);

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
          t[prop] = io ? 0 : 'N';
          t.activecoordinate = [1, 1];
          break;
        case io ? 'E' : 90:
          t[prop] = io ? 90 : 'E';
          t.activecoordinate = [0, 1];
          break;
        case io ? 'S' : 180:
          t[prop] = io ? 180 : 'S';
          t.activecoordinate = [1, -1];
          break;
        case io ? 'W' : 270:
          t[prop] = io ? 270 : 'W';
          t.activecoordinate = [0, -1];
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
            t.turn(t.orientation -= 90);
            break;
          case 'R':
            t.turn(t.orientation += 90);
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
      t.orientation = 270;
    } else if (orientation === 360) {
      t.orientation = 0;
    } else {
      t.orientation = orientation;
    }

    t.set('direction')(t.orientation);
  }

  forward() {
    const t = this;
    const i = t.activecoordinate[0];

    if (t.activecoordinate[1] > 0) {
      t.coordinates[t.activecoordinate[0]] += 1;
    } else {
      t.coordinates[t.activecoordinate[0]] -= 1;
    }

    if (t.coordinates[i] > t.boundaries[i] || t.coordinates[i] < 0) {
      return {
        valid: false,
        message: `${i === 0 ? 'x' : 'y'} coordinate is outside grid.`,
      };
    }

    return { valid: true };
  }
};

module.exports = Ship;
