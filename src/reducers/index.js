import { combineReducers } from 'redux'
import auth from './auth'
import business from './business'

const storeApp = combineReducers({
  auth,
  business
})

export default storeApp
