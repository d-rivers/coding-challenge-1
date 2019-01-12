const Grid = class Grid {
  constructor(props) {
    const t = this;

    t.boundaries = props.boundaries || [100, 100];
  }
};

module.exports = Grid;
