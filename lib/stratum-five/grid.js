const Grid = class Grid {
  constructor(props) {
    const t = this;

    t.boundaries = props.boundaries || [100, 100];
    t.warnings = props.warnings || [];
  }

  /**
   * @description
   * Sets the grid boundaries.
   *
   * @param command
   */
  setboundries(command) {
    const t = this;
    t.boundaries = command.split(' ').map(Number);
  }
};

module.exports = Grid;
