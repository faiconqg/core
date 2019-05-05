import React from 'react'
import FieldsBase from './FieldsBase'
import {
  withStyles,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility'

const styles = theme => ({
  root: { marginTop: 15 },
  red: {
    color: 'red'
  }
})
export default 
@withStyles(styles)
class PasswordInput extends FieldsBase {
  state = {
    showPassword: false,
    message: null
  }

  handleValidation = value => {
    if (this.props.assert) {
      if (this.props.assertValue && value === this.props.assertValue) {
        this.onChangeValidation(true)
      } else {
        this.onChangeValidation(
          false,
          this.props.errorMessage || 'O campo senha é obrigatório'
        )
      }
    } else {
      if (value.length === 0) {
        this.onChangeValidation(
          false,
          this.props.errorMessage || 'O campo senha é obrigatório'
        )
      } else {
        this.onChangeValidation(true)
      }
    }
  }

  render() {
    const { classes, error, value, label, autoFocus } = this.props
    const { message, showPassword } = this.state

    return (
      <FormControl fullWidth className={classes.root}>
        <InputLabel>{label || 'Digite sua senha'}</InputLabel>
        <Input
          fullWidth
          autoFocus={autoFocus === undefined ? true : autoFocus}
          error={!!error && (typeof error === 'string' || !!message)}
          value={value}
          onChange={this.handleChange}
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                tabIndex={-1}
                aria-label="Ver senha"
                onPointerDown={() => this.setState({ showPassword: true })}
                onPointerUp={() => this.setState({ showPassword: false })}
                onPointerLeave={() => this.setState({ showPassword: false })}
              >
                <Visibility />
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText id="senha-helper-text" className={classes.red}>
          {!!error && (typeof error === 'string' ? error : message)}
        </FormHelperText>
      </FormControl>
    )
  }
}
