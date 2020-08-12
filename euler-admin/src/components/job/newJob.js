import React from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import { JsonEditor } from 'jsoneditor-react'
import 'jsoneditor-react/es/editor.min.css'

class NewJob extends React.Component {
  state = {
    seed: '',
    config: { source: 'empty', tasks: [] },
    enqueue: false,
  }

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleConfigChange = event => {
    this.setState({
      config: event.target.value,
    })
    console.info(event.target.value)
  }

  handleSubmit = event => {
    event.preventDefault()
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
          <TextValidator
            type="text"
            name="seed"
            label="seed"
            value={seed}
            validators={['required']}
            errorMessages={['Enter job seed.']}
            onChange={this.handleUpdate}
          />
        </ValidatorForm>
      </div>
    )
  }
}

export default NewJob
