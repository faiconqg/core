import React from 'react'
import { Hidden } from '@material-ui/core'
import { RealmStore } from 'stores'

const styles = {
  base: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    position: 'absolute'
  },
  background: {
    backgroundRepeat: 'no-repeat,no-repeat',
    backgroundPosition: 'center,center,center,center',
    backgroundSize: 'cover,cover',
    transition: 'background-image 1s ease-in-out'
  },
  overlay: {
    background: 'rgba(0,0,0,.65)'
  }
}

export default class Background extends React.Component {
  constructor() {
    super()
    this.state = {
      currentBackground: RealmStore.background && RealmStore.background[0]
    }
  }

  onBackgroundLoad = result => {
    this.setState({ currentBackground: result.target.src })
  }

  render() {
    const { children, style, ...other } = this.props
    return (
      <div style={Object.assign({}, styles.base, style)} {...other}>
        <Hidden smDown>
          <img onLoad={this.onBackgroundLoad} src={RealmStore.background && RealmStore.background[1]} style={{ display: 'none' }} alt="background" />
          <div
            style={Object.assign({}, styles.base, styles.background, {
              backgroundImage: 'url(\'' + this.state.currentBackground + '\')'
            })}
          />
          <div style={Object.assign({}, styles.base, RealmStore.backgroundColor ? { background: RealmStore.backgroundColor } : styles.overlay)} />
        </Hidden>
        <div style={styles.base}>{children}</div>
      </div>
    )
  }
}
