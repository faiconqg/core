import { observable, action, computed } from './../api'
import { AccessRoutesStore, UserStore } from './../'

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

  @computed
  get shouldMenuBeVisible() {
    // return !this.inSubPage && (this.menuFixed || this.menuOver)
    return this.menuFixed || this.menuOver
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
    this.worker.postMessage('skipWaiting')
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
