import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'material-ui'

export default function Login() {
  return (
    <div>
      <Button component={Link} to="register" raised color="primary">
        Register
      </Button>

      <p>Login</p>
    </div>
  )
}