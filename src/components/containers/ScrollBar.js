import React from 'react'
import Page from './../../app/Page'
import { Scrollbars } from 'react-custom-scrollbars'

const style = {
  background: 'inherit',
  display: 'flex',
  alignSelf: 'stretch',
  width: '100%',
  height: '100vh'
}

export default class ScrollBar extends Page {
  render() {
    return <Scrollbars autoHide style={Object.assign({}, this.props.style, style)} {...this.props} />
  }
}
