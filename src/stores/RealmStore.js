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
  @observable banner = null
  @observable appName = null
  @observable appUrl = null
  @observable privacyUrl = null
  @observable faqUrl = null
  @observable background = null
  @observable backgroundColor = null
  @observable primaryColor = null
  @observable secondaryColor = null
  @observable appbarColor = null
  @observable termsOfUse = null
  @observable useBankAccount = null
  @observable menuBackground = null
  @observable useScore = false
  @observable walletQuotation = 1
  @observable walletConfig = { walletIcon: 'realms/incents.svg', walletName: ['ic', 'ics', 'incent', 'incents'] }
  @observable customFlags = {}
  @observable confirmationMethod = 'CPF'
  // @observable passwordValidity = {}
  // @observable passwordRule = {}

  completeLoad = callback => {
    if (this.currentRealm) {
      if (this.currentRealm.logos) {
        let customLogo = {}
        Object.keys(this.currentRealm.logos).map(key => (customLogo[key] = ResourceLoader.load(this.currentRealm.logos[key])))
        this.logos = Object.assign({}, this.logos, customLogo)
      }
      if (this.currentRealm.appUrl) {
        this.appUrl = this.currentRealm.appUrl
      }
      if (this.currentRealm.walletQuotation) {
        this.walletQuotation = this.currentRealm.walletQuotation
      }
      if (this.currentRealm.walletConfig) {
        this.walletConfig = Object.assign({}, this.walletConfig, this.currentRealm.walletConfig)
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
      if (this.currentRealm.faqUrl) {
        this.faqUrl = this.currentRealm.faqUrl
      }
      if (this.currentRealm.privacyUrl) {
        this.privacyUrl = this.currentRealm.privacyUrl
      }
      if (this.currentRealm.confirmationMethod) {
        this.confirmationMethod = this.currentRealm.confirmationMethod
      }
      this.useBankAccount = this.currentRealm.useBankAccount
      this.customFlags = this.currentRealm.customFlags
    }
    this.realmResolved = true
    callback && callback()
  }
}

export default Realms
