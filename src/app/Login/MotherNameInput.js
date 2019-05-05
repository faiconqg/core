import React from 'react'
import FieldsBase from './FieldsBase'
import { withStyles, TextField } from '@material-ui/core'

const styles = theme => ({
  root: {
    marginTop: 15
  },
  red: {
    color: 'red'
  }
})

export default
@withStyles(styles)
class MotherNameInput extends FieldsBase {
  state = {
    message: null
  }

  handleValidation = value => {
    if (value.length === 0) {
      this.onChangeValidation(
        false,
        'Você precisa informar o nome da sua mãe para confirmarmos sua identidade'
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
        label={
          window.screen.width < 360
            ? 'Primeiro nome da mãe'
            : 'Qual o primeiro nome da sua mãe?'
        }
        error={!!error && (typeof error === 'string' || !!message)}
        value={value}
        onChange={this.handleChange}
        margin="normal"
        fullWidth
        helperText={!!error && (typeof error === 'string' ? error : message)}
      />
    )
  }
}
