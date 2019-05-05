import React from 'react'
import Page from './../../app/Page'
import ErrorOutline from '@material-ui/icons/ErrorOutline'
import LinearLayout from './LinearLayout'
import { Button } from '@material-ui/core'

export default class PageError extends Page {
  render() {
    return (
      <LinearLayout gravity="center" cover height="100%">
        {/* <img src={require('resources/images/incentiveme.png')} width="140" alt="Logo" /> */}
        <br />
        <ErrorOutline />
        <br />
        <span style={{ padding: 40 }}>
          Ops, algo deu errado.
          <br />
          <br />
          Verifique sua conexão com a internet...
        </span>
        <br />
        <br />
        <Button type="submit" color="primary" variant="contained" onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </LinearLayout>
    )
  }
}
