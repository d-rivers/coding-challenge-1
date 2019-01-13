const Ship = class Ship {
  constructor(props) {
    const t = this;

    t.position = props.position || '';
    t.coordinates = props.coordinates || [0, 0];
    t.orientation = props.orientation || 0;
    t.direction = props.direction || 'N';
    t.displacement = props.displacement || [1, 1];
    t.lost = props.lost || false;
  }

  updateposition() {
    const t = this;

    t.position = `${t.coordinates.join(' ')} ${t.direction} ${t.lost ? 'LOST' : ''}`;
  }
};

module.exports = Ship;
