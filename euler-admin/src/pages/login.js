import React from 'react'
import { Grid } from '@material-ui/core'
import Login from '../components/login'

const LoginPage = () => (
  <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justify="center"
    style={{ minHeight: '100vh' }}
  >
    <Grid item xs={3}>
      <Login />
    </Grid>
  </Grid>
)

export default LoginPage
