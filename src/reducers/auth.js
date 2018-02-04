import { SET_USER, LOGOUT_USER } from '../actions/auth'

const auth = (state = {}, action) => {
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
