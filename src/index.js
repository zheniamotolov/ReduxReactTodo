import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import {createStore} from 'redux'
import rootRedux from './reducers'
import App from './components/App'
import 'popper.js'
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'jquery/dist/jquery.js';

const store = createStore(rootRedux)

render(
        <App/>,
    document.getElementById('root')
)