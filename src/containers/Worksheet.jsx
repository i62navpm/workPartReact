import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import WorksheetPresentational from '../components/Worksheet'
import { setLoader } from '../actions/loader'
import { EmployeeForm } from '../components/Employee'
const debug = require('debug')('workSheet')

class Worksheet extends React.Component {
  constructor(props) {
    super(props)
    this.props.setLoader(true)

    const { loading, company = {} } = props.data

    this.state = {
      company,
      loading
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data: { loading, company } } = nextProps
    this.setState({ loading, company })
    this.props.setLoader(loading)
  }

  render() {
    let { loading, company } = this.state

    if (loading) return null

    return (
      <Switch>
        <Route exact path={`${this.props.match.url}/`} render={() => <WorksheetPresentational company={company} />} />
        <Route path={`${this.props.match.url}/employee/:employeeId?`} render={withRouter(({ history, ...rest }) => <EmployeeForm onSubmit={this.props.onNewEmployeeClick} closeForm={() => history.push(`${this.props.match.url}`)} history={history} {...rest} />)} />
      </Switch>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onNewEmployeeClick: () => debug('new Employee'),
    setLoader: (loading) => dispatch(setLoader({ loading }))
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
