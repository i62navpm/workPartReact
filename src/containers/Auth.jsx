import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import Login from '../components/Login'
import Register from '../components/Register'
import { loginUser } from '../actions/auth'

function Auth({ match, onLoginClick }) {
  return (
    <div>
      <p>{}</p>
      <Switch>
        <Route path={`${match.url}/login`} render={() => <Login onSubmit={onLoginClick} />}/>
        <Route path={`${match.url}/register`} component={Register} />
        <Redirect from={`${match.url}/`} to={`${match.url}/login`} />
      </Switch>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginClick: (user = {}) => dispatch(loginUser(user))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth)