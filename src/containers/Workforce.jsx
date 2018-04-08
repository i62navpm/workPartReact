import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { EmployeeList, EmployeeForm } from '../components/Employee'
import { setLoader } from '../actions/loader'
import { setNotification } from '../actions/notification'
import { graphql, compose } from 'react-apollo'
import queryEmployeesByBusinessIdIndex from '../graphql/queries/queryEmployeesByBusinessIdIndex'
import createEmployee from '../graphql/mutations/createEmployee'
import updateEmployee from '../graphql/mutations/updateEmployee'
import deleteEmployee from '../graphql/mutations/deleteEmployee'
import { v4 as uuid } from 'uuid'

class Workforce extends React.Component {
  constructor(props) {
    super(props)
    this.props.setLoader(true)

    const { loading, workforce = {} } = props.data

    this.state = {
      workforce,
      loading,
      businessId: this.props.match.params.companyId
    }

    this.submitForm = this.submitForm.bind(this)
    this.removeEmployee = this.removeEmployee.bind(this)
  }

  updateEmployee(data) {
    this.props.setLoader(true)
    return this.props.updateEmployee({
      variables: { input: data },
      update: (proxy) => {
        const options = {
          query: queryEmployeesByBusinessIdIndex,
          variables: { businessId: this.state.businessId }
        }
        const data = proxy.readQuery(options)
        proxy.writeQuery({ ...options, data })
      }
    })
  }

  createEmployee(data) {
    this.props.setLoader(true)
    return this.props.createEmployee({
      variables: { input: data },
      update: (proxy, { data: { createEmployee } }) => {
        const options = {
          query: queryEmployeesByBusinessIdIndex,
          variables: { businessId: this.state.businessId }
        }
        const data = proxy.readQuery(options)
        data.queryEmployeesByBusinessIdIndex.items.push(createEmployee)
        proxy.writeQuery({ ...options, data })
      }
    })
  }

  removeEmployee(data) {
    this.props.setLoader(true)
    data = { businessId: this.state.businessId, ...data }
    return this.props.deleteEmployee({
      variables: { input: data },
      update: (proxy, { data: { deleteEmployee } }) => {
        const options = {
          query: queryEmployeesByBusinessIdIndex,
          variables: { businessId: this.state.businessId }
        }
        const data = proxy.readQuery(options)
        data.queryEmployeesByBusinessIdIndex.items = data.queryEmployeesByBusinessIdIndex.items.filter(item => item.id !== deleteEmployee.id)
        proxy.writeQuery({ ...options, data })
      }
    })
  }

  submitForm(employeeData) {
    if (employeeData.id)
      return this.updateEmployee(employeeData)

    const idInfo = { businessId: this.state.businessId, id: uuid() }
    employeeData = { ...idInfo, ...employeeData }
    return this.createEmployee(employeeData)
  }

  componentWillReceiveProps(nextProps) {
    const { data: { loading, queryEmployeesByBusinessIdIndex } } = nextProps
    const { items } = queryEmployeesByBusinessIdIndex || { items: [] }

    this.setState({ loading, workforce: items })
    this.props.setLoader(loading)
  }

  render() {
    let { loading, workforce } = this.state

    if (loading) return null

    return (
      <Switch>
        <Route exact path={`${this.props.match.url}/`} render={withRouter(({ history, ...rest }) => <EmployeeList workforce={workforce} onRemove={this.removeEmployee} history={history} {...rest} />)} />
        <Route exact path={`${this.props.match.url}/employee/:employeeId?`} render={withRouter(({ history, ...rest }) => <EmployeeForm onSubmit={this.submitForm} businessId={this.props.match.params.companyId} setNotification={this.props.setNotification} closeForm={() => history.push(this.props.match.url)} history={history} {...rest} />)} />
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
    setLoader: (loading) => dispatch(setLoader({ loading })),
    setNotification: (notification = {}) => dispatch(setNotification(notification)),
  }
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(compose(
  graphql(queryEmployeesByBusinessIdIndex, {
    options: ({ match }) => ({
      variables: { businessId: match.params.companyId },
      fetchPolicy: 'network-only'
    }),
  }),
  graphql(createEmployee, { name: 'createEmployee' }),
  graphql(updateEmployee, { name: 'updateEmployee' }),
  graphql(deleteEmployee, { name: 'deleteEmployee' }),
)(Workforce))
)