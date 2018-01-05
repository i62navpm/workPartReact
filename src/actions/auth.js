export const SET_USER = 'SET_USER'
export const LOGIN_USER = 'LOGIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'

export function setUser(user) {
  return {
    type: SET_USER,
    user
  }
}

export function loginUser(user) {
  return dispatch => {
    dispatch({ type: LOGIN_USER })
    dispatch({ type: LOGOUT_USER })
    return new Promise(resolve => {
      setTimeout(() => resolve(dispatch(setUser(user))), 2000)
    })
  }
}
