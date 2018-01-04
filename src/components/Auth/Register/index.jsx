import React from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <div>
      <Link to={'login'}>
        Got to Login
      </Link>

      <p>Register</p>
    </div>
  )
}