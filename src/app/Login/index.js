import React from 'react'
import { Redirect } from 'react-router'
import { UserStore, AppStore, RealmStore } from 'stores'
import { Background, LinearLayout, PageLoading, PageError, UpgradeNeeded } from 'components'
import { observer, inject } from './../../api'
import { withStyles, Button, Card, CircularProgress, Hidden } from '@material-ui/core'
import Warning from '@material-ui/icons/Warning'
import CheckCircle from '@material-ui/icons/CheckCircle'
import PasswordInput from './PasswordInput'
import LoginInput from './LoginInput'
import MotherNameInput from './MotherNameInput'
import BirthdateInput from './BirthdateInput'
import PhoneInput from './PhoneInput'
import EmailInput from './EmailInput'
import UserIndicator from './UserIndicator'
import ValidationKeyInput from './ValidationKeyInput'
import FooterBar from '../FooterBar'
import AcceptTerms from './AcceptTerms'
import ReceiveContact from './ReceiveContact'
import cs from 'classnames'

const styles = theme => ({
  root: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      flex: 1,
      alignItems: 'center',
      borderRadius: 0
    }
  },
  flex: {
    flex: 1,
    width: '100%'
  },
  button: { marginTop: 15 },
  // buttonNegative: {
  //   marginTop: 15,
  //   [theme.breakpoints.down('sm')]: {
  //     fontSize: 12,
  //     width: '80%'
  //   }
  // },
  // span: {
  //   fontSize: 13
  // },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  logoContainerIos: {
    height: 120,
    paddingTop: 40
  },
  logoContainerDefault: {
    height: 100,
    paddingTop: 20
  },
  logoContainer: {
    maxWidth: 412,
    width: '100%',
    paddingRight: 40,
    paddingLeft: 40,
    paddingBottom: 20,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.grey[100],
    objectFit: 'contain',
    borderBottomColor: theme.palette.grey[400],
    borderBottomWidth: 1,
    borderBottomStyle: 'solid'
  },
  formWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 50,
    paddingRight: 50,
    paddingLeft: 50
  },
  bottomLogo: {
    opacity: 0.9,
    padding: 20,
    marginBottom: 20,
    maxWidth: 160,
    width: '50%'
  },
  recoverTitle: {
    fontWeight: 400,
    fontSize: 17
  },
  wellcome: {
    fontWeight: 500,
    fontSize: 16
  },
  forgotContainer: {
    width: '100%',
    paddingTop: 15,
    textAlign: 'right'
  },
  // preLink: {
  //   fontSize: 13,
  //   color: '#333',
  //   marginRight: '10px'
  // },
  link: {
    textDecoration: 'none',
    color: theme.palette.secondary.main,
    fontSize: 13,
    background: 'none',
    border: 'none',
    padding: 0,
    marginLeft: 5,
    cursor: 'pointer'
  },
  appName: {
    color: theme.palette.primary.dark,
    textAlign: 'center',
    padding: 20,
    fontWeight: 400,
    fontSize: 22
  },
  card: {
    flexDirection: 'column',
    maxWidth: 412,
    width: '100%',
    display: 'flex',
    flex: 'none',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      flex: 1,
      alignItems: 'center',
      borderRadius: 0
    }
  },
  // footerBar: {
  //   position: 'fixed',
  //   right: 0,
  //   left: 0,
  //   bottom: 0,
  //   display: 'flex',
  //   flex: 1,
  //   justifyContent: 'flex-end',
  //   paddingLeft: 5,
  //   paddingRight: 5,
  //   paddingBottom: 4,
  //   paddingTop: 5,
  //   // backgroundColor: theme.palette.primary.dark
  //   backgroundColor: 'rgba(0,0,0,0.35)'
  // },
  // footerLabel: {
  //   marginLeft: 5,
  //   marginRight: 5,
  //   color: theme.palette.common.white,
  //   fontSize: 12,
  //   fontWeight: 400
  // },
  // footerLink: {
  //   color: theme.palette.common.white,
  //   textDecoration: 'none'
  // },
  emailSuccess: {
    marginRight: 10,
    color: '#11aa11'
  },
  suggestRegisterContainer: {
    paddingTop: 20
  },
  testifyError: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20
  },
  marginBottom: {
    marginBottom: 20
  },
  testifyErrorIcon: {
    marginRight: 10,
    color: theme.palette.error.light
  },
  emailInfo: {
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 13,
    marginTop: 15
  },
  enabledFalse: {
    color: 'rgba(0, 0, 0, 0.54)',
    marginTop: 25
  }
})
export default
@withStyles(styles)
@inject('router')
@observer
class Login extends React.Component {
  state = {
    // page: 'FirstLoginPage',
    page: AppStore.user ? 'PasswordPage' : 'LoginPage',
    error: false,
    tokenExpired: false,
    requireValidationKey: false,
    username: AppStore.user ? AppStore.user.username : '',
    usernameValid: false,
    password: '',
    passwordValid: false,
    birthdate: '',
    birthdateValid: false,
    motherName: '',
    motherNameValid: false,
    validationKey: '',
    validationKeyValid: false,
    phoneKey: '',
    phoneValid: false,
    newPassword: '',
    newPasswordValid: false,
    newPasswordConfirm: '',
    newPasswordConfirmValid: false,
    emailConfirm: '',
    emailConfirmValid: false,
    terms: false,
    termsValid: false,
    newUser: false,
    allowSendEmail: true,
    noTestify: false
  }

