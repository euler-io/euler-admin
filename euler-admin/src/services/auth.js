import axios from 'axios'
import { navigate } from 'gatsby'
import Cookie from 'js-cookie'
import jwtDecode from 'jwt-decode'
import qs from 'qs'

class AuthService {
  init() {
    console.info('Initiliazing AuthService.')
    this.setInterceptors()
    this.handleAuthentication()
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      response => {
        return response
      },
      err => {
        return new Promise((resolve, reject) => {
          if (
            err.response &&
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            //this.emit('onAutoLogout', 'Invalid access_token')
            this.setSession(null)
            navigate(`/app/login`)
          }
          throw err
        })
      }
    )
  }

  handleAuthentication = () => {
    let access_token = this.getAccessToken()

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token)
      // this.emit('onAutoLogin', true)
    } else {
      this.setSession(null)
      // this.emit('onAutoLogout', 'access_token expired')
    }
  }

  isLoggedIn = () => {
    return this.isAuthTokenValid(this.getAccessToken())
  }

  isAuthTokenValid = access_token => {
    if (!access_token) {
      return false
    }
    const decoded = jwtDecode(access_token)
    const currentTime = Date.now() / 1000
    if (decoded.exp < currentTime) {
      console.warn('Access Token Expired!')
      return false
    } else {
      return true
    }
  }

  setSession = access_token => {
    if (access_token) {
      const decoded = jwtDecode(access_token)
      const expires = new Date(decoded.exp * 1000)
      if (!Cookie.get('jwt_access_token', { path: '/' })) {
        Cookie.set('jwt_access_token', access_token, {
          expires: expires,
          path: '/',
        })
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    } else {
      Cookie.remove('jwt_access_token', { path: '/' })
      delete axios.defaults.headers.common['Authorization']
    }
  }

  getAccessToken = () => {
    return Cookie.get('jwt_access_token', { path: '/' })
  }

  signInWithUsernameAndPassword = (username, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          '/auth',
          qs.stringify({
            username: username,
            password: password,
          })
        )
        .then(response => {
          if (response.data) {
            const token = response.data.replace('Bearer ', '')
            this.setSession(token)
            //this.emit('onAutoLogin', true)
            const decoded = jwtDecode(token)
            resolve(decoded)
          } else {
            reject(response.statusText)
          }
        })
        .catch(error => {
          reject(error.toString())
        })
    })
  }
}

const authService = new AuthService()
authService.init()
export default authService
