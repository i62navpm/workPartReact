import CognitoSDK from '../utils/cognito.service'
export const SET_USER = 'SET_USER'
export const LOGIN_USER = 'LOGIN_USER'
export const REGISTER_USER = 'REGISTER_USER'
export const VERIFICATE_USER = 'VERIFICATE_USER'
export const LOGOUT_USER = 'LOGOUT_USER'
export const FORGOT_PASSWORD_USER = 'FORGOT_PASSWORD_USER'
export const CONFIRM_PASSWORD_USER = 'CONFIRM_PASSWORD_USER'

const cognito = new CognitoSDK()

export function setUser(user) {
  return {
    type: SET_USER,
    user
  }
}

export function loginUser({ username, password }) {
  return async dispatch => {
    dispatch({ type: LOGOUT_USER })
    try {
      let email = await cognito.login(username, password)
      dispatch({ type: LOGIN_USER })
      dispatch(setUser(email))
    } catch (error) {
      throw new Error(error)
    }
  }
}

export function registerUser({ username, password }) {
  return async dispatch => {
    try {
      let result = await cognito.register(username, password)
      dispatch({ type: REGISTER_USER })
      dispatch(setUser({ email: result.user.username }))
      return result.userConfirmed
    } catch (error) {
      throw new Error(error)
    }
  }
}

export function verificationUser({ code }) {
  return async (dispatch, getState) => {
    try {
      let result = await cognito.verificateCode({
        Username: getState().auth.email,
        code
      })
      dispatch({ type: VERIFICATE_USER })
      return result
    } catch (error) {
      throw new Error(error)
    }
  }
}

export function forgotPasswordUser({ email }) {
  return async dispatch => {
    try {
      let result = await cognito.forgotPassword({ Username: email })
      dispatch({ type: FORGOT_PASSWORD_USER })
      return result
    } catch (error) {
      throw new Error(error)
    }
  }
}

export function confirmPasswordUser({ email, code, password }) {
  return async dispatch => {
    try {
      let result = await cognito.confirmPassword({
        Username: email,
        code,
        password
      })
      dispatch({ type: CONFIRM_PASSWORD_USER })
      return result
    } catch (error) {
      throw new Error(error)
    }
  }
}

export function getSessionUser() {
  return async dispatch => {
    try {
      let { email, token } = await cognito.getUserSession()
      dispatch(setUser(email))
      return token
    } catch (error) {
      throw new Error(error)
    }
  }
}
