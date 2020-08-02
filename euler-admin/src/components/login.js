import React from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import authService from '../services/auth'
import axiosConfig from '../config/axiosConfig'
import { navigate } from 'gatsby'
import qs from 'qs'

class Login extends React.Component {
  state = {
    username: ``,
    password: ``,
    loginError: false,
    open: true,
  }

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = event => {
    console.info(qs.parse(this.props.location.search.replace('?', '')))
    event.preventDefault()
    this.setState({ loginError: false })
    const { username, password } = this.state
    this.signIn(username, password)
  }

  async signIn(username, password) {
    try {
      const response = await authService.signInWithUsernameAndPassword(
        username,
        password
      )
      navigate(this.getGoto())
    } catch (error) {
      console.info('Login error', error)
      this.setState({ loginError: true })
    }
  }

  getGoto() {
    if (this.props.location.search) {
      const params = qs.parse(this.props.location.search.replace('?', ''))
      if (params.next) {
        return params.next
      }
    }
    return '/'
  }

  render() {
    const { loginError, username, password, open } = this.state
    return (
      <Dialog open={open} aria-labelledby="login-title">
        <DialogTitle id="login-title">Login</DialogTitle>
        <DialogContent>
          <div className="w-full max-w-xs">
            <ValidatorForm
              ref="form"
              className="px-8 pt-6 pb-8 mb-4"
              method="post"
              onSubmit={event => {
                this.handleSubmit(event)
              }}
              onError={errors => console.log(errors)}
            >
              {loginError && (
                <Alert className="mb-4" severity="error" variant="outlined">
                  Invalid username or password.
                </Alert>
              )}
              <div className="mb-4">
                <TextValidator
                  type="text"
                  name="username"
                  label="Username"
                  value={username}
                  validators={['required']}
                  errorMessages={['Enter your username.']}
                  onChange={this.handleUpdate}
                />
              </div>
              <div className="mb-6">
                <TextValidator
                  type="password"
                  name="password"
                  label="Password"
                  value={password}
                  validators={['required']}
                  errorMessages={['Enter your password.']}
                  onChange={this.handleUpdate}
                />
              </div>
              <DialogActions>
                <Button variant="contained" color="primary" type="submit">
                  Log in
                </Button>
              </DialogActions>
            </ValidatorForm>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

export default Login
