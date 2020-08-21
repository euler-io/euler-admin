import React from 'react'
import { Typography } from '@material-ui/core'
import TemplateService from '../../services/templates'

class Template extends React.Component {
  state = {
    template: null,
  }
  constructor(props) {
    super(props)
    this.service = new TemplateService()
  }

  componentDidMount() {
    this.getTemplateDetails()
  }

  async getTemplateDetails() {
    const { templateName } = this.props
    const response = await this.service.getTemplateDetails(templateName)
    this.setState({
      template: response.data,
    })
  }
  render() {
    const { templateName } = this.props
    const { template } = this.state
    return (
      <div className="w-full">
        <Typography variant="h6" component="div">
          Template '{templateName}'
        </Typography>
        {template !== null && (
          <>
            <div className="mb-4">
              <pre>{template.config}</pre>
            </div>
          </>
        )}
      </div>
    )
  }
}

export default Template
