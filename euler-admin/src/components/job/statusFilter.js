import React from 'react'
import {
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
} from '@material-ui/core'
import PropTypes from 'prop-types'

class StatusFilter extends React.Component {
  state = {
    openDialog: false,
    formStatus: 'ANY',
  }

  componentDidMount() {
    console.info(this.props)
    const formStatus = this.props.status ? this.props.status : 'ANY'
    this.setState({ formStatus: formStatus })
  }

  handleClick = event => {
    this.setState({ openDialog: true })
  }

  handleRemove = event => {
    this.props.onRemoveFilter(this.props.field)
  }

  handleChange = event => {
    this.setState({ formStatus: event.target.value })
  }

  handleCancel = event => {
    this.setState({ openDialog: false })
  }

  handleOk = event => {
    const { formStatus } = this.state
    const value = formStatus !== 'ANY' ? formStatus : ''
    this.setState({ openDialog: false })
    this.props.onChangeFilter(this.props.field, value)
  }

  render() {
    const { openDialog, formStatus } = this.state
    const { status } = this.props
    let statusDesc = 'ANY'
    if (status !== '') {
      statusDesc = status
    }
    return (
      <>
        <Chip
          label={`Status: ${statusDesc}`}
          onClick={this.handleClick}
          onDelete={this.handleRemove}
        />
        <Dialog open={openDialog} aria-labelledby="status-filter-title">
          <DialogTitle id="status-filter-title">Status Filter</DialogTitle>
          <DialogContent>
            <div className="w-full max-w-xs">
              <div className="mb-4">
                <Select
                  value={formStatus}
                  onChange={this.handleChange}
                  className="w-full"
                >
                  <MenuItem value="ANY">ANY</MenuItem>
                  <MenuItem value="NEW">NEW</MenuItem>
                  <MenuItem value="ENQUEUED">ENQUEUED</MenuItem>
                  <MenuItem value="RUNNING">RUNNING</MenuItem>
                  <MenuItem value="ERROR">ERROR</MenuItem>
                  <MenuItem value="CANCELLING">CANCELLING</MenuItem>
                  <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                  <MenuItem value="FINISHED">FINISHED</MenuItem>
                </Select>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="default"
              type="button"
              onClick={this.handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={this.handleOk}
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

StatusFilter.propTypes = {
  onRemoveFilter: PropTypes.func.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  field: PropTypes.string,
}

StatusFilter.defaultProps = {
  field: 'status',
}

export default StatusFilter
