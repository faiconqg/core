import React from 'react'
import { withStyles, TextField, Button } from '@material-ui/core'
import MaskedInput from 'react-text-mask'
import { AppStore } from 'stores'
import firebase from 'firebase/app'
import { UserStore } from 'stores'
import { observer, Listener, inject } from './../../api'
import PhoneInput from './PhoneInput'
import UserIndicator from './UserIndicator'

const styles = theme => ({
  wellcome: {
    fontWeight: 500,
    fontSize: 16,
    paddingBottom: 10
  },
  code: {
    paddingTop: 10
  },
  codeInput: {
    textAlign: 'center',
    fontWeight: 500,
    fontSize: 22
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.secondary.main
  },
  button: { marginTop: 15 }
})

export default
@withStyles(styles)
@inject('router')
@observer
class ConfirmPhone extends React.Component {
  state = {
    mobileSet: '',
    mobile: '',
    code: '',
    valid: false,
    error: false,
    errorCode: null,
    delay: 0,
    smsSent: false,
    captchaOk: false
  }

  showTime = () => {
    if (this.state.delay > 0) {
      this.setState({ delay: this.state.delay - 1 })
    } else {
      clearInterval(this.timer)
    }
  }

  sendSms = () => {
    this.setState({ delay: 120 })
    this.timer = setInterval(this.showTime, 1000)

    AppStore.firebase.auth().languageCode = 'pt-br'

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-button', {
      size: 'invisible',
      callback: response => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        this.setState({ captchaOk: true })
      }
    })

    var phoneNumber = '+55' + this.state.mobile.replace(/\D+/g, '')
    var appVerifier = window.recaptchaVerifier
    AppStore.firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        this.confirmationResult = confirmationResult
        this.setState({ smsSent: true })
      })
      .catch(error => {
        if (error.code === 'auth/too-many-requests') {
          this.setState({ errorCode: 'Muitas tentativas, aguarde um pouco e tente novamente' })
        } else {
          console.log(error)
        }
      })
  }

  changeCode = e => {
    this.setState({ code: e.target.value, errorCode: null })
  }

  confirmCode = () => {
    const code = this.state.code.replace(/\D+/g, '')
    if (code.length === 6) {
      this.confirmationResult
        .confirm(code)
        .then(result => {
          UserStore.rpc('confirm-mobile').then(() => {
            clearInterval(this.timer)
            UserStore.current().then(() => this.props.router.push('/'))
          })
        })
        .catch(error => {
          console.log(error)
          if (error.code === 'auth/invalid-verification-code') {
            this.setState({ errorCode: 'Código de verificação incorreto' })
          } else {
            this.setState({ errorCode: 'Algo deu errado, tente novamente mais tarde' })
          }
        })
    } else {
      this.setState({ errorCode: 'O código precisa ter 6 digitos' })
    }
  }

  changeMobile = value => {
    this.setState({ mobileSet: value })
  }

  confirmPhone = () => {
    if (this.state.valid) {
      UserStore.rpc('update-data', { mobile: this.state.mobileSet }).then(() => this.setMobile(this.state.mobileSet))
    } else {
      this.setState({ error: true })
    }
  }

  setMobile = value => {
    const mobile = String(value || '').replace(/\D+/g, '')
    this.setState({ mobile }, () => {
      if (mobile.length === 11) {
        this.sendSms()
      }
    })
  }

  handleChangeValidation = value => {
    this.setState({ valid: value })
  }

  render() {
    const { classes, username } = this.props
    let { mobile, code, mobileSet, error, errorCode, delay, smsSent, captchaOk } = this.state

    mobile = String(mobile).replace(/\D+/g, '')

    return (
      <>
        <Listener value={UserStore.logged} onChange={() => this.setMobile(UserStore.logged && UserStore.logged.mobile)} />

        {mobile.length === 11 ? (
          <>
            <UserIndicator username={username} onForgotUser={() => UserStore.logout()} />
            <span className={classes.wellcome}>Para sua segurança, precisamos validar o número do seu celular.</span>
            <span>
              Enviamos um código de confirmação para o número{' '}
              <b>
                ({mobile.slice(0, 2)}) {mobile.slice(2, 7)}-{mobile.slice(7, 11)}
              </b>
              .{' '}
              <a className={classes.link} onClick={() => this.setState({ mobileSet: null, mobile: mobileSet || '' })}>
                Número errado?
              </a>
            </span>
            <TextField
              className={classes.code}
              placeholder="-   -   -   -   -   -"
              type="tel"
              InputProps={{
                inputComponent: MaskNumber
              }}
              inputProps={{
                className: classes.codeInput
              }}
              value={code}
              onChange={this.changeCode}
              error={!!errorCode}
              helperText={errorCode}
            />
            <Button color="secondary" onClick={this.sendSms} disabled={delay > 0}>
              Reenviar SMS {delay > 0 && delay}
            </Button>
            <Button
              id="recaptcha-button"
              className={classes.button}
              color="secondary"
              variant="contained"
              fullWidth
              onClick={this.confirmCode}
              disabled={!smsSent || !captchaOk}
            >
              Continuar
            </Button>
          </>
        ) : (
          <>
            <UserIndicator username={username} onForgotUser={() => UserStore.logout()} />
            <span className={classes.wellcome}>Confirme seu número</span>
            <span>Enviaremos um SMS para confirmar seu número. Insira o código DDD da sua cidade e o número do seu telefone.</span>
            <PhoneInput error={error} value={mobileSet} onChange={this.changeMobile} onChangeValidation={this.handleChangeValidation} />
            <Button className={classes.button} color="secondary" variant="contained" fullWidth onClick={this.confirmPhone}>
              Continuar
            </Button>
          </>
        )}
      </>
    )
  }
}

const MaskNumber = props => {
  const { inputRef, ...other } = props

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null)
      }}
      guide={false}
      mask={[/\d/, ' ', '-', ' ', /\d/, ' ', '-', ' ', /\d/, ' ', '-', ' ', /\d/, ' ', '-', ' ', /\d/, ' ', '-', ' ', /\d/]}
    />
  )
}
