import React from 'react'
import { Typography } from '@material-ui/core'

class Template extends React.Component {
  render() {
    const { templateName } = this.props
    return (
      <div className="w-full">
        <Typography variant="h6" component="div">
          Template {templateName}
        </Typography>
      </div>
    )
  }
}

export default Template
