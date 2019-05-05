import React from 'react'
import { withStyles, SnackbarContent, Snackbar } from '@material-ui/core'
import green from '@material-ui/core/colors/green'

const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  success: {
    backgroundColor: green[600]
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
})

export default 
@withStyles(styles)
class Register extends React.Component {
  state = {}

  render() {
    const { classes, open, close, msgError } = this.props
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={open}
        autoHideDuration={3000}
        onClose={close}
      >
        <SnackbarContent
          className={classes.error}
          onClose={close}
          variant="error"
          message={msgError}
        />
      </Snackbar>
    )
  }
}
