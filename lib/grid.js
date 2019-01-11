const Grid = class Grid {
  constructor(props) {
    const t = this;

    t.boundaries = props.boundaries || [100, 100];
    t.forbidden = props.forbidden || [];
    t.ships = props.ships || [];
  }

  addship(ship) {
    const t = this;
    t.ships.push(ship);
  }
};

module.exports = Grid;
