import { combineReducers } from 'redux'
import auth from './auth'
import business from './business'
import loader from './loader'

const storeApp = combineReducers({
  auth,
  business,
  loader
})

export default storeApp
