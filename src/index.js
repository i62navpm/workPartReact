import React from 'react'
import { applyMiddleware, createStore, compose } from 'redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { I18nextProvider } from 'react-i18next'
import './index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import storeApp from './reducers'
import { ApolloProvider } from 'react-apollo'
import AWSAppSyncClient from 'aws-appsync'
import { Rehydrated } from 'aws-appsync-react'
import appSyncConfig from './config/appSync'
// import { HttpLink } from 'apollo-link-http'
// import { InMemoryCache } from 'apollo-cache-inmemory'
// import { ApolloClient } from 'apollo-client'
// import { MockHttpLink } from './graphql/mockHttpLink'
import { Settings } from 'luxon'
import i18n from './i18n'

Settings.defaultLocale = 'en-gb'

// const client = new ApolloClient({
//   // link: new HttpLink({ uri: 'https://1jzxrj179.lp.gql.zone/graphql' }),
//   link: MockHttpLink,
//   cache: new InMemoryCache()
// })

const client = new AWSAppSyncClient({
  url: appSyncConfig.graphqlEndpoint,
  region: appSyncConfig.region,
  auth: {
    type: appSyncConfig.authenticationType,
    apiKey: appSyncConfig.apiKey
  }
})

const store = createStore(storeApp, compose(applyMiddleware(thunk, logger)))

ReactDOM.render(
  <ApolloProvider client={client}>
    <Rehydrated>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </Provider>
    </Rehydrated>
  </ApolloProvider>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default
    ReactDOM.render(
      <ApolloProvider client={client}>
        <Rehydrated>
          <Provider store={store}>
            <NextApp />
          </Provider>
        </Rehydrated>
      </ApolloProvider>,
      document.getElementById('root')
    )
  })
}

registerServiceWorker()
