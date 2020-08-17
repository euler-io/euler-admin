import React from 'react'
import _ from 'lodash'
import qs from 'querystring'
import { navigate } from 'gatsby'
import TemplateService from '../../services/templates'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Fade,
  Typography,
  IconButton,
  Button,
  Toolbar,
} from '@material-ui/core'
import { Link } from '@reach/router'
import PlayIcon from '@material-ui/icons/PlayArrow'
import CancelIcon from '@material-ui/icons/Cancel'
import PropTypes from 'prop-types'

const TemplatesHeaders = () => {
  return (
    <>
      <TableCell>Name</TableCell>
      <TableCell></TableCell>
    </>
  )
}

const TemplateRow = props => {
  const { template, onTemplateDelete } = props
  const { name } = template
  return (
    <>
      <TableCell>
        <Link to={`/app/template/${name}`}>{name}</Link>
      </TableCell>
      <TableCell>
        <IconButton
          aria-label="play"
          color="primary"
          href={`/app/template/${name}/run`}
        >
          <PlayIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          color="secondary"
          onClick={event => onTemplateDelete(name)}
        >
          <CancelIcon />
        </IconButton>
      </TableCell>
    </>
  )
}

TemplateRow.propTypes = {
  template: PropTypes.object.isRequired,
  onTemplateDelete: PropTypes.func.isRequired,
}

class Templates extends React.Component {
  state = {
    data: null,
  }

  constructor(props) {
    super(props)
    this.service = new TemplateService()
  }

  componentDidMount() {
    this.listTemplates()
  }

  componentDidUpdate(oldProps) {
    if (oldProps !== this.props) {
      this.listTemplates()
    }
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
      ...qs.parse(this.props.location.search.replace('?', '')),
    }
    return {
      ...params,
      page: Number.parseInt(params.page),
      size: Number.parseInt(params.size),
    }
  }

  async listTemplates() {
    const { page, size, name } = this.getParams()
    const response = await this.service.listTemplates({ page, size, name })
    this.setState({
      data: response.data,
    })
  }

  handleOnTemplateDelete = templateName => {
    this.service.deleteTemplate(templateName).then(response => {
      this.listTemplates()
    })
  }

  render() {
    const { data } = this.state
    return (
      <>
        {data !== null && (
          <Fade in={data !== null} timeout={1000}>
            <div>
              <Toolbar>
                <Typography className="flex-1" variant="h6" component="div">
                  Templates
                </Typography>
                <Button
                  href="/app/template"
                  variant="contained"
                  color="default"
                >
                  New Template
                </Button>
              </Toolbar>
              <Table aria-label="Templates Table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TemplatesHeaders />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.templates.map(row => {
                    return (
                      <TableRow key={row.name}>
                        <TableCell padding="checkbox"></TableCell>
                        <TemplateRow
                          template={row}
                          onTemplateDelete={this.handleOnTemplateDelete}
                        />
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Fade>
        )}
      </>
    )
  }
}

export default Templates
