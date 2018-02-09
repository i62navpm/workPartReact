import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from 'react-router-dom'
import { connect } from 'react-redux'
import './App.css'
import Loadable from 'react-loadable'
import PrivateRoute from './PrivateRoute'
import MenuAppBar from './MenuAppBar'

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

const Worksheet = Loadable({
  loader: () =>
    import(/* webpackChunkName: "worksheet" */ '../containers/Worksheet'),
  loading() {
    return <div>Loading...</div>
  }
})

class App extends Component {
  showAppBar() {
    return !window.location.pathname.includes('/auth') && this.props.user.email
  }
  render() {
    return (
      <div className="App">
        <div className="App-intro">
          <Router>
            <div>
              {this.showAppBar() && (
                <Route
                  render={withRouter(({ history }) => (
                    <MenuAppBar history={history} />
                  ))}
                />
              )}
              <Switch>
                <Route path="/auth" component={Auth} />
                <PrivateRoute path="/business" component={Business} />
                <PrivateRoute path="/workforce" component={Workforce} />
                <PrivateRoute
                  path="/worksheet/:companyId"
                  component={Worksheet}
                />
                <Route exact path="/" render={() => <h3>Main App</h3>} />
              </Switch>
            </div>
          </Router>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth
  }
}

export default connect(mapStateToProps)(App)
