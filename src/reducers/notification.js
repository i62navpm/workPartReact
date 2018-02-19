import { SET_NOTIFICATION } from '../actions/notification'

const drawer = (state = { open: false }, action) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      return action.notification
    default:
      return state
  }
}

export default drawer
