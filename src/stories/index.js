import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Button } from '@storybook/react/demo'
import { MemoryRouter } from 'react-router'
import { DateTime } from 'luxon'
import imageBusiness from '../assets/images/businessDefault.png'

import App from '../components/App'
import Login from '../components/Login'
import Register from '../components/Register'
import Verification from '../components/Verification'
import ForgotPassword from '../components/ForgotPassword'
import { BusinessCard, BusinessForm } from '../components/Business'
import UploadImage from '../components/UploadImage'
import AddBusiness from '../components/Business/BusinessAddButton'
import ApolloProvider from 'react-apollo/ApolloProvider'
import ApolloClient from 'apollo-client'
import { MockHttpLink } from '../graphql/mockHttpLink'
import { InMemoryCache } from 'apollo-cache-inmemory'

const initialState = {
  id: '1',
  name: 'Business example 1',
  date: DateTime.local().toLocaleString(DateTime.DATETIME_MED),
  image: imageBusiness
}

const client = new ApolloClient({
  link: MockHttpLink,
  cache: new InMemoryCache()
})

storiesOf('Welcome', module).add('React App', () => <App />)

storiesOf('Button', module)
  .add('Add business', () => <AddBusiness onClick={action('clicked')} />)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ))

storiesOf('Upload', module).add('Upload image', () => (
  <UploadImage image="" name="image" handleChange={action('clicked')} />
))

storiesOf('Auth', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/auth']}>{story()}</MemoryRouter>
  ))
  .add('Login', () => <Login onSubmit={action('clicked')} />)
  .add('Register', () => <Register onSubmit={action('clicked')} />)
  .add('Verification', () => <Verification onSubmit={action('clicked')} />)
  .add('ForgotPassword', () => (
    <ForgotPassword
      onSubmit={action('clicked')}
      onNextStep={action('clicked')}
    />
  ))

storiesOf('Business', module)
  .addDecorator(story => (
    <ApolloProvider client={client}>
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    </ApolloProvider>
  ))
  .add('Card business', () => <BusinessCard data={initialState} />)
  .add('Form business', () => (
    <BusinessForm match={{ params: { companyId: '1' } }} />
  ))
