import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { BusinessList, BusinessForm } from '../components/Business'
import { setLoader } from '../actions/loader'
import { graphql, compose } from 'react-apollo'
import Loadable from 'react-loadable'
import Loading from '../components/Loading'
import queryBusinessesByUserIdIndex from '../graphql/queries/queryBusinessesByUserIdIndex'
import createBusiness from '../graphql/mutations/createBusiness'
import updateBusiness from '../graphql/mutations/updateBusiness'
import deleteBusiness from '../graphql/mutations/deleteBusiness'
import { v4 as uuid } from 'uuid'

const Workforce = Loadable({
  loader: () => import(/* webpackChunkName: "workforce" */ './Workforce'),
  loading: Loading
})

class Business extends React.Component {
  constructor(props) {
    super(props)
    this.props.setLoader(true)

    const { loading, business = [] } = props.data
    this.state = {
      loading,
      business
    }
    this.submitForm = this.submitForm.bind(this)
    this.removeBusiness = this.removeBusiness.bind(this)
  }

  updateBusiness(data) {
    this.props.setLoader(true)
    return this.props.updateBusiness({
      variables: { input: data },
      update: (proxy) => {
        const options = {
          query: queryBusinessesByUserIdIndex,
          variables: { userId: this.props.user.email }
        }
        const data = proxy.readQuery(options)
        proxy.writeQuery({ ...options, data })
      }
    })
  }

  createBusiness(data) {
    this.props.setLoader(true)
    return this.props.createBusiness({
      variables: { input: data },
      update: (proxy, { data: { createBusiness } }) => {
        const options = {
          query: queryBusinessesByUserIdIndex,
          variables: { userId: this.props.user.email }
        }
        const data = proxy.readQuery(options)
        data.queryBusinessesByUserIdIndex.items.push(createBusiness)
        proxy.writeQuery({ ...options, data })
      }
    })
  }

  removeBusiness(data) {
    this.props.setLoader(true)
    data = {userId: this.props.user.email, ...data}
    return this.props.deleteBusiness({
      variables: { input: data },
      update: (proxy, { data: { deleteBusiness } }) => {
        const options = {
          query: queryBusinessesByUserIdIndex,
          variables: { userId: this.props.user.email }
        }
        const data = proxy.readQuery(options)
        data.queryBusinessesByUserIdIndex.items = data.queryBusinessesByUserIdIndex.items.filter(item => item.id !== deleteBusiness.id)
        proxy.writeQuery({ ...options, data })
      }
    })
  }

  submitForm(businessData) {
    if (businessData.id)
      return this.updateBusiness(businessData)

    const idInfo = { userId: this.props.user.email, id: uuid() }
    businessData = { ...idInfo, ...businessData }
    return this.createBusiness(businessData)
  }

  componentWillReceiveProps(nextProps) {
    const { data: { loading, queryBusinessesByUserIdIndex: { items } } } = nextProps
    this.setState({ loading, business: items })
    this.props.setLoader(loading)
  }

  render() {
    let { loading, business } = this.state

    if (loading) return null

    return (
      <Switch>
        <Route exact path={`${this.props.match.url}/`} render={withRouter(({ history }) => <BusinessList business={business} onRemove={this.removeBusiness} history={history} />)} />
        <Route exact path={`${this.props.match.url}/company/:companyId?`} render={withRouter(({ history, ...rest }) => <BusinessForm onSubmit={this.submitForm} closeForm={() => history.push('/business')} history={history} {...rest} />)} />
        <Route path={`${this.props.match.url}/company/:companyId/workforce`} render={withRouter(({ history, ...rest }) => <Workforce history={history} {...rest} />)} />
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
  graphql(queryBusinessesByUserIdIndex, {
    options: ({ user: { email } }) => ({
      variables: { userId: email },
      fetchPolicy: 'network-only'
    }),
  }),
  graphql(createBusiness, { name: 'createBusiness' }),
  graphql(updateBusiness, { name: 'updateBusiness' }),
  graphql(deleteBusiness, { name: 'deleteBusiness' }),
)(Business))
)