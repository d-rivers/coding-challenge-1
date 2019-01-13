const Ship = class Ship {
  constructor(props) {
    const t = this;

    t.position = props.position || '';
    t.coordinates = props.coordinates || [0, 0];
    t.orientation = props.orientation || 0;
    t.direction = props.direction || 'N';
    t.displacement = props.displacement || [1, 1];
  }

  updateposition() {
    const t = this;
    const lost = t.coordinates.indexOf(-1);

    if (lost > -1) {
      t.coordinates[lost] += 1;
    }

    t.position = `${t.coordinates.join(' ')} ${t.direction} ${lost > -1 ? 'LOST' : ''}`;
  }
};

module.exports = Ship;
