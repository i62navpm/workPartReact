import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import logo from '../logo.svg'
import './App.css'
import Loadable from 'react-loadable'

const Auth = Loadable({
  loader: () => import(/* webpackChunkName: "auth" */ '../containers/Auth'),
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
            <div>
              <Route path="/auth" component={Auth} />
              <Route exact path="/" render={() => <h3>Main App</h3>} />
            </div>
          </Router>
        </div>
      </div>
    )
  }
}

export default App
