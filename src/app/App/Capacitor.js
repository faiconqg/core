import { AppStore, UserStore } from 'stores'
import { SplashScreen } from '@capacitor/splash-screen'
import { Device }from '@capacitor/device'
import { PushNotifications } from '@capacitor/push-notifications'

const defaultError = err => {
  console.log('Disponível apenas de forma nativa')

  if (!AppStore.device.isMobile && window.screen.width === 360) {
    AppStore.device.isMobile = true
  }
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
          AppStore.operatingSystem = result.operatingSystem
          AppStore.device.isIos = result.platform === 'ios'
          AppStore.device.isAndroid = result.platform === 'android'
          AppStore.device.isMobile = result.platform === 'ios' || result.platform === 'android' || window.screen.width === 360
          if (AppStore.device.isIos) {
            if (
              window.screen.height === 812 ||
              window.screen.height === 844 ||
              window.screen.height === 896 ||
              window.screen.height === 926 ||
              window.screen.height === 2436 ||
              window.screen.height === 2688 ||
              window.screen.height === 1792
            ) {
              AppStore.device.hasNotch = true
            }
          }
          alert(window.screen.height)
          // this.user.pnToken = token.value
          // this.user.devUUID = data.uuid
          // this.user.platform = data.platform
          // this.auth.saveUser(this.user)
          SplashScreen.hide().catch(defaultError)
        })
        .catch((e) => {
          SplashScreen.hide().catch(defaultError)
        })

      PushNotifications.register().catch(defaultError)
      initialized = true
    }
  }
}

export default new Capacitor()
