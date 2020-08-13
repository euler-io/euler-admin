import React from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/en'
import { Button, Typography, FormControlLabel, Switch } from '@material-ui/core'
import JobService from '../../services/jobs'
import { navigate } from 'gatsby'

class NewJob extends React.Component {
  state = {
    seed: '',
    config: { source: 'empty', tasks: [] },
    enqueue: false,
  }

  constructor(props) {
    super(props)
    this.service = new JobService()
  }

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleEnqueueChange = (event, value) => {
    this.setState({
      [event.target.name]: value,
    })
  }

  handleConfigChange = content => {
    this.setState({ config: content.jsObject })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { seed, config, enqueue } = this.state
    const job = { seed, config }
    this.createJob(job, true)
  }

  async createJob(job, enqueue) {
    const response = await this.service.createJob(job, enqueue)
    navigate(`/app/job/${response.data.id}`)
  }

  goBack() {
    navigate(-1)
  }

  render() {
    const { seed, config, enqueue } = this.state
    return (
      <div className="w-full">
        <Typography variant="h6" component="div">
          Create New Job
        </Typography>
        <ValidatorForm
          ref="form"
          className="px-8 pt-6 pb-8 mb-4"
          method="post"
          onSubmit={event => {
            this.handleSubmit(event)
          }}
          onError={errors => console.log(errors)}
        >
          <div className="mb-4">
            <label>Configuration</label>
            <JSONInput
              placeholder={config}
              locale={locale}
              theme="light_mitsuketa_tribute"
              onChange={this.handleConfigChange}
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
          <div className="mb-4">
            <FormControlLabel
              control={
                <Switch
                  checked={enqueue}
                  value={enqueue}
                  onChange={this.handleEnqueueChange}
                  name="enqueue"
                  inputProps={{ 'aria-label': 'enqueue job' }}
                />
              }
              label="Enqueue Job"
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

export default NewJob
