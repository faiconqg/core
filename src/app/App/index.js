import React from 'react'
import './../../basis/Polyfill'
import { syncHistoryWithStore } from 'components'
import { Provider } from 'mobx-react'
import { apiSetup, observer } from './../../api'
import { RouterStore, AppStore, UserStore, RealmStore } from 'stores'
import Foundation from './../../basis/Foundation'
import RendererManager from './../../basis/RendererManager'
import { I18n } from 'react-i18nify'
import MasterLayout from './../MasterLayout'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
// import { Provider } from 'mobx-react'
import Login from './../Login'
import MyAccount from './../MyAccount'
// import Register from './../Register'
import { Snackbar, Button } from '@material-ui/core'
import Helmet from './Helmet'
import Capacitor from './Capacitor'
import moment from 'moment'
import firebase from 'firebase/app'
import 'firebase/auth'

// import DevTools from 'mobx-react-devtools'

const createBrowserHistory = require('history').createBrowserHistory
const history = syncHistoryWithStore(createBrowserHistory(), RouterStore)

export default
@observer
class App extends Foundation {
  componentDidMount() {
    if (this.props.multitenant) {
      RealmStore.fetch().then(realms => {
        const hostname = window.location.hostname
        let subdomain = hostname.split('.')[0]
        // let subdomain = 'incentiveme'
        // let subdomain = 'positivo'
        // let subdomain = 'oi'

        if (process.env.REACT_APP_FLAVOR) {
          subdomain = process.env.REACT_APP_FLAVOR
        } else if (['app', 'stg', 'dev'].indexOf(subdomain) > -1) {
          subdomain = 'incentiveme'
        }
        let realmInstance = realms.find(item => hostname.indexOf(item.matchUrl) > -1)
        if (!realmInstance) {
          realmInstance = realms.find(item => item.name === subdomain)
        }
        if (realmInstance) {
          RealmStore.currentRealm = realmInstance
          UserStore.realm = RealmStore.currentRealm.name
        } else {
          console.log('Usando realm padrão')
        }
        RealmStore.completeLoad(() => {
          if (AppStore.token) {
            UserStore.current()
          }
        })
        Capacitor.init()
      })
    } else {
      RealmStore.realmResolved = true
      Capacitor.init()
      if (AppStore.token) {
        UserStore.current()
      }
    }
    RealmStore.logos = this.props.logos
    RealmStore.remoteLogo = RealmStore.logos && RealmStore.logos.full
    RealmStore.background = this.props.background
    RealmStore.backgroundColor = this.props.backgroundColor
    RealmStore.appName = this.props.appName
    RealmStore.appUrl = this.props.appUrl
    RealmStore.privacyUrl = this.props.privacyUrl
    RealmStore.primaryColor = this.props.primaryColor
    RealmStore.secondaryColor = this.props.secondaryColor
    RealmStore.menuBackground = this.props.menuBackground
    AppStore.menuFixed = !!this.props.menuFixed
    AppStore.startExpanded = !!this.props.startExpanded
  }

  render() {
    const {
      renderer,
      pt,
      en,
      es,
      lang,
      api,
      children,
      prefix,
      multitenant,
      onLogout,
      onLogin,
      wellcomeMessage,
      onPushNotificationReceived,
      acceptMessage,
      appEmail,
      configurations,
      useMobileVerification,
      loginType = 'email',
      canRegister = true,
      firebaseConfig
    } = this.props

    RendererManager.renderer = renderer

    if (pt) {
      let langs = { pt: pt }
      if (en) {
        langs.en = en
      }
      if (es) {
        langs.es = es
      }
      I18n.setTranslations(langs)
      let language = lang || (UserStore.logged && UserStore.logged.locale) || 'pt'
      I18n.setLocale(language)

      if (language.indexOf('en') === 0) {
        moment.locale('en-us')
      } else if (language.indexOf('es') === 0) {
        moment.locale('es')
      } else {
        moment.locale('pt-br')
      }
    }

    AppStore.onReset = onLogout
    AppStore.onLogin = onLogin
    AppStore.onPushNotificationReceived = onPushNotificationReceived
    AppStore.configurations = configurations
    if (firebaseConfig && !AppStore.firebase) {
      AppStore.firebase = firebase.initializeApp(firebaseConfig)
    }

    apiSetup(api, AppStore.token, { platform: AppStore.platform, version: process.env.REACT_APP_VERSION })

    return (
      <Provider router={RouterStore}>
        <Router history={history}>
          <MasterLayout>
            {RealmStore.realmResolved && (
              <Helmet color={RealmStore.primaryColor} multitenant={multitenant} realm={UserStore.realm} appName={RealmStore.appName} />
            )}
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={AppStore.hasUpdate}
              message={<span id="message-id">Atualização disponível</span>}
              action={
                <Button color="secondary" size="small" onClick={() => AppStore.update()}>
                  Atualizar Agora
                </Button>
              }
            />
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={AppStore.tokenExpired}
              message={<span id="message-id">Seu token expirou</span>}
              action={
                <Button color="secondary" size="small" onClick={() => AppStore.resetAppicationState()}>
                  Entrar Novamente
                </Button>
              }
            />
            <Switch>
              <Route
                path="/login"
                render={props => (
                  <Login
                    {...props}
                    useMobileVerification={useMobileVerification}
                    acceptMessage={acceptMessage}
                    wellcomeMessage={wellcomeMessage}
                    loginType={loginType}
                    loginLabel={loginType === 'cpf' ? 'CPF' : 'e-mail'}
                    multitenant={multitenant}
                    canRegister={canRegister}
                    appEmail={appEmail}
                  />
                )}
              />
              <Route
                path="/confirm-phone"
                render={props => (
                  <Login
                    {...props}
                    confirmPhone
                    useMobileVerification={useMobileVerification}
                    acceptMessage={acceptMessage}
                    wellcomeMessage={wellcomeMessage}
                    loginType={loginType}
                    loginLabel={loginType === 'cpf' ? 'CPF' : 'e-mail'}
                    multitenant={multitenant}
                    canRegister={canRegister}
                    appEmail={appEmail}
                  />
                )}
              />
              {/*<Route
                path="/register"
                render={props => (
                  <Register {...props} multitenant={multitenant} />
                )}
                />*/}
              {(!AppStore.token || (UserStore.logged && !UserStore.logged.enabled)) && (
                <Redirect
                  to={{
                    pathname: '/login',
                    state: { from: history.location }
                  }}
                />
              )}
              {useMobileVerification && UserStore.logged && !UserStore.logged.mobileVerified && (
                <Redirect
                  to={{
                    pathname: '/confirm-phone',
                    state: { from: history.location }
                  }}
                />
              )}
              <Route path="/account-settings" render={props => <MyAccount {...props} loginType={loginType} />} />
              {children
                ? React.Children.map(children, child =>
                    React.cloneElement(child, {
                      prefix
                    })
                  )
                : 'Propriedade children é obrigatória para o App'}
              />
            </Switch>
          </MasterLayout>
        </Router>
      </Provider>
    )
  }
}
