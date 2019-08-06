import React from 'react'
import { withStyles, Paper, Typography, Table, TableBody } from '@material-ui/core'

const styles = theme => ({
  paper: {
    height: '100%',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: 920,
    marginBottom: 16
  },
  header: {
    padding: 20,
    paddingBottom: 10
  }
})

const ConfigSection = ({ title, subtitle, children, classes }) => {
  return (
    <Paper className={classes.paper}>
      <div className={classes.header}>
        {title && <Typography variant="h6">{title}</Typography>}
        {subtitle && <Typography component="p">{subtitle}</Typography>}
      </div>
      <Table>
        <TableBody>{children}</TableBody>
      </Table>
    </Paper>
  )
}

export default withStyles(styles)(ConfigSection)
