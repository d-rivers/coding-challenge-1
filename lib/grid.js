const Grid = class Grid {
  constructor(props) {
    const t = this;

    t.boundaries = props.boundaries || [100, 100];
    t.warnings = props.warnings || [];
  }
};

module.exports = Grid;
