import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { BrowserRouter as Router } from "react-router-dom";


ReactDOM.render(
    <Router>
      <App />
    </Router>,
    document.getElementById("root")
);


// Se reemplaza debido al uso de ReactRouter
// ReactDOM.render(<App />, document.getElementById('root'));

