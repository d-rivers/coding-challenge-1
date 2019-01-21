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
   * Iterator invokes both positioning &
   * instructions.
   *
   * @param cnf
   */
  run(cnf) {
    const t = this;

    t.positioning(cnf.position);
    t.instructions(cnf.instructions);
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

    t.vorpal.activeCommand.log(t.ship.position);
  }
};

module.exports = ControlStation;
