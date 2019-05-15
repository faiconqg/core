import { Collection, observable, computed, Model } from './../api'
import { AccountStore, AppStore, UserDetailStore, RealmStore } from 'stores'
import platform from 'platform'

class User extends Model {
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
  realm = 'incentiveme'

  @observable
  loggingOut = false

  @observable
  dataConfirmed = false

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
        if (this.notificationToken) {
          if (res.userDetail.notificationToken !== this.notificationToken) {
            this.updateToken(this.notificationToken)
          }
        }
        // this.loggedUserInstance = this.build(res)
        if (memorizeName) {
          AppStore.setUser({ name: res.name, username: memorizeName })
        }
        AppStore.onLogin && AppStore.onLogin()
        if (this.logged.email && this.logged.mobile) {
          this.dataConfirmed = true
        }
        if (res.realm === 'incentiveme' && (res.seller && res.seller.store && res.seller.store.merchant && res.seller.store.merchant.color)) {
          RealmStore.primaryColor = res.seller.store.merchant.color
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
      email
    })

  check = username =>
    this.rpc('check', {
      realm: this.realm,
      username
    })

  updateToken = notificationToken =>
    this.rpc('update-token', {
      notificationToken
    })

  completeValidation = password => this.rpc('complete-validation', { password })

  testify = (username, motherName, birthdate, allowSendEmail, validationKey) =>
    this.rpc('testify', {
      realm: this.realm,
      username,
      motherName,
      birthdate,
      allowSendEmail,
      validationKey
    })

  changePassword = (oldPassword, newPassword) =>
    this.rpc('change-password', {
      oldPassword,
      newPassword
    })

  login = (username, password, memorizeName) =>
    this.rpc('login', {
      realm: this.realm,
      username,
      password
    }).then(res => {
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
