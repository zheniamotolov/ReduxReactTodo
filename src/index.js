import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import {createStore} from 'redux'
import rootRedux from './reducers'
import App from './components/App'

const store = createStore(rootRedux)

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
)