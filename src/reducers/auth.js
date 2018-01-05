import { SET_USER } from '../actions/auth'

const initialState = {
  name: 'Manuel Navarro',
  email: 'manuelnavarro1987@gmail.com'
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return action.user
    default:
      return state
  }
}

export default auth
