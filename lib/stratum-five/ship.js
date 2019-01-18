const Ship = class Ship {
  constructor(props) {
    const t = this;

    t.position = props.position || '';
    t.coordinates = props.coordinates || [0, 0];
    t.orientation = props.orientation || 'N';
    t.direction = props.direction || 0;
    t.displacement = props.displacement || [1, 1];
    t.lost = props.lost || false;
  }

  updatedisplacement() {
    const t = this;

    let arr;

    switch (t.orientation) {
      case 'N':
        arr = [1, 1];
        break;
      case 'E':
        arr = [0, 1];
        break;
      case 'S':
        arr = [1, -1];
        break;
      case 'W':
        arr = [0, -1];
        break;
      default:
        throw new Error(`${t.orientation} isn't a valid orientation.`);
    }


    t.displacement = arr;
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
