import React from 'react'
import { withStyles, withWidth } from '@material-ui/core'
import { observer } from './../api'
import { AppStore } from 'stores'
import { LinearLayout, ScrollBar } from 'components'
import Header from './Header'
import Footer from './Footer'
import Menu from './Menu'
import { withRouter } from 'react-router-dom'

const styles = theme => ({
  // master: { marginLeft: AppStore.menuFixed ? 250 : 69 },
  body: {
    paddingBottom: 6,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
    marginTop: AppStore.device.hasNotch ? 120 : 80,
    [theme.breakpoints.down('sm')]: {
      paddingRight: 5,
      paddingTop: 10,
      paddingLeft: 5
    }
  }
})

export default
@withStyles(styles)
@withWidth()
@withRouter
@observer
class AuthenticatedLayout extends React.Component {
  render() {
    const { classes, toolbar, title } = this.props

    return (
      <LinearLayout cover orientation="row">
        <Menu />
        <ScrollBar>
          <LinearLayout
            name="linear"
            cover
            height="100%"
            style={{
              marginLeft: AppStore.menuWidth
            }}
          >
            <Header toolbar={toolbar} title={title} />
            <div className={classes.body}>{this.props.children}</div>
            <Footer />
          </LinearLayout>
        </ScrollBar>
      </LinearLayout>
    )
  }
}
