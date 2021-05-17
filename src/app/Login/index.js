import React from 'react'
import { Redirect } from 'react-router'
import { UserStore, AppStore, RealmStore } from 'stores'
import { Background, LinearLayout, PageLoading, PageError, UpgradeNeeded } from 'components'
import { observer, inject } from './../../api'
import { withStyles, Button, Card, CircularProgress, Typography } from '@material-ui/core'
import Warning from '@material-ui/icons/Warning'
import ComputerIcon from '@material-ui/icons/Computer'
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid'
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
import ConfirmPhone from './ConfirmPhone'
import ConfirmEmail from './ConfirmEmail'
import PasswordRule from './PasswordRule'
import cs from 'classnames'
import Reaptcha from '@panalbish/reaptcha-enterprise'



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
    // alignItems: 'center',
    paddingBottom: 50,
    paddingRight: 50,
    paddingLeft: 50
  },
  bottomLogo: {
    opacity: 0.9,
    padding: 20,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 20,
    },
    maxHeight: 40,
    maxWidth: 'calc(100% - 40px)',
    alignSelf: 'flex-end',
    objectFit: 'contain'
    // width: '50%'
  },
  recoverTitle: {
    fontWeight: 400,
    fontSize: 17
  },
  wellcome: {
    fontWeight: 500,
    fontSize: 16,
    paddingBottom: 10
  },
  errorTitle: {
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
  footerLogo: {
    flex: 1,
    marginTop: -40,
    display: 'flex',
    justifyContent: 'center'
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
  infoIcon: {
    marginRight: 10,
    color: theme.palette.secondary.light
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
  },
  buttonQr: {
    border: `2px solid ${theme.palette.secondary.main}`,
    '&:hover': {
      border: `2px solid ${theme.palette.secondary.main}`
    },
    textTransform: 'none',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20
  },
  message: {
    color: theme.palette.secondary.main,
    fontSize: 13,
    padding: 6,
    flex: 2
  },
  icon: {
    height: 90
  },
  centered: {
    margin: 'auto',
    marginTop: '20px',
  }
})
export default
@withStyles(styles)
@inject('router')
@observer
class Login extends React.Component {
  state = {
    // page: 'FirstLoginPage',
    page: this.props.confirmEmail ? 'ConfirmEmailPage' : this.props.confirmPhone ? 'ConfirmPhonePage' : AppStore.user ? 'PasswordPage' : 'LoginPage',
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
    privacy: false,
    privacyValid: false,
    newUser: false,
    allowSendEmail: true,
    userInconsistent: false,
    noTestify: false,
    recaptchaSate: localStorage.getItem('recaptchaSate') || '',
    verificationData: {}
  }

  verifyCallback = (recaptchaToken) => {
    if (recaptchaToken) {
      this.setState({ recaptchaSate: recaptchaToken })
    }
  }

  login = e => {
    UserStore.error = null
    UserStore.login(
      this.props.loginType === 'cpf' ? this.state.username.replace(/\./g, '').replace(/-/g, '') : this.state.username,
      this.state.password,
      this.state.username,
      this.state.recaptchaSate
    ).catch(err => {
      if (err.error.code === 'PASSWORD_BLOCK') {
        this.go('PasswordBlock')
      } else if (err.error.code === 'RESET_PASSWORD_REQUIRED') {
        this.setState({ verificationData: err.error.verification }, this.go('VerificationLoginPage'))
      } else {
        throw err
      }
    })
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
    UserStore.check(this.props.loginType === 'cpf' ? this.state.username.replace(/\./g, '').replace(/-/g, '') : this.state.username, this.state.recaptchaSate).then(result => {
      if (result) {
        AppStore.setEmail(result.email)


        // } else {
        if (result.code === 6) {
          // Invalid recaptcha response
          this.setState({ error: 'Por favor, tente novamente.' }, () => {
            this.captcha.reset()
            this.setState({ recaptchaSate: '' })
          })
        } else if (result.verification && !result.verification.date) {
          // console.log(result.verification)
          this.setState({ verificationData: result.verification }, this.go('VerificationLoginPage'))
        } else if (result.code === 1) {
          // Common valid user
          this.go('PasswordPage')
        } else if (result.code === 2 || result.code === 3) {
          // User invalid
          if (AppStore.email || RealmStore.confirmationMethod === 'CPF' || RealmStore.confirmationMethod === 'DISABLED') {
            // console.log(result)
            this.go('FirstLoginPage')
            this.setState({ requireValidationKey: result.code === 3 }, () => this.go('FirstLoginPage'))
          } else {
            this.setState({ userInconsistent: true }, () => this.go('ErrorPage'))
          }
        } else if (result.code === 4) {
          // Disable confirmation
          this.setState({ noTestify: true, newUser: true }, () => this.go('FirstLoginPage'))
        } else if (result.code === 5) {
          // Invited user
          this.setState({ newUser: true }, () => this.go('FirstLoginPage'))
        }
        // }
      } else {
        if (RealmStore.currentRealm ? RealmStore.currentRealm.registerEnabled : this.props.canRegister) {
          this.setState({ newUser: true }, () => this.go('FirstLoginPage'))
        } else {
          this.go('ErrorPage')
        }
      }
    })
  }

