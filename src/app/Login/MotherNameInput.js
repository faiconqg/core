import React from 'react'
import FieldsBase from './FieldsBase'
import { withStyles, TextField } from '@material-ui/core'
import { AppStore } from './../../stores'

const styles = theme => ({
  // root: {
  //   marginTop: 15
  // },
  // red: {
  //   color: 'red'
  // }
})

export default
@withStyles(styles)
class MotherNameInput extends FieldsBase {
  state = {
    message: null
  }

  handleValidation = value => {
    if (value.length === 0) {
      this.onChangeValidation(false, 'Você precisa informar o nome completo da sua mãe para confirmarmos sua identidade')
    } else if (value.split(' ').length < 2) {
      this.onChangeValidation(false, 'Atenção! Você precisa preencher o nome da sua mãe COMPLETO!')
    } else {
      this.onChangeValidation(true)
    }
  }

  render() {
    const { error, value } = this.props
    const { message } = this.state

    return (
      <TextField
        label={AppStore.windowWidth < 360 ? 'Nome completo da mãe' : 'Qual o nome completo da sua mãe?'}
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
