import React from 'react'
import { Router } from '@reach/router'
import Layout from '../components/layout'
import PrivateRoute from '../components/privateRoute'
import Jobs from '../components/job/jobs'
import Job from '../components/job/job'
import NewJob from '../components/job/newJob'
import Login from '../components/login'
const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/app/jobs" component={Jobs} />
      <PrivateRoute path="/app/job/:jobId" component={Job} />
      <PrivateRoute path="/app/job" component={NewJob} />
      <Login path="/app/login" />
    </Router>
  </Layout>
)
export default App