import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Drawer from "./containers/comDrawer/Content";
import AppliedRoute from "./components/AppliedRoute";

// Recibe el childProps de App.js
export default ({childProps}) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps}/>
    <AppliedRoute path="/login" exact component={Login} props={childProps}/>
    <AppliedRoute path="/drawer" exact component={Drawer} props={childProps} />

    {/** Se cachan las rutas que no coincidan */}
    <Route component={NotFound} />
  </Switch>;
