import { observable, action, computed } from './../api'
import { AccessRoutesStore, UserStore } from './../'
import debounce from 'lodash/debounce'

class AppStore {
  @observable
  token = localStorage.getItem('token')
  @observable
  user = JSON.parse(localStorage.getItem('user'))
  @observable
  email = localStorage.getItem('email')
  @observable
  tokenExpired = false
  @observable
  application
  @observable
  redirect = true
  @observable
  appLoaded = false
  @observable
  history
  @observable
  menuFixed = false
  @observable
  startExpanded = false
  @observable
  menuOver = false
  @observable
  smallToggled = false
  @observable
  inSubPage = false
  @observable
  hasUpdate = false
  @observable
  device = {}
  @observable
  platform = 'web'
  onReset = null
  onLogin = null
  onPushNotificationReceived = null
  @observable
  windowWidth = 0
  configurations = null
  firebase = null
  @observable messages = {
    userBlocked: 'Sua conta está desabilitada, em caso de dúvidas, envie um e-mail para <b>${email}</b>.',
    userBlockedWithoutEmail: 'Sua conta está desabilitada, em caso de dúvidas, entre em contato.',
    recoverPasswordA: 'Se o seu e-mail for diferente do e-mail cadastrado, envie um e-mail para ',
    recoverPasswordB: ' com o novo endereço de e-mail e um documento de identificação com foto e cpf.',
    wellcome: 'Parabéns! Você foi convidado para fazer parte da maior plataforma de incentivos do Brasil!',
    firstAccess: 'Verificamos que esse é seu primeiro acesso, confirme seus dados para configurarmos seu ambiente.',
    emailConfirmation: 'Confirme seu email e clique em "Continuar" para receber o seu link de redefinição de senha.'
  }

  constructor() {
    this.windowWidth = window.screen.width
    window.addEventListener('resize', this.handleWindowWidthChange)
  }

  handleWindowWidthChange = debounce(() => {
    this.windowWidth = window.screen.width
  }, 100)

  @computed
  get shouldMenuBeVisible() {
    // return !this.inSubPage && (this.menuFixed || this.menuOver)
    return this.menuFixed || this.menuOver
  }

  @computed
  get menuWidth() {
    // return !this.inSubPage && (this.menuFixed || this.menuOver)
    return this.windowWidth < 960 ? 0 : this.menuFixed ? 250 : 69
  }

  @action
  setUser(user) {
    this.user = user
    localStorage.setItem('user', JSON.stringify(user))
  }

  @action
  setEmail(email) {
    this.email = email
    localStorage.setItem('email', email)
  }

  @action
  setToken(token) {
    this.token = token
    localStorage.setItem('token', token)
    this.tokenExpired = false
  }

  @action
  resetAppicationState() {
    this.redirect = false
    UserStore.error = null
    UserStore.loggedInstance = null
    AccessRoutesStore.reset([])
    this.tokenExpired = false
    this.resetToken()
    if (this.onReset) {
      this.onReset()
    }
  }

  @action
  update() {
    this.worker ? this.worker.postMessage('skipWaiting') : window.location.reload()
  }

  @action
  updateAvailable(worker) {
    this.worker = worker
    navigator.serviceWorker.addEventListener('controllerchange', event => {
      window.location.reload()
    })
    this.hasUpdate = true
  }

  @action
  invalidateToken() {
    this.tokenExpired = true
  }

  @action
  resetToken() {
    localStorage.removeItem('token')
    this.token = null
  }

  @action
  resetUser() {
    localStorage.removeItem('user')
    this.user = null
  }

  @action
  setAppLoaded() {
    this.appLoaded = true
  }
}

export default new AppStore()
