import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { darken, lighten, getContrastRatio } from '@material-ui/core/styles/colorManipulator'
import { observer } from './../api'
import { withRouter } from 'react-router-dom'
import { RealmStore } from 'stores'

export default
@withRouter
@observer
class MasterLayout extends React.Component {
  render() {
    const defaultAppbar = RealmStore.appbarColor || '#F6DA4A'

    const theme = createMuiTheme({
      typography: {
        useNextVariants: true
      },
      palette: {
        primary: {
          main: RealmStore.primaryColor || '#F6DA4A',
          transparency: lighten(RealmStore.primaryColor || '#F6DA4A', 0.95)
        },
        secondary: {
          main: RealmStore.secondaryColor || '#6D8345',
          transparency: lighten(RealmStore.secondaryColor || '#6D8345', 0.95)
        },
        appbar: {
          light: lighten(defaultAppbar, 0.2),
          main: defaultAppbar,
          dark: darken(defaultAppbar, 0.3),
          // contrastText: 'black'
          contrastText: getContrastRatio(defaultAppbar, 'rgba(0, 0, 0, 0.87)') >= 10 ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.97)'
        }
        // error: will use the default color
      }
    })

    return <MuiThemeProvider theme={theme}>{this.props.children}</MuiThemeProvider>
  }
}
