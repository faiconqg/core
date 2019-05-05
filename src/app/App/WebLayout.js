import React from 'react'
import Foundation from './../../basis/Foundation'
import { MainRouter } from 'components'
import { observer } from './../../api'
import AuthenticatedLayout from './../AuthenticatedLayout'

export default
@observer
class WebLayout extends Foundation {
  render() {
    const { prefix, toolbar } = this.props

    return (
      <AuthenticatedLayout toolbar={toolbar}>
        <MainRouter prefix={prefix} />
      </AuthenticatedLayout>
    )
  }
}
