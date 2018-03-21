import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import WorksheetPresentational from '../components/Worksheet'
import { setLoader } from '../actions/loader'
import { EmployeeForm } from '../components/Employee'
import { EmployeeSummary } from '../components/Employee'
import getBusinessWithEmployees from '../graphql/queries/getBusinessWithEmployees'
import updateEmployee from '../graphql/mutations/updateEmployee'

class Worksheet extends React.Component {
  constructor(props) {
    super(props)
    this.props.setLoader(true)

    const { loading, company = {} } = props.data

    this.state = {
      company,
      loading
    }

    this.updateEmployee = this.updateEmployee.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { data: { loading, getBusiness } } = nextProps
    this.setState({ loading, company: getBusiness })
    this.props.setLoader(loading)
  }

  updateEmployee(data) {
    this.props.setLoader(true)
    return this.props.updateEmployee({
      variables: { input: data },
      update: (proxy, { data: { updateEmployee } }) => {
        const options = {
          query: getBusinessWithEmployees,
          variables: { id: this.props.match.params.companyId, userId: this.props.user.email }
        }
        const data = proxy.readQuery(options)
        data.getBusiness.employees.items = data.getBusiness.employees.items.map(
          item => item.id === updateEmployee.id ? updateEmployee : item
        )
        proxy.writeQuery({ ...options, data })
      }
    })
  }

  render() {
    let { loading, company } = this.state

    if (loading) return null

    return (
      <Switch>
        <Route exact path={`${this.props.match.url}/`} render={() => <WorksheetPresentational company={company} />} />
        <Route path={`${this.props.match.url}/employee/:employeeId?`} render={withRouter(({ history, ...rest }) => <EmployeeForm onSubmit={this.updateEmployee} businessId={company.id} closeForm={() => history.push(`${this.props.match.url}`)} history={history} {...rest} />)} />
        <Route path={`${this.props.match.url}/summary/:employeeId`} render={withRouter(({ history, ...rest }) => <EmployeeSummary closeForm={() => history.push(`${this.props.match.url}`)} history={history} businessId={company.id} {...rest} />)} />
      </Switch>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setLoader: (loading) => dispatch(setLoader({ loading }))
  }
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(compose(
  graphql(getBusinessWithEmployees, {
    options: ({ match, user: { email } }) => ({
      variables: { id: match.params.companyId, userId: email },
      fetchPolicy: 'network-only'
    }),
  }),
  graphql(updateEmployee, { name: 'updateEmployee' }),
)(Worksheet))
)
