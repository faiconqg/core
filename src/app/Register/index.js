import React from 'react'
import { withStyles, Hidden } from '@material-ui/core'
import { RealmStore } from 'stores'
import Form from './Form'
import { Background } from 'components'
import FooterBar from '../FooterBar'

import Grid from '@material-ui/core/Grid'

const styles = theme => {
  console.log(theme)
  return {
    fullPageCentralized: {
      width: '100%',
      height: '100vh',
      minHeight: '600px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        minHeight: 'initial'
      }
    },
    bottomLogo: {
      padding: 20,
      marginBottom: 20,
      maxWidth: 220,
      width: '50%',
      zIndex: 1,
      [theme.breakpoints.down('sm')]: {
        width: '60%',
        position: 'absolute',
        bottom: 0
      }
    }
  }
}

export default
@withStyles(styles)
class Register extends React.Component {
  render() {
    const { classes } = this.props
    const { login, solid } = RealmStore.logos || {}
    return (
      <Background>
        <Grid item xs={12} className={classes.fullPageCentralized}>
          <Form />
          <Hidden mdUp>
            <img src={login} alt="Logo" className={classes.bottomLogo} />
          </Hidden>
          <Hidden smDown>
            <img src={solid} alt="Logo" className={classes.bottomLogo} />
          </Hidden>
        </Grid>
        <FooterBar appUrl={RealmStore.appUrl} appName={RealmStore.appName} />
      </Background>
    )
  }
}
