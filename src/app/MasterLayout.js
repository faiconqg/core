import React from 'react'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core'
import {darken, lighten, getContrastRatio} from '@material-ui/core/styles/colorManipulator'
import {observer} from './../api'
import {withRouter} from 'react-router-dom'
import {RealmStore} from 'stores'

export default
@withRouter
@observer
class MasterLayout extends React.Component {
  render() {
    const defaultAppbar = RealmStore.appbarColor || '#F6DA4A'

    const theme = createMuiTheme({
      typography: {
        useNextVariants: true,
      },
      background: {
        menu: RealmStore.menuBackground,
      },
      palette: {
        primary: {
          main: RealmStore.primaryColor || '#F6DA4A',
          custom: rate => lighten(RealmStore.primaryColor || '#F6DA4A', rate),
          transparency: lighten(RealmStore.primaryColor || '#F6DA4A', 0.95),
          contrastText:
            getContrastRatio(RealmStore.primaryColor || '#F6DA4A', 'rgba(0, 0, 0, 0.87)') >= 10 ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.97)',
        },
        secondary: {
          main: RealmStore.secondaryColor || '#6D8345',
          transparency: lighten(RealmStore.secondaryColor || '#6D8345', 0.95),
          custom: rate => lighten(RealmStore.secondaryColor || '#6D8345', rate),
          contrastText:
            getContrastRatio(RealmStore.secondaryColor || '#6D8345', 'rgba(0, 0, 0, 0.87)') >= 10 ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.97)',
        },
        appbar: {
          light: lighten(defaultAppbar, 0.2),
          main: defaultAppbar,
          custom: rate => lighten(defaultAppbar, rate),
          dark: darken(defaultAppbar, 0.3),
          // contrastText: 'black'
          contrastText: getContrastRatio(defaultAppbar, 'rgba(0, 0, 0, 0.87)') >= 10 ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.97)',
        },
        // error: will use the default color
      },
    })

    return <MuiThemeProvider theme={theme}>{this.props.children}</MuiThemeProvider>
  }
}
