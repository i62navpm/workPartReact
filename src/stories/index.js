import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Button } from '@storybook/react/demo'
import { MemoryRouter } from 'react-router'

import App from '../components/App'
import Login from '../components/Login'
import Register from '../components/Register'
import Verification from '../components/Verification'
import ForgotPassword from '../components/ForgotPassword'
import {
  BusinessCard,
  BusinessForm,
  BusinessEmployeeList
} from '../components/Business'
import { EmployeeCard, EmployeeForm } from '../components/Employee'
import AddButton from '../components/AddButton'
import UploadImage from '../components/UploadImage'
import ApolloProvider from 'react-apollo/ApolloProvider'
import ApolloClient from 'apollo-client'
import { MockHttpLink } from '../graphql/mockHttpLink'
import { InMemoryCache } from 'apollo-cache-inmemory'
import businessMockData from '../graphql/businessMock'
import workforceMockData from '../graphql/workforceMock'

const client = new ApolloClient({
  link: MockHttpLink,
  cache: new InMemoryCache()
})

storiesOf('Welcome', module).add('React App', () => <App />)

storiesOf('Button', module)
  .add('Add button', () => <AddButton onClick={action('clicked')} />)
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
  .add('Card business', () => <BusinessCard data={businessMockData[0]} />)
  .add('Form business', () => (
    <BusinessForm match={{ params: { companyId: '1' } }} />
  ))
  .add('Business employees list', () => (
    <BusinessEmployeeList
      activeWorkforce={[1, 2]}
      name="workforce"
      handleChange={action('clicked')}
    />
  ))

storiesOf('Workforce', module)
  .addDecorator(story => (
    <ApolloProvider client={client}>
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    </ApolloProvider>
  ))
  .add('Card employee', () => <EmployeeCard data={workforceMockData[0]} />)
  .add('Form employee', () => (
    <EmployeeForm match={{ params: { employeeId: '1' } }} />
  ))
