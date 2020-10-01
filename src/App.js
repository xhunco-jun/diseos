import React, { Component, Fragment } from "react";
//import { Link } from "react-router-dom";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem} from "react-bootstrap";
//import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
// Se importa para comprobar que si se tiene Scatter, y se ha iniciado sesión
import EosService from "./eosio/EosService";

class App extends Component {
  //  Para almacenar el estado de sesión iniciada
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      /*eosio: new EosService(`dAppDisenos XD 4`,`maria`),*/
      //scatter: null,
      account: null
    }
    this.data = {
      eosio: new EosService(`dAppDisenos XD 4`,`maria`)
    }
  }
  componentDidMount() {
    if (this.data.eosio.scatter === null){
      const cacheScatter = localStorage.getItem("scatterx");
      console.log("componentDidMount");
      //console.log(cacheScatter);
      if (cacheScatter) {
        this.data.eosio.scatter = JSON.parse(cacheScatter);
        //this.setState({account: cacheCuenta});
        var cuenta = this.data.eosio.verificarSesionEos();
        //console.log(this.data.eosio.scatter.identity);
        //console.log(cuenta);
        if (cuenta !== null) {
          console.log("la cuenta existe cache");
          //console.log(cuenta);
          this.data.eosio.account = cuenta;
          //this.props.guardarCache(this.props.eosiop.scatter);
          this.autentificarUsuario(cuenta);
        }
      }
      console.log("componentDidMount");
    }

    //console.log(this.data.eosio.scatter);
    this.conectarScatter();
    //console.log(this.data.eosio.scatter);
    this.verificarSesion();
    //console.log(this.state.account);
  }
  guardarCache(datoScatter){
    localStorage.setItem("scatterx", JSON.stringify(datoScatter));
    console.log(datoScatter);
  }
  /*userHasAuthenticated = authenticated => {
    this.setState({isAuthenticated: authenticated});
  }*/
  autentificarUsuario = accountd => {
    this.setState({account: accountd});
  }
  handleLogout = async () => {
    console.log("Funcion para deslogear");
    console.log(this.data.eosio);
    await this.data.eosio.logout();
    localStorage.removeItem("scatterx");
    this.verificarSesion();
    // Regresar a iniciar sesion
    this.props.history.push("/login");
  }

  verificarSesion = async () => {
    try {
      var cuenta = await this.data.eosio.verificarSesionEos();
      if (!(cuenta)){
        console.log(cuenta);
        this.autentificarUsuario(cuenta);
        return console.log('No se esta logeado');
      }else {
        // Si cuenta es nulo, no existe sesión
        //console.log(cuenta);
        console.log("Sesión iniciada");
        this.autentificarUsuario(cuenta);
      }
    } catch (e) {
      console.log("Error en try catch verificarSesion");
      /*alert("Hello!!!2!");*/
      alert(e.message);
    }
  }

  conectarScatter = async () => {
    try {
      if (!(await this.data.eosio.connectNet())){
        //alert("Error al logearse");
        //alert(this.data.eosio);
        console.log(this.data.eosio);
        return console.log('Failed to get Scatter account');
      }else {
        // Si todo sale bien, Scatter existe
        //console.log(this.data.eosio);
        // Si logra conectarse pero no se esta en una sesión producirá error
        this.setState({scatter: this.data.eosio.scatter});
        //alert("Logged in");
      }
    } catch (e) {
      console.log("Error en try catch conectarScatter");
      /*alert("Hello!!!2!");*/
      alert(e.message);
    }
  }

  render() {
    /*handleLogout = event => {
      this.userHasAuthenticated(false);
    }*/
    
    // Para pasar referencia del metodo userHasAuthenticated y estado isAuthenticated a login (y otros)
    const childProps = {
      //scatter: this.state.scatter,
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,

      autentificarUsuario: this.autentificarUsuario,
      account: this.state.account,
      eosiop: this.data.eosio,
      guardarCache: this.guardarCache
    }

    return (
      
      // Se crea el contenedor
      // Se crea una barra de navegación que se adapte a la anchura del contendor con fluid
      // Link to para ir a home sin refrescar la página
      // Los LinkContainer son para que cargue los componentes en la misma página (Sin refrescarla toda)
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Scratch</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav pullRight>
            {(this.state.scatter !== null) && (this.state.account !== null)
              ? <NavItem onClick={this.handleLogout}>Cerrar sesión</NavItem>
              : <Fragment>
                  <LinkContainer to="/signup">
                    <NavItem>Registrarse
                    </NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Iniciar sesión</NavItem>
                  </LinkContainer>
                </Fragment>}
            
            {/*!this.state.isAuthenticated && this.conectarScatter()
              ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
              : <Fragment>
                  <LinkContainer to="/signup">
                    <NavItem>Registrarse
                    </NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Iniciar sesión</NavItem>
                  </LinkContainer>
                </Fragment>
            */}
            </Nav>
          </Navbar.Collapse>

        </Navbar>
        {/* Routes para poder cargar otros componentes en la misma página - childProps permite modificar el estado a logeado this.state.eosio.scatter.identity.hash*/}
        <Routes childProps={childProps} />
      </div>
    );
  }
}
export default withRouter(App);