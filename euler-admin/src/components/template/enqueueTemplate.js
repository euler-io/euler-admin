import React from 'react'
import { Button, Typography } from '@material-ui/core'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/en'
import TemplateService from '../../services/templates'
import { navigate } from 'gatsby'

class EnqueueTemplate extends React.Component {
  state = {
    seed: '',
    params: {},
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

  handleSubmit = event => {
    event.preventDefault()
    const { templateName } = this.props
    const { seed, params } = this.state
    this.enqueueTemplateAsJob(templateName, seed, params)
  }

  async enqueueTemplateAsJob(templateName, seed, params) {
    params = { params, seed }
    const response = await this.service.enqueueTemplateAsJob(
      templateName,
      params
    )
    navigate(`/app/job/${response.data.id}`)
  }

  handleParamsChange = content => {
    this.setState({ params: content.jsObject })
  }

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  goBack() {
    navigate(-1)
  }

  render() {
    const { templateName } = this.props
    const { seed, params, template } = this.state
    return (
      <div className="w-full">
        <Typography variant="h6" component="div">
          Run Template '{templateName}'
        </Typography>
        {template !== null && (
          <ValidatorForm
            ref="form"
            className="px-8 pt-6 pb-8 mb-4"
            method="post"
            onSubmit={this.handleSubmit}
            onError={errors => console.log(errors)}
          >
            <div className="mb-4">
              <pre>{template.config}</pre>
            </div>
            <div className="mb-4">
              <label>Parameters</label>
              <JSONInput
                placeholder={params}
                locale={locale}
                theme="light_mitsuketa_tribute"
                onChange={this.handleParamsChange}
                height={'15em'}
                width={'100%'}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <TextValidator
                type="text"
                name="seed"
                label="Seed"
                value={seed}
                validators={['required']}
                errorMessages={['Enter a seed.']}
                onChange={this.handleUpdate}
                className="w-full"
              />
            </div>
            <Button variant="contained" color="default" onClick={this.goBack}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </ValidatorForm>
        )}
      </div>
    )
  }
}

export default EnqueueTemplate
