import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { BusinessList, BusinessForm } from '../components/Business'
import { setLoader } from '../actions/loader'
import { graphql, compose } from 'react-apollo'
import Loadable from 'react-loadable'
import Loading from '../components/Loading'
import queryBusinessesByUserIdIndex from '../graphql/queries/queryBusinessesByUserIdIndex'
import updateBusiness from '../graphql/mutations/updateBusiness'
import createBusiness from '../graphql/mutations/createUser'

const Workforce = Loadable({
  loader: () =>
    import(/* webpackChunkName: "workforce" */ './Workforce'),
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
  }

  submitForm(businessData) {
    return this.props.updateBusiness({ variables: { input: businessData },
      update: (proxy) => {
        const query = queryBusinessesByUserIdIndex
        const data = proxy.readQuery({ query, variables: { userId: this.props.user.email } })
        proxy.writeQuery({ query, data })
      },
    })
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
        <Route exact path={`${this.props.match.url}/`} render={withRouter(({ history }) => <BusinessList business={business} history={history} />)} />
        <Route exact path={`${this.props.match.url}/company/:companyId?`} render={withRouter(({ history, ...rest }) => <BusinessForm onSubmit={this.submitForm} closeForm={() => history.push('/business')} history={history} {...rest} />)} />
        <Route path={`${this.props.match.url}/company/:companyId/workforce`} component={Workforce} />
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
  graphql(updateBusiness, { name: 'updateBusiness' })
)(Business))
)