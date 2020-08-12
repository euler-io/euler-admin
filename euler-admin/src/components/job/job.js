import React from 'react'

class Job extends React.Component {
  render() {
    const { jobId } = this.props
    return <div>{jobId}</div>
  }
}

export default Job
