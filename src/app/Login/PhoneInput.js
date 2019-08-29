import React from 'react'
import FieldsBase from './FieldsBase'
import { withStyles, TextField } from '@material-ui/core'
import MaskedInput from 'react-text-mask'

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
class PhoneInput extends FieldsBase {
  state = {
    message: null
  }

  handleValidation = value => {
    if (value.replace(/\D+/g, '').length < 11) {
      this.onChangeValidation(false, 'Você precisa informar seu telefone corretamente')
    } else {
      this.onChangeValidation(true)
    }
  }

  render() {
    const { error, value } = this.props
    const { message } = this.state
    return (
      <TextField
        placeholder="(xx) xxxxx-xxxx"
        label="Informe seu número de telefone"
        InputProps={{
          inputComponent: MaskNumber
        }}
        error={!!error && (typeof error === 'string' || !!message)}
        value={value}
        onChange={this.handleChange}
        margin="normal"
        type="tel"
        fullWidth
        helperText={!!error && (typeof error === 'string' ? error : message)}
      />
    )
  }
}

const MaskNumber = props => {
  const { inputRef, ...other } = props

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null)
      }}
      guide={false}
      mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
    />
  )
}
