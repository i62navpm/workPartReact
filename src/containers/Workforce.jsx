import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { EmployeeList, EmployeeForm } from '../components/Employee'
import { setLoader } from '../actions/loader'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
const debug = require('debug')('bussiness')

class Workforce extends React.Component {
  constructor(props) {
    super(props)
    this.props.setLoader(true)

    const { loading, workforce = {} } = props.data

    this.state = {
      workforce,
      loading
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data: { loading, workforce } } = nextProps
    this.setState({ loading, workforce })
    this.props.setLoader(loading)
  }

  render() {
    let { loading, workforce } = this.state

    if (loading) return null

    return (
      <Switch>
        <Route exact path={`${this.props.match.url}/`} render={withRouter(({ history }) => <EmployeeList workforce={workforce} history={history} />)} />
        <Route path={`${this.props.match.url}/employee/:employeeId?`} render={withRouter(({ history, ...rest }) => <EmployeeForm onSubmit={this.props.onNewEmployeeClick} closeForm={() => history.push('/workforce')} history={history} {...rest} />)} />
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