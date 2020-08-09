import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  Tooltip,
  IconButton,
  Typography,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import UpdateIcon from '@material-ui/icons/UpdateSharp'

class AutoRefresh extends React.Component {
  state = {
    openDialog: false,
    formUpdate: 0,
  }

  componentDidMount() {
    const formUpdate = this.props.update ? this.props.update : 0
    this.setState({ formUpdate: formUpdate })
  }

  handleClick = event => {
    this.setState({ openDialog: true })
  }

  handleChange = (event, value) => {
    this.setState({ formUpdate: value })
  }

  handleCancel = event => {
    this.setState({ openDialog: false })
  }

  handleOk = event => {
    const { formUpdate } = this.state
    this.setState({ openDialog: false })
    this.props.onChangeAutoRefresh(formUpdate)
  }

  getValueText(value) {
    if (value > 0) {
      return `Every ${value} sec${value > 1 ? 's' : ''}`
    } else {
      return 'Never'
    }
  }

  render() {
    const { openDialog, formUpdate } = this.state
    const { update } = this.props
    const updateDesc = this.getValueText(formUpdate)
    return (
      <>
        <Tooltip title="Auto-Refresh">
          <IconButton
            aria-label="auto-refresh"
            color={update > 0 ? 'secondary' : 'default'}
            onClick={this.handleClick}
          >
            <UpdateIcon />
          </IconButton>
        </Tooltip>
        <Dialog
          open={openDialog}
          aria-labelledby="status-filter-title"
          fullWidth={true}
        >
          <DialogTitle id="auto-refresh-title">Auto-Refresh</DialogTitle>
          <DialogContent>
            <div className="w-full">
              <div className="m-8"></div>
              <Slider
                defaultValue={1}
                value={formUpdate}
                aria-labelledby="discrete-slider"
                onChangeCommitted={this.handleChange}
                valueLabelDisplay="on"
                step={1}
                min={0}
                max={10}
              />
            </div>
            <Typography variant="subtitle1">{updateDesc}</Typography>
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

AutoRefresh.propTypes = {
  onChangeAutoRefresh: PropTypes.func.isRequired,
  update: PropTypes.number.isRequired,
}

export default AutoRefresh
