import React from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div>
      <Link to="register">
        Got to Register
      </Link>

      <p>Login</p>
    </div>
  )
}