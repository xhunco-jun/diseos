import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Line from './Line';
import Dot from './Dot';
import Texto from './Texto';
import Arco from './Arco';
import Victor from 'victor';
import Fondo from './Fondo';
import Fondo2 from './Fondo2';
import './Drawer.css';

class Drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shape: this.props.shape,
      tipo: this.props.tipo, /** CAMBIADO */
      selected: null,
      lineaSelec: null,
      coorLineaSel: null,
      medidas: this.props.medidas,
      // Para mover el area de dibujado
      selectDrawArea: null,
      coorInicialSDA: null,
      coorActual: this.props.coorActual,
      selectedSens: null/*,
      //  
      sensor: this.props.sensor// Otro*/
    };
    this.mouseMove  =this.mouseMove.bind(this);
    this.mouseClick  =this.mouseClick.bind(this);
    this.deselect  =this.deselect.bind(this);
    // Otras funciones sobreescritas
    this.selectNode = this.selectNode.bind(this);
    this.selectNodeSen = this.selectNodeSen.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.mouseClickDots = this.mouseClickDots.bind(this);
    this.removerLineaDot = this.removerLineaDot.bind(this);
    this.funSelecLineaDraw = this.funSelecLineaDraw.bind(this);
  }

  componentDidMount() {
    var node = ReactDOM.findDOMNode(this);
    node.addEventListener("mousemove", this.mouseMove);
    node.addEventListener("mousedown", this.mouseClick);
    document.addEventListener("mouseup", this.deselect);

  }
  obtenerPuntoMouseMove(nodo1, nodo2, distLinea) {
    var distLinea2 = distLinea;

    var ca = Math.abs(nodo2.x - nodo1.x);
    var co = Math.abs(nodo2.y - nodo1.y);
    var theta = (Math.atan(co/ca)*180)/Math.PI;//36.869897*/
    var angM = Math.abs(90-theta);
    var proporcion = Math.tan((angM*Math.PI)/180);
    var proporX=0;
    var proporY=0;

    /** CASO : PUERTAS */
    if (distLinea === 0) {
      distLinea2 = Math.trunc(Math.sqrt(Math.pow(nodo1.x-nodo2.x,2) + Math.pow(nodo1.y-nodo2.y,2)));
      proporX = co;
      proporY = ca;
    }else{
      if (proporcion >= 1) {
        proporX = distLinea2/proporcion;
        proporY = distLinea2;//*proporcion;
      }else{
        proporX = distLinea2;
        proporY = distLinea2*proporcion;//*proporcion;
      }
    }
    var aux = (nodo2.x-nodo1.x)/(nodo2.y - nodo1.y);
    if (aux > 0) {
      var aux2 = proporY;
      proporY=aux2*-1;
    }
    var angulo = (Math.atan((nodo2.y - nodo1.y)/(nodo2.x - nodo1.x))*180)/Math.PI;
    // Corrige segun el lado
    if ((nodo2.x - nodo1.x) > 0) {
      proporX=proporX*-1;
      proporY=proporY*-1;
      if (angulo >= 0) {
        proporX=proporX*-1;
        proporY=proporY*-1;
      }
    } else if ((nodo2.x - nodo1.x) === 0) {
      if ((nodo2.y - nodo1.y) > 0) {
        proporX=proporX*-1;
        proporY=proporY*-1;
      }
      proporX=proporX*-1;
      proporY=proporY*-1;
    } else {
      if (angulo > 0) {
        proporX=proporX*-1;
        proporY=proporY*-1;
      }
    }
    var nNodo1 = new Victor(nodo1.x + proporX, nodo1.y + proporY);
    var nNodo2 = new Victor(nodo2.x + proporX, nodo2.y + proporY);
    return [nNodo1, nNodo2];
  }
  /** CÍRCULO:
   * Se activa al detectar el movimiento del mouse
   * Se ocupa para mover los circulos unidos a las lineas
   * Previamente se tiene que selecionar el nodo en Dot.js */
  mouseMove(e) {
    var nuevoMedi = [];
    var dosNodos = [];// Guarda el retorno de obtenerPuntoMouseMove
    var nodo1 = null;
    var nodo2 = null;
    if(this.state.selected !== null) {
      var shape = this.props.shape.slice();
      shape[this.state.selected] = new Victor(e.offsetX+this.state.coorActual[0], e.offsetY+this.state.coorActual[1]);
      var tipo = this.props.tipo.slice(); // Tipo
      var sensores = this.props.sensor.slice();
      var tipoSensor = this.props.tipoSensor.slice();
      // Empieza lo chido - para medidas
      nuevoMedi = this.props.medidas.slice();
      // Si es el último nodo
      if ((nuevoMedi.length-1) === this.state.selected) {
        if ((nuevoMedi.length%2)===1) { // Se es un nodo sin linea, retorna
          this.props.onChange(shape, tipo, nuevoMedi, sensores, tipoSensor);
          return ;
        }
      }
      // Si se ha seleccionado el nodo 1 o nodo 2
      if ((this.state.selected % 2) === 0) {
        nodo1 = shape[this.state.selected];
        nodo2 = shape[this.state.selected+1];
      }else{
        nodo1 = shape[this.state.selected-1];
        nodo2 = shape[this.state.selected];
      }
      dosNodos = this.obtenerPuntoMouseMove(nodo1, nodo2, 10);
      // Si se ha seleccionado el nodo 1 o nodo 2
      if ((this.state.selected % 2) === 0) {
        nuevoMedi[this.state.selected]=dosNodos[0];
        nuevoMedi[this.state.selected+1]=dosNodos[1];
      }else{
        nuevoMedi[this.state.selected-1]=dosNodos[0];
        nuevoMedi[this.state.selected]=dosNodos[1];
      }
      this.props.onChange(shape, tipo, nuevoMedi, sensores, tipoSensor);
    } else if (this.state.lineaSelec !== null) {
      // MOVIMIENTO LINEA
      var newShape = this.props.shape.slice();
      var tipo2 = this.props.tipo.slice();
      var sensores2 = this.props.sensor.slice();
      var tipoSensor2 = this.props.tipoSensor.slice();
      var offsetX = e.offsetX - this.state.coorLineaSel[0];
      var offsetY = e.offsetY - this.state.coorLineaSel[1];
      var p1 = new Victor(this.state.coorLineaSel[2]+offsetX, this.state.coorLineaSel[3]+offsetY);
      var p2 = new Victor(this.state.coorLineaSel[4]+offsetX, this.state.coorLineaSel[5]+offsetY);
      newShape[this.state.lineaSelec*2] = p1;
      newShape[this.state.lineaSelec*2+1] = p2;

      // Empieza lo chido - para medidas
      nuevoMedi = this.props.medidas.slice();
      nodo1 = p1.clone(); // Lo invierte por eso es -10 y no 10
      nodo2 = p2.clone();

      dosNodos = this.obtenerPuntoMouseMove(nodo1, nodo2, 10);

      nuevoMedi[this.state.lineaSelec*2] = dosNodos[0];
      nuevoMedi[this.state.lineaSelec*2+1] = dosNodos[1];
      this.props.onChange(newShape, tipo2, nuevoMedi, sensores2, tipoSensor2);// Actualiza el lienzo
    } else if (this.state.selectedSens !== null) {
      var shape3 = this.props.shape.slice();
      var tipo3 = this.props.tipo.slice(); // Tipo
      var sensores3 = this.props.sensor.slice();
      sensores3[this.state.selectedSens] = new Victor(e.offsetX+this.state.coorActual[0], e.offsetY+this.state.coorActual[1]);
      var tipoSensor3 = this.props.tipoSensor.slice();
      var nuevoMedi3 = this.props.medidas.slice();
      this.props.onChange(shape3, tipo3, nuevoMedi3, sensores3, tipoSensor3);
    }else if (this.state.selectDrawArea !== null) {
      //var offsetX = e.offsetX - this.state.coorInicialSDA[0];
      //var offsetY = e.offsetY - this.state.coorInicialSDA[1];
      var coorActX = this.state.coorInicialSDA[2] - (e.offsetX - this.state.coorInicialSDA[0]);
      var coorActY = this.state.coorInicialSDA[3] - (e.offsetY - this.state.coorInicialSDA[1]);
      this.setState({coorActual: [coorActX, coorActY]});
    }
  }
  /** CÍRCULO:
   * Agrega un nuevo nodo en el lienzo en la posición en la que se a dado clic */
  mouseClick(e) {
    if (e.target === ReactDOM.findDOMNode(this) && this.props.objetoSel === 20) {
      //console.log(this.props.tipoSensor);
      //this.props.objetoSel
      this.addNode(e.offsetX, e.offsetY, 1);
    }else if (e.target === ReactDOM.findDOMNode(this) && this.props.objetoSel === 21){
      this.addNode(e.offsetX, e.offsetY, 2);
    }else if (e.target === ReactDOM.findDOMNode(this) && (this.props.objetoSel > 0 && this.props.objetoSel <= 6)) {
      this.addSensor(e.offsetX, e.offsetY, this.props.objetoSel);
    }else if (e.target === ReactDOM.findDOMNode(this)) {
      this.setState({selectDrawArea: true});
      this.setState({coorInicialSDA: [e.offsetX, e.offsetY, this.state.coorActual[0], this.state.coorActual[1]]});
    }
  }
  /** SENSORES :  */
  addSensor(x, y, sensor) {
    x = x || Math.random() * this.props.width;
    y = y || Math.random() * this.props.height;
    var node = new Victor(x+this.state.coorActual[0], y+this.state.coorActual[1]);
    var newShape = this.props.shape.slice();
    var nuevoTipo = this.props.tipo.slice();
    var nuevoMedidas = this.props.medidas.slice();
    var nuevoSensores= this.props.sensor.slice();
    nuevoSensores.push(node);
    var tipoSensor = this.props.tipoSensor.slice();
    tipoSensor.push(sensor);
    
    this.props.onChange(newShape, nuevoTipo, nuevoMedidas, nuevoSensores, tipoSensor);// Actualiza el lienzo
    console.log(nuevoSensores);
    console.log(tipoSensor);
  }
  /** CÍRCULO:
   * Agrega un nodo desde Dot.js   */
  mouseClickDots(index, tipo){
    var shape = this.props.shape.slice();
    var punto = shape[index];
    this.addNode(punto.x, punto.y, tipo);
  }
  /** CÍRCULO:
   * Establece a nulo el nodo seleccionado */
  deselect() {
    this.setState({selected: null});//nodo
    this.setState({lineaSelec : null});//linea
    this.setState({coorLineaSel: null});//linea
    this.setState({selectDrawArea: null});//area
    this.setState({coorInicialSDA: null});//area
    this.setState({selectedSens: null});//sensor
  }
  /** CÍRCULO:
   * Establece la selección de un nodo - es llamado desde Dot.js */
  selectNode(index) {
    this.setState({ selected: index });
  }
   /** CÍRCULO:
   * Establece la selección de un nodo (sensores)- es llamado desde Dot.js */
  selectNodeSen(index) {
    this.setState({ selectedSens: index });
  }
  /** CÍRCULO: INUTIL
   * Elimina el nodo sobre el cual se a dado clic */
  removeNode(index) {
    var newShape = this.props.shape.slice();
    alert(index);
    newShape.splice(index, 1);// Elimina el elemento en la pos, index
    this.props.onChange(newShape);// Actualiza el lienzo
  }
  /** LÍNEA: */
  removerLineaDot(index){
    var newShape = this.props.shape.slice();
    var nuevoTipo = this.props.tipo.slice();
    var nuevoMedidas = this.props.medidas.slice();
    var sensores = this.props.sensor.slice();
    var tipoSensor = this.props.tipoSensor.slice();
    newShape.splice(index*2, 1);// Elimina el elemento en la pos, index
    newShape.splice(index*2, 1);// Elimina el elemento en la pos, index
    nuevoTipo.splice(index*2, 1);
    nuevoTipo.splice(index*2, 1);
    nuevoMedidas.splice(index*2, 1);
    nuevoMedidas.splice(index*2, 1);
    this.props.onChange(newShape, nuevoTipo, nuevoMedidas, sensores, tipoSensor);// Actualiza el lienzo
  }
  /** CÍRCULO:
   * Agrega un nuevo nodo al final del arreglo   */
  addNode(x, y, tipo) {
    x = x || Math.random() * this.props.width;
    y = y || Math.random() * this.props.height;
    var node = new Victor(x+this.state.coorActual[0], y+this.state.coorActual[1]);
    var newShape = this.props.shape.slice();
    newShape.push(node);
    var nuevoTipo = this.props.tipo.slice();
    nuevoTipo.push(tipo);
    var sensores = this.props.sensor.slice();
    var tipoSensor = this.props.tipoSensor.slice();
    // Empieza lo chido
    var nuevoMedidas = this.props.medidas.slice();
    var dosNodos = [];// Guarda el retorno de obtenerPuntoMouseMove
    if (nuevoTipo.length % 2 === 0) {
      var nodo1 = nuevoMedidas.pop();// CORREGIDO -> Primero en entrar
      var nodo2 = node;
      /** Si es el mismo punto */
      if (!((nodo2.x - nodo1.x)===0 && (nodo2.y - nodo1.y)===0)) {
        dosNodos = this.obtenerPuntoMouseMove(nodo1.clone(), nodo2.clone(), 10);

        nuevoMedidas.push(dosNodos[0]);
        nuevoMedidas.push(dosNodos[1]);
      } else {
        newShape.pop();
        nuevoTipo.pop();
        newShape.pop();
        nuevoTipo.pop();
      }
    } else {
      nuevoMedidas.push(node);
    }
    this.props.onChange(newShape, nuevoTipo, nuevoMedidas, sensores, tipoSensor);// Actualiza el lienzo
    /*console.log(sensores);
    console.log(tipoSensor);*/
  }
  funSelecLineaDraw(index, coor){
    var shape = this.props.shape.slice();
    var p1 = shape[index*2];
    var p2 = shape[index*2+1];
    this.setState({lineaSelec: index });
    this.setState({coorLineaSel: [coor[0], coor[1], p1.x, p1.y, p2.x, p2.y]});
  }
  connectTheDots(dots, tipos) {
    var lines = [];
    var tamano = dots.length;
    var i=0;
    for (i=0;i<(tamano-1);i=i+2) {
      lines.push({start: dots[i], end: dots[i+1], tipo: tipos[i]+tipos[i+1] });
    }
    return lines;
  }

  renderShape(Segmento, points, tipos, sonMedidas) {
    /** connectTheDots retorna un arreglo y map devuelve otro arreglo,
     * ahora de segmentos/Lines */
    return this.connectTheDots(points, tipos).map((line, index) => {
      //if (sonMedidas === 0 && sonMedidas === 1){
        return ( <Segmento 
          removerLinea={this.removerLineaDot.bind(null, index)}
          funSelecLinea={this.funSelecLineaDraw.bind(null, index)}
          start={line.start}
          end={line.end}
          tipo={line.tipo}
          sonMedidas={sonMedidas}
          key={index}/> );
      /*} else {
        return ( <Segmento 
          start={line.start}
          end={line.end}
          tipo={line.tipo}
          sonMedidas={sonMedidas}
          key={index}/> );
      }*/
    });
  }
  /** Construye el componente circulo dentro del SVG */
  renderDots(Component, dots, tipo) {
    var tipoDot = 0;
    var circles = dots.map((dot, index) => {
      if (tipo !== 0){
        //console.log("renderdots" + tipo);
        //console.log("renderdots2" + dots);
        tipoDot = tipo[index];
        return ( <Component
          onSelect={this.selectNodeSen.bind(null, index)}
          onRemove={this.removeNode.bind(null, index)}
          onAddNode={this.mouseClickDots.bind(null, index)}
          tipoD={tipoDot}
          position={dot}
          key={index}
        />);
      }
      return ( <Component
        onSelect={this.selectNode.bind(null, index)}
        onRemove={this.removeNode.bind(null, index)}
        onAddNode={this.mouseClickDots.bind(null, index)}
        tipoD={tipoDot}
        position={dot}
        key={index}
      />);
    });
    return circles;
  }
  /** Construye el componente circulo dentro del SVG */
  /*renderDotsSensors(Component, dots, tipo) {
    var tipoDot = 0;
    var circles = dots.map((dot, index) => {
      if (tipo !== 0){
        tipoDot = tipo[index];
      }
      return ( <Component
        onSelect={this.selectNode.bind(null, index)}
        onRemove={this.removeNode.bind(null, index)}
        onAddNode={this.mouseClickDots.bind(null, index)}
        tipoD={tipoDot}
        position={dot}
        key={index}
      />);
    });
    return circles;
  }*/
  obtenerPuntosRelativos(forma, tamano, distLinea) {
    var nueMed = [];
    var dosNodos = [];// Guarda el retorno de obtenerPuntoMouseMove
    var i=0;
    for (i=0;i<(tamano-1);i=i+2) {
      var nodo2 = forma.pop();
      var nodo1 = forma.pop();

      dosNodos = this.obtenerPuntoMouseMove(nodo1.clone(), nodo2.clone(), distLinea);

      nueMed.push(dosNodos[0]);
      nueMed.push(dosNodos[1]);
    }
    return nueMed;
  }
  obtenerSegmentosPuertas(forma, tipo, tamForma){
    var i;
    var formaPuertas = [];
    var tipoPuertas = [];
    for (i=0;i<(tamForma-1);i=i+2) {
      if (tipo[i] === 2) {
        formaPuertas.push(forma[i]);
        formaPuertas.push(forma[i+1]);
        tipoPuertas.push(2);
        tipoPuertas.push(2);
      }
    }
    return [formaPuertas, tipoPuertas];
  }
  obtenerBordes(forma/** Son las medidas de shape/forma */, tipo){
    var nueMed = [];
    var nueMed2 = [];
    var rNueMed = [];
    var rNueMed2 = [];
    var posMedidas = [];
    var valMedidas = [];
    if (forma.length % 2 !== 0) {
      forma.pop();
    }
    var i=0;// ELIMINAR
    var tamForma =  forma.length;
    //console.log("nueMed");
    nueMed = this.obtenerPuntosRelativos(forma.slice(), tamForma, 6);
    //console.log("nueMed2");
    nueMed2 = this.obtenerPuntosRelativos(forma.slice(), tamForma, 14);
    /*for (i=0;i<(tamForma-1);i=i+2)*/
    tamForma = nueMed.length;
    for (i=0;i<(tamForma-1);i=i+2) {
      var nAux = nueMed.pop();
      var nAux2 = nueMed2.pop();
      rNueMed.push(nAux);
      rNueMed.push(nAux2);
      var nAuxw = nueMed.pop();
      var nAux2w = nueMed2.pop();
      rNueMed2.push(nAuxw);
      rNueMed2.push(nAux2w);
      // Se obtienen el la longitud de los segmentos
      valMedidas.push(Math.trunc(Math.sqrt((nAux2.x-nAux2w.x)*(nAux2.x-nAux2w.x) + (nAux2.y-nAux2w.y)*(nAux2.y-nAux2w.y))));
      // Se obtienen la posición de las medidas de los segmentos
      var nodoPosMedi = new Victor(nAux2.x-(nAux2.x-nAux2w.x)/2, nAux2.y-(nAux2.y-nAux2w.y)/2);
      posMedidas.push(nodoPosMedi);
    }
    /** CASO PUERTAS: los alementos adicionales al trazado de los segmentos se obtienen en tiempo de ejecución */
    var lineaPerpendicularPuerta = [];
    tamForma =  forma.length;
    var formaPuertas = this.obtenerSegmentosPuertas(forma.slice(), tipo.slice(), tamForma);
    //console.log("lineaPerpendicularPuerta");
    lineaPerpendicularPuerta = this.obtenerPuntosRelativos(formaPuertas[0].slice(), formaPuertas[0].length, 0);
    //console.log(lineaPerpendicularPuerta);
    /** rNueMed: linea para medidas del punto 1
     * rNueMed2: linea para medidas del punto 2
     * posMedidas: posición a ubicar la logitud de los segmentos
     * valMedidas: logitud de los segmentos
     * lineaPerpendicularPuerta: segmentos paralelos a las puertas
     * formaPuertas[1]: arreglo del tipo de segmentos (puertas)
     * formaPuertas[0].slice(): segmentos de forma que son puertas */
    return [rNueMed, rNueMed2, posMedidas, valMedidas, lineaPerpendicularPuerta, formaPuertas[1], formaPuertas[0].slice()];
  }

  renderText(Component, dots, valores) {
    var circles = dots.map((dot, index) => {
      return ( <Component
        position={dot}
        texto={valores[index]}
        key={index}
      />);
    });
    return circles;
  }
  obtenerLineasPuertas(linParalPuertas, linPuertas) {
    var tamForma = linParalPuertas.length;
    var auxLinParalPuertas = [];
    var arLinPerpen = [];
    var arArcos = [];
    var i;
    for (i=0;i<(tamForma-1);i=i+2) {
      var n2=linParalPuertas.pop();
      var n1=linParalPuertas.pop();
      auxLinParalPuertas.push(n1);
      auxLinParalPuertas.push(n2);
    }
    for (i=0;i<(tamForma-1);i=i+2) {
      arLinPerpen.push(linPuertas[i]);
      arLinPerpen.push(auxLinParalPuertas[i]);
      arArcos.push(linPuertas[i+1], auxLinParalPuertas[i+1], auxLinParalPuertas[i]);
    }
    return [arLinPerpen, arArcos];
  }
  connectTheDotsArc(dots) {
    var arcos = [];
    var tamano = dots.length;
    var i=0;
    for (i=0;i<(tamano-1);i=i+3) {
      arcos.push({start: dots[i], mid: dots[i+1], end: dots[i+2] });
    }
    return arcos;
  }
  renderArcos(Component, arcPuertaPuntos){
    return this.connectTheDotsArc(arcPuertaPuntos).map((arco, index) => {
      return ( <Component 
        start={arco.start}
        mid={arco.mid}
        end={arco.end}
        key={index}/> );
    });
  }

  render() {
    // Renderiza las lineas para el canvas
    var lines = this.renderShape(Line, this.props.shape.slice(), this.props.tipo.slice(), 0);
    var linMedidas = this.renderShape(Line, this.props.medidas.slice(), this.props.tipo.slice(), 1);
    // Duvuelve vectores y no elementos jsx
    var medidasBordes = this.obtenerBordes(this.props.shape.slice(), this.props.tipo.slice());
    var linMedidasTopes = this.renderShape(Line, medidasBordes[0].slice(), this.props.tipo.slice(), 1);
    var linMedidasTopes2 = this.renderShape(Line, medidasBordes[1].slice(), this.props.tipo.slice(), 1);
    // TEXTO - MEDIDAS
    var textMedidas = this.renderText(Texto, medidasBordes[2].slice(), medidasBordes[3].slice());
    /** Lineas de puertas */
    var linArcPuerta = this.obtenerLineasPuertas(medidasBordes[4].slice(), medidasBordes[6].slice());
    var linPuertas = this.renderShape(Line, linArcPuerta[0].slice(), medidasBordes[5].slice(), 2);//2: nno tiene escuhadores
    var arcPuertas = this.renderArcos(Arco, linArcPuerta[1].slice());
    // Renderiza los circulos para el canvas
    var dots = !this.props.editable ? [] : (
      this.renderDots(Dot, this.props.shape.slice(), 0)
    );
    var sensoresDots = this.renderDots(Dot, this.props.sensor.slice(), this.props.tipoSensor.slice());
    var strVP = this.state.coorActual[0] + " " + this.state.coorActual[1] +" 1000 450";
    return (
      //viewBox="000 -000 1200 600"
      <svg width={this.props.width} height={this.props.height} data-reactid=".0.1.0.0" viewBox={strVP}>
        <defs>
          <pattern id="img1" patternUnits="userSpaceOnUse" width="100" height="100">
            <image href="https://image.freepik.com/vector-gratis/fondo-decorativo-blanco_1268-1295.jpg" x="0" y="0" width="100" height="100" />
          </pattern>
        </defs>
        <Fondo />
        <Fondo2 />
        {lines}
        {dots}
        {linMedidas}
        {linMedidasTopes}
        {linMedidasTopes2}
        {textMedidas}
        {linPuertas}
        {arcPuertas}
        {sensoresDots}
      </svg>
    );
  }
}

Drawer.defaultProps = {
  editable: true
};

export default Drawer;