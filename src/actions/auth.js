import CognitoSDK from '../utils/cognito.service'
export const SET_USER = 'SET_USER'
export const LOGIN_USER = 'LOGIN_USER'
export const REGISTER_USER = 'REGISTER_USER'
export const VERIFICATE_USER = 'VERIFICATE_USER'
export const LOGOUT_USER = 'LOGOUT_USER'

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
