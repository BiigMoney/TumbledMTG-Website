import React from 'react';
import ReactDOM from 'react-dom';
import Router from './Router';
import 'bootstrap/dist/js/bootstrap.js';
import "bootstrap/js/src/collapse.js"
import './css/bootstrap.min.css';
import './css/App.css';

ReactDOM.render(
  
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);


