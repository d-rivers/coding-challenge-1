const Navigation = require('./navigation');
const Ship = require('./ship');

const ControlStation = class ControlStation extends Navigation {
  constructor(props) {
    super(props);

    const t = this;

    t.vorpal = props.vorpal || null;
  }

  /**
   * @description
   * Assigns a new ship construction.
   *
   * @param position
   * @returns {Promise<any>}
   */
  positioning(position) {
    const t = this;

    return new Promise((resolve) => {
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

      return resolve({ valid: true });
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
   * @returns {Promise<any>}
   */
  instructions(instructions) {
    const t = this;

    return new Promise(async (resolve) => {
      const move = await t.move(instructions)
        .then(response => response)
        .catch(error => error);

      if (!move.valid) {
        t.ship.lost = true;
        move.valid = true;
      }

      t.ship.updateposition();

      t.vorpal.activeCommand.log(t.ship.position);

      resolve(move);
    });
  }
};

module.exports = ControlStation;
