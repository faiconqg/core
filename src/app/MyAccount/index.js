import React from 'react'
import { AppStore, RealmStore, UserStore } from 'stores'
import { withStyles, AppBar, Toolbar, Fab, CircularProgress } from '@material-ui/core'
import Close from '@material-ui/icons/Close'
import { I18n } from 'react-i18nify'
import { observer, inject } from './../../api'
import { Listener } from 'api'
import { ConfigSection, ConfigItem } from 'components/form'
import { PageLoading } from 'components/containers/index'

const styles = theme => ({
  root: {
    width: '100%'
  },
  container: {
    paddingTop: AppStore.device.hasNotch ? 138 : 98,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1
  },
  toolbar: {
    width: '100%',
    boxSizing: 'border-box',
    height: 82,
    maxWidth: 960
  },
  appBar: {
    paddingTop: AppStore.device.hasNotch ? 40 : 'none',
    display: 'flex',
    alignItems: 'center',
    boxShadow: 'none',
    zIndex: 100,
    color: theme.palette.text.secondary,
    position: 'fixed',
    backgroundColor: theme.palette.grey[200],
    borderBottomColor: theme.palette.primary.main,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid'
  },
  logoImg: {
    height: 36,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  flex1: {
    flex: 1
  },
  sidebarMiniIcon: {
    color: '#999999',
    width: 16,
    height: 16
  },
  closeButton: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    flexShrink: 0,
    boxShadow: theme.shadows[1]
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 30
  }
})

export default
@withStyles(styles)
@inject('router')
@observer
class MyAccount extends React.Component {
  state = {}

  updateModel() {
    UserStore.edit(UserStore.logged)
  }

  handleChange = name => value => {
    UserStore.workingModel.set({ [name]: value })
    return UserStore.workingModel.save()
  }

  handleChangeCpf = value => {
    value = String(value)
      .replace(/\./g, '')
      .replace(/-/g, '')

    UserStore.workingModel.set({ cpf: value })
    if (this.props.loginType === 'cpf') {
      UserStore.workingModel.set({ username: value })
    }

    return UserStore.workingModel.save()
  }

  handleChangeEmail = value => {
    UserStore.workingModel.set({ email: value })
    if (this.props.loginType === 'email') {
      UserStore.workingModel.set({ username: value })
    }
    return UserStore.workingModel.save()
  }

  handleChangePaassword = (newPassword, oldPassword) => {
    return UserStore.changePassword(oldPassword, newPassword)
      .then(() => this.setState({ open: false, busy: false }))
      .catch(err => {
        if (err.error.code === 'INVALID_PASSWORD') {
          throw { error: { message: I18n.t('senha_invalida') } }
        } else {
          throw err
        }
      })
  }

  render() {
    const { classes, router } = this.props
    const { full } = RealmStore.logos || {}

    if (!UserStore.logged) {
      return <PageLoading />
    }

    return (
      <div className={classes.root}>
        <Listener value={UserStore.logged} onChange={this.updateModel} />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <ArrowBack />
            </IconButton> */}
            <img className={classes.logoImg} src={full} alt={RealmStore.appName} />
            <div className={classes.flex1} />
            <Fab className={classes.closeButton} onClick={() => router.pushBack()}>
              <Close className={classes.sidebarMiniIcon} />
            </Fab>
          </Toolbar>
        </AppBar>
        <div className={classes.container}>
          {/* <div className={classes.header}>{I18n.t('minha_conta')}</div> */}
          {UserStore.workingModel ? (
            <>
              <ConfigSection title={I18n.t('dados_de_acesso')}>
                <ConfigItem
                  label={I18n.t('email')}
                  helperText={I18n.t('prompt_email')}
                  value={UserStore.workingModel.g('email')}
                  onChange={this.handleChangeEmail}
                  type="email"
                />
                <ConfigItem
                  label={I18n.t('cpf')}
                  type="tel"
                  value={String(UserStore.workingModel.g('cpf')).padStart(11, '0')}
                  onChange={this.handleChangeCpf}
                  mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                />
                <ConfigItem label={I18n.t('senha')} helperText={I18n.t('prompt_senha')} lastRow onChange={this.handleChangePaassword} type="password" />
              </ConfigSection>
              {AppStore.configurations}
            </>
          ) : (
            <div className={classes.progressContainer}>
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
    )
  }
}
