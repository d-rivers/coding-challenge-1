const Ship = class Ship {
  constructor(position) {
    const t = this;

    t.position = position;

    t.coordinates = [0, 0];
    t.orientation = 0;
  }

  setup() {
    const t = this;

    return new Promise((resolve) => {
      const array = t.position.split(' ');

      if (array.length === 3) {
        t.setOrientation(array.pop());
      }

      t.coordinates = array;

      resolve();
    });
  }

  setOrientation(orientation) {
    const t = this;

    switch (orientation) {
      case 'N':
        t.orientation = 0;
        break;
      case 'E':
        t.orientation = 90;
        break;
      case 'S':
        t.orientation = 180;
        break;
      case 'W':
        t.orientation = 270;
        break;
      default:
        throw new Error(`${orientation} isn't a valid orientation.`);
    }
  }
};

module.exports = Ship;
