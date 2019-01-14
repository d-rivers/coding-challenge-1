const Grid = class Grid {
  constructor(props) {
    const t = this;

    t.boundaries = props.boundaries || [100, 100];
    t.warnings = props.warnings || [];
  }

  setboundries(command) {
    const t = this;

    return new Promise((resolve) => {
      t.boundaries = command.split(' ').map(Number);
      resolve({ valid: true });
    });
  }
};

module.exports = Grid;
