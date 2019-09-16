import React from 'react'
import { observer, inject } from './../../api'
import { RealmStore } from 'stores'
import { LinearLayout, ScrollBar } from 'components'
import { AccessRoutesStore, AppStore } from 'stores'
import { withStyles, SwipeableDrawer, withWidth, CircularProgress } from '@material-ui/core'
import Page from './../Page'
import MenuList from './MenuList'

const styles = theme => ({
  progress: {
    color: theme.palette.common.white
  },
  logoDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoDivImg: {
    cursor: 'pointer',
    flex: 1,
    borderBottom: '1px solid hsla(0,0%,100%,.3)',
    padding: '15px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  logoImg: {
    height: 50,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  scrollbar: {
    paddingTop: 20,
    paddingBottom: 20,
    width: '100%'
  },
  appName: {
    color: theme.palette.common.white,
    fontSize: 18
  },
  drawer: {
    boxShadow: theme.shadows[12],
    borderRightWidth: 0
  },
  version: {
    color: theme.palette.grey[700],
    bottom: 10,
    left: 10,
    fontSize: 9,
    fontWeight: 500,
    position: 'fixed'
  },
  divFora: {
    zIndex: 9999,
    background: `linear-gradient(rgba(0,0,0,.8), rgba(0,0,0,.8)), url('${RealmStore.menuBackground}')`,
    overflow: 'hidden',
    height: '100%',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  }
})

export default
@withStyles(styles)
@withWidth()
@inject('router')
@observer
class Menu extends Page {
  // componentWillMount() {
  //   AccessRoutes.where({ accessRouteId: null })
  //     .include('children')
  //     .all()
  // }

  handleItemClick = menuItem => {
    if (menuItem.hasChildren()) {
      menuItem.setState({ open: !menuItem.state.open })
    } else {
      this.props.router.pushAccessRoute(menuItem.props)
      if (AppStore.smallToggled) {
        AppStore.smallToggled = false
      }
    }
  }

  toggleMenu = value => {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    this.timeout = setTimeout(() => (AppStore.menuOver = value), 200)
  }

  isSmall = () => this.props.width === 'xs' || this.props.width === 'sm'

  handleLogoClick = () => {
    this.props.router.push('/')
    this.props.router.go()
  }

  resolveWidth = () => {
    if (AppStore.shouldMenuBeVisible || this.isSmall()) {
      return 250
    } else {
      return 69
    }
  }

  render() {
    const { classes } = this.props
    const { sidebar } = RealmStore.logos || {}
    const width = this.resolveWidth()
    return (
      <SwipeableDrawer
        open={AppStore.smallToggled}
        anchor="left"
        classes={{ paper: classes.drawer }}
        variant={this.isSmall() ? 'temporary' : 'permanent'}
        onClose={() => (AppStore.smallToggled = false)}
        onOpen={() => (AppStore.smallToggled = true)}
      >
        <div style={{ width: width }} className={classes.divFora} onMouseEnter={() => this.toggleMenu(true)} onMouseLeave={() => this.toggleMenu(false)}>
          {AccessRoutesStore.busy()}
          <div className={classes.logoDiv} id="logo">
            <div className={classes.logoDivImg} onClick={this.handleLogoClick}>
              {/*<img
                className={classes.logoImg}
                style={{
                  width: width > 69 ? 'auto' : 0
                }}
                src={logoWhite}
                alt="Logo"
              />*/}
              {sidebar ? (
                <img
                  className={classes.logoImg}
                  style={{
                    width: width > 0 ? 'auto' : 0
                  }}
                  src={sidebar}
                  alt={RealmStore.appName}
                />
              ) : (
                <span className={classes.appName}>
                  {RealmStore.appName ? (width > 69 ? RealmStore.appName : RealmStore.appName.slice(0, 2)) : width > 69 ? 'Nome do Sistema' : 'NS'}
                </span>
              )}
            </div>
          </div>
          <ScrollBar className={classes.scrollbar}>
            {AccessRoutesStore.busy() ? (
              <LinearLayout center padding={30}>
                <CircularProgress className={classes.progress} />
              </LinearLayout>
            ) : (
              <MenuList items={AccessRoutesStore.models} level={0} root onItemClick={this.handleItemClick} path={this.path} />
            )}
            <span className={classes.version}>{process.env.REACT_APP_VERSION}</span>
          </ScrollBar>
        </div>
      </SwipeableDrawer>
    )
  }
}
