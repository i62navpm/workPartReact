import { SET_DRAWER } from '../actions/drawer'

const drawer = (state = { open: false }, action) => {
  switch (action.type) {
    case SET_DRAWER:
      return action.open
    default:
      return state
  }
}

export default drawer
