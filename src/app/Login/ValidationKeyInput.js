import React from 'react'
import FieldsBase from './FieldsBase'
import { withStyles, TextField } from '@material-ui/core'
import { RealmStore } from 'stores'

const styles = theme => ({
  // root: { marginTop: 15 },
  // red: {
  //   color: 'red'
  // }
})

export default
@withStyles(styles)
class ValidationKeyInput extends FieldsBase {
  state = {
    message: null
  }

  handleValidation = value => {
    if (value.length === 0) {
      this.onChangeValidation(false, 'A chave de verificação é um campo obrigatório')
    } else {
      this.onChangeValidation(true)
    }
  }

  render() {
    const { error, value } = this.props
    const { message } = this.state

    let validationKetTitle, validationKeyMessage

    if (RealmStore.customFlags) {
      validationKetTitle = RealmStore.customFlags.validationKetTitle
      validationKeyMessage = RealmStore.customFlags.validationKeyMessage
    }

    return (
      <TextField
        label={validationKetTitle || 'Qual a chave de verificação?'}
        error={!!error}
        value={value}
        onChange={this.handleChange}
        margin="normal"
        fullWidth
        helperText={error ? message : validationKeyMessage || 'A chave de verificação, é uma palavra informada por quem lhe convidou para usar o sistema.'}
      />
    )
  }
}
