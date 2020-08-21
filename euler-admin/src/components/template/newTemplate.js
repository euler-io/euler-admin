import React from 'react'
import { Typography, TextField, Button } from '@material-ui/core'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import HoconEditor from '../hoconEditor'
import TemplateService from '../../services/templates'
import { navigate } from 'gatsby'

class NewTemplate extends React.Component {
  state = {
    name: null,
    config: null,
  }
  constructor(props) {
    super(props)
    this.service = new TemplateService()
  }
  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { name, config } = this.state
    this.createTemplate(name, config)
  }

  async createTemplate(name, config) {
    const response = await this.service.createTemplate(name, config)
    navigate(`/app/templates`)
  }

  render() {
    const { name, config } = this.state
    return (
      <div className="w-full">
        <Typography variant="h6" component="div">
          Create New Template
        </Typography>
        <ValidatorForm
          ref="form"
          className="px-8 pt-6 pb-8 mb-4"
          method="post"
          onSubmit={this.handleSubmit}
          onError={errors => console.log(errors)}
        >
          <div className="mb-4">
            <TextValidator
              type="text"
              name="name"
              label="Name"
              value={name}
              validators={['required']}
              errorMessages={['Enter a name.']}
              onChange={this.handleUpdate}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <HoconEditor
              name="config"
              label="Configuration"
              value={config}
              validators={['required']}
              errorMessages={['Enter the template configuration.']}
              onChange={this.handleUpdate}
              className="w-full"
              multiline
            />
          </div>
          <Button variant="contained" color="default" onClick={this.goBack}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </ValidatorForm>
      </div>
    )
  }
}

export default NewTemplate
