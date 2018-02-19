import { combineReducers } from 'redux'
import auth from './auth'
import business from './business'
import loader from './loader'
import drawer from './drawer'
import notification from './notification'

const storeApp = combineReducers({
  auth,
  business,
  loader,
  drawer,
  notification
})

export default storeApp