  componentDidMount() {}

  login = e => {
    UserStore.error = null
    UserStore.login(
      this.props.loginType === 'cpf' ? this.state.username.replace(/\./g, '').replace(/-/g, '') : this.state.username,
      this.state.password,
      this.state.username
    )
  }

  requestReset = e => {
    UserStore.error = null
    UserStore.requestReset(this.state.emailConfirm + '@' + AppStore.email.split('@')[1]).then(res => this.go('ConfirmSetPasswordPage'))
  }

  completeValidation = e => {
    UserStore.error = null
    UserStore.completeValidation(this.state.newPassword)
      .then(res => {
        this.setState({ password: this.state.newPassword }, this.login)
      })
      .catch(err => {
        if (err.error.code === 'INVALID_TOKEN') {
          this.setState({ tokenExpired: true })
        }
      })
  }

  check = e => {
    UserStore.error = null
    UserStore.check(this.props.loginType === 'cpf' ? this.state.username.replace(/\./g, '').replace(/-/g, '') : this.state.username).then(result => {
      if (result) {
        AppStore.setEmail(result.email)
        if (result.code === 1) {
          this.go('PasswordPage')
        } else if (result.code === 2) {
          this.go('FirstLoginPage')
        } else if (result.code === 3) {
          this.setState({ requireValidationKey: true }, () => this.go('FirstLoginPage'))
        } else if (result.code === 4) {
          this.setState({ noTestify: true, newUser: true }, () => this.go('FirstLoginPage'))
        }
      } else {
        if (RealmStore.currentRealm ? RealmStore.currentRealm.registerEnabled : this.props.canRegister) {
          this.setState({ newUser: true }, () => this.go('FirstLoginPage'))
        } else {
          alert('Usuário não encontrado') // TODO: Criar mensagem de usuário não encontrado
        }
      }
    })
  }

  testify = e => {
    UserStore.error = null
    UserStore.testify(
      this.props.loginType === 'cpf' ? this.state.username.replace(/\./g, '').replace(/-/g, '') : this.state.username,
      this.state.noTestify ? 'noTestify' : this.state.motherName,
      this.state.noTestify ? new Date() : this.state.birthdate,
      this.state.phone,
      this.state.allowSendEmail,
      this.state.requireValidationKey ? this.state.validationKey : 'icv',
      this.state.noTestify
    )
      .then(res => {
        AppStore.setToken(res.id)
        this.go('SetPasswordPage')
      })
      .catch(err => {
        if (err.error.code === 'CONFIRMATION_INVALID') {
          this.go('TestifyErrorPage')
        } else {
          console.log(err)
        }
      })
  }

  handleChange = (value, field) => {
    if (UserStore.error) {
      UserStore.error = null
    }
    this.setState({ [field]: value, error: false })
  }

  handleChangeValidation = (value, field) => {
    this.setState({ [field + 'Valid']: value })
  }

  go = page => {
    UserStore.error = null
    this.setState({ page })
  }

