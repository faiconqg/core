import { observable, action, computed } from './../api'
import { AccessRoutesStore, UserStore } from './../'
import debounce from 'lodash/debounce'
import firebase from 'firebase/app'
// import { cfaSignIn, cfaSignInPhoneOnCodeSent, cfaSignInPhoneOnCodeReceived } from 'capacitor-firebase-auth'

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
  analytics = null
  @observable messages = {
    userBlocked: 'Sua conta está desabilitada, em caso de dúvidas, envie um e-mail para <b>${email}</b>.',
    userBlockedWithoutEmail: 'Sua conta está desabilitada, em caso de dúvidas, entre em contato.',
    recoverPasswordA: 'Para atualizar o seu e-mail de cadastrado, envie um email para ',
    recoverPasswordB: ' com o novo endereço de e-mail, uma foto da Identidade ou CNH e uma selfie segurando esse documento. Atenção à qualidade das fotos que devem estar legíveis.',
    welcome: 'Parabéns! Você foi convidado para fazer parte da maior plataforma de incentivos do Brasil!',
    firstAccess: 'Verificamos que esse é seu primeiro acesso, confirme seus dados para configurarmos seu ambiente.',
    emailConfirmation: 'Confirme seu email e clique em "Continuar" para receber o seu link de redefinição de senha.',
    noEmailWithoutEmail:
      '<p><b>E-mail não está cadastrado</b></p><p>Para cadastrar seu e-mail é preciso seguir um protocolo de segurança:</p><p>Entre em contato para mais informações.</p>',
    noEmail:
      '<p><b>E-mail não está cadastrado</b></p><p>Para cadastrar seu e-mail é preciso seguir um protocolo de segurança:</p><p>Envie um documento com foto para <b>${email}</b>, com isso, nós atualizaremos o e-mail com o mesmo endereço que nos enviou o documento.</p>'
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
  logGa(event, data) {
    this.analytics.logEvent(event, data)
  }

  @action
  setGaProperty(data) {
    this.analytics.setUserProperties(data)
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
    localStorage.setItem('adminLoginCache', false)
    UserStore.adminLogin = false
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

  sendSms = (phoneNumber, callback, callbackCode) => {
    let today = new Date()
    if (!window.sendSmsCountTime || (today - window.sendSmsCountTime) > 10000) {
        window.sendSmsCountTime = today
      if (this.device.isMobile) {
        this.sendSmsApp(phoneNumber, callback, callbackCode)
      } else {
        this.sendSmsWeb(phoneNumber, callback)
      }
    }
  }

  sendSmsWeb = (phoneNumber, callback) => {
    this.firebase.auth().languageCode = 'pt-br'

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-button', {
      size: 'invisible',
      callback: response => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        callback()
      },
      'error-callback': error => {
        console.log('recaptchaVerifier', error)
      }
    })

    window.recaptchaVerifier.render().then(function(widgetId) {
      window.recaptchaWidgetId = widgetId
    })

    var appVerifier = window.recaptchaVerifier
    this.firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        this.confirmationResult = confirmationResult
        callback()
      })
      .catch(error => {
        window.grecaptcha.reset(window.recaptchaWidgetId)
        console.log('sendSmsWeb', error)
        if (error.code === 'auth/too-many-requests') {
          callback('Muitas tentativas, aguarde um pouco e tente novamente')
        } else {
          callback('Falha ao enviar SMS')
        }
      })
  }

  confirmCode = (code, callback) => {
    if (code.length === 6) {
      if (this.device.isMobile) {
        this.confirmCodeApp(code, callback)
      } else {
        this.confirmCodeWeb(code, callback)
      }
    } else {
      callback('O código precisa ter 6 digitos')
    }
  }

  confirmCodeWeb = (code, callback) => {
    this.confirmationResult
      .confirm(code)
      .then(result => {
        callback()
      })
      .catch(error => {
        console.log('confirmCodeWeb', error)
        if (error.code === 'auth/invalid-verification-code') {
          callback('Código de verificação incorreto')
        } else {
          callback('Algo deu errado, tente novamente mais tarde')
        }
      })
  }

  // sendSmsApp = (phoneNumber, callback, callbackCode) => {
  //   this.callbackCalled = false
  //   this.verificationId = null

  //   cfaSignInPhoneOnCodeReceived().subscribe((event: { verificationId: string, verificationCode: string }) => {
  //     console.log('cfaSignInPhoneOnCodeReceived')
  //     this.verificationId = event.verificationId
  //     callbackCode(event.verificationCode)
  //   })

  //   cfaSignInPhoneOnCodeSent().subscribe(verificationId => {
  //     console.log('cfaSignInPhoneOnCodeSent')
  //     if (!this.verificationId) {
  //       this.verificationId = verificationId
  //       this.callbackCalled = true
  //       callback()
  //     }
  //   })
    
  //   cfaSignIn('phone', { phone: phoneNumber }).subscribe(user => {
  //     console.log('cfaSignIn')
  //     if (this.verificationId) {
  //       this.callbackCalled = true
  //       callback()
  //     }
  //   })

  //   setTimeout(() => {
  //     if (!this.callbackCalled) {
  //       callback('Muitas tentativas, aguarde um pouco e tente novamente')
  //     }
  //     this.callbackCalled = true
  //   }, 10000)
  // }

  confirmCodeApp = (code, callback) => {
    const credential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, code)
    console.log(1, 'credential', JSON.parse(JSON.stringify(credential)))
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(result => {
        console.log(101, result)
        callback()
      })
      .catch(error => {
        console.log(1,'error-confirm-code', JSON.parse(JSON.stringify(error)))
        if (error.code === 'auth/invalid-verification-code') {
          callback('Código de verificação incorreto')
        } else if (error.code === 'auth/code-expired') {
          callback('O código expirou, solicite um novo código')
        } else {
          callback('Algo deu errado, tente novamente mais tarde')
        }
      })
  }
}

export default new AppStore()
