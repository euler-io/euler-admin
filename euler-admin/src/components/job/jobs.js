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
  Fade,
  Toolbar,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Checkbox,
} from '@material-ui/core'
import { Link } from '@reach/router'
import { Skeleton } from '@material-ui/lab'
import FilterListIcon from '@material-ui/icons/FilterList'
import PlayIcon from '@material-ui/icons/PlayArrow'
import CancelIcon from '@material-ui/icons/Cancel'
import Moment from 'react-moment'
import { navigate } from 'gatsby'
import qs from 'querystring'
import PropTypes from 'prop-types'
import _ from 'lodash'
import StatusFilter from './statusFilter'
import AutoRefresh from '../autoRefresh'

const FiltersMenu = props => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleStatusFilter = () => {
    props.onStatusFilter()
    closeMenu()
  }

  const handleClose = () => {
    closeMenu()
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  return (
    <Tooltip title="Filter list">
      <div>
        <IconButton
          aria-label="filter list"
          aria-controls="filters-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <FilterListIcon fontSize="small" />
        </IconButton>
        <Menu
          id="filters-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: '20ch',
            },
          }}
        >
          <MenuItem onClick={handleStatusFilter}>Status</MenuItem>
        </Menu>
      </div>
    </Tooltip>
  )
}

const JobsHeaders = () => {
  return (
    <>
      <TableCell>Status</TableCell>
      <TableCell>Creation</TableCell>
      <TableCell>Enqueued</TableCell>
      <TableCell>Start</TableCell>
      <TableCell>End</TableCell>
      <TableCell></TableCell>
    </>
  )
}

const DateTableCell = props => {
  const { date } = props
  return (
    <TableCell>
      {date !== null && (
        <Moment format="DD/MM/YYYY HH:mm:ss" parse="YYYY-MM-DDTHH:mm:ss.SSSZs">
          {date}
        </Moment>
      )}
    </TableCell>
  )
}

DateTableCell.propTypes = {
  date: PropTypes.string,
}

const TableSkeleton = props => {
  return (
    <Skeleton width="100%">
      <Table>
        <TableHead>
          <TableRow>
            <JobsHeaders />
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <JobsHeaders />
          </TableRow>
        </TableBody>
      </Table>
    </Skeleton>
  )
}

const CANCELABLE_STATUS = new Set(['NEW', 'ENQUEUED', 'RUNNING'])

const JobRow = props => {
  const { job, onJobEnqueue, onJobCancel } = props
  const { status, id } = job
  return (
    <>
      <TableCell>
        <Link to={`/app/job/${id}`}>{status}</Link>
      </TableCell>
      <DateTableCell date={job['creation-date']} />
      <DateTableCell date={job['enqueued-date']} />
      <DateTableCell date={job['start-date']} />
      <DateTableCell date={job['end-date']} />
      <TableCell>
        {status === 'NEW' && (
          <IconButton
            aria-label="play"
            color="primary"
            onClick={event => onJobEnqueue(id)}
          >
            <PlayIcon />
          </IconButton>
        )}
        {CANCELABLE_STATUS.has(status) && (
          <IconButton
            aria-label="cancel"
            color="secondary"
            onClick={event => onJobCancel(id)}
          >
            <CancelIcon />
          </IconButton>
        )}
      </TableCell>
    </>
  )
}

JobRow.propTypes = {
  job: PropTypes.object.isRequired,
  onJobEnqueue: PropTypes.func.isRequired,
  onJobCancel: PropTypes.func.isRequired,
}

class Jobs extends React.Component {
  state = {
    data: null,
    openStatusFilter: false,
    numSelected: undefined,
    selected: new Set(),
  }

  constructor(props) {
    super(props)
    this.service = new JobService()
    this.interval = null
  }

  componentDidMount() {
    this.listJobs()
  }

  componentDidUpdate(oldProps) {
    if (oldProps !== this.props) {
      this.listJobs()
    }
  }

  async listJobs() {
    const { page, size, status } = this.getParams()
    let params = { page, size }
    if (status !== '') {
      params = { ...params, status }
    }
    const response = await this.service.listJobs(params)
    this.setState({
      data: response.data,
    })
    params = this.getParams()
    if (this.interval) {
      clearInterval(this.interval)
    }
    if (params.update > 0) {
      this.interval = setInterval(() => {
        this.listJobs()
      }, params.update * 1000)
    }
  }

