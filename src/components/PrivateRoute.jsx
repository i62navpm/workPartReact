import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { getSessionUser } from '../actions/auth'

class PrivateRoute extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentWillMount() {
    try {
      this.setState({ token: await this.props.getSessionUser() })
    } catch (err) {
      this.setState({ token: false })
    }
  }

  render() {
    const { token } = this.state

    if (token === undefined) return null

    return (
      token ? 
      <Route {...this.props} render={ this.props.render} /> :
      <Redirect to={{ pathname: '/auth/login', state: { from: this.props.location } }} />
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
    getSessionUser: async () => dispatch(await getSessionUser()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivateRoute)