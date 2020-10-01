import React, { Component } from "react";
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Button, FormGroup } from "react-bootstrap";
import "./Login.css";
//import EosService from "../eosio/EosService";
import logo from './icono_scatter.jpg';

export default class Login extends Component {
  constructor(props) {
    super(props);
    /* Almacena el estado del formulario */
    this.state = {
      email: "",
      password: ""
    };
    this.data = {
      eosio: null
    }
  }

  validateForm() {
    //return this.state.email.length > 0 && this.state.password.length > 0;
    return true;
  }

  // Actualiza el estado del formulario - Antes cuando se usaba correo-password
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  /* Para evitar que el formulario de mande */
  handleSubmit = async event => {
    event.preventDefault();
    // Sin el await no espera a que la función terminé - produce errores
    await this.props.eosiop.iniciarSesion();
    // Aquí el verificarSesionEos es de EosService y no de app
    var cuenta = this.props.eosiop.verificarSesionEos();
    if (cuenta !== null) {
      console.log("la cuenta existe");
      console.log(cuenta);
      this.props.guardarCache(this.props.eosiop.scatter);
      this.props.autentificarUsuario(cuenta);

      
      this.props.history.push("/drawer");
    }else {
      console.log("la cuenta no existe");
      console.log(cuenta);
    }
  }
  

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          {/*<FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>*/}
          <FormGroup controlId="email" bsSize="large">
            <img src={logo} alt="Scatter" align="middle" />
          </FormGroup>
          <Button variant="primary"
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Iniciar sesión con Scatter
          </Button>
        </form>
      </div>
    );
  }
}
