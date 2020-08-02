import React from 'react'
import { Router } from '@reach/router'
import Layout from '../components/layout'
import PrivateRoute from '../components/privateRoute'
import Jobs from '../components/job/jobs'
import Login from '../components/login'
const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/app/job" component={Jobs} />
      <Login path="/app/login" />
    </Router>
  </Layout>
)
export default App