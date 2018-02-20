import React from 'react'
import { applyMiddleware, createStore, compose } from 'redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import './index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import storeApp from './reducers'
import { ApolloProvider } from 'react-apollo'
// import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { MockHttpLink } from './graphql/mockHttpLink'

const client = new ApolloClient({
  // link: new HttpLink({ uri: 'https://1jzxrj179.lp.gql.zone/graphql' }),
  link: MockHttpLink,
  cache: new InMemoryCache()
})

const store = createStore(storeApp, compose(applyMiddleware(thunk, logger)))

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default
    ReactDOM.render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <NextApp />
        </Provider>
      </ApolloProvider>,
      document.getElementById('root')
    )
  })
}

registerServiceWorker()
