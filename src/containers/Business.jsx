import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { BusinessList, BusinessForm } from '../components/Business'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
const debug = require('debug')('bussiness')

function Business({ match, onNewBusinessClick, data }) {
  const { loading, business = [] } = data

  if (loading) return <div>Loading...</div>

  return (
    <Switch>
      <Route exact path={`${match.url}/`} render={withRouter(({ history }) => <BusinessList business={business} history={history} />)} />
      <Route path={`${match.url}/company/:companyId?`} render={withRouter(({ history, ...rest }) => <BusinessForm onSubmit={onNewBusinessClick} closeForm={() => history.push('/business')} history={history} {...rest} />)} />
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
    onNewBusinessClick: () => debug('new Business')
  }
}

export default graphql(gql`
  {
    business {
      id,
      name,
      date,
      image
    }
  }
  `)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Business)
  )