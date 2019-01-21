const Ship = class Ship {
  constructor(props) {
    const t = this;

    t.position = props.position || '';
    t.coordinates = props.coordinates || [0, 0];
    t.orientation = props.orientation || 'N';
    t.direction = props.direction || 0;
    t.lost = props.lost || false;
  }

  /**
   * @description
   * Updates a ships position.
   */
  updateposition() {
    const t = this;

    t.position = `${t.coordinates.join(' ')} ${t.orientation} ${t.lost ? 'LOST' : ''}`;
  }
};

module.exports = Ship;
