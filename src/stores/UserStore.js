import { Collection, observable, computed, Model } from './../api'
import { AccountStore, AppStore, UserDetailStore, RealmStore, ContactDataStore } from 'stores'
import platform from 'platform'

class User extends Model {
  @computed
  get account() {
    const accountId = this.g('accountId')
    let account = AccountStore.get(accountId)
    if (account) {
      return account
    } else {
      AccountStore.current()
      return AccountStore.build()
    }
  }

  @computed
  get contactData() {
    const contactDataId = this.g('contactDataId') || 0
    let contactData = ContactDataStore.get(contactDataId)
    if (contactData) {
      return contactData
    } else {
      ContactDataStore.current()
      ContactDataStore.add({ id: contactDataId })
      return ContactDataStore.get(contactDataId)
    }
  }

  @computed
  get userDetail() {
    const userDetailId = this.g('userDetailId')
    let userDetail = UserDetailStore.get(userDetailId)
    if (userDetail) {
      return userDetail
    } else {
      UserDetailStore.current()
      return UserDetailStore.build()
    }
  }
}
class Users extends Collection {
  @observable
  loggedInstance = null

  @observable
  realm = 'app'

  @observable
  customFlags = {}

  @observable
  loggingOut = false

  @observable
  dataConfirmed = false

  @observable
  notifications = []

  @observable
  adminLogin = JSON.parse(localStorage.getItem('adminLoginCache'))

  notificationToken = null

  url = () => 'users'
  model = () => User

  @computed
  get logged() {
    return this.loggedInstance ? this.loggedInstance.toJS() : null
  }

  current = memorizeName =>
    this.rpcGet('current', { details: platform })
      .then(res => {
        this.loggedInstance = this.build(res)
        this.customFlags = res.customFlags
        if (this.notificationToken) {
          if (res.userDetail.notificationToken !== this.notificationToken) {
            if (!this.adminLogin) {
              this.updateToken(this.notificationToken)
            }
          }
        }
        // this.loggedUserInstance = this.build(res)
        if (memorizeName) {
          AppStore.setUser({ name: res.name, username: memorizeName })
        }
        AppStore.onLogin && AppStore.onLogin()
        AppStore.logGa('login', { method: 'CPF', id: res.id, name: res.name })
        if (this.logged.emailVerified && this.logged.mobile) {
          this.dataConfirmed = true
        } else {
          this.dataConfirmed = false
        }
        if (res.realm === 'incentiveme') {
          if (res.primaryColor) {
            RealmStore.primaryColor = res.primaryColor
          }
          if (res.appbarColor) {
            RealmStore.appbarColor = res.appbarColor
          }
        }
        if (res.notifications) {
          this.notifications = res.notifications
        }
      })
      .catch(err => {
        if (err && err.error && (err.error.code === 'AUTHORIZATION_REQUIRED' || err.error.code === 'INVALID_TOKEN')) {
          AppStore.resetAppicationState()
        }
      })

  requestReset = email =>
    this.rpc('reset', {
      realm: this.realm,
      email,
    })

  check = username =>
    this.rpc('check', {
      realm: this.realm,
      username,
    })

  sendVerification = () => this.rpc('send-verification')

  updateToken = notificationToken =>
    this.rpc('update-token', {
      notificationToken,
    })

  completeValidation = password => this.rpc('complete-validation', { password })

  testify = (username, motherName, birthdate, phone, emailConfirm, allowSendEmail, validationKey, noTestify, confirmationMethod) =>
    this.rpc('testify', {
      realm: this.realm,
      username,
      motherName,
      birthdate: birthdate || new Date(),
      phone,
      emailConfirm,
      allowSendEmail,
      validationKey,
      noTestify,
      confirmationMethod,
    })

  changePassword = (oldPassword, newPassword) =>
    this.rpc('change-password', {
      oldPassword,
      newPassword,
    })

  generateQr = (id) =>
    this.rpc('generate-qr', {id})

  qrLogin = (qr) =>
    this.rpc('qr-login', {realm: this.realm, qr}).then(res => {
      AppStore.setToken(res.id)
      localStorage.setItem('adminLoginCache', true)
      this.adminLogin = true
      this.current()
    })

  ssoLogin = () =>
    this.rpc('renew-token').then(res => {
      AppStore.setToken(res.id)
      this.current()
    })

  login = (username, password, memorizeName) =>
    this.rpc('login', {
      realm: this.realm,
      username,
      password,
    }).then(res => {
      localStorage.setItem('adminLoginCache', false)
      this.adminLogin = false
      AppStore.setToken(res.id)
      this.current(memorizeName)
    })

  logout = (username, password) => {
    this.loggingOut = true
    return this.rpc('logout').finally(res => {
      this.loggingOut = false
      AppStore.resetAppicationState()
    })
  }

  can = role => {
    let roles = this.loggedInstance.g('roles')
    return roles.filter(r => r.name === role).length > 0
  }
}

export default Users
