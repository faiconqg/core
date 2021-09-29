import React from 'react'
import { withStyles, TextField, Button, CircularProgress, Dialog, DialogContent } from '@material-ui/core'
import MaskedInput from 'react-text-mask'
import { UserStore } from 'stores'
import { observer, Listener, inject } from './../../api'
import PhoneInput from './PhoneInput'
import UserIndicator from './UserIndicator'

const styles = theme => ({
  welcome: {
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
    busy: false,
    sendedSms: false,
    recaptchaSate: localStorage.getItem('recaptchaSate') || '',
    call: false
  }

  showTime = () => {
    if (this.state.delay > 0) {
      this.setState({ delay: this.state.delay - 1 })
    } else {
      clearInterval(this.timer)
    }
  }

  sendSms = (call = false) => {
    clearInterval(this.timer)
    this.setState({ delay: 120 })
    this.timer = setInterval(this.showTime, 1000)
    UserStore.sendPin(this.state.recaptchaSate, call).catch(e => {
      if (e.error.code == 'INVALID_TOKEN') {
        UserStore.logout()
      } else {
        this.setState({ errorCode: e.error.message })
      }
    })
    this.setState({ smsSent: true })
  }

  changeCode = e => {
    this.setState({ code: e.target.value, errorCode: null })
  }

  confirmCode = () => {
    this.setState({ busy: true })
    const code = this.state.code.replace(/\D+/g, '')
    UserStore.verifyPin(code, this.state.recaptchaSate).then(result => {
      if (result.success) {
        clearInterval(this.timer)
        this.props.router.push('/')
        window.location.reload()
      }
    }).catch(e => {
      if (e.error.code == 'INVALID_TOKEN') {
        UserStore.logout()
      } else {
        this.setState({ errorCode: e.error.message })
      }
    }).finally(() => {
      this.setState({ busy: false })
    })
  }

  changeMobile = value => {
    this.setState({ mobileSet: value })
  }

  call = () => {
    this.sendSms(true)
    this.setState({ call: false })
  }

  confirmPhone = () => {
    if (this.state.valid) {
      UserStore.rpc('update-data', { mobile: this.state.mobileSet }).then(() => {
        this.setMobile(this.state.mobileSet)
        this.sendSms()
      }).catch(e => {
        if (e.error) {
          this.setState({ error: e.error.message })
        }
      })
    } else {
      this.setState({ error: true })
    }
  }

  setMobile = value => {
    const mobile = String(value || '').replace(/\D+/g, '')
    this.setState({ mobile }, () => {
      if (mobile.length === 11) {
        this.setState({ sendedSms: true })
      }
    })
  }

  handleChangeValidation = value => {
    this.setState({ valid: value })
  }

  render() {
    const { classes, username } = this.props
    let { sendedSms, mobile, code, mobileSet, error, errorCode, delay, smsSent, busy, call } = this.state

    mobile = String(mobile).replace(/\D+/g, '')

    return (
      <>
        <Listener value={UserStore.logged} onChange={() => {
          if (UserStore.logged) {
            this.setState({ mobileSet: String(UserStore.logged.mobile || '').replace(/\D+/g, '') }, () => {
              this.handleChangeValidation(String(UserStore.logged.mobile).replace(/\D+/g, '').length >= 11)
            }
            )
          }
        }} />


        {sendedSms ? (
          call ?
            (<>
              <UserIndicator username={username} onForgotUser={() => UserStore.logout()} />
              <span className={classes.welcome}>Siga as etapas abaixo para verificar seu número:</span>
              <ul style={{paddingInlineStart: 20}}>
                <li>Verifique se você digitou corretamente o número de telefone e o código da sua cidade <b>
                  ({mobile.slice(0, 2)}) {mobile.slice(2, 7)}-{mobile.slice(7, 11)}.
                </b></li>
                <li>O modo avião precisa estar desativado.</li>
                <li>Vá para um local onde haja uma conexão melhor. O ícone dos dados móveis precisa ter pelo menos uma barra.</li>
                <li>Verifique se seu smartphone está funcionando: peça para um amigo enviar uma mensagem de texto a você.</li>
                <li>Se ainda assim você não receber o SMS, solicite uma chamada tocando em Ligar para mim.</li>
                <li>Se nada disso resolver, abra um chamado em <a href="https://ajuda.incentive.me/ticket" target="blank" className={classes.link}>ajuda.incentive.me/ticket</a> com
                uma foto da Identidade ou CNH e uma selfie segurando esse documento. Atenção à qualidade das fotos que devem estar legíveis.</li>
              </ul>
              <Button color="secondary" onClick={this.call}>
                Ligar para mim
              </Button>
              <Button className={classes.button} color="secondary" variant="contained" fullWidth onClick={() => this.setState({ call: false })}>
                Continuar
              </Button>
            </>
            )
            :
            (
              <>
                <UserIndicator username={username} onForgotUser={() => UserStore.logout()} />
                <span className={classes.welcome}>Para sua segurança, precisamos validar o número do seu celular.</span>
                <span>
                  Enviamos um código de confirmação para o número{' '}
                  <b>
                    ({mobile.slice(0, 2)}) {mobile.slice(2, 7)}-{mobile.slice(7, 11)}
                  </b>
                  .{' '}
                  <a className={classes.link} onClick={() => {
                    clearInterval(this.timer)
                    this.setState({ mobileSet: null, mobile: mobileSet || '', sendedSms: false, smsSent: false })
                  }}>
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
                <Button color="secondary" onClick={() => this.setState({ call: true })} style={{ marginTop: 16 }}>
                  Problemas para receber o SMS?
                </Button>
              </>
            )
        ) : (
          <>
            <UserIndicator username={username} onForgotUser={() => UserStore.logout()} />
            <span className={classes.welcome}>Confirme seu número</span>
            <span>Enviaremos um SMS para confirmar seu número. Insira o código DDD da sua cidade e o número do seu celular.</span>
            <PhoneInput error={error} value={mobileSet} onChange={this.changeMobile} onChangeValidation={this.handleChangeValidation} />
            <Button className={classes.button} color="secondary" variant="contained" fullWidth onClick={this.confirmPhone}>
              Continuar
            </Button>
          </>
        )
        }
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
