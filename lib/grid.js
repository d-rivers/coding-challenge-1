const Grid = class Grid {
  constructor(props) {
    const t = this;

    t.boundaries = props.boundaries || [100, 100];
    t.forbidden = props.forbidden || [];
    t.ships = props.ships || [];
  }

  addShip(ship) {
    console.log('add ship', ship);
    const t = this;
    t.ships.push(ship);
  }
};

module.exports = Grid;
