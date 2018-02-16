import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  withRouter
} from 'react-router-dom'
import { connect } from 'react-redux'
import './App.css'
import Loadable from 'react-loadable'
import PrivateRoute from './PrivateRoute'
import MenuAppBar from './MenuAppBar'
import Loading from './Loading'

const Auth = Loadable({
  loader: () => import(/* webpackChunkName: "auth" */ '../containers/Auth'),
  loading: Loading
})

const Business = Loadable({
  loader: () =>
    import(/* webpackChunkName: "business" */ '../containers/Business'),
  loading: Loading
})

const Workforce = Loadable({
  loader: () =>
    import(/* webpackChunkName: "workforce" */ '../containers/Workforce'),
  loading: Loading
})

const Worksheet = Loadable({
  loader: () =>
    import(/* webpackChunkName: "worksheet" */ '../containers/Worksheet'),
  loading: Loading
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
                <Redirect exact from={'/'} to={'/business'} />
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
