import React from 'react'
import { observer, inject } from './../../api'
import { LinearLayout } from 'components'
import { withStyles } from '@material-ui/core'
import Page from './../Page'
import { Collapse, ListItem, ListItemIcon, ListItemText, Icon, Fade } from '@material-ui/core'
import MenuList from './MenuList'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import cs from 'classnames'

var styles = theme => ({
  drawerIcons: {
    color: theme.palette.secondary.contrastText,
    marginRight: 0
  },
  initials: {
    width: 30,
    marginRight: 15,
    letterSpacing: 1
  },
  label: {
    color: theme.palette.secondary.contrastText,
    fontSize: 14,
    fontWeight: 400,
    margin: 0,
    transition: 'all 1s',
    lineHeight: '1,5em'
  },
  label2: {
    fontWeight: 300
  },
  drawerDiv: { marginLeft: -10 },
  wrapperInner: { paddingLeft: 20 },
  button: { background: 'transparent' },
  item: {
    overflow: 'hidden',
    textDecoration: 'none',
    paddingLeft: 16,
    width: 'calc(100% - 16px)',
    height: 50,
    alignSelf: 'center',
    borderRadius: 3,
    '&:focus': {
      backgroundColor: theme.palette.secondary.light
    },
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  itemHover: {
    '&:hover,&:focus': {
      backgroundColor: 'rgba(200, 200, 200, 0.2)'
    }
  },
  itemActive: {
    backgroundColor: theme.palette.secondary.light
  },
  fade: {
    overflowX: 'hidden',
    paddingLeft: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  }
})

export default
@withStyles(styles)
@inject('router')
@observer
class Item extends Page {
  state = {
    open: this.startOpened()
  }

  startOpened() {
    return (
      this.hasChildren() &&
      this.props.accessRoute.accessRoutes.filter(item => this.props.router.location.pathname.indexOf(`/${this.props.accessRoute.path}/${item.path}`) === 0)
        .length > 0
    )
  }

  hasChildren() {
    return this.props.accessRoute.accessRoutes && this.props.accessRoute.accessRoutes.length > 0
  }

  render() {
    const { accessRoute, classes, router, level } = this.props
    const isActive = router.isActive(this.props)
    const shouldShowActive = isActive && (!this.hasChildren() || !this.state.open)
    return (
      <LinearLayout direction="cols">
        <ListItem
          button
          onClick={() => this.props.onItemClick(this)}
          className={cs(classes.item, {
            [classes.itemHover]: !shouldShowActive,
            [classes.itemActive]: shouldShowActive
          })}
          classes={{ button: this.props.classes.button, focusVisible: '' }}
        >
          <ListItemIcon>
            {accessRoute.icon ? (
              <Icon className={classes.drawerIcons}>{accessRoute.icon}</Icon>
            ) : (
              <span className={cs(classes.label, classes.initials)}>{accessRoute.initials}</span>
            )}
          </ListItemIcon>
          <Fade in={!this.props.hideMenu}>
            <div className={classes.fade}>
              <ListItemText primary={accessRoute.label} disableTypography={true} className={cs(classes.label, { [classes.label2]: level > 0 })} />

              <div>
                {this.hasChildren() ? this.state.open ? <ExpandLess className={classes.drawerIcons} /> : <ExpandMore className={classes.drawerIcons} /> : ''}
              </div>
            </div>
          </Fade>
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <MenuList parent={this.props} items={accessRoute.accessRoutes} level={this.props.level + 1} onItemClick={this.props.onItemClick} />
        </Collapse>
      </LinearLayout>
    )
  }
}
