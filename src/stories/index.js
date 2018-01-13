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
import Business from '../components/Business'

storiesOf('Welcome', module).add('React App', () => <App />)

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
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
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('Card business', () => <Business />)
