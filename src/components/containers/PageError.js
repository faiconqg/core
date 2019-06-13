import React from 'react'
import Page from 'app/Page'
import { RealmStore } from 'stores'
import { Typography } from '@material-ui/core'
import ErrorOutline from '@material-ui/icons/ErrorOutline'
import LinearLayout from './LinearLayout'
import { Button } from '@material-ui/core'

export default class PageError extends Page {
  handleClick = () => {
    if (this.props.action) {
      this.props.action()
    } else {
      window.location.reload()
    }
  }

  render() {
    const { title, message, label } = this.props

    return (
      <LinearLayout gravity="center" cover height="100%">
        {RealmStore.remoteLogo && <img src={RealmStore.remoteLogo} width="140" alt="Logo" />}
        <br />
        <ErrorOutline />
        <br />
        <span style={{ padding: 40, maxWidth: 400 }}>
          <Typography variant="subtitle1">{title || 'Ops, algo deu errado.'}</Typography>
          <br />
          <Typography>{message || 'Verifique sua conexão com a internet...'}</Typography>
        </span>
        <br />
        <br />
        <Button type="submit" color="primary" variant="contained" onClick={this.handleClick}>
          {label || 'Tentar Novamente'}
        </Button>
      </LinearLayout>
    )
  }
}