  resolveError = () => {
    if (UserStore.error) {
      if (UserStore.error && UserStore.error.code === 'LOGIN_FAILED') {
        return 'Sua senha está incorreta. Se você não lembra de sua senha, clique em "Esqueci minha senha"'
      } else if (UserStore.error && UserStore.error.code === 'EMAIL_NOT_FOUND') {
        return 'A confirmação de email está incorreta.'
      } else {
        return 'Ops! Algo deu errado, tente novamente'
      }
    } else {
      return this.state.error
    }
  }

  resolveSubmit = e => {
    switch (this.state.page) {
      default:
        return this.handleSubmitLoginPage
      case 'PasswordPage':
        return this.handleSubmitPasswordPage
      case 'FirstLoginPage':
        return this.handleSubmitFirstLoginPage
      case 'TestifyErrorPage':
        return this.handleSubmitTestifyErrorPage
      case 'RecoverPasswordPage':
        return this.handleSubmitRecoverPasswordPage
      case 'SetPasswordPage':
        return this.handleSubmitSetPasswordPage
      case 'ConfirmSetPasswordPage':
        return this.handleSubmitConfirmSetPasswordPage
      case 'RegisterPage':
        return this.handleSubmitRegisterPage
    }
  }

  handleSubmitLoginPage = e => {
    e.preventDefault()
    if (this.state.usernameValid) {
      this.check()
    } else {
      this.setState({ error: true })
    }
  }

  handleSubmitPasswordPage = e => {
    e.preventDefault()
    if (this.state.passwordValid) {
      this.login()
    } else {
      this.setState({ error: true })
    }
  }

  handleSubmitFirstLoginPage = e => {
    e.preventDefault()

    if (
      ((this.props.loginType === 'cpf' && this.state.birthdateValid && this.state.motherNameValid) ||
        (this.state.birthdateValid && this.state.phoneValid) ||
        this.state.noTestify) &&
      (this.state.termsValid || !RealmStore.termsOfUse) &&
      (this.state.validationKeyValid || !this.state.requireValidationKey)
    ) {
      this.testify()
    } else {
      this.setState({ error: true })
    }
  }

  handleSubmitTestifyErrorPage = e => {
    e.preventDefault()
    UserStore.error = null
    this.go('FirstLoginPage')
  }

  handleSubmitRecoverPasswordPage = e => {
    e.preventDefault()
    if (this.state.emailConfirmValid) {
      this.requestReset()
    } else {
      this.setState({ error: true })
    }
  }

  handleSubmitSetPasswordPage = e => {
    e.preventDefault()
    if (this.state.newPasswordValid && this.state.newPasswordConfirmValid) {
      this.completeValidation()
    } else {
      this.setState({ error: true })
    }
  }

  handleSubmitConfirmSetPasswordPage = e => {
    e.preventDefault()
    this.go('LoginPage')
  }

  handleSubmitRegisterPage = e => {
    e.preventDefault()
    this.go('LoginPage')
  }

  forgotUser = () => {
    this.setState({ username: null }, () => {
      AppStore.resetUser()
      this.go('LoginPage')
    })
  }

  logout = () => {
    UserStore.logout()
    this.forgotUser()
  }

