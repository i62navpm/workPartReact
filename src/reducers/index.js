import { combineReducers } from 'redux'
import auth from './auth'
import business from './business'
import loader from './loader'
import drawer from './drawer'

const storeApp = combineReducers({
  auth,
  business,
  loader,
  drawer
})

export default storeApp
