import React from 'react'
import FieldsBase from './FieldsBase'
import { withStyles, TextField } from '@material-ui/core'

const styles = theme => ({
  root: { marginTop: 15 },
  red: {
    color: 'red'
  }
})

export default
@withStyles(styles)
class ValidationKeyInput extends FieldsBase {
  state = {
    message: null
  }

  handleValidation = value => {
    if (value.length === 0) {
      this.onChangeValidation(
        false,
        'A chave de verificação é um campo obrigatório'
      )
    } else {
      this.onChangeValidation(true)
    }
  }

  render() {
    const { error, value } = this.props
    const { message } = this.state
    return (
      <TextField
        label="Qual a chave de verificação?"
        error={!!error}
        value={value}
        onChange={this.handleChange}
        margin="normal"
        fullWidth
        helperText={
          error
            ? message
            : 'A chave de verificação, é uma palavra informada por quem lhe convidou para usar o sistema.'
        }
      />
    )
  }
}
