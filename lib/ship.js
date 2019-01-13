const Ship = class Ship {
  constructor(props) {
    const t = this;

    t.position = props.position || '';
    t.coordinates = props.coordinates || [0, 0];
    t.orientation = props.orientation || 0;
    t.direction = props.direction || 'N';
    t.displacement = props.displacement || [1, 1];
  }
};

module.exports = Ship;
