import React from 'react'
import Page from './../../app/Page'
import { CircularProgress } from '@material-ui/core'
import LinearLayout from './LinearLayout'

export default class PageLoading extends Page {
  render() {
    return (
      <LinearLayout absolute gravity="center" width="100%" height="100%">
        <CircularProgress />
        <br />
        <span>Incentive.me</span>
      </LinearLayout>
    )
  }
}
