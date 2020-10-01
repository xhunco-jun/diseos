import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Dot extends Component {
  constructor(props) {
    super(props);
    this.handleMouseDown  =this.handleMouseDown.bind(this);
  }

  handleMouseDown(e) {
    if ( e.shiftKey) {
      //this.props.onRemove();
      /*var coor = [e.offsetX, e.offsetY];
      alert(coor)*/
      this.props.onAddNode(1);
    } else if ( e.ctrlKey) {
      this.props.onAddNode(2);
    } else {
      this.props.onSelect();
    }
  }

  render() {
    var opacidad = 0;
    var relleno = "black";
    if (this.props.tipoD !== 0){
      opacidad = 0.9;
      //console.log(this.props.tipoD);
      if (this.props.tipoD === 1) {
        relleno = "#24df2a";
      } else if (this.props.tipoD === 2) {
        relleno = "#ce1414"
      } else if (this.props.tipoD === 3) {
        relleno = "#eee719";
      } else if (this.props.tipoD === 4) {
        relleno = "#11eccb"
      } else if (this.props.tipoD === 5) {
        relleno = "#0019bc";
      } else if (this.props.tipoD === 6) {
        relleno = "#9600bc"
      }
    }
    return (
        <circle
          onMouseDown={this.handleMouseDown}
          cx={this.props.position.x}
          cy={this.props.position.y}
          opacity={opacidad}
          r={5} stroke="black" strokeWidth="2" fill={relleno} />
    );
  }
}

Dot.propTypes = {
  position: PropTypes.object.isRequired,
  onMove: PropTypes.func
}
export default Dot;


/*addNode(x, y) {
  x = x || Math.random() * this.props.width;
  y = y || Math.random() * this.props.height;
  var node = new Victor(x, y);
  var newShape = this.props.shape.slice();
  newShape.push(node);
  var nuevoTipo = this.props.tipo.slice();
  nuevoTipo.push(1);
  // Empieza lo chido
  var nuevoMedidas = this.props.medidas.slice();
  if (nuevoTipo.length % 2 === 0) {
    var nodo1 = nuevoMedidas.pop();
    var nodo2 = node;
    var ca = Math.abs(nodo2.x - nodo1.x);
    var co = Math.abs(nodo2.y - nodo1.y);
//console.log(nodo2.x-nodo1.x);
//console.log(nodo2.y-nodo1.y);
    var theta = (Math.atan(co/ca)*180)/Math.PI;//36.869897
    //console.log(theta);
    var angM = Math.abs(90-theta);
    var proporcion = Math.tan((angM*Math.PI)/180);
    //console.log((angM*Math.PI)/180);
    //console.log(angM);
    var proporX=0;
    var proporY=0;
    if (proporcion >= 1) {
      proporX = (-10)/proporcion;
      proporY = -10;//*proporcion;
    }else{
      proporX = -10;
      proporY = (-10)*proporcion;//*proporcion;
    }
    var aux = (nodo2.x-nodo1.x)/(nodo2.y - nodo1.y);
    if (aux > 0) {
      var aux2 = proporY;
      //proporX=proporX;
      proporY=aux2*-1;
    }
    var nNodo1 = new Victor(nodo1.x + proporX, nodo1.y + proporY);
    var nNodo2 = new Victor(nodo2.x + proporX, nodo2.y + proporY);
//console.log(proporcion);
    //alert(proporcion);
    nuevoMedidas.push(nNodo1);
    nuevoMedidas.push(nNodo2);
  } else {
    nuevoMedidas.push(node);
  }
  this.props.onChange(newShape, nuevoTipo, nuevoMedidas);// Actualiza el lienzo
}*/