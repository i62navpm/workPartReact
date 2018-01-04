import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import Login from './Login'
import Register from './Register'

export default function Auth({ match }) {
  return (
    <div>
      <Switch>
        <Route path={`${match.url}/login`} component={Login} />
        <Route path={`${match.url}/register`} component={Register} />
        <Redirect from={`${match.url}/`} to={`${match.url}/login`} />
      </Switch>
    </div>
  )
}