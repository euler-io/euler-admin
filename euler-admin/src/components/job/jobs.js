import React from 'react'
import JobService from '../../services/jobs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
} from '@material-ui/core'
import Moment from 'react-moment'
import { navigate } from 'gatsby'
import qs from 'qs'

class Jobs extends React.Component {
  state = {
    data: null,
  }

  constructor(props) {
    super(props)
    this.service = new JobService()
  }

  componentDidMount() {
    this.listJobs()
  }

  componentDidUpdate() {
    //this.listJobs()
  }

  listJobs() {
    const { page, size } = this.getParams()
    const params = { page: page, size: size }
    return this.service.listJobs(params).then(response => {
      this.setState({
        data: response.data,
      })
    })
  }

  handleChangePage = (event, newPage) => {
    this.updateParams({ page: newPage })
  }

  handleChangeRowsPerPage = event => {
    this.updateParams({ size: Number.parseInt(event.target.value), page: 0 })
  }

  updateParams(params) {
    params = {
      ...this.getParams(),
      ...params,
    }
    navigate(`${this.props.path}?${qs.stringify(params)}`)
  }

  getParams() {
    const params = {
      page: '0',
      size: '10',
      ...qs.parse(this.props.location.search.replace('?', '')),
    }
    return {
      page: Number.parseInt(params.page),
      size: Number.parseInt(params.size),
    }
  }

  render() {
    const { data } = this.state
    const { page, size } = this.getParams()
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
                <TableRow key={row.id}>
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
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 50, 100]}
                  colSpan={5}
                  count={data.total}
                  rowsPerPage={size}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </>
    )
  }
}
export default Jobs
