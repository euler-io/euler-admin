import React from 'react'
import { navigate } from 'gatsby'
import authService from '../services/auth'

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  if (!authService.isLoggedIn() && location.pathname !== `/app/login`) {
    navigate(`/app/login?next=${location.pathname}`)
    return null
  }

  return <Component {...rest} />
}

export default PrivateRoute