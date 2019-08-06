import React from 'react'
import Foundation from './../../basis/Foundation'
import App from './index'
import WebLayout from './WebLayout'
import { observer } from './../../api'
import { PageLoading } from 'components'
import { UserStore, RealmStore } from 'stores'

export default
@observer
class WebApp extends Foundation {
  render() {
    const { ...props } = this.props

    return <App {...props}>{!UserStore.logged || RealmStore.busy() ? <PageLoading /> : <WebLayout />}</App>
  }
}
