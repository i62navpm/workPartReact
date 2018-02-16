import { SET_LOADER } from '../actions/loader'

const loader = (state = { loading: false }, action) => {
  switch (action.type) {
    case SET_LOADER:
      return action.loading
    default:
      return state
  }
}

export default loader
