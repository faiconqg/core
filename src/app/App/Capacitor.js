import { Plugins } from '@capacitor/core'
import { AppStore } from 'stores'
const { SplashScreen, Device, PushNotifications } = Plugins

const defaultError = err => {
  console.log('Disponível apenas de forma nativa')

  if (!AppStore.device.isMobile && window.screen.width < 600) {
    AppStore.device.isMobile = true
  }
}

class Capacitor {
  init() {
    // StatusBar.setBackgroundColor({ color: RealmStore.primaryColor }).catch(defaultError)
    const registrationError = PushNotifications.addListener('registrationError', (error: any) => {
      console.log('error on register ' + JSON.stringify(error))
    })
    registrationError.catch && registrationError.catch(defaultError)

    const registration = PushNotifications.addListener('registration', token => {
      console.log('token ' + token.value)
      Device.getInfo()
        .then(result => {
          AppStore.platform = result.platform
          AppStore.device.isIos = result.platform === 'ios'
          AppStore.device.isAndroid = result.platform === 'android'
          AppStore.device.isMobile = true
          // isMobile: result.platform === 'ios' || result.platform === 'android'
          // this.user.pnToken = token.value
          // this.user.devUUID = data.uuid
          // this.user.platform = data.platform
          // this.auth.saveUser(this.user)
          SplashScreen.hide().catch(defaultError)
          PushNotifications.addListener('pushNotificationReceived', notification => {
            console.log(notification)
          })
        })
        .catch(() => SplashScreen.hide().catch(defaultError))
    })

    registration.catch && registration.catch(defaultError)
    PushNotifications.register().catch(defaultError)
  }
}

export default new Capacitor()
