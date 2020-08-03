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
import qs from 'qs'
import { navigate } from 'gatsby'
import { useQueryParam, NumberParam, StringParam } from 'use-query-params'

class Jobs extends React.Component {
  state = {
    data: null,
    page: 0,
    rowsPerPage: 1,
  }

  constructor(props) {
    super(props)
    this.service = new JobService()
  }

  componentDidMount() {
    this.listJobs()
  }

  componentDidUpdate() {
    console.info(this.props)
  }

  listJobs() {
    this.service.listJobs({}).then(response => {
      this.setState({
        data: response.data,
      })
    })
  }

  handleChangePage = (event, newPage) => {
    //setPage(newPage);
    this.updateParams({ page: newPage })
  }

  handleChangeRowsPerPage = event => {
    //setRowsPerPage(parseInt(event.target.value, 10));
    //setPage(0);
  }

  updateParams(params) {
    params = {
      //...qs.parse(this.props.location.search.replace('?', '')),
      ...params,
    }
    navigate(`${this.props.path}?${qs.stringify(params)}`)
  }
  
  render() {
   // const [page, setPage] = useQueryParam('page', NumberParam)
    const { data, rowsPerPage } = this.state
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
                  rowsPerPageOptions={[1, 50, 100]}
                  colSpan={5}
                  count={data.total}
                  rowsPerPage={rowsPerPage}
                  //page={(event, newPage) => setPage(newPage)}
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
