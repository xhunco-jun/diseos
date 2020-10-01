import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Arco extends Component {
  render() {
    var dProp = "M "+this.props.start.x+" "+this.props.start.y+" Q "+ this.props.mid.x+" "+this.props.mid.y+" "+this.props.end.x+" "+this.props.end.y;
    return (
        <path
            d={dProp}
            stroke="rgb(28,28,28)"
            fill="none"
            strokeWidth="1">
        </path>
    );
  }
}
// Exige que se reciban don variables de tipo objeto
Arco.propTypes = {
    start: PropTypes.object.isRequired,
    mid: PropTypes.object.isRequired,
    end: PropTypes.object.isRequired
}

/*Dot.propTypes = {
  position: PropTypes.object.isRequired,
  onMove: PropTypes.func
}*/
export default Arco;