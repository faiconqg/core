import React from 'react'
import { withStyles, Fab, AppBar, Toolbar, CircularProgress } from '@material-ui/core'
import Menu from '@material-ui/icons/Menu'
import ArrowBack from '@material-ui/icons/ArrowBack'
import ExitToApp from '@material-ui/icons/ExitToApp'
import { AppStore, UserStore, AccessRoutesStore } from 'stores'
import { LinearLayout } from 'components'
import { observer, inject } from './../api'
import Page from './Page'

const styles = theme => ({
  progress: {
    color: theme.palette.grey[500]
  },
  loggedUser: {
    fontSize: 18,
    fontWeight: 300,
    paddingRight: 10,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
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
    height: 82,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    zIndex: 100,
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.primary.contrastText,
      borderBottomColor: theme.palette.primary.main,
      borderBottomWidth: 2,
      borderBottomStyle: 'solid'
    }
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
  }
})

export default
@withStyles(styles)
@inject('router')
@observer
class Header extends Page {
  toggleMenu = (e, value) => {
    if (AppStore.inSubPage) {
      this.props.router.pushBack()
    } else {
      AppStore.menuFixed = !AppStore.menuFixed
      AppStore.smallToggled = true
    }
  }

  logout = () => {
    UserStore.logout()
  }

  render() {
    const { classes, router, toolbar } = this.props
    return (
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <Fab className={classes.sidebarButton} size="small" disableRipple disableFocusRipple onClick={this.toggleMenu}>
            {AppStore.inSubPage ? <ArrowBack className={classes.sidebarMenuIcon} /> : <Menu className={classes.sidebarMenuIcon} />}
          </Fab>
          {AccessRoutesStore.busy() ? (
            <LinearLayout padding={20}>
              <CircularProgress size={20} className={classes.progress} />
            </LinearLayout>
          ) : (
            <span className={classes.header}>{router.currentTitle}</span>
          )}
          {toolbar}
          <div className={classes.rightContainer}>
            {UserStore.logged ? (
              <span className={classes.loggedUser}>{UserStore.logged.name}</span>
            ) : (
              UserStore.busy() && (
                <LinearLayout padding={20}>
                  <CircularProgress size={20} className={classes.progress} />
                </LinearLayout>
              )
            )}
            {UserStore.loggingOut ? (
              <LinearLayout padding={10}>
                <CircularProgress size={20} className={classes.progress} />
              </LinearLayout>
            ) : (
              <Fab className={classes.logoutButton} onClick={this.logout}>
                <ExitToApp className={classes.sidebarMiniIcon} />
              </Fab>
            )}
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}
