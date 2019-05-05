import React from 'react'
import { withStyles } from '@material-ui/core'

const styles = theme => ({
  root: {
    height: 'calc(100% + 20px)',
    minHeight: 55,
    width: 1,
    flexShrink: 0,
    marginLeft: 20,
    marginRight: 20,
    marginTop: -10,
    marginBottom: -10,
    background: 'rgba(0,0,0,0.2)'
  }
})

const Divider = ({ classes }) => {
  return <div className={classes.root} />
}

export default withStyles(styles)(Divider)
