import React from 'react'
import JobService from '../../services/jobs'
import { Typography, TextField } from '@material-ui/core'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/en'

class Job extends React.Component {
  state = {
    job: null,
  }
  constructor(props) {
    super(props)
    this.service = new JobService()
  }

  componentDidMount() {
    this.getJobDetails()
  }

  async getJobDetails() {
    const { jobId } = this.props
    const response = await this.service.getJobDetails(jobId)
    this.setState({
      job: response.data,
    })
  }

  render() {
    const { jobId } = this.props
    const { job } = this.state
    return (
      <div className="w-full">
        <Typography variant="h6" component="div">
          Job {jobId}
        </Typography>
        {job !== null && (
          <>
            <div className="mb-4">
              <label>Configuration</label>
              <JSONInput
                placeholder={job.config}
                locale={locale}
                theme="light_mitsuketa_tribute"
                width={'100%'}
                height={'15em'}
                className="w-full"
                viewOnly={true}
                confirmGood={false}
              />
            </div>
            <div className="mb-4">
              <TextField
                type="text"
                name="seed"
                label="Seed"
                value={job.seed}
                disabled={true}
                className="w-full"
              />
            </div>
          </>
        )}
      </div>
    )
  }
}

export default Job
