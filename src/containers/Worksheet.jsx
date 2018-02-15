import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import WorksheetPresentational from '../components/Worksheet'
import { EmployeeForm } from '../components/Employee'
const debug = require('debug')('workSheet')

function Worksheet({ match, data, onNewEmployeeClick }) {
  const { loading } = data

  if (loading) return <div>Loading...</div>

  return (
    <Switch>
      <Route exact path={`${match.url}/`} render={() => <WorksheetPresentational data={data} />} />
      <Route path={`${match.url}/employee/:employeeId?`} render={withRouter(({ history, ...rest }) => <EmployeeForm onSubmit={onNewEmployeeClick} closeForm={() => history.push(`${match.url}`)} history={history} {...rest} />)} />
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
  query getCompany($companyId: ID) {
    company(id: $companyId) {
      id,
      name,
      cif,
      image,
      workforce {
        id,
        name,
        image,
        fullSalary,
        halfSalary,
        events {
          pay {
            data {
              title,
              salary,
              money
            },
            allDay,
            start,
            end
          },
          debt {
            data {
              title,
              salary,
              money
            },
            allDay,
            start,
            end
          }
        }
      }
    }
  }
  `, {
    options: ({ match }) => {
      return { variables: { companyId: match.params.companyId } }
    }
  })(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Worksheet)
  )
