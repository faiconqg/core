import { Collection, Model, observable, ResourceLoader } from './../api'

class Realm extends Model {
  urlRoot = () => 'realms'
}

class Realms extends Collection {
  url = () => 'realms'
  model = () => Realm
  @observable
  currentRealm = null
  @observable
  realmResolved = false

  @observable logos = null
  @observable remoteLogo = null
  @observable appName = null
  @observable appUrl = null
  @observable privacyUrl = null
  @observable background = null
  @observable backgroundColor = null
  @observable primaryColor = null
  @observable secondaryColor = null
  @observable appbarColor = null
  @observable termsOfUse = null
  @observable useBankAccount = null
  @observable menuBackground = null
  @observable useScore = false

  completeLoad = callback => {
    if (this.currentRealm) {
      if (this.currentRealm.picture) {
        this.remoteLogo = ResourceLoader.load(this.currentRealm.picture)
      }
      if (this.currentRealm.backgroundMicro && this.currentRealm.background) {
        this.background = [this.currentRealm.backgroundMicro, this.currentRealm.background]
      }
      if (this.currentRealm.backgroundColor) {
        this.backgroundColor = this.currentRealm.backgroundColor
      }
      if (this.currentRealm.primaryColor) {
        this.primaryColor = this.currentRealm.primaryColor
      }
      if (this.currentRealm.secondaryColor) {
        this.secondaryColor = this.currentRealm.secondaryColor
      }
      if (this.currentRealm.appbarColor) {
        this.appbarColor = this.currentRealm.appbarColor
      }
      if (this.currentRealm.termsOfUse) {
        this.termsOfUse = this.currentRealm.termsOfUse
      }
      if (this.currentRealm.appName) {
        this.appName = this.currentRealm.appName
      }
      if (this.currentRealm.useScore) {
        this.useScore = this.currentRealm.useScore
      }
      this.useBankAccount = this.currentRealm.useBankAccount
    }
    this.realmResolved = true
    callback && callback()
  }
}

export default Realms
