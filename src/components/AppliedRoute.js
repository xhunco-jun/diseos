import React from "react";
import { Route } from "react-router-dom";

// Permite manejar el paso del estado y funciones a traves de las rutas
export default ({ component: C, props: cProps, ...rest }) =>
  <Route {...rest} render={props => <C {...props} {...cProps} />} />;
