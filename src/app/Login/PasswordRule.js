import React from 'react'
import { withStyles } from '@material-ui/core'
import Warning from '@material-ui/icons/Warning'
import CheckCircle from '@material-ui/icons/CheckCircle'

const styles = theme => ({
  passwordRule: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 5,
    fontSize: 12
  },
  passedRule: {
    width: 20,
    height: 20,
    marginRight: 5,
    color: '#11aa11'
  },
  errorRule: {
    width: 20,
    height: 20,
    marginRight: 5,
    color: theme.palette.error.main
  }
})

export default
@withStyles(styles)
class PasswordRule extends React.Component {
  render() {
    const { rules, classes } = this.props

    return rules.map((item, index) => (
      <div key={index} className={classes.passwordRule}>
        {item.valid ? <CheckCircle className={classes.passedRule} /> : <Warning className={classes.errorRule} />}
        {item.description}
      </div>
    ))
  }
}
