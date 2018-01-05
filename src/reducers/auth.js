import { SET_USER, LOGOUT_USER } from '../actions/auth'

const initialState = {
  username: 'Manuel Navarro',
  email: 'manuelnavarro1987@gmail.com'
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return action.user
    case LOGOUT_USER:
      return {}
    default:
      return state
  }
}

export default auth
