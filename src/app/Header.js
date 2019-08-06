import React from 'react'
import { withStyles, Fab, AppBar, Toolbar, CircularProgress, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@material-ui/core'
import ArrowBack from '@material-ui/icons/ArrowBack'
import MenuIcon from '@material-ui/icons/Menu'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Person from '@material-ui/icons/Person'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { AppStore, UserStore, AccessRoutesStore, RealmStore } from 'stores'
import { LinearLayout } from 'components'
import { observer, inject } from './../api'
import Page from './Page'
import { I18n } from 'react-i18nify'

const styles = theme => ({
  progress: {
    color: theme.palette.grey[500]
  },
  header: {
    color: theme.palette.text.primary,
    fontSize: 18,
    fontWeight: 300,
    paddingLeft: 20,
    paddingRight: 20
  },
  sidebarButton: {
    width: 42,
    height: 42,
    flexShrink: 0,
    padding: 0,
    boxShadow: 'none',
    backgroundColor: 'transparent'
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 0
  },
  logoutButton: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    flexShrink: 0,
    boxShadow: theme.shadows[1]
  },
  appBar: {
    paddingTop: AppStore.device.hasNotch ? 40 : 'none',
    height: AppStore.device.hasNotch ? 'none' : 82,
    // backgroundColor: 'transparent',
    boxShadow: 'none',
    zIndex: 100,
    color: theme.palette.text.secondary,
    // [theme.breakpoints.down('sm')]: {0
    position: 'fixed',
    backgroundColor: theme.palette.grey[200],
    // color: theme.palette.primary.contrastText,
    borderBottomColor: theme.palette.primary.main,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid'
    // }
  },
  toolBar: {
    height: 82
  },
  // list: {
  //   margin: 0,
  //   padding: '0 10px 0 0',
  //   display: 'flex',
  //   justifyContent: 'flex-end'
  // },
  // image: {
  //   div: { display: 'flex', justifyContent: 'flex-start', flex: 1 },
  //   img: { maxHeight: 50, padding: 3 }
  // },
  // avatar: {
  //   image: { backgroundColor: theme.palette.primary.contrastText },
  //   text: { color: theme.palette.primary.dark }
  // },
  sidebarMenuIcon: {
    color: theme.palette.primary.main,
    width: 28,
    height: 28
  },
  sidebarMiniIcon: {
    color: '#999999',
    width: 16,
    height: 16
  },
  divider: {
    marginBottom: 10,
    marginTop: 10
  },
  menuItem: {
    height: 'unset'
  }
})

export default
@withStyles(styles)
@inject('router')
@observer
class Header extends Page {
  state = {
    anchorEl: null
  }

  toggleMenu = (e, value) => {
    if (AppStore.inSubPage) {
      this.props.router.pushBack()
    } else {
      AppStore.menuFixed = !AppStore.menuFixed
      AppStore.smallToggled = true
    }
  }

  clickMenu = callback => () => this.setState({ anchorEl: null }, callback)

  logout = () => {
    UserStore.logout()
  }

  render() {
    const { anchorEl } = this.state
    const { classes, router, toolbar, title } = this.props
    return (
      <AppBar position="static" className={classes.appBar} style={{ width: `calc(100% - ${AppStore.menuWidth}px)` }}>
        <Toolbar className={classes.toolBar}>
          <Fab className={classes.sidebarButton} size="small" disableRipple disableFocusRipple onClick={this.toggleMenu}>
            {AppStore.inSubPage ? <ArrowBack className={classes.sidebarMenuIcon} /> : <MenuIcon className={classes.sidebarMenuIcon} />}
          </Fab>
          {title}
          {AccessRoutesStore.busy() ? (
            <LinearLayout padding={20}>
              <CircularProgress size={20} className={classes.progress} />
            </LinearLayout>
          ) : (
            <span className={classes.header}>{router.currentTitle}</span>
          )}
          {toolbar}
          <div className={classes.rightContainer}>
            {UserStore.loggingOut || UserStore.busy() ? (
              <LinearLayout padding={10}>
                <CircularProgress size={20} className={classes.progress} />
              </LinearLayout>
            ) : (
              <>
                <Menu anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={() => this.setState({ anchorEl: null })}>
                  <MenuItem className={classes.menuItem} onClick={this.clickMenu(() => router.push('/account-settings'))}>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText variant="inherit" secondary={UserStore.logged ? UserStore.logged.email || UserStore.logged.name : ''}>
                      {I18n.t('minha_conta')}
                    </ListItemText>
                  </MenuItem>
                  {RealmStore.privacyUrl && (
                    <MenuItem className={classes.menuItem} onClick={this.clickMenu(() => window.open(RealmStore.privacyUrl, '_blank', 'location=no'))}>
                      <ListItemIcon>
                        <InfoOutlined />
                      </ListItemIcon>
                      <ListItemText variant="inherit">{I18n.t('privacidade')}</ListItemText>
                    </MenuItem>
                  )}
                  <Divider className={classes.divider} />
                  <MenuItem className={classes.menuItem} onClick={this.clickMenu(this.logout)}>
                    <ListItemIcon>
                      <ExitToApp />
                    </ListItemIcon>
                    <ListItemText variant="inherit">{I18n.t('sair')}</ListItemText>
                  </MenuItem>
                </Menu>
                <Fab className={classes.logoutButton} onClick={e => this.setState({ anchorEl: e.currentTarget })}>
                  <MoreVertIcon className={classes.sidebarMiniIcon} />
                </Fab>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}