  render() {
    const { classes, location, loginLabel, loginType, appEmail, wellcomeMessage } = this.props
    const {
      page,
      username,
      password,
      requireValidationKey,
      birthdate,
      motherName,
      phone,
      newPassword,
      emailConfirm,
      newPasswordConfirm,
      validationKey,
      tokenExpired,
      allowSendEmail,
      acceptMessage,
      terms,
      newUser,
      noTestify
    } = this.state
    const { full, solid } = RealmStore.logos || {}

    if (UserStore.logged && UserStore.logged.enabled) {
      return <Redirect to={(AppStore.redirect && location.state && location.state.from) || '/'} />
    } else if (!AppStore.redirect && tokenExpired) {
      // Se o usuário não estiver logado e o "AppStore.redirect" estiver false, significa que o botão "Token expirado"
      // foi clicado, como já estamos na página de login, esse redirect vai fazer a página ser re-renderizada
      return <Redirect to="/" />
    }

    if (UserStore.error && UserStore.error.code === 'UPGRADE_NEEDED') {
      return <UpgradeNeeded />
    }

    if (RealmStore.error) {
      return <PageError error={RealmStore.error} />
    }

    if (!RealmStore.realmResolved) {
      return <PageLoading />
    }

    let mainTenant = true

    return (
      <Background>
        <div className={classes.root}>
          <Card className={classes.card}>
            <form className={classes.flex} onSubmit={this.resolveSubmit()} noValidate>
              <LinearLayout visible={!UserStore.busy() || !!UserStore.error} flex={1}>
                {RealmStore.remoteLogo ? (
                  <div className={cs(classes.logoContainer, AppStore.device.hasNotch ? classes.logoContainerIos : classes.logoContainerDefault)}>
                    <img src={RealmStore.remoteLogo} alt="Logo" className={classes.logo} />
                  </div>
                ) : (
                  <span className={classes.appName}>{RealmStore.appName || 'Nome do sistema'}</span>
                )}
                {!UserStore.logged || UserStore.logged.enabled ? (
                  <div className={classes.formWrapper}>
                    {(() => {
                      switch (page) {
                        default:
                          return (
                            <LoginPage
                              error={this.resolveError()}
                              username={username}
                              loginLabel={loginLabel}
                              loginType={loginType}
                              onChangeValidation={this.handleChangeValidation}
                              onChange={this.handleChange}
                            />
                          )
                        case 'PasswordPage':
                          return (
                            <PasswordPage
                              username={username}
                              password={password}
                              error={this.resolveError()}
                              onForgotUser={this.forgotUser}
                              onBack={() => this.go('LoginPage')}
                              onChangeValidation={this.handleChangeValidation}
                              onChange={this.handleChange}
                            />
                          )
                        case 'FirstLoginPage':
                          return (
                            <FirstLoginPage
                              username={username}
                              newUser={newUser}
                              birthdate={birthdate}
                              motherName={motherName}
                              phone={phone}
                              validationKey={validationKey}
                              requireValidationKey={requireValidationKey}
                              error={this.resolveError()}
                              onBack={() => this.go('LoginPage')}
                              onChangeValidation={this.handleChangeValidation}
                              loginType={loginType}
                              onChange={this.handleChange}
                              noTestify={noTestify}
                            />
                          )
                        case 'TestifyErrorPage':
                          return <TestifyErrorPage />
                        case 'RecoverPasswordPage':
                          return (
                            <RecoverPasswordPage
                              username={username}
                              email={AppStore.email}
                              emailConfirm={emailConfirm}
                              birthdate={birthdate}
                              motherName={motherName}
                              validationKey={validationKey}
                              requireValidationKey={requireValidationKey}
                              error={this.resolveError()}
                              onBack={() => (username ? this.go('PasswordPage') : this.go('LoginPage'))}
                              onChangeValidation={this.handleChangeValidation}
                              onChange={this.handleChange}
                            />
                          )
                        case 'SetPasswordPage':
                          return (
                            <SetPasswordPage
                              username={username}
                              newPassword={newPassword}
                              newPasswordConfirm={newPasswordConfirm}
                              error={this.resolveError()}
                              onBack={() => this.go('LoginPage')}
                              wellcomeMessage={wellcomeMessage}
                              onChangeValidation={this.handleChangeValidation}
                              onChange={this.handleChange}
                            />
                          )
                        case 'ConfirmSetPasswordPage':
                          return <ConfirmSetPasswordPage />
                        case 'RegisterPage':
                          return <RegisterPage username={username} onRegister={() => this.props.router.push('/register')} />
                      }
                    })()}
                    {page === 'FirstLoginPage' && (
                      <React.Fragment>
                        {RealmStore.termsOfUse && (
                          <AcceptTerms
                            value={terms}
                            error={this.resolveError()}
                            onChangeValidation={value => this.handleChangeValidation(value, 'terms')}
                            onChange={value => this.handleChange(value, 'terms')}
                          />
                        )}
                        <ReceiveContact
                          value={allowSendEmail}
                          error={this.resolveError()}
                          acceptMessage={acceptMessage}
                          onChangeValidation={value => this.handleChangeValidation(value, 'receiveContact')}
                          onChange={value => this.handleChange(value, 'allowSendEmail')}
                        />
                      </React.Fragment>
                    )}
                    <Button className={classes.button} type="submit" color="secondary" variant="contained" fullWidth>
                      Continuar
                    </Button>

                    {/*page === 'LoginPage' && (
                    <div className={classes.forgotContainer}>
                      <span className={classes.preLink}>
                        Problemas com acesso?
                  </span>
                      <button
                        className={classes.link}
                        onClick={() => {
                          AppStore.resetUser()
                          this.go('RecoverPasswordPage')
                        }}
                      >
                        Probemas no acesso?
                      </button>
                    </div>
                      )*/}
                    {page === 'RecoverPasswordPage' && appEmail && (
                      <div className={classes.emailInfo}>
                        <span>Se o seu e-mail for diferente do e-mail cadastrado, envie um e-mail para </span>
                        <b>{appEmail}</b>
                        {loginType === 'cpf' && <span> com o novo endereço de e-mail e um documento de identificação com foto e cpf.</span>}
                      </div>
                    )}

                    {page === 'PasswordPage' && (
                      <div className={classes.forgotContainer}>
                        <button
                          className={classes.link}
                          onClick={() => {
                            AppStore.resetUser()
                            this.go('RecoverPasswordPage')
                          }}
                        >
                          Esqueci minha senha
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={classes.formWrapper}>
                    <div className={classes.enabledFalse}>
                      {appEmail ? (
                        <>
                          <span>Sua conta está desabilitada, em caso de dúvidas, envie um e-mail para </span>
                          <b>{appEmail}</b>.
                        </>
                      ) : (
                        <span>Sua conta está desabilitada, em caso de dúvidas, entre em contato. </span>
                      )}
                    </div>
                    <Button className={classes.button} onClick={this.logout} color="secondary" variant="contained" fullWidth>
                      Continuar
                    </Button>
                  </div>
                )}
                {/*<div className={classes.forgotContainer}>
                  <button
                    className={classes.link}
                    onClick={() => {
                      AppStore.resetUser()
                      this.props.router.push('register')
                    }}
                  >
                    Ainda não tem conta?
                  </button>
                  </div>*/}
              </LinearLayout>
            </form>
            <Hidden mdUp>{!mainTenant && full && <img src={full} alt="Logo" className={classes.bottomLogo} />}</Hidden>
          </Card>
          <Hidden smDown>{!mainTenant && solid && <img src={solid} alt="Logo" className={classes.bottomLogo} />}</Hidden>
        </div>
        <FooterBar />
        {UserStore.busy() && !UserStore.error && (
          <LinearLayout absolute gravity="center" width="100%" height="100%">
            <CircularProgress />
          </LinearLayout>
        )}
      </Background>
    )
  }
}

const LoginPage = ({ error, username, loginLabel, loginType, onChange, onChangeValidation }) => (
  <LoginInput
    error={error}
    value={username}
    loginLabel={loginLabel}
    loginType={loginType}
    onChange={value => onChange(value, 'username')}
    onChangeValidation={value => onChangeValidation(value, 'username')}
  />
)

const PasswordPage = withStyles(styles)(({ classes, error, username, password, onChange, onBack, onForgotUser, onChangeValidation }) => (
  <React.Fragment>
    <UserIndicator username={username} onBack={onBack} onForgotUser={onForgotUser} />
    <PasswordInput
      error={error}
      value={password}
      onChange={value => onChange(value, 'password')}
      onChangeValidation={value => onChangeValidation(value, 'password')}
    />
  </React.Fragment>
))

const FirstLoginPage = withStyles(styles)(
  ({
    classes,
    error,
    birthdate,
    motherName,
    validationKey,
    username,
    phone,
    onChange,
    onBack,
    onChangeValidation,
    loginType,
    requireValidationKey,
    newUser,
    noTestify
  }) => (
    <>
      <UserIndicator username={username} onBack={onBack} />
      {!newUser && <span className={classes.wellcome}>Parabéns! Você foi convidado para fazer parte da maior plataforma de incentivos do Brasil!</span>}
      <span>Verificamos que esse é seu primeiro acesso, confirme seus dados para configurarmos seu ambiente.</span>
      {!noTestify && (
        <>
          <BirthdateInput
            error={error}
            value={birthdate}
            loginType={loginType}
            onChange={value => onChange(value, 'birthdate')}
            onChangeValidation={value => onChangeValidation(value, 'birthdate')}
          />
          {loginType === 'cpf' ? (
            <MotherNameInput
              error={error}
              value={motherName}
              onChange={value => onChange(value, 'motherName')}
              onChangeValidation={value => onChangeValidation(value, 'motherName')}
            />
          ) : (
            <PhoneInput
              error={error}
              value={phone}
              onChange={value => onChange(value, 'phone')}
              onChangeValidation={value => onChangeValidation(value, 'phone')}
            />
          )}
        </>
      )}
      {requireValidationKey && (
        <ValidationKeyInput
          error={error}
          value={validationKey}
          onChange={value => onChange(value, 'validationKey')}
          onChangeValidation={value => onChangeValidation(value, 'validationKey')}
        />
      )}
    </>
  )
)

const RecoverPasswordPage = withStyles(styles)(({ classes, error, username, emailConfirm, email, onChange, onChangeValidation, onBack }) => (
  <React.Fragment>
    <UserIndicator username={username} onBack={onBack} />
    <p>
      Vamos enviar um email para:
      <span className={classes.recoverTitle}> {email}</span>
    </p>
    <span>{'Confirme seu email e clique em "Continuar" para receber o seu link de redefinição de senha.'}</span>
    <div className={classes.marginBottom}>
      <EmailInput
        emailDomain={'@' + email.split('@')[1]}
        error={error}
        value={emailConfirm}
        onChange={value => onChange(value, 'emailConfirm')}
        onChangeValidation={value => onChangeValidation(value, 'emailConfirm')}
      />
    </div>
  </React.Fragment>
))

const SetPasswordPage = withStyles(styles)(
  ({ classes, error, username, newPassword, newPasswordConfirm, onChange, onChangeValidation, wellcomeMessage, onBack }) => (
    <React.Fragment>
      <UserIndicator username={username} onBack={onBack} />
      <span className={classes.wellcome}>Tudo certo! Confirmamos seus dados.</span>
      {wellcomeMessage && <span>{wellcomeMessage}</span>}
      <PasswordInput
        label="Escolha uma senha"
        error={error}
        value={newPassword}
        errorMessage="Você precisa escolher uma senha"
        onChange={value => onChange(value, 'newPassword')}
        onChangeValidation={value => onChangeValidation(value, 'newPassword')}
      />
      <PasswordInput
        label="Confirme a senha"
        autoFocus={false}
        error={error}
        value={newPasswordConfirm}
        assert
        assertValue={newPassword}
        errorMessage="Essa senha não é igual a anterior"
        onChange={value => onChange(value, 'newPasswordConfirm')}
        onChangeValidation={value => onChangeValidation(value, 'newPasswordConfirm')}
      />
    </React.Fragment>
  )
)

const ConfirmSetPasswordPage = withStyles(styles)(({ classes }) => (
  <React.Fragment>
    <div className={classes.testifyError}>
      <CheckCircle className={classes.emailSuccess} />
      <span className={classes.wellcome}>Email enviado com sucesso!</span>
    </div>
    <p>Siga as instruções para redefinir sua senha no email.</p>
    <div className={classes.marginBottom}>
      <span>Clique em continuar para voltar para tela de login.</span>
    </div>
  </React.Fragment>
))

const RegisterPage = withStyles(styles)(({ classes, error, username, password, onRegister }) => (
  <React.Fragment>
    <div className={classes.suggestRegisterContainer}>
      <b>{username}</b>
      <br /> Esse CPF não está cadastrado em nossa base.
      <button className={classes.link} onClick={onRegister}>
        Recuperar senha
      </button>
      Solicite acesso ao seu gestor.
    </div>
  </React.Fragment>
))

const TestifyErrorPage = withStyles(styles)(({ classes }) => (
  <React.Fragment>
    <div className={classes.testifyError}>
      <Warning className={classes.testifyErrorIcon} />
      <span className={classes.wellcome}>Os dados informados estão incorretos!</span>
    </div>
    <ul>
      <li>Confira se o CPF informado está correto;</li>
      <li>Confira se você digitou sua data de nascimento corretamente;</li>
      <li>Você deve escrever apenas o primeiro nome da sua mãe, exatamente como consta em sua identidade;</li>
    </ul>
    <div className={classes.marginBottom}>
      <span>Clique em continuar para tentar novamente.</span>
    </div>
  </React.Fragment>
))
