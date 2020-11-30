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
import { HelmetProvider } from 'react-helmet-async'
import 'firebase/auth'
import 'firebase/analytics'
import { PageLoading } from '../../../dist/components/containers/index'

// import DevTools from 'mobx-react-devtools'

const createBrowserHistory = require('history').createBrowserHistory
const history = syncHistoryWithStore(createBrowserHistory(), RouterStore)
let ssoToken = null

export default
@observer
class App extends Foundation {
  state = {
    ssoError: false
  }
  componentDidMount() {
    if (this.props.multitenant) {
      RealmStore.fetch().then(realms => {
        const hostname = window.location.hostname
        let subdomain = hostname.split('.')[0]
        // subdomain = 'incentiveme'
        // subdomain = 'gndi'
        // let subdomain = 'positivo'
        // let subdomain = 'oi'

        if (process.env.REACT_APP_FLAVOR) {
          subdomain = process.env.REACT_APP_FLAVOR
        } else if (['app', 'stg', 'dev'].indexOf(subdomain) > -1) {
          subdomain = 'incentiveme'
        }
        let realmInstance = realms.find(item => hostname == item.matchUrl)
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
          this.resolveCurrent()
        })
        Capacitor.init()
      })
    } else {
      RealmStore.realmResolved = true
      RealmStore.appName = this.props.appName
      Capacitor.init()
      this.resolveCurrent()
    }
    RealmStore.logos = this.props.logos
    RealmStore.remoteLogo = RealmStore.logos && RealmStore.logos.full
    RealmStore.background = this.props.background
    RealmStore.backgroundColor = this.props.backgroundColor
    RealmStore.appUrl = this.props.appUrl
    RealmStore.privacyUrl = this.props.privacyUrl
    RealmStore.faqUrl = this.props.faqUrl
    RealmStore.primaryColor = this.props.primaryColor
    RealmStore.secondaryColor = this.props.secondaryColor
    RealmStore.menuBackground = this.props.menuBackground
    AppStore.menuFixed = !!this.props.menuFixed
    AppStore.startExpanded = !!this.props.startExpanded
  }

  resolveCurrent = () => {
    if (ssoToken) {
      AppStore.setToken(ssoToken)
      UserStore.ssoLogin().then(() => {
        history.replace('/login')
      }).catch(e => this.setState({ ssoError: true }))
      ssoToken = null
    } else {
      if (AppStore.token) {
        UserStore.current()
      }
    }
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
      useMobileVerification = true,
      loginType = 'email',
      canRegister = true,
      firebaseConfig,
      messages,
      loginLabel,
      loginMask
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

    if (messages) {
      Object.assign(AppStore.messages, messages)
    }
    AppStore.onReset = onLogout
    AppStore.onLogin = onLogin
    AppStore.onPushNotificationReceived = onPushNotificationReceived
    AppStore.configurations = configurations
    if (firebaseConfig && !AppStore.firebase) {
      AppStore.firebase = firebase.initializeApp(firebaseConfig)
      AppStore.analytics = AppStore.firebase.analytics()
    }

    apiSetup(api, AppStore.token, { platform: AppStore.platform, version: process.env.REACT_APP_VERSION })

    const urlParams = new URLSearchParams(history.location.search)
    ssoToken = urlParams.get('sso-login-token')

    if (this.state.ssoError) {
      return <div>Usuário não reconhecido</div>
    }

    if (ssoToken) {
      return <PageLoading />
    }

    return (
      <HelmetProvider>
        <Provider router={RouterStore}>
          <Router history={history}>
            <MasterLayout>
              {RealmStore.realmResolved ? (
                <Helmet color={RealmStore.primaryColor} multitenant={multitenant} realm={UserStore.realm} appName={RealmStore.appName} />
              ) : null}
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
                      acceptMessage={acceptMessage}
                      wellcomeMessage={wellcomeMessage}
                      loginType={loginType}
                      loginLabel={loginLabel ? loginLabel : loginType === 'cpf' ? 'CPF' : 'e-mail'}
                      loginMask={loginMask}
                      multitenant={multitenant}
                      canRegister={canRegister}
                      appEmail={appEmail}
                    />
                  )}
                />
                {!AppStore.token || (UserStore.logged && !UserStore.logged.enabled) ? (
                  <Redirect
                    to={{
                      pathname: '/login',
                      state: { from: history.location }
                    }}
                  />
                ) : null}
                {!UserStore.adminLogin &&
                  AppStore.token &&
                  useMobileVerification &&
                  (!RealmStore.customFlags || !RealmStore.customFlags.disableMobileVerification) &&
                  UserStore.logged &&
                  !UserStore.logged.mobileVerified ? (
                    <>
                      <Route
                        path="/confirm-phone"
                        render={props => (
                          <Login
                            {...props}
                            confirmPhone
                            acceptMessage={acceptMessage}
                            wellcomeMessage={wellcomeMessage}
                            loginType={loginType}
                            loginLabel={loginLabel ? loginLabel : loginType === 'cpf' ? 'CPF' : 'e-mail'}
                            loginMask={loginMask}
                            multitenant={multitenant}
                            canRegister={canRegister}
                            appEmail={appEmail}
                          />
                        )}
                      />
                      <Redirect
                        to={{
                          pathname: '/confirm-phone',
                          state: { from: history.location }
                        }}
                      />
                    </>
                  ) : null}
                {!UserStore.adminLogin &&
                  AppStore.token &&
                  UserStore.logged &&
                  !UserStore.logged.emailVerified ? (
                    <>
                      <Route
                        path="/confirm-email"
                        render={props => (
                          <Login
                            {...props}
                            confirmEmail
                            acceptMessage={acceptMessage}
                            wellcomeMessage={wellcomeMessage}
                            loginType={loginType}
                            loginLabel={loginLabel ? loginLabel : loginType === 'cpf' ? 'CPF' : 'e-mail'}
                            loginMask={loginMask}
                            multitenant={multitenant}
                            canRegister={canRegister}
                            appEmail={appEmail}
                          />
                        )}
                      />
                      <Redirect
                        to={{
                          pathname: '/confirm-email',
                          state: { from: history.location }
                        }}
                      />
                    </>
                  ) : null}
                {/*<Route
                path="/register"
                render={props => (
                  <Register {...props} multitenant={multitenant} />
                )}
                />*/}
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
      </HelmetProvider>
    )
  }
}
