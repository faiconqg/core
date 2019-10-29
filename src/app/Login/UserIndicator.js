import React from 'react'
import { withStyles, IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core'
import { observer } from './../../api'
import ArrowBack from '@material-ui/icons/ArrowBack'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Close from '@material-ui/icons/Close'
import { AppStore } from 'stores'

const styles = theme => ({
  flex: {
    flex: 1
  },
  root: {
    width: '100%',
    color: 'rgba(0, 0, 0, 0.54)',
    display: 'flex',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  vContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  nameContaienr: {
    display: 'flex',
    flex: 1,
    alignItems: 'center'
  },
  name: {
    fontWeight: 400,
    fontSize: 18
  },
  username: {
    fontWeight: 400,
    fontSize: 14
  },
  button: {
    padding: 0,
    position: 'relative',
    width: 32,
    height: 32,
    marginRight: 5
  },
  icon: {
    color: theme.palette.grey[700],
    marginRight: 10,
    width: 48,
    height: 48
  }
})
export default
@withStyles(styles)
@observer
class UserIndicator extends React.Component {
  state = {
    anchorEl: null
  }

  render() {
    const { classes, username, onBack, onForgotUser } = this.props
    const { anchorEl } = this.state
    return (
      <div className={classes.root}>
        {AppStore.user ? (
          <div className={classes.nameContaienr}>
            <AccountCircle className={classes.icon} />
            <div className={classes.vContainer}>
              <span className={classes.name}>{AppStore.user.name}</span>
              {typeof username === 'string' || username instanceof String ? <span className={classes.username}>{username}</span> : null}
            </div>
            <span className={classes.flex} />
            <Tooltip title="Esquecer usuário" placement="top-start">
              <IconButton className={classes.button} aria-label="Esquecer" onClick={onForgotUser}>
                <Close />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <React.Fragment>
            <IconButton className={classes.button} aria-label="Voltar" onClick={onBack}>
              <ArrowBack />
            </IconButton>
            <span className={classes.name}>{username}</span>
          </React.Fragment>
        )}
        <Menu id="long-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => this.setState({ anchorEl: null })}>
          <MenuItem
            onClick={() =>
              this.setState({
                usuarioValido: false,
                anchorEl: null
              })
            }
          >
            {'Entrar com outro usuário'}
          </MenuItem>
        </Menu>
      </div>
    )
  }
}
