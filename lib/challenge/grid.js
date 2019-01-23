const Grid = class Grid {
  constructor(props) {
    const t = this;

    t.boundaries = props.boundaries || [50, 50];
    t.warnings = props.warnings || [];
  }

  /**
   * @description
   * Sets the grid boundaries.
   *
   * @param command
   */
  setboundaries(command) {
    const t = this;

    t.boundaries = command.split(' ').map(Number);
  }
};

module.exports = Grid;
