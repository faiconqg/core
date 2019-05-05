import React from 'react'
import Foundation from './../../basis/Foundation'

export default class Label extends Foundation {
  render() {
    // const { t, ...props } = this.props
    // return <this.F.Label {...props}>{this.t(t || '')}</this.F.Label>
    const { text, ...props } = this.props
    return <this.F.Label {...props}>{text}</this.F.Label>
  }
}
