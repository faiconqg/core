import React from 'react'
import FieldsBase from './FieldsBase'
import { withStyles, FormControl, FormControlLabel, Checkbox, FormHelperText } from '@material-ui/core'
import { RealmStore } from 'stores'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'

const styles = theme => ({
  root: {
    marginTop: 15
  }
  // input: {
  //   width: '100%'
  // },
  // red: {
  //   color: 'red'
  // },
  // adornment: {
  //   whiteSpace: 'nowrap'
  // }
})

export default
@withStyles(styles)
class AcceptTerms extends FieldsBase {
  state = {
    message: null
  }

  handleValidation = value => {
    this.onChangeValidation(true)
  }

  render() {
    const { classes, error, value, acceptMessage } = this.props
    const { message } = this.state
    return (
      <FormControl fullWidth className={classes.root} error={!!error && (typeof error === 'string' || !!message)}>
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              color="primary"
              onChange={this.handleChangeBool}
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
            />
          }
          label={acceptMessage || `Desejo receber e-mails com informações importantes sobre o ${RealmStore.appName}`}
        />
        {!!error && <FormHelperText>{typeof error === 'string' ? error : message}</FormHelperText>}
      </FormControl>
    )
  }
}
