import React from 'react'
import { withStyles } from '@material-ui/core'
import { AppStore } from 'stores'
import firebase from 'firebase/app'

const styles = theme => ({
  // root: {
  //   marginTop: 15
  // },
  // red: {
  //   color: 'red'
  // }
})

export default
@withStyles(styles)
class ConfirmPhone extends React.Component {
  state = {
    message: null
  }

  componentDidMount() {
    AppStore.firebase.auth().languageCode = 'pt-br'

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      size: 'invisible',
      callback: function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log('CaptchaOk')
      }
    })

    var phoneNumber = '+5521967593209'
    var appVerifier = window.recaptchaVerifier
    AppStore.firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function(confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult
        console.log('SMS Enviado')
      })
      .catch(error => {
        if (error.code === 'auth/too-many-requests') {
          console.log('Muitas atividades em curto espaço de tempo. Tente mais tarde.')
        } else {
          console.log(error)
        }
      })
  }

  render() {
    // const { error, value, loginLabel, loginType } = this.props
    // const { message } = this.state
    return <div>Teste</div>
  }
}
