import React from 'react'
import FieldsBase from './FieldsBase'
import { withStyles, TextField, InputAdornment } from '@material-ui/core'

const styles = theme => ({
  // root: {
  //   marginTop: 15
  // },
  input: {
    width: '100%'
  },
  // red: {
  //   color: 'red'
  // },
  adornment: {
    whiteSpace: 'nowrap'
  }
})

export default
@withStyles(styles)
class EmailInput extends FieldsBase {
  state = {
    message: null
  }

  handleValidation = value => {
    if (value.length === 0) {
      this.onChangeValidation(false, 'Você precisa confirmar o email para receber seu link')
    } else {
      if (this.props.emailDomain && value.indexOf('@') > -1) {
        const splited = value.split('@')
        this.props.onChange(splited[0])
      }
      this.onChangeValidation(true)
    }
  }

  render() {
    const { classes, error, value, emailDomain } = this.props
    const { message } = this.state
    return (
      <TextField
        autoFocus
        label="Seu e-mail"
        error={!!error && (typeof error === 'string' || !!message)}
        value={value}
        onChange={this.handleChange}
        margin="normal"
        fullWidth
        helperText={!!error && (typeof error === 'string' ? error : message)}
        type="email"
        InputProps={emailDomain ? {
          endAdornment: (
            <InputAdornment className={classes.adornment} position="end">
              {emailDomain}
            </InputAdornment>
          ),
          classes: { input: classes.input }
        } : null}
      />
    )
  }
}
