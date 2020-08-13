import React from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/en'
import { Button } from '@material-ui/core'
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

  handleConfigChange = content => {
    this.setState({ config: content.jsObject })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { seed, config } = this.state
    const job = { seed, config }
    this.createJob(job, true)
  }

  async createJob(job, enqueue) {
    const response = await this.service.createJob(job, false)
    navigate(`/app/job/${response.data.id}`)
  }

  render() {
    const { seed, config } = this.state
    return (
      <div className="w-full">
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
            <TextValidator
              type="text"
              name="seed"
              label="seed"
              value={seed}
              validators={['required']}
              errorMessages={['Enter a seed.']}
              onChange={this.handleUpdate}
            />
          </div>
          <div className="mb-4">
            <JSONInput
              placeholder={config}
              locale={locale}
              onChange={this.handleConfigChange}
            />
          </div>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </ValidatorForm>
      </div>
    )
  }
}

export default NewJob
