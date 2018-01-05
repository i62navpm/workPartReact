import React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore, compose } from 'redux'
import ReactDOM from 'react-dom'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import './index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import storeApp from './reducers'

const store = createStore(storeApp, compose(applyMiddleware(thunk, logger)))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
