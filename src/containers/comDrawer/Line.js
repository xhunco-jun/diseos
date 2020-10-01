import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class Line extends Component {
  constructor(props) {
    super(props);
    this.handlegMouseDown2  =this.handlegMouseDown2.bind(this);
  }
  componentDidMount() {
    var nodol = ReactDOM.findDOMNode(this);
    nodol.addEventListener("mousedown", this.handlegMouseDown2);
  }

  handlegMouseDown2(e) {
    if (e.target === ReactDOM.findDOMNode(this) && e.shiftKey) {
      alert('función eliminar - dar clic sobre linea');
      this.props.removerLinea();
    } else if(e.target === ReactDOM.findDOMNode(this)){
      var coor = [e.offsetX, e.offsetY];
      this.props.funSelecLinea(coor);
    }
  }
  render() {
    var anchoLinea = 4;
    var vColor = "gray";
    if (this.props.sonMedidas !== 0){
      anchoLinea = 1;
    }
    if (this.props.sonMedidas === 2){
      vColor = "black";
    }
    if (this.props.tipo === 2) {//paredes
      vColor = "black";
    }else if(this.props.tipo === 0){//inicio
      vColor = "white";
    }else if ((this.props.tipo % 2) === 1){
      vColor = "blue";//combinado
    }
    return (
        // Define el dibujado de una linea a traves de SVG
        <line
          /*onMouseDown={this.handlegMouseDown2}*/
          stroke={vColor}
          strokeWidth={anchoLinea}
          x1={this.props.start.x}
          y1={this.props.start.y}
          x2={this.props.end.x}
          y2={this.props.end.y}
          opacity={anchoLinea/4}
        />
    );
  }
}

// Exige que se reciban don variables de tipo objeto
Line.propTypes = {
  start: PropTypes.object.isRequired,
  end: PropTypes.object.isRequired
}
export default Line;