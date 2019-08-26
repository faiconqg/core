import React from 'react'
import {
  withStyles,
  TableRow,
  TableCell,
  IconButton,
  Switch,
  CircularProgress,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText
} from '@material-ui/core'
import cs from 'classnames'
import Edit from '@material-ui/icons/Edit'
import { DateFormatter } from 'components/dataGrid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked'
import RadioButtonChecked from '@material-ui/icons/RadioButtonChecked'
import moment from 'moment'
import { TextField } from 'components/form'
import { I18n } from 'react-i18nify'

const styles = theme => ({
  label: {
    padding: '4px 56px 4px 24px',
    paddingRight: 5,
    fontSize: 15,
    fontWeight: 500,
    color: theme.palette.grey[700],
    '&:last-child': {}
  },
  value: {
    padding: '4px 56px 4px 24px',
    whiteSpace: 'nowrap',
    paddingRight: 5,
    color: theme.palette.grey[700],
    fontSize: 14,
    '&:last-child': {
      paddingRight: 5
    }
  },
  lastRow: {
    borderBottom: 'none'
  },
  helperText: {
    fontSize: 11
  },
  progress: {
    padding: 11,
    width: 26,
    height: 26,
    marginRight: 10
  },
  error: {
    color: theme.palette.error.main
  },
  labelContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  wrap: {
    whiteSpace: 'initial'
  },
  dialogTitle: {
    paddingBottom: 0
  },
  currentPassword: {
    marginTop: 30
  }
})

export default
@withStyles(styles)
class ConfigItem extends React.Component {
  state = { open: false, busy: false, currentValue: null, passwordConfirm: '', currentPassword: '' }

  handleEdit = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleChangeCurrentValue = e => {
    this.setState({ currentValue: e.target.value })
  }

  handleListItemClick = item => {
    this.setState({ busy: true, open: false })
    this.props
      .onChange(item.id)
      .then(() => this.setState({ busy: false }, this.props.afterUpdate))
      .catch(e => {
        this.setState({ busy: false, open: true, error: e.error.message })
      })
  }

  handleEditBoolean = event => {
    this.setState({ busy: true })
    this.props
      .onChange(event.target.checked)
      .then(() => this.setState({ busy: false }, this.props.afterUpdate))
      .catch(e => {
        this.setState({ busy: false, open: true, error: e.error.message })
      })
  }

  handleConfirm = event => {
    event.preventDefault()
    if (this.props.type === 'password' && this.state.currentValue != this.state.passwordConfirm) {
      this.setState({ error: I18n.t('senha_diferente') })
      return
    }

    this.setState({ busy: true, open: false, error: null })
    this.props
      .onChange(this.state.currentValue === null ? this.props.value : this.state.currentValue, this.state.currentPassword)
      .then(() => this.setState({ busy: false }, this.props.afterUpdate))
      .catch(e => {
        this.setState({ busy: false, open: true, error: e.error.message })
      })
  }

  resolveValue = () => {
    let formmatedValue = String(this.props.value).trim()
    if (this.props.type === 'password') {
      return '********'
    }

    if (this.props.list) {
      const listItem = this.props.list.find(item => item.id === this.props.value)

      if (listItem) {
        formmatedValue = listItem[this.props.labelField || 'label']
      }
    }
    if (this.props.type === 'date') {
      if (this.props.value) {
        formmatedValue = DateFormatter(moment(this.props.value))
      }
    }
    return formmatedValue || I18n.t('nao_cadastrado')
  }

  render() {
    const { label, helperText, value, lastRow, boolean, list, type, mask, labelField = 'label', classes } = this.props
    const { open, busy, error, currentValue, passwordConfirm, currentPassword } = this.state

    const resolvedValue = currentValue === null ? (type === 'date' ? moment.utc(new Date(value)).format('YYYY-MM-DD') : value) : currentValue

    return (
      <TableRow hover>
        <TableCell component="th" scope="row" className={cs(classes.label, lastRow && classes.lastRow)}>
          <div>{label}</div>
          <div className={classes.helperText}>{helperText}</div>
        </TableCell>
        <TableCell align="right" className={cs(classes.value, lastRow && classes.lastRow)}>
          {busy ? (
            <CircularProgress className={classes.progress} size="small" />
          ) : boolean ? (
            <Switch onChange={this.handleEditBoolean} checked={value} />
          ) : (
            <div className={classes.labelContainer}>
              <div className={classes.wrap}>{this.resolveValue()}</div>
              <IconButton color="primary" onClick={this.handleEdit}>
                <Edit />
              </IconButton>
            </div>
          )}
        </TableCell>
        <Dialog onClose={this.handleClose} open={open}>
          <>
            <DialogTitle className={classes.dialogTitle}>{helperText || label}</DialogTitle>
            {list ? (
              <List>
                {list.map(item => (
                  <ListItem button onClick={() => this.handleListItemClick(item)} key={item.id}>
                    <ListItemIcon>{value === item.id ? <RadioButtonChecked /> : <RadioButtonUnchecked />}</ListItemIcon>
                    <ListItemText primary={item[labelField]} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <>
                <form onSubmit={this.handleConfirm}>
                  <DialogContent>
                    {error && <DialogContentText className={classes.error}>{error}</DialogContentText>}
                    <TextField
                      autoFocus
                      mask={mask}
                      value={resolvedValue}
                      margin="dense"
                      helperText={type === 'password' ? I18n.t('nova_senha_ajuda') : null}
                      placeholder={type === 'password' ? I18n.t('nova_senha') : label || helperText}
                      required
                      type={type}
                      onChange={this.handleChangeCurrentValue}
                      fullWidth
                    />
                    {type === 'password' && (
                      <>
                        <TextField
                          value={passwordConfirm}
                          margin="dense"
                          placeholder={I18n.t('senha_confirma')}
                          helperText={I18n.t('senha_confirma_ajuda')}
                          required
                          type={type}
                          onChange={e => this.setState({ passwordConfirm: e.target.value })}
                          fullWidth
                        />
                        <TextField
                          className={classes.currentPassword}
                          value={currentPassword}
                          margin="dense"
                          placeholder={I18n.t('senha_atual')}
                          helperText={I18n.t('senha_atual_ajuda')}
                          required
                          type={type}
                          onChange={e => this.setState({ currentPassword: e.target.value })}
                          fullWidth
                        />
                      </>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                      {I18n.t('cancelar')}
                    </Button>
                    <Button color="primary" type="submit">
                      {I18n.t('ok')}
                    </Button>
                  </DialogActions>
                </form>
              </>
            )}
          </>
        </Dialog>
      </TableRow>
    )
  }
}
