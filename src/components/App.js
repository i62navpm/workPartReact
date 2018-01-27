import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import logo from '../logo.svg'
import './App.css'
import Loadable from 'react-loadable'
import PrivateRoute from './PrivateRoute'

const Auth = Loadable({
  loader: () => import(/* webpackChunkName: "auth" */ '../containers/Auth'),
  loading() {
    return <div>Loading...</div>
  }
})

const Business = Loadable({
  loader: () =>
    import(/* webpackChunkName: "business" */ '../containers/Business'),
  loading() {
    return <div>Loading...</div>
  }
})

const Workforce = Loadable({
  loader: () =>
    import(/* webpackChunkName: "workforce" */ '../containers/Workforce'),
  loading() {
    return <div>Loading...</div>
  }
})

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <Router>
            <Switch>
              <Route path="/auth" component={Auth} />
              <PrivateRoute path="/business" component={Business} />
              <PrivateRoute path="/workforce" component={Workforce} />
              <Route exact path="/" render={() => <h3>Main App</h3>} />
            </Switch>
          </Router>
        </div>
      </div>
    )
  }
}

export default App