  testify = e => {
    UserStore.error = null
    UserStore.testify(
      this.props.loginType === 'cpf' ? this.state.username.replace(/\./g, '').replace(/-/g, '') : this.state.username,
      this.state.motherName,
      this.state.birthdate,
      this.state.phone || '',
      this.state.emailConfirm ? this.state.emailConfirm + '@' + AppStore.email.split('@')[1] : '',
      this.state.allowSendEmail,
      this.state.requireValidationKey ? this.state.validationKey : 'icv',
      this.state.noTestify,
      RealmStore.confirmationMethod
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
      } else if (UserStore.error && UserStore.error.code === 'PASSWORD_RULE') {
        return ''
      } else if (UserStore.error && UserStore.error.displayMessage) {
        return UserStore.error.displayMessage
      } else {
        return 'Ops! Algo deu errado, tente novamente'
      }
    } else {
      return this.state.error
    }
  }

  handleQr = () => {

    window.cordova.plugins.barcodeScanner.scan(
      result => {
        if (result.cancelled) {
          return
        }
        UserStore.qrLogin(result.text).then(result => {
          this.setState({ error: false })
        }).catch(e => this.setState({ error: true }))
      },
      error => {
        console.log(error)
      },
      {
        showTorchButton: true, // iOS and Android
        saveHistory: true, // Android, save scan history (default false)
        prompt: 'Coloque o Código QR da nota na área especificada', // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        disableAnimations: true, // iOS
        disableSuccessBeep: true // iOS and Android
      }
    )
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
      case 'ErrorPage':
        return this.handleSubmitErrorPage
      case 'PasswordBlock':
        return this.handleSubmitPasswordBlock
      case 'VerificationLoginPage':
        return this.handleSubmitVerificationLogin
    }
  }

  handleSubmitVerificationLogin = e => {
    e.preventDefault()
    console.log(e)
  }

  handleSubmitLoginPage = e => {
    e.preventDefault()
    if (this.state.usernameValid) {
      this.setState({ error: false }, this.check())

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
      (this.state.noTestify || RealmStore.confirmationMethod === 'DISABLED' ||
        (RealmStore.confirmationMethod === 'EMAIL' && this.state.emailConfirmValid && this.state.phoneValid) ||
        ((this.props.loginType === 'cpf' && this.state.birthdateValid && this.state.motherNameValid) ||
          (this.state.birthdateValid && this.state.phoneValid))) &&
      (this.state.termsValid || !RealmStore.termsOfUse) &&
      (this.state.privacyValid || !RealmStore.privacyUrl) &&
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

  handleSubmitErrorPage = e => {
    e.preventDefault()
    this.setState({ userInconsistent: false })
    UserStore.error = null
    this.go('LoginPage')
  }

  handleSubmitPasswordBlock = e => {
    e.preventDefault()
    UserStore.error = null
    this.go('RecoverPasswordPage')
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
    const { classes, location, loginLabel, loginMask, loginType, appEmail, wellcomeMessage, confirmPhone, confirmEmail } = this.props
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
      privacy,
      recaptchaSate,
      userInconsistent,
      newUser,
      noTestify,
      verificationData
    } = this.state
    const { full, bottom } = RealmStore.logos || {}

    if (UserStore.logged && UserStore.logged.enabled && !confirmPhone && !confirmEmail) {
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

    let mainTenant = UserStore.realm === 'incentiveme'

    // console.log(page, verificationData)
    // console.log(process.env.REACT_APP_RECAPTCHA_SITE_KEY)

    return (
      <Background>
        <div className={classes.root}>
          <Card className={classes.card}>
            <form className={classes.flex} onSubmit={this.resolveSubmit()} noValidate>
              <LinearLayout visible={!UserStore.busy() || !!UserStore.error} flex={1}>
                {full ? (
                  <div className={cs(classes.logoContainer, AppStore.device.hasNotch ? classes.logoContainerIos : classes.logoContainerDefault)}>
                    <img src={full} alt="Logo" className={classes.logo} />
                  </div>
                ) : (
                  <span className={classes.appName}>{RealmStore.appName || 'Nome do sistema'}</span>
                )}
                {!UserStore.logged || UserStore.logged.enabled ? (
                  <div className={classes.formWrapper} style={{ paddingBottom: 20 }}>
                    {(() => {
                      switch (page) {
                        default:
                          return (
                            <LoginPage
                              error={this.resolveError()}
                              username={username}
                              loginLabel={loginLabel}
                              loginType={loginType}
                              loginMask={loginMask}
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
                        case 'AdminLogin':
                          return (
                            <AdminLogin
                              classes={classes}
                              error={this.resolveError()}
                              username={username}
                              loginLabel={loginLabel}
                              loginType={loginType}
                              loginMask={loginMask}
                              onChangeValidation={this.handleChangeValidation}

                              onClick={this.handleQr}
                              onBack={() => this.go('LoginPage')}
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
                              email={AppStore.email}
                              emailConfirm={emailConfirm}
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
                        case 'ConfirmPhonePage':
                          return <ConfirmPhone />
                        case 'ConfirmEmailPage':
                          return <ConfirmEmail />
                        case 'TestifyErrorPage':
                          return <TestifyErrorPage />
                        case 'ErrorPage':
                          return <ErrorPage userInconsistent={userInconsistent} />
                        case 'PasswordBlock':
                          return <PasswordBlock />
                        case 'RecoverPasswordPage':
                          return (
                            <RecoverPasswordPage
                              username={username}
                              email={AppStore.email}
                              appEmail={appEmail}
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
                            <>
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
                              {UserStore.error && UserStore.error.code === 'PASSWORD_RULE' ? <PasswordRule rules={UserStore.error.detail} /> : null}
                            </>
                          )
                        case 'ConfirmSetPasswordPage':
                          return <ConfirmSetPasswordPage error={this.resolveError()} onChangeValidation={this.handleChangeValidation} />
                        case 'RegisterPage':
                          return <RegisterPage username={username} onRegister={() => this.props.router.push('/register')} />
                        case 'VerificationLoginPage':
                          return <VerificationLoginPage verificationData={verificationData} go={this.go} />
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
                            text={
                              <div>
                                Li e aceito os{' '}
                                <a href={RealmStore.termsOfUse} target="_system" rel="noopener noreferrer">
                                  termos de uso
                                </a>{' '}
                                do aplicativo e declaro ser maior de 18 anos
                              </div>
                            }
                          />
                        )}
                        {RealmStore.privacyUrl && (
                          <AcceptTerms
                            value={privacy}
                            error={this.resolveError()}
                            onChangeValidation={value => this.handleChangeValidation(value, 'privacy')}
                            onChange={value => this.handleChange(value, 'privacy')}
                            text={
                              <div>
                                Li e concordo com o{' '}
                                <a href={RealmStore.privacyUrl} target="_system" rel="noopener noreferrer">
                                  termo de privacidade de dados
                                </a>{' '}
                              </div>
                            }
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
                    {page !== 'ConfirmEmailPage' && page !== 'ConfirmPhonePage' && page !== 'AdminLogin' && page !== 'VerificationLoginPage' ? (
                      <Button id="sign-in-button" className={classes.button} type="submit" color="secondary" variant="contained" fullWidth disabled={page == 'LoginPage' && !recaptchaSate}>
                        Continuar
                      </Button>
                    ) : null}

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
                        <span>{AppStore.messages.recoverPasswordA}</span>
                        <b>{appEmail}</b>
                        {loginType === 'cpf' && <span>{AppStore.messages.recoverPasswordB}</span>}
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

                    {page === 'LoginPage' && JSON.parse(localStorage.getItem('adminLogin')) && AppStore.device.isMobile ? (
                      <div className={classes.forgotContainer}>
                        <button
                          className={classes.link}
                          onClick={() => {
                            AppStore.resetUser()
                            this.go('AdminLogin')
                          }}
                        >
                          Login administrativo
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className={classes.formWrapper}>
                    <div className={classes.enabledFalse}>
                      {appEmail ? (
                        <>
                          <span dangerouslySetInnerHTML={{ __html: AppStore.messages.userBlocked.replace('${email}', appEmail) }}></span>
                        </>
                      ) : (
                        <span>{AppStore.messages.userBlockedWithoutEmail}</span>
                      )}
                    </div>
                    <Button className={classes.button} onClick={this.logout} color="secondary" variant="contained" fullWidth>
                      Continuar
                    </Button>
                  </div>
                )}
                <div style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingBottom: 50
                }}>
                  {page == 'LoginPage' && (
                    <Reaptcha
                      ref={e => (this.captcha = e)}
                      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                      onVerify={this.verifyCallback}
                      onError={() => {
                        console.log('captcha error')
                        // this.captcha.reset()
                      }}
                      onExpire={() => {
                        console.log('captcha expired')
                        this.captcha.reset()

                      }}
                      isolated={true}
                      action="check"
                      hl="pt-BR"
                      badge="bottomleft"
                    // size="invisible"
                    />)
                  }
                </div>
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
            {!mainTenant && bottom && (
              <div className={classes.footerLogo}>{!mainTenant && bottom && <img src={bottom} alt="Logo" className={classes.bottomLogo} />}</div>
            )}
            {/* <Hidden mdUp>{!mainTenant && bottom && <img src={bottom} alt="Logo" className={classes.bottomLogo} />}</Hidden> */}
          </Card>
          {/* <Hidden smDown>{!mainTenant && bottom_solid && <img src={bottom_solid} alt="Logo" className={classes.bottomLogo} />}</Hidden> */}
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

const LoginPage = ({ error, username, loginLabel, loginType, loginMask, onChange, onChangeValidation }) => (
  <LoginInput
    error={error}
    value={username}
    loginLabel={loginLabel}
    loginType={loginType}
    loginMask={loginMask}
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
    email,
    emailConfirm,
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
      {!newUser && <span className={classes.wellcome}>{AppStore.messages.wellcome} </span>}
      <span>{AppStore.messages.firstAccess}</span>
      {!noTestify &&
        (RealmStore.confirmationMethod === 'CPF' ? (
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
        ) : RealmStore.confirmationMethod === 'EMAIL' ? (
          <>
            <EmailInput
              emailDomain={'@' + email.split('@')[1]}
              error={error}
              value={emailConfirm}
              onChange={value => onChange(value, 'emailConfirm')}
              onChangeValidation={value => onChangeValidation(value, 'emailConfirm')}
            />
            <PhoneInput
              error={error}
              value={phone}
              onChange={value => onChange(value, 'phone')}
              onChangeValidation={value => onChangeValidation(value, 'phone')}
            />
          </>
        ) : null)}
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

const RecoverPasswordPage = withStyles(styles)(({ classes, error, username, emailConfirm, email, appEmail, onChange, onChangeValidation, onBack }) => (
  <React.Fragment>
    <UserIndicator username={username} onBack={onBack} />
    {email ? (
      <>
        <p>
          Vamos enviar um email para:
          <span className={classes.recoverTitle}> {email}</span>
        </p>
        <span>{AppStore.messages.emailConfirmation}</span>
        <div className={classes.marginBottom}>
          <EmailInput
            emailDomain={'@' + email.split('@')[1]}
            error={error}
            value={emailConfirm}
            onChange={value => onChange(value, 'emailConfirm')}
            onChangeValidation={value => onChangeValidation(value, 'emailConfirm')}
          />
        </div>
      </>
    ) : appEmail ? (
      <span dangerouslySetInnerHTML={{ __html: AppStore.messages.noEmail.replace('${email}', appEmail) }}></span>
    ) : (
      <span dangerouslySetInnerHTML={{ __html: AppStore.messages.noEmailWithoutEmail }}></span>
    )}
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
      <span className={classes.errorTitle}>Os dados informados estão incorretos!</span>
    </div>
    {RealmStore.confirmationMethod === 'CPF' ? (
      <ul>
        <li>Confira se o CPF informado está correto;</li>
        <li>Confira se você digitou sua data de nascimento corretamente;</li>
        <li>Você deve escrever apenas o primeiro nome da sua mãe, exatamente como consta em sua identidade;</li>
      </ul>
    ) : (
      <ul>
        <li>Confira se o e-mail informado está correto;</li>
        <li>Você precisa informar o e-mail utilizado no seu pré-cadastro;</li>
      </ul>
    )}
    <div className={classes.marginBottom}>
      <span>Clique em continuar para tentar novamente.</span>
    </div>
  </React.Fragment>
))

const ErrorPage = withStyles(styles)(({ classes, userInconsistent }) => (
  <React.Fragment>
    <div className={classes.testifyError}>
      <Warning className={classes.testifyErrorIcon} />
      {userInconsistent ? (
        <span className={classes.errorTitle}>Usuário com cadastro incompleto!</span>
      ) : (
        <span className={classes.errorTitle}>Usuário não encontrado!</span>
      )}
    </div>
    <ul>
      <li>Confira se o login informado está correto;</li>
      <li>Novos registros não estão habilitados;</li>
      {userInconsistent && <li>Entre em contato para obter ajuda;</li>}
    </ul>
    <div className={classes.marginBottom}>
      <span>Clique em continuar para tentar outro login.</span>
    </div>
  </React.Fragment>
))

const PasswordBlock = withStyles(styles)(({ classes }) => (
  <React.Fragment>
    <div className={classes.testifyError}>
      <Warning className={classes.testifyErrorIcon} />
      <span className={classes.errorTitle}>Conta bloqueada ou expirada</span>
    </div>
    <ul>
      <li>Sua conta está expirada ou foi bloqueada devido ao número máximo de tentativas de senha incorreta;</li>
      <li>Será necessário criar uma nova senha para acessar o sistema;</li>
    </ul>
    <div className={classes.marginBottom}>
      <span>Clique em continuar para resetar sua senha.</span>
    </div>
  </React.Fragment>
))

const VerificationLoginPage = withStyles(styles)(({ classes, verificationData, go }) => (
  <React.Fragment>
    <div className={classes.testifyError}>
      <Warning className={classes.testifyErrorIcon} />
      <span className={classes.errorTitle}>Confirmação de dados de acesso</span>
    </div>
    <ul>
      <li>{verificationData.message}</li>
    </ul>
    {/* <div className={classes.marginBottom}>
      <span>Clique em continuar para confirmar seus dados.</span>
    </div> */}
    {verificationData.link === 'RESET_PASSWORD' ?
      <Button className={classes.button} color="secondary" variant="contained" fullWidth onClick={() => go('RecoverPasswordPage')}>
        Resetar Senha
    </Button>
      : verificationData.link === 'RESET_EMAIL' ?
        <Button className={classes.button} color="secondary" variant="contained" fullWidth onClick={() => go('RecoverPasswordPage')}>
          Confirmar E-mail
    </Button> : (
          <Button className={classes.button} color="secondary" variant="contained" fullWidth onClick={() => window.open(verificationData.link, '_blank')}>
            Continuar
          </Button>
        )}
  </React.Fragment>
))


const AdminLogin = ({ classes, onBack, onClick, error, username, loginLabel, loginType, loginMask, onChange, onChangeValidation }) => (
  <React.Fragment>
    <div className={classes.testifyError}>
      <Button
        variant="outlined"
        component="span"
        color="secondary"
        className={classes.buttonQr}
        fullWidth
        onClick={onClick}
      >
        <img
          alt="QR Code"
          className={classes.icon}
          src={require('resources/images/qrcode.png')}
        />
        <span className={classes.message}>
          Escaneie aqui o QR Code para acessar
        </span>
      </Button>
    </div>
    {error && <div className={classes.testifyError}>
      <Warning className={classes.testifyErrorIcon} />
      <span className={classes.errorTitle}>QR Code Inválido, tente novamente</span>
    </div>}
    <div className={classes.testifyError}>
      <ComputerIcon className={classes.infoIcon} />
      <span className={classes.errorTitle}>Na versão web</span>
    </div>
    <ul>
      <li>No menu, vá em "Relatórios > Acesso";</li>
      <li>Procure um usuário na lista e clique no mesmo;</li>
      <li>Clique em "Gerar QR Code de acesso";</li>
    </ul>
    <div className={classes.testifyError}>
      <PhoneAndroidIcon className={classes.infoIcon} />
      <span className={classes.errorTitle}>No APP</span>
    </div>
    <ul>
      <li>Cique no botão acima para escanear o QR Code;</li>
      <li>Aponte a câmera para o QR Code na tela;</li>
    </ul>
    <Typography variant="caption">* Você será desconectado após 5 minutos</Typography>
    <Button className={classes.button} color="secondary" variant="contained" fullWidth onClick={onBack}>
      Cancelar
    </Button>
  </React.Fragment>
)
