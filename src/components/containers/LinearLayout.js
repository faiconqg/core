import React from 'react'
import Page from './../../app/Page'
import PropTypes from 'prop-types'

export default class LinearLayout extends Page {
  static propTypes = {
    orientation: PropTypes.oneOf(['col', 'row']),
    center: PropTypes.bool,
    cover: PropTypes.bool,
    flex: PropTypes.number,
    gravity: PropTypes.string,
    block: PropTypes.bool,
    left: PropTypes.bool,
    right: PropTypes.bool,
    margin: PropTypes.number,
    padding: PropTypes.number,
    form: PropTypes.bool,
    width: PropTypes.any,
    height: PropTypes.any,
    maxWidth: PropTypes.any,
    maxHeight: PropTypes.any,
    visible: PropTypes.bool,
    absolute: PropTypes.bool,
    style: PropTypes.any
  }

  static defaultProps = {
    orientation: 'col',
    width: 'none',
    height: 'none',
    maxWidth: 'none',
    maxHeight: 'none',
    visible: true,
    absolute: false,
    style: {}
  }

  resolveAlign = () => {
    if (this.props.block) {
      return 'stretch'
    } else if (this.props.center) {
      return 'center'
    } else if (this.props.left) {
      return 'flex-start'
    } else if (this.props.right) {
      return 'flex-end'
    } else {
      return 'auto'
    }
  }

  resolveMargin = () => {
    if (this.props.form) {
      return 15
    } else {
      return this.props.margin
    }
  }

  resolveGravity = type => {
    if (this.props.center || this.props.gravity.indexOf('center') > -1) {
      return 'center'
    } else {
      if (type === 'align') {
        if (this.props.gravity.indexOf('right') > -1) {
          return 'flex-end'
        } else if (this.props.gravity.indexOf('horizontal') > -1) {
          return 'center'
        } else {
          return 'flex-start'
        }
      } else {
        if (this.props.gravity.indexOf('bottom') > -1) {
          return 'flex-end'
        } else if (this.props.gravity.indexOf('vertical') > -1) {
          return 'center'
        } else {
          return 'flex-start'
        }
      }
    }
  }

  render() {
    let style = {
      display: 'flex',
      flex: this.props.flex ? this.props.flex : this.props.cover ? 1 : 'none',
      flexDirection: this.props.orientation === 'col' ? 'column' : 'row',
      padding: this.props.padding,
      width: this.props.width,
      height: this.props.height,
      maxWidth: this.props.maxWidth,
      maxHeight: this.props.maxHeight,
      visibility: this.props.visible ? 'unset' : 'hidden'
    }

    if (this.props.absolute) {
      style.position = 'absolute'
    }

    if (this.props.block || this.props.center || this.props.left || this.props.right) {
      style.alignSelf = this.resolveAlign()
    }

    if (this.props.center || this.props.gravity) {
      style.alignItems = this.resolveGravity('align')
      style.justifyContent = this.resolveGravity('justify')
    }

    if (this.props.form || this.props.margin) {
      style.margin = this.resolveMargin()
    }

    return (
      <div style={Object.assign({}, this.props.style, style)} className={this.props.className}>
        {this.props.children}
      </div>
    )
  }
}
