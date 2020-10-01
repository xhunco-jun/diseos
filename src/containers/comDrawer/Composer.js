import React, { Component } from 'react';
import { Button, ButtonToolbar, DropdownButton, MenuItem} from "react-bootstrap";
import ShapeEditor from './ShapeEditor';
import Victor from 'victor';
import './Composer.css';

class Composer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fractal: {
        shape: [
          new Victor( 0, this.props.height/2 ),
          new Victor( this.props.width/2, 0 )
        ],
        tipo: [//1:muros - 2:puertas 0:no-se-pinta
          0,
          0
        ],
        medidas: [
          new Victor( 0, this.props.height/2 ),
          new Victor( this.props.width/2, 0 )
        ],
        sensor: [ ],
        tipoSensor: []
      },
      objetoSel: null
    };
    // Funciones que se sobreescriben
    this.onShapeChanged = this.onShapeChanged.bind(this);
    this.addPlano = this.addPlano.bind(this);
    // Indica que objeto se tiene que dibujar: paredes, puerta, ventanas, sensores (6)
    this.objetoPintar = this.objetoPintar.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fractal !== this.props.fractal){
      this.setState({fractal: nextProps.fractal});
      alert("componentWillReceiveProps");
    }
  }
  /** Actualiza el estado del trazo - Llamado desde Drawer.js */
  onShapeChanged(shape/** CAMBIADO */,tipo, medidas, sensores, tipoSensor) {
    var fractal = this.state.fractal;
    fractal.shape = shape;
    fractal.tipo = tipo;
    fractal.medidas = medidas;
    fractal.sensor = sensores;
    fractal.tipoSensor = tipoSensor;
    // CAMBIAR fractal.tipo = tipo;
    this.setState({fractal: fractal});
  }
  // Para especificar la profundidad del fractal
  /*changeIterations(e) {
    var fractal = this.state.fractal;
    fractal.iterations = e.target.value;
    this.setState({fractal: fractal});
  }*/
  /** Servirá para guardar el plano - Método en Content.js*/
  addPlano(index) {
    this.props.onAdd(this.state.fractal);
  }
  /** Asigna el valor para el sensor */
  objetoPintar(index ) {
    this.setState({objetoSel: index});
  }

  render() {
    // Es para generar el fractal
    return (
      <div className="viewer-container">
        <ButtonToolbar>
          <Button className="Buttonx" onClick={this.objetoPintar.bind(null, 20)}>Trazar paredes</Button>
          <Button className="Buttonx" onClick={this.objetoPintar.bind(null, 21)}>Trazar puertas</Button>
          <Button className="Buttonx" onClick={this.objetoPintar.bind(null, 22)}>Trazar ventanas</Button>
          <DropdownButton className="Buttonx" id="dropdown-basic-button" title="Colocar sensores">
            <MenuItem id="s1" onClick={this.objetoPintar.bind(null, 1)} key={1}>Temperatura</MenuItem>
            <MenuItem id="s2" onClick={this.objetoPintar.bind(null, 2)} key={2}>Ruptura de cristales</MenuItem>
            <MenuItem id="s3" onClick={this.objetoPintar.bind(null, 3)} key={3}>Calidad del aire</MenuItem>
            <MenuItem id="s4" onClick={this.objetoPintar.bind(null, 4)} key={4}>Humo</MenuItem>
            <MenuItem id="s5" onClick={this.objetoPintar.bind(null, 5)} key={5}>Movimiento</MenuItem>
            <MenuItem id="s6" onClick={this.objetoPintar.bind(null, 6)} key={6}>Luminosidad</MenuItem>
          </DropdownButton>
          <Button className="Buttonx" onClick={this.objetoPintar.bind(null, 30)}>Mover elementos</Button>
          <Button className="ButtonS" onClick={this.addPlano}>Guardar plano</Button>
        </ButtonToolbar>
        {/** Es el lienzo en donde se realizará el trazo de lementos */}
        <div className="canvas" id="svgdrawer">
          <ShapeEditor
            onChange={this.onShapeChanged}
            shape={this.state.fractal.shape}
            tipo={this.state.fractal.tipo}
            medidas={this.state.fractal.medidas}
            sensor={this.state.fractal.sensor}
            tipoSensor={this.state.fractal.tipoSensor}
            objetoSel={this.state.objetoSel}
            width={this.props.width} height={this.props.height}
          />
          {/*<input type="range" min={0} max={5} onChange={this.changeIterations}/>*/}
          {/* Puede ser usado para guardar el fragtal
          <button onClick={this.handleAdd}>Save Fractal</button>*/}
        </div>
      </div>
    );
  }
}

Composer.defaultProps = {
  width:  1000,
  height: 450
};

export default Composer;