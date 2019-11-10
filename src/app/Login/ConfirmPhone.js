import React from 'react'
import { withStyles, TextField, Button, CircularProgress, Dialog, DialogContent } from '@material-ui/core'
import MaskedInput from 'react-text-mask'
import { AppStore } from 'stores'
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
  button: { marginTop: 15 },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  label: {
    paddingTop: 10,
    paddingRight: 30,
    paddingLeft: 30,
    color: theme.palette.text.secondary
  }
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
    busy: false
  }

  showTime = () => {
    if (this.state.delay > 0) {
      this.setState({ delay: this.state.delay - 1 })
    } else {
      clearInterval(this.timer)
    }
  }

  sendSms = () => {
    clearInterval(this.timer)
    this.setState({ delay: 120 })
    this.timer = setInterval(this.showTime, 1000)
    const phoneNumber = '+55' + this.state.mobile.replace(/\D+/g, '')
    AppStore.sendSms(
      phoneNumber,
      error => {
        if (error) {
          this.setState({ errorCode: error })
        } else {
          this.setState({ smsSent: true })
        }
      },
      code => {
        this.setState({ code }, this.confirmCode)
      }
    )
  }

  changeCode = e => {
    this.setState({ code: e.target.value, errorCode: null })
  }

  confirmCode = () => {
    this.setState({ busy: true })
    const code = this.state.code.replace(/\D+/g, '')
    AppStore.confirmCode(code, error => {
      if (error) {
        this.setState({ busy: false })
        this.setState({ errorCode: error })
      } else {
        UserStore.rpc('confirm-mobile').then(() => {
          UserStore.current().then(() => {
            clearInterval(this.timer)
            this.props.router.push('/')
          })
        })
      }
    })
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
    let { mobile, code, mobileSet, error, errorCode, delay, smsSent, busy } = this.state

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
              disabled={!smsSent}
            >
              Continuar
            </Button>
          </>
        ) : (
          <>
            <UserIndicator username={username} onForgotUser={() => UserStore.logout()} />
            <span className={classes.wellcome}>Confirme seu número</span>
            <span>Enviaremos um SMS para confirmar seu número. Insira o código DDD da sua cidade e o número do seu celular.</span>
            <PhoneInput error={error} value={mobileSet} onChange={this.changeMobile} onChangeValidation={this.handleChangeValidation} />
            <Button className={classes.button} color="secondary" variant="contained" fullWidth onClick={this.confirmPhone}>
              Continuar
            </Button>
          </>
        )}
        <Dialog open={busy} fullScreen={false} maxWidth="lg">
          <DialogContent>
            <div className={classes.container}>
              <CircularProgress />
              <div className={classes.label}>Verificando...</div>
            </div>
          </DialogContent>
        </Dialog>
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