  handleChangePage = (event, newPage) => {
    this.updateParams({ page: newPage })
  }

  handleChangeRowsPerPage = event => {
    this.updateParams({ size: Number.parseInt(event.target.value), page: 0 })
  }

  updateParams(params, omit) {
    const oldParams = this.getParams()
    params = {
      ...oldParams,
      ...params,
    }
    if (omit) {
      params = _.omit(params, omit)
    }
    if (oldParams !== params) {
      navigate(`${this.props.path}?${qs.stringify(params)}`)
    }
  }

  getParams() {
    const params = {
      page: '0',
      size: '10',
      update: '0',
      ...qs.parse(this.props.location.search.replace('?', '')),
    }
    return {
      ...params,
      page: Number.parseInt(params.page),
      size: Number.parseInt(params.size),
      update: Number.parseInt(params.update),
    }
  }

  handleRemoveFilter = field => {
    this.updateParams({ page: 0 }, [field])
  }

  handleStatusFilter = () => {
    const params = this.getParams()
    if (!('status' in params)) {
      this.updateParams({ status: null })
    }
  }

  handleChangeAutoRefresh = newUpdate => {
    this.updateParams({ update: newUpdate })
  }

  handleSelectAllJobs = event => {
    const selected = new Set(this.state.selected)
    const { data } = this.state
    if (
      selected.size === data.jobs.length ||
      selected.size > data.jobs.length / 2
    ) {
      selected.clear()
    } else if (selected.size === 0 || selected.size <= data.jobs.length / 2) {
      data.jobs.forEach(job => selected.add(job.id))
    }

    this.setState({ selected })
  }

  handleSelectJob = event => {
    const selected = new Set(this.state.selected)
    const { value } = event.target
    if (selected.has(value)) {
      selected.delete(value)
    } else {
      selected.add(event.target.value)
    }

    this.setState({ selected })
  }

  onChangeFilter = (field, value) => {
    const oldParams = this.getParams()
    const params = { ...oldParams, page: 0 }
    params[field] = value
    if (oldParams[field] !== params[field]) {
      this.updateParams(params)
    }
  }

  handleOnJobCancel = jobId => {
    this.service.cancelJob(jobId).then(response => {
      this.listJobs()
    })
  }

  handleOnJobEnqueue = jobId => {
    this.service.enqueueJob(jobId).then(response => {
      this.listJobs()
    })
  }

  render() {
    const { data, selected } = this.state
    const params = this.getParams()
    const { page, size, status, update } = params
    return (
      <>
        {data == null ? (
          <TableSkeleton />
        ) : (
          <Fade in={data !== null} timeout={1000}>
            <div>
              <Toolbar>
                <Typography className="flex-1" variant="h6" component="div">
                  Jobs
                </Typography>
                <Button href="/app/job" variant="contained" color="default">
                  New Job
                </Button>
                <AutoRefresh
                  update={update}
                  onChangeAutoRefresh={this.handleChangeAutoRefresh}
                />
                <FiltersMenu onStatusFilter={this.handleStatusFilter} />
              </Toolbar>
              <div>
                {'status' in params && (
                  <StatusFilter
                    status={status}
                    onRemoveFilter={this.handleRemoveFilter}
                    onChangeFilter={this.onChangeFilter}
                  />
                )}
              </div>
              <Table aria-label="Jobs Table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selected.size > 0 && selected.size < data.jobs.length
                        }
                        checked={
                          data.jobs.length > 0 &&
                          selected.size === data.jobs.length
                        }
                        onChange={this.handleSelectAllJobs}
                        inputProps={{ 'aria-label': 'select all jobs' }}
                      />
                    </TableCell>
                    <JobsHeaders />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.jobs.map(row => {
                    const isItemSelected = selected.has(row.id)
                    const labelId = `enhanced-table-checkbox-${row.id}`
                    return (
                      <TableRow key={row.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                            value={row.id}
                            onChange={this.handleSelectJob}
                          />
                        </TableCell>
                        <JobRow
                          job={row}
                          onJobCancel={this.handleOnJobCancel}
                          onJobEnqueue={this.handleOnJobEnqueue}
                        />
                      </TableRow>
                    )
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[10, 50, 100]}
                      colSpan={7}
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
            </div>
          </Fade>
        )}
      </>
    )
  }
}
export default Jobs
