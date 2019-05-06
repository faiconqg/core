import React from 'react'
import { withStyles } from '@material-ui/core'
import { RealmStore } from 'stores'

const styles = theme => ({
  flex: {
    flex: 1
  },
  // appName: {
  //   color: theme.palette.primary.dark,
  //   fontWeight: 400,
  //   fontSize: 22
  // },
  // card: {
  //   flexDirection: 'column',
  //   maxWidth: 412,
  //   width: '100%',
  //   display: 'flex',
  //   flex: 'none',
  //   justifyContent: 'center',
  //   [theme.breakpoints.down('sm')]: {
  //     flex: 1,
  //     alignItems: 'center',
  //     borderRadius: 0
  //   }
  // },
  footerBar: {
    position: 'fixed',
    right: 0,
    left: 0,
    bottom: 0,
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 4,
    paddingTop: 5,
    // backgroundColor: theme.palette.primary.dark
    backgroundColor: 'rgba(0,0,0,0.65)'
  },
  footerLabel: {
    marginLeft: 5,
    marginRight: 5,
    color: theme.palette.common.white,
    fontSize: 12,
    fontWeight: 400
  },
  footerLink: {
    color: theme.palette.common.white,
    textDecoration: 'none'
  }
})
export default
@withStyles(styles)
class FooterBar extends React.Component {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.footerBar}>
        <span className={classes.footerLabel}>{process.env.REACT_APP_VERSION}</span>
        <span className={classes.flex} />
        <span className={classes.footerLabel}>
          © 2019{' '}
          <a href={RealmStore.appUrl || 'https://www.faicon.com'} target="blank" className={classes.footerLink}>
            {RealmStore.appName || 'faicon.com'}
          </a>
        </span>
      </div>
    )
  }
}
