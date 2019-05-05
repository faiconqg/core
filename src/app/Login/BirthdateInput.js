import React from 'react'
import FieldsBase from './FieldsBase'
import { withStyles, TextField } from '@material-ui/core'
import MaskedInput from 'react-text-mask'
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'

const styles = theme => ({
  root: {
    marginTop: 15
  },
  red: {
    color: 'red'
  }
})

const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy')

export default
@withStyles(styles)
class BirthdateInput extends FieldsBase {
  state = {
    message: null
  }

  handleValidation = value => {
    if (value.length < 10) {
      this.onChangeValidation(false, 'Você precisa informar a data de nascimento para confirmarmos sua identidade')
    } else {
      this.onChangeValidation(true)
    }
  }

  render() {
    const { error, value } = this.props
    const { message } = this.state
    return (
      <TextField
        autoFocus
        placeholder="dd/mm/aaaa"
        label={window.screen.width < 360 ? 'Data do seu nascimento?' : 'Qual a data do seu nascimento?'}
        InputProps={{
          inputComponent: MaskDate
        }}
        error={!!error && (typeof error === 'string' || !!message)}
        value={value.format ? value.format('DD/MM/YYYY') : value}
        onChange={this.handleChangeDate}
        margin="normal"
        type="tel"
        fullWidth
        helperText={!!error && (typeof error === 'string' ? error : message)}
      />
    )
  }
}

const MaskDate = props => {
  const { inputRef, ...other } = props

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null)
      }}
      guide={false}
      mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
      type="tel" //TYPE DATE BUGA COM ESTE TEXTFIELD
      keepCharPositions={true}
      pipe={autoCorrectedDatePipe}
    />
  )
}
