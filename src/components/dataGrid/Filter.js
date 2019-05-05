import React from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  FormControl,
  FormGroup,
  FormControlLabel
} from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import FilterIcon from '@material-ui/icons/FilterList'
import Checkbox from '@material-ui/core/Checkbox'

const styles = {
  checkbox: {
    padding: '0 5px'
  },

  menu: {
    padding: 25
  }
}

class Filter extends React.Component {
  state = {
    anchorEl: null,
    ativa: true,
    finalizada: true,
    finalizando: true
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  render() {
    const { anchorEl } = this.state
    const { classes } = this.props
    return (
      <div>
        <IconButton style={{ marginLeft: 15 }} onClick={this.handleClick}>
          <FilterIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    className={classes.checkbox}
                    checked={this.state.ativa}
                    onChange={this.handleChange('ativa')}
                    value="ativa"
                  />
                }
                label="Ativa"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    className={classes.checkbox}
                    checked={this.state.finalizada}
                    onChange={this.handleChange('finalizada')}
                    value="finalizada"
                  />
                }
                label="Finalizada"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    className={classes.checkbox}
                    checked={this.state.finalizando}
                    onChange={this.handleChange('finalizando')}
                    value="finalizando"
                  />
                }
                label="Finalizando"
              />
            </FormGroup>
          </FormControl>
        </Menu>
      </div>
    )
  }
}

Filter.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Filter)
