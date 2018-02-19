import React from 'react'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Login from '../components/Login'
import Register from '../components/Register'
import Verification from '../components/Verification'
import ForgotPassword from '../components/ForgotPassword'
import { loginUser, registerUser, verificationUser, forgotPasswordUser, confirmPasswordUser } from '../actions/auth'
import { setNotification } from '../actions/notification'

function Auth({ match, onLoginClick, onRegisterClick, onVerificationClick, onForgotPasswordClick, onConfirmPasswordClick, setNotification }) {
  return (
    <div>
      <Switch>
        <Route path={`${match.url}/login`} render={withRouter(({history}) => <Login onSubmit={onLoginClick} setNotification={setNotification} history={history}/>)} />
        <Route path={`${match.url}/register`} render={withRouter(({history}) => <Register onSubmit={onRegisterClick} setNotification={setNotification} history={history}/>)} />
        <Route path={`${match.url}/verification`} render={withRouter(({history}) => <Verification onSubmit={onVerificationClick} setNotification={setNotification} history={history}/>)} />
        <Route path={`${match.url}/forgotPassword`} render={withRouter(({ history }) => <ForgotPassword onSubmit={onConfirmPasswordClick} onNextStep={onForgotPasswordClick} setNotification={setNotification} history={history}/>)} />
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
    onForgotPasswordClick: (user = {}) => dispatch(forgotPasswordUser(user)),
    onConfirmPasswordClick: (user = {}) => dispatch(confirmPasswordUser(user)),
    setNotification: (notification = {}) => dispatch(setNotification(notification)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth)