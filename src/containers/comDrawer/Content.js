import React, {Component} from 'react';
import ipfsClient from 'ipfs-http-client';
import Composer from './Composer';
import './Content.css'

class Content extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      fractals: []
    };
    this.manejadorGuardarPlano = this.manejadorGuardarPlano.bind(this);
    this.ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https'});
  }

  /*onFractalSelected(fractal) {
    this.setState({selected: fractal});
  }*/

  onFractalRemove(key) {
    //debugger;
    //this.firebaseRef.child(key).remove();
  }
  handleAddFractal (newFractal) {
    alert('Aquí se debería invocar al metodo se guardar plano');
    //this.firebaseRef.push(newFractal);
  }
  manejadorGuardarPlano = async (nuevoPlano) => {
  //manejadorGuardarPlano (nuevoPlano) {
    console.log(nuevoPlano);
    var cuenta = this.props.eosiop.verificarSesionEos();
    console.log(cuenta);
    alert('Aquí se invoca al metodo de guardar plano');
    //this.firebaseRef.push(newFractal);
    var planoIpfs = JSON.stringify(nuevoPlano);
    console.log("########################################33");
    console.log(planoIpfs);
    console.log("########################################33");
    const buf1 = Buffer.from(planoIpfs);
    console.log("########################################33");
    console.log(buf1.toString());
    console.log("########################################33");
    //this.obtenerTablas(buf1);
    //await this.props.eosiop.getKings();
    await this.subirArchivo(buf1);
  }

  subirArchivo = async (content) => {
    console.info("ssssssr");
	  try {
      const results = await this.ipfs.add(content)
      const hash = results[0].hash // "Qm...WW"
      console.log(hash);
      alert(hash);
	  } catch (e) {
	    alert(e.message);
	  }
  }

  render() {
    return (
      <div>
        {/** onAdd es innecesario ya que hace uso de Firebase y no afecta la funcionalidad de la aplicación
        <Composer fractal={this.state.selected} onAdd={this.handleAddFractal} />*/}
        <Composer fractal={this.state.selected} onAdd={this.manejadorGuardarPlano}/>
      </div>
    );
  }
}

Content.defaultProps = {
  width:  200,
  height: 200
};

export default Content;


/*var React = require("react");
//var Firebase = require("firebase");
var Victor = require("victor");
var Composer = require("./Composer");
var FractalCollection = require("./FractalCollection");


var Content = React.createClass({

  getInitialState() {
    return {
      selected: null,
      fractals: []
    };
  },

  /*componentDidMount() {
    this.firebaseRef = new Firebase("https://mini3-firebase.firebaseio.com/").child("fractals");
    this.firebaseRef.on('value', this.handleFirebaseChange);
    // this.firebaseRef.on("child_added", this.onFractalAdd);
  },

  handleFirebaseChange (snapshot) {
    var list = this.toArray(snapshot.val());
    fractals = this.parseFractals(list);

    this.setState({ fractals: fractals });
  },

  parseFractals(list) {
    var fractals = list.reverse().map((fractal) => {
      fractal.val.segment = fractal.val.segment.map((seg) => {
        return Victor.fromObject(seg);
      });
      fractal.val.shape = fractal.val.shape.map((point) => {
        return Victor.fromObject(point);
      });
      return fractal;
    });
    return fractals;
  },

  toArray(object) {
    var arr = [];
    for (var i in object) {
      var obj = {};
      obj.val = object[i];
      obj.val = obj.val;
      obj.key = i;
      arr.push(obj);
    }
    return arr;
  },*/

  /*onFractalAdd(snapshot) {
    var object = { key: snapshot.key(), val: snapshot.val() };
    var newFractals = this.state.fractals.concat(this.parseFractals([object]));
    this.setState({ fractals: newFractals });
  },

  handleAddFractal: function(newFractal) {
    this.firebaseRef.push(newFractal);
  },

  onFractalSelected(fractal) {
    this.setState({selected: fractal});
  },

  onFractalRemove(key) {
    debugger;
    this.firebaseRef.child(key).remove();
  },* /

  getDefaultProps() {
    return {
      width:  200,
      height: 200
    };
  },

  render() {
    return (
      <div>
        <FractalCollection
          {/** Estos metodos se utilizan en otros archivos y en las líneas de abajo se le son enviados al componente FractalCollection * /}
          onSelect={this.onFractalSelected}
          onRemove={this.onFractalRemove}
          fractals={this.state.fractals}
          width={this.props.width} height={this.props.height}/>

        <Composer fractal={this.state.selected} onAdd={this.handleAddFractal}/>
      </div>
    );
  }
});

module.exports = Content;
*/