import React from 'react'
import { AppStore } from 'stores'
import PageError from './PageError'

export default class UpgradeNeeded extends React.Component {
  render() {
    return (
      <PageError
        title="Atualização necessária"
        message="Você está usando uma versão desatualizada, para ter acesso a sua conta e novos recursos, atualize seu aplicativo."
        label="Atualizar agora"
        action={
          AppStore.device.isMobile
            ? AppStore.device.isIos
              ? () => window.open('https://apps.apple.com/br/app/' + process.env.REACT_APP_APP_STORE, '_blank', 'location=no')
              : () => window.open('https://play.google.com/store/apps/details?id=' + process.env.REACT_APP_PLAY_STORE, '_blank', 'location=no')
            : AppStore.update
        }
      />
    )
  }
}
