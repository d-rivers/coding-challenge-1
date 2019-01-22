const Helpers = require('./helpers');

// very rough input gen
const GenerateInput = class GenerateInput {
  constructor(props) {
    const t = this;

    t.filename = props.filename || 'test';
    t.lines = props.lines || 1000;
  }

  init() {
    const t = this;

    const array = Array.from(new Array(t.lines));
    const writestream = Helpers.writestream(`${__dirname}/${t.filename}`);

    const boundaries = {
      x: GenerateInput.random(50),
      y: GenerateInput.random(50),
    };

    writestream.write(`${boundaries.x} ${boundaries.y}\n`);

    const mapped = () => {
      const coordinates = `${GenerateInput.coordinates(boundaries.x, boundaries.y)}`;
      const orientation = GenerateInput.orientation();
      const instructions = GenerateInput.instructions(100);

      writestream.write(`${coordinates} ${orientation}\n`);
      writestream.write(`${instructions}\n\n`);
    };

    array.map(mapped);

    writestream.end();
  }

  /**
   * @description
   * Returns a random number.
   *
   * @param max
   * @returns {number}
   */
  static random(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /**
   * @description
   * Returns random x y coordinates.
   *
   * @param maxx
   * @param maxy
   * @returns {string}
   */
  static coordinates(maxx, maxy) {
    const x = GenerateInput.random(maxx);
    const y = GenerateInput.random(maxy);

    return `${x} ${y}`;
  }

  /**
   * @description
   * Returns a random orientation.
   *
   * @returns {string}
   */
  static orientation() {
    const orientations = ['N', 'E', 'S', 'W'];
    return orientations[Math.floor(Math.random() * orientations.length)];
  }

  /**
   * @description
   * Returns a random string of L|R|F.
   *
   * @param max
   * @returns {string}
   */
  static instructions(max) {
    const chars = ['L', 'R', 'F'];
    const length = Array.from(new Array(GenerateInput.random(max)));

    let str = '';

    const mapped = () => {
      str += chars[GenerateInput.random(3)];
    };

    length.map(mapped);

    if (!str.length) str += 'F';

    return str;
  }
};

const gen = new GenerateInput({
  filename: 'input',
  lines: 1000,
});

gen.init();
