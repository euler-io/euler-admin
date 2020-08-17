import React from 'react'
import { Router } from '@reach/router'
import Layout from '../components/layout'
import PrivateRoute from '../components/privateRoute'
import Jobs from '../components/job/jobs'
import Job from '../components/job/job'
import NewJob from '../components/job/newJob'
import Templates from '../components/template/templates'
import NewTemplate from '../components/template/newTemplate'
import Template from '../components/template/template'
import EnqueueTemplate from '../components/template/enqueueTemplate'
import Login from '../components/login'
const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/app/jobs" component={Jobs} />
      <PrivateRoute path="/app/job/:jobId" component={Job} />
      <PrivateRoute path="/app/job" component={NewJob} />
      <PrivateRoute path="/app/templates" component={Templates} />
      <PrivateRoute path="/app/template" component={NewTemplate} />
      <PrivateRoute path="/app/template/:templateName" component={Template} />
      <PrivateRoute
        path="/app/template/:templateName/run"
        component={EnqueueTemplate}
      />
      <Login path="/app/login" />
    </Router>
  </Layout>
)
export default App
