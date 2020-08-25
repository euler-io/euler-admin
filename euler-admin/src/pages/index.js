import React from 'react'

import Layout from '../components/layout'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import { Link } from '@reach/router'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

const IndexPage = () => {
  const classes = useStyles()
  const [features, setFeatures] = React.useState(true)
  const [info, setInfo] = React.useState(true)

  function handleClick(id) {
    switch (id) {
      case 'features':
        setFeatures(!features)
        break
      case 'info':
        setInfo(!info)
        break
    }
  }

  return (
    <Layout>
      <Grid container spacing={3} justify="center">
        <Grid item xs={8}>
          <h1>Euler Admin App</h1>
          <h5>A frontend for the Euler HTTP API. Here you can create new <Link to="/app/jobs">jobs</Link> and new <Link to="/app/templates">templates</Link>.</h5>
        </Grid>
      </Grid>
      <Divider />
    </Layout>
  )
}

export default IndexPage
