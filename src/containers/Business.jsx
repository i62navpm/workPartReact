import React from 'react'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import BusinessList from '../components/Business/BusinessList'
import BusinessForm from '../components/Business/BusinessForm'
function Business({ match, business = [], onNewBusinessClick }) {
  return (
    <Switch>
      <Route path={`${match.url}/list`} render={withRouter(({ history }) => <BusinessList business={business} history={history} />)} />
      <Route path={`${match.url}/new`} render={withRouter(({ history }) => <BusinessForm onSubmit={onNewBusinessClick} closeForm={() => history.push('/business/list')} history={history} />)} />
      <Redirect from={`${match.url}/`} to={`${match.url}/list`} />
    </Switch>
  )
}

const mapStateToProps = state => {
  return {
    business: state.business
  }
}

const mapDispatchToProps = () => {
  return {
    onNewBusinessClick: () => console.log('new Business')
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Business)