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
class PasswordInput extends FieldsBase {
  state = {
    message: null
  }

  MaskCPF = props => {
    const { inputRef, ...other } = props

    return (
      <MaskedInput
        {...other}
        ref={ref => {
          inputRef(ref ? ref.inputElement : null)
        }}
        guide={false}
        mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
      />
    )
  }

  checkEmail = strEmail => {
    // eslint-disable-next-line
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(strEmail).toLowerCase())
  }
  checkCPF = strCPF => {
    let soma
    let resto
    soma = 0
    if (strCPF.substring(0, 9) === '999888777') return true
    if (strCPF.substring(0, 4) === '9999') return true
    if (strCPF === '00000000000') return false

    for (let i = 1; i <= 9; i++) soma = soma + parseInt(strCPF.substring(i - 1, i), 10) * (11 - i)
    resto = (soma * 10) % 11

    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(strCPF.substring(9, 10), 10)) return false

    soma = 0
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(strCPF.substring(i - 1, i), 10) * (12 - i)
    resto = (soma * 10) % 11

    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(strCPF.substring(10, 11), 10)) return false
    return true
  }

  handleValidation = value => {
    value = value || ''

    if (value.length === 0) {
      this.onChangeValidation(false, 'O campo ' + this.props.loginLabel + ' é obrigatório')
    } else if (this.props.loginType === 'cpf') {
      value = value
        .replace(/\./g, '')
        .replace(/-/g, '')
        .trim()
      if (value.length >= 11) {
        if (this.checkCPF(value)) {
          this.onChangeValidation(true)
        } else {
          this.onChangeValidation(false, 'CPF inválido, verifique o valor digitado')
        }
      } else {
        this.onChangeValidation(false, 'Preencha o campo ' + this.props.loginLabel + ' corretamente com 11 digitos')
      }
    } else {
      if (this.checkEmail(value)) {
        this.onChangeValidation(true)
      } else {
        this.onChangeValidation(false, 'E-mail inválido, verifique o valor digitado')
      }
    }
  }

  render() {
    const { error, value, loginLabel, loginType } = this.props
    const { message } = this.state
    return (
      <TextField
        autoFocus
        InputProps={
          loginType === 'cpf'
            ? {
                inputComponent: this.MaskCPF
              }
            : {}
        }
        label={`Digite seu ${loginLabel}`}
        error={!!error && (typeof error === 'string' || !!message)}
        value={value}
        onChange={this.handleChange}
        margin="normal"
        fullWidth
        helperText={!!error && (typeof error === 'string' ? error : message)}
        type={loginType === 'cpf' ? 'tel' : 'email'}
      />
    )
  }
}
