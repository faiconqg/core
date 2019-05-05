import React from 'react'
import Foundation from './../../basis/Foundation'
import { Link } from 'react-router-dom'

export default class Button extends Foundation {
  render() {
    // const { t, ...props } = this.props
    // return <this.F.Label {...props}>{this.t(t || '')}</this.F.Label>
    const { ...props } = this.props
    return <this.F.Button {...props} component={props.to ? Link : null} />
  }
}
