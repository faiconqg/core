import React from 'react'
import Page from './Page'
import { RealmStore } from 'stores'
import { withStyles } from '@material-ui/core'
import { LinearLayout } from 'components'

const styles = theme => ({
  container: {
    // borderTopColor: theme.palette.grey[300],
    // backgroundColor: theme.palette.grey[500],
    // borderTopWidth: 1,
    // borderTopStyle: 'solid',
    paddingRight: 30,
    paddingBottom: 5
  },
  label: {
    color: theme.palette.text.secondary,
    fontSize: 12,
    fontWeight: 300
  },
  link: {
    color: theme.palette.secondary.main,
    textDecoration: 'none'
  }
})

export default
@withStyles(styles)
class Footer extends Page {
  render() {
    const { classes } = this.props
    return (
      <LinearLayout gravity="right" className={classes.container}>
        <span className={classes.label}>
          © 2019{' '}
          <a href={RealmStore.appUrl || 'https://www.faicon.com'} target="blank" className={classes.link}>
            {RealmStore.appName || 'faicon.com'}
          </a>
        </span>
      </LinearLayout>
    )
  }
}
