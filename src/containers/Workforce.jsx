import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { EmployeeList, EmployeeForm } from '../components/Employee'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
const debug = require('debug')('bussiness')

function Workforce({ match, onNewEmployeeClick, data }) {
  const { loading, workforce = [] } = data

  if (loading) return <div>Loading...</div>

  return (
    <Switch>
      <Route exact path={`${match.url}/`} render={withRouter(({ history }) => <EmployeeList workforce={workforce} history={history} />)} />
      <Route path={`${match.url}/employee/:employeeId?`} render={withRouter(({ history, ...rest }) => <EmployeeForm onSubmit={onNewEmployeeClick} closeForm={() => history.push('/workforce')} history={history} {...rest} />)} />
    </Switch>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = () => {
  return {
    onNewEmployeeClick: () => debug('new Employee')
  }
}

export default graphql(gql`
  {
    workforce {
      id,
      name,
      image
    }
  }
  `)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Workforce)
  )