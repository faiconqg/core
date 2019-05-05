import React from 'react'
import Foundation from './../../basis/Foundation'
import App from './index'
import WebLayout from './WebLayout'
import { observer } from './../../api'

export default
@observer
class WebApp extends Foundation {
  render() {
    const { ...props } = this.props

    return (
      <App {...props}>
        <WebLayout />
      </App>
    )
  }
}
