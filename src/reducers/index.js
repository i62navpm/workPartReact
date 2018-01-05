import { combineReducers } from 'redux'
import auth from './auth'

const storeApp = combineReducers({
  auth
})

export default storeApp
