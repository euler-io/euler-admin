import React from 'react'
import JobService from '../../services/jobs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import Moment from 'react-moment'

class Jobs extends React.Component {
  state = {
    data: null,
  }

  constructor(props) {
    super(props)
    this.service = new JobService()
  }

  componentDidMount() {
    this.service.listJobs({}).then(response => {
      this.setState({
        data: response.data,
      })
    })
  }

  render() {
    const { data } = this.state
    return (
      <>
        <h1>Jobs</h1>
        {data && (
          <Table aria-label="Jobs Table">
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Creation</TableCell>
                <TableCell>Enqueued</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.jobs.map(row => (
                <TableRow>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Moment
                      format="DD/MM/YYYY HH:mm:ss"
                      parse="YYYY-MM-DDTHH:mm:ss.SSSZs"
                    >
                      {row['creation-date']}
                    </Moment>
                  </TableCell>
                  <TableCell>
                    <Moment
                      format="DD/MM/YYYY HH:mm:ss"
                      parse="YYYY-MM-DDTHH:mm:ss.SSSZs"
                    >
                      {row['enqueued-date']}
                    </Moment>
                  </TableCell>
                  <TableCell>
                    <Moment
                      format="DD/MM/YYYY HH:mm:ss"
                      parse="YYYY-MM-DDTHH:mm:ss.SSSZs"
                    >
                      {row['start-date']}
                    </Moment>
                  </TableCell>
                  <TableCell>
                    <Moment
                      format="DD/MM/YYYY HH:mm:ss"
                      parse="YYYY-MM-DDTHH:mm:ss.SSSZs"
                    >
                      {row['end-date']}
                    </Moment>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </>
    )
  }
}
export default Jobs
