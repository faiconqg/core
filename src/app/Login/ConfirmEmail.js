import React from 'react'
import { withStyles, Button, CircularProgress, Dialog, DialogContent } from '@material-ui/core'
// import { AppStore } from 'stores'
import { UserStore } from 'stores'
import { observer, Listener, inject } from './../../api'
import EmailInput from './EmailInput'
import UserIndicator from './UserIndicator'

const styles = theme => ({
  wellcome: {
    fontWeight: 500,
    fontSize: 16,
    paddingBottom: 10
  },
  resend: {
    marginTop: 25
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.secondary.main
  },
  button: { marginTop: 20 },
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
  },
  span: {
    paddingBottom: 10
  }
})

export default
@withStyles(styles)
@inject('router')
@observer
class ConfirmEmail extends React.Component {
  state = {
    emailSet: '',
    email: '',
    code: '',
    valid: false,
    error: false,
    errorCode: null,
    busy: false,
    sended: false,
  }

  sendEmail = () => {
    UserStore.sendVerification().then(() => {
      this.setState({ sended: true })
    })
  }

  dismiss = () => {
    UserStore.current().then(() => {
      UserStore.dismissEmailVerified = true      
      this.props.router.push('/')
    })
  }

  changeEmail = value => {
    this.setState({ emailSet: value })
  }

  confirmEmail = () => {
    if (this.state.valid) {
      UserStore.rpc('update-data', { email: this.state.emailSet }).then(() => this.setEmail(this.state.emailSet))
    } else {
      this.setState({ error: true })
    }
  }

  setEmail = value => {
    this.setState({ email: value || '' })
  }

  handleChangeValidation = value => {
    this.setState({ valid: value })
  }

  render() {
    const { classes, username } = this.props
    let { email, emailSet, error, sended, busy } = this.state

    return (
      <>
        <Listener value={UserStore.logged} onChange={() => this.setEmail(UserStore.logged && UserStore.logged.email)} />

        {email.length > 3 ? (
          <>
            <UserIndicator username={username} onForgotUser={() => UserStore.logout()} />
            <span className={classes.wellcome}>Para sua segurança, precisamos validar seu e-mail.</span>
            <span className={classes.span}>
              Enviamos um link de confirmação para o e-mail{' '}
              <b>
                {email}
              </b>
              .              
            </span>            
            <span>
              <a className={classes.link} onClick={() => this.setState({ emailSet: '', email: emailSet || '' })}>
                O e-mail está errado?
              </a>
            </span>            
            <Button
              id="recaptcha-button"
              variant="contained" 
              fullWidth
              className={classes.button}
              color="secondary"                            
              onClick={this.dismiss}
            >
              Continuar
            </Button>
            <Button color="secondary" onClick={this.sendEmail} className={classes.resend} disabled={sended}>
              {sended ? 'Enviado' : 'Reenviar e-mail'}
            </Button>
            
          </>
        ) : (
            <>
              <UserIndicator username={username} onForgotUser={() => UserStore.logout()} />
              <span className={classes.wellcome}>Confirme seu e-mail</span>
              <span>Enviaremos um e-mail com um link para endereço informado. Abra este e-mail e clique no link para confirmação.</span>
              <EmailInput error={UserStore.error ? UserStore.error.message : error} value={emailSet}
                onChange={this.changeEmail} onChangeValidation={this.handleChangeValidation} />
              <Button className={classes.button} color="secondary" variant="contained" fullWidth onClick={this.confirmEmail}>
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
