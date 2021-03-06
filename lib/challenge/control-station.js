const Navigation = require('./navigation');
const Validations = require('./validations');
const Ship = require('./ship');

const ControlStation = class ControlStation extends Navigation {
  /**
   * @description
   * Awaits start validation before
   * invoking positioning/instructions.
   *
   * @param line
   * @param callback
   * @returns {Promise<*>}
   */
  async run(line, callback) {
    const t = this;

    const result = await Validations.run(line)
      .then(response => response)
      .catch(error => error);

    if (!result.valid || !result.method) return callback();

    t[result.method](line);

    return callback();
  }

  /**
   * @description
   * Assigns a new ship construction.
   *
   * @param position
   */
  positioning(position) {
    const t = this;
    const array = position.split(' ');
    const orientation = array.pop();
    const direction = t.orientations.indexOf(orientation);
    const coordinates = array.map(Number);

    t.ship = new Ship({
      position,
      orientation,
      direction,
      coordinates,
    });
  }

  /**
   * @description
   * Invokes move.
   * Assigns lost ships.
   * Invokes update ship position.
   * Outputs ship position.
   *
   * @param instructions
   */
  instructions(instructions) {
    const t = this;
    const result = t.move(instructions);

    if (!result) {
      t.ship.lost = true;
    }

    t.ship.updateposition();

    console.info(t.ship.position);
  }
};

module.exports = ControlStation;
