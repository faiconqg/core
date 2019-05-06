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
    [theme.breakpoints.down('sm')]: {
      paddingTop: 20,
      marginTop: 80
    }
  }
})

export default
@withStyles(styles)
@withWidth()
@withRouter
@observer
class AuthenticatedLayout extends React.Component {
  isSmall = () => this.props.width === 'xs' || this.props.width === 'sm'

  render() {
    const { classes, toolbar } = this.props
    return (
      <LinearLayout cover orientation="row">
        <Menu />
        <ScrollBar>
          <LinearLayout
            name="linear"
            cover
            height="100%"
            style={{
              marginLeft: this.isSmall()
                ? 0
                : // : AppStore.menuFixed && !AppStore.inSubPage
                AppStore.menuFixed
                ? 250
                : 69
            }}
          >
            <Header toolbar={toolbar} />
            <div className={classes.body}>{this.props.children}</div>
            <Footer />
          </LinearLayout>
        </ScrollBar>
      </LinearLayout>
    )
  }
}
