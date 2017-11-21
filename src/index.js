import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';
import 'react-select/dist/react-select.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'jquery/src/jquery';

// Bootstrap imports
const tether = require('tether');
global.Tether = tether;
require('bootstrap');


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
