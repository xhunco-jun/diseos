import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Texto extends Component {
  render() {
    return (
        <text x={this.props.position.x} y={this.props.position.y} fontSize="8">
            {this.props.texto/100}
        </text>
    );
  }
}

Texto.propTypes = {
  position: PropTypes.object.isRequired,
  texto: PropTypes.number.isRequired
}
export default Texto;
