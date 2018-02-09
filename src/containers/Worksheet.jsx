import React from 'react'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Grid } from 'material-ui'
import { BusinessCardSummary } from '../components/Business'
import { EmployeeCalendar } from '../components/Employee'
const debug = require('debug')('workSheet')

function Worksheet({ data }) {
  const { loading, company } = data

  if (loading) return <div>Loading...</div>

  return (
    <React.Fragment>
      <Grid justify="center" direction="row" spacing={40} container>
        <Grid xs={12} sm={6} item>
          <BusinessCardSummary data={company} />
        </Grid>
        <Grid xs={12} sm={10} item>
          {company.workforce.map(employee => <EmployeeCalendar key={employee.id} data={employee} /> )}
        </ Grid>
      </Grid>
    </React.Fragment>
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
      name,
      cif,
      image,
      workforce {
        id,
        name,
        image,
        fullSalary,
        halfSalary
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
