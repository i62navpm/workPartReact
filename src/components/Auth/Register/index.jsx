import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'material-ui'

export default function Register() {
  return (
    <div>
      <Button component={Link} to="login" raised color="primary">
        Login
      </Button>

      <p>Register</p>
    </div>
  )
}