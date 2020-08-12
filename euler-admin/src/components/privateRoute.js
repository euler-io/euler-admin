import React from 'react'
import { navigate } from 'gatsby'
import authService from '../services/auth'
import qs from 'querystring'

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  if (!authService.isLoggedIn() && location.pathname !== `/app/login`) {
    let next = location.pathname
    if (location.search) {
      next = `${location.pathname}${location.search}`
    }
    navigate(`/app/login?${qs.stringify({ next })}`)
    return null
  }

  return <Component {...rest} location={location} />
}

export default PrivateRoute
