import { Plugins } from '@capacitor/core'
import { AppStore, UserStore } from 'stores'
const { SplashScreen, Device, PushNotifications } = Plugins

const defaultError = err => {
  console.log('Disponível apenas de forma nativa')

  // if (!AppStore.device.isMobile && window.screen.width < 600) {
  //   AppStore.device.isMobile = true
  // }
}

let initialized = false

class Capacitor {
  init() {
    if (!initialized) {
      // StatusBar.setBackgroundColor({ color: RealmStore.primaryColor }).catch(defaultError)
      const registrationError = PushNotifications.addListener('registrationError', (error: any) => {
        console.log('error on register ' + JSON.stringify(error))
      })
      registrationError.catch && registrationError.catch(defaultError)

      const registration = PushNotifications.addListener('registration', token => {
        UserStore.notificationToken = token.value
      })
      registration.catch && registration.catch(defaultError)

      const pushNotificationReceived = PushNotifications.addListener('pushNotificationReceived', notification => {
        AppStore.onPushNotificationReceived && AppStore.onPushNotificationReceived(notification)
      })
      pushNotificationReceived.catch && pushNotificationReceived.catch(defaultError)

      Device.getInfo()
        .then(result => {
          AppStore.platform = result.platform
          AppStore.device.isIos = result.platform === 'ios'
          AppStore.device.isAndroid = result.platform === 'android'
          AppStore.device.isMobile = result.platform === 'ios' || result.platform === 'android'
          if (
            window.screen.height === 812 ||
            window.screen.height === 896 ||
            window.screen.height === 2436 ||
            window.screen.height === 2688 ||
            window.screen.height === 1792
          ) {
            AppStore.device.hasNotch = true
          }
          // this.user.pnToken = token.value
          // this.user.devUUID = data.uuid
          // this.user.platform = data.platform
          // this.auth.saveUser(this.user)
          SplashScreen.hide().catch(defaultError)
        })
        .catch(() => {
          SplashScreen.hide().catch(defaultError)
        })

      PushNotifications.register().catch(defaultError)
      initialized = true
    }
  }
}

export default new Capacitor()
