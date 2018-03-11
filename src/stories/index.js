import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Button } from '@storybook/react/demo'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import storeApp from '../reducers'
import Login from '../components/Login'
import Register from '../components/Register'
import Verification from '../components/Verification'
import ForgotPassword from '../components/ForgotPassword'
import {
  BusinessCard,
  BusinessCardSummary,
  BusinessForm,
  BusinessEmployeeList
} from '../components/Business'
import {
  EmployeeCard,
  EmployeeForm,
  EmployeeCalendar
} from '../components/Employee'
import AddButton from '../components/AddButton'
import UploadImage from '../components/UploadImage'
import MenuAppBar from '../components/MenuAppBar'
import DrawerBar from '../components/DrawerBar'
import ApolloProvider from 'react-apollo/ApolloProvider'
import ApolloClient from 'apollo-client'
import { MockHttpLink } from '../graphql/mockHttpLink'
import { InMemoryCache } from 'apollo-cache-inmemory'
import businessMockData from '../graphql/businessMock'
import workforceMockData from '../graphql/workforceMock'
import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'moment/locale/en-gb'
import moment from 'moment'

BigCalendar.momentLocalizer(moment)
const store = createStore(storeApp)

const client = new ApolloClient({
  link: MockHttpLink,
  cache: new InMemoryCache()
})

storiesOf('Button', module)
  .add('Add button', () => <AddButton onClick={action('clicked')} />)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ))

storiesOf('Menu Bars', module)
  .addDecorator(story => (
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    </Provider>
  ))
  .add('App bar', () => <MenuAppBar onLogoutClick={action('clicked')} />)
  .add('Drawer', () => <DrawerBar history={{ push: action('clicked') }} />)

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
    <Provider store={store}>
      <ApolloProvider client={client}>
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
      </ApolloProvider>
    </Provider>
  ))
  .add('Card business', () => <BusinessCard data={businessMockData[0]} />)
  .add('Card business summary', () => (
    <BusinessCardSummary data={businessMockData[0]} />
  ))
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
    <Provider store={store}>
      <ApolloProvider client={client}>
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
      </ApolloProvider>
    </Provider>
  ))
  .add('Card employee', () => (
    <EmployeeCard data={workforceMockData[0]} history={{ location: {} }} />
  ))
  .add('Form employee', () => (
    <EmployeeForm match={{ params: { employeeId: '1' } }} history={{}} />
  ))
  .add('Calendar employee', () => (
    <EmployeeCalendar employee={workforceMockData[0]} companyId={'1'} />
  ))
