import React from 'react'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Login from '../components/Login'
import Register from '../components/Register'
import Verification from '../components/Verification'
import ForgotPassword from '../components/ForgotPassword'
import { loginUser, registerUser, verificationUser } from '../actions/auth'

function Auth({ match, onLoginClick, onRegisterClick, onVerificationClick }) {
  return (
    <div>
      <p>{}</p>
      <Switch>
        <Route path={`${match.url}/login`} render={withRouter(({history}) => <Login onSubmit={onLoginClick} history={history}/>)} />
        <Route path={`${match.url}/register`} render={withRouter(({history}) => <Register onSubmit={onRegisterClick} history={history}/>)} />
        <Route path={`${match.url}/verification`} render={withRouter(({history}) => <Verification onSubmit={onVerificationClick} history={history}/>)} />
        <Route path={`${match.url}/forgotPassword`} render={withRouter(({history}) => <ForgotPassword onSubmit={onLoginClick} history={history}/>)} />
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
    onLoginClick: (user = {}) => dispatch(loginUser(user)),
    onRegisterClick: (user = {}) => dispatch(registerUser(user)),
    onVerificationClick: (user = {}) => dispatch(verificationUser(user)),
    onForgotPasswordClick: (user = {}) => dispatch(loginUser(user)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth)