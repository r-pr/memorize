import  rootReducer  from './reducers';

var state = {}

import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import App from './containers/App'

const loggerMiddleware = createLogger()

let store = createStore(
	rootReducer, 
	applyMiddleware(
		loggerMiddleware,
		thunkMiddleware
	)
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);