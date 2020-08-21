import React from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { IconButton } from '@material-ui/core'
import FormatIcon from '@material-ui/icons/FormatPaint'

class HoconEditor extends React.Component {
  handleFormat = event => {
    // TBD
    console.info('Not implemented yet')
  }

  render() {
    return (
      <div className="relative">
        <TextValidator {...this.props} type="text" multiline />
        <div className="absolute right-0 top-0">
          <IconButton
            aria-label="format"
            color="primary"
            onClick={this.handleFormat}
          >
            <FormatIcon />
          </IconButton>
        </div>
      </div>
    )
  }
}

export default HoconEditor
