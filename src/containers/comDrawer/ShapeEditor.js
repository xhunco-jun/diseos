import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from './Drawer';

class ShapeEditor extends Component {
  render() {
    return (
      <Drawer
        onChange={this.props.onChange}
        shape={this.props.shape}
        tipo={this.props.tipo}
        medidas={this.props.medidas}
        sensor={this.props.sensor}
        tipoSensor={this.props.tipoSensor}
        objetoSel={this.props.objetoSel}
        width={this.props.width}
        height={this.props.height}
        coorActual={[0, 0]}/>
    );
  }
}

ShapeEditor.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  shape: PropTypes.array.isRequired,
  tipo: PropTypes.array.isRequired,
  medidas: PropTypes.array.isRequired
}
export default ShapeEditor;