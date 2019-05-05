import React from 'react'
import { withStyles, Hidden, Grid, Button, CircularProgress } from '@material-ui/core'
import classNames from 'classnames'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Face from '@material-ui/icons/Face'
import Email from '@material-ui/icons/Email'
import Https from '@material-ui/icons/Https'
import Timeline from '@material-ui/icons/Timeline'
import Code from '@material-ui/icons/Code'
import People from '@material-ui/icons/People'
import InputAdornment from '@material-ui/core/InputAdornment'
import Paper from '@material-ui/core/Paper'
import blue from '@material-ui/core/colors/blue'
import grey from '@material-ui/core/colors/grey'
import MaskedInput from 'react-text-mask'
import { TextField } from 'draft'
import { Form, observer, inject } from './../'
import { LinearLayout } from 'components'
import { UserStore } from 'stores'
import MessageError from './MessageError'

const styles = theme => ({
  h2Header: {
    textAlign: 'center',
    color: '#3C4858',
    fontSize: 35,
    fontWeight: '300',
    margin: '0 0 40px'
  },
  loading: {
    position: 'absolute',
    top: 0,
    background: '#fff',
    transition: '.3s'
  },
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  marginInput: {
    margin: '15px 0'
  },
  button: {
    display: 'block',
    fontSize: 14,
    color: '#ccc',
    marginRight: '24px'
  },
  buttonNegative: {
    display: 'block',
    fontSize: 12,
    color: '#ccc',
    [theme.breakpoints.down('sm')]: {
      whiteSpace: 'nowrap',
      fontSize: 11
    }
  },
  cssRoot: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    '&:hover': {
      backgroundColor: blue[700]
    }
  },
  cssRootNegative: {
    color: theme.palette.getContrastText(grey[300]),
    backgroundColor: grey[300],
    '&:hover': {
      backgroundColor: grey[400]
    }
  },
  formRegister: {
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: 0
    }
  },
  formRegisterContent: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  footerForm: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  paddingPaper: {
    padding: '50px 60px',
    maxWidth: 800,
    [theme.breakpoints.down('sm')]: {
      padding: '40px',
      borderRadius: 0,
      boxSizing: 'border-box',
      height: '100vh'
    }
  },
  flexStart: {
    alignItems: 'flex-start'
  },
  blue: {
    color: 'blue'
  },
  red: {
    color: 'red'
  },
  purple: {
    color: 'purple'
  },
  gray: {
    color: 'gray'
  }
})

export default
@withStyles(styles)
@inject('router')
@observer
class FormRegister extends React.Component {
  state = {
    cpf: '',
    email: '',
    password: '',
    repeatPassword: '',
    error: false,
    labelError: '',
    message: '',
    detail: false,
    open: false,
    type: ''
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({ open: false })
  }

  handleOpen = e => {
    this.setState({ open: true })
  }

  handleChange = name => value => {
    UserStore.workingModel.s(name, value)
  }

  handleCpf = value => {
    this.setState({ cpf: value })
  }

  handleEmail = value => {
    this.setState({ email: value })
  }

  handlePassword = value => {
    this.setState({ password: value })
  }

  handleRepeat = value => {
    if (this.state.password === value) {
      this.setState({ error: false, labelError: '' })
    } else {
      this.setState({ error: true, labelError: 'Senhas não conferem' })
    }
    this.setState({ repeatPassword: value })
  }

  componentDidMount = () => {
    UserStore.init()
  }

  handleSubmit = event => {
    event.preventDefault()
    // if (this.state.password === '') {
    //   console.log('Você precisa preencher uma nova senha')
    //   return false
    // } else if (this.state.repeatPassword === '') {
    //   console.log('Você precisa repetir sua senha')
    //   return false
    // } else if (this.state.password !== this.state.repeatPassword) {
    //   console.log('Suas senhas não se conferem')
    //   return false
    // }

    let data = UserStore.workingModel.toJS()

    data.cpf = data.cpf.replace(/\./g, '').replace(/-/g, '')

    UserStore.rpc('register', data)
      .then(result => {
        // let message
        // message = `Usuário de ID ${result.id} criado com sucesso!`
        UserStore.login(data.cpf, data.password, data.cpf)
          .then(resultLogin => {
            console.log(resultLogin)
          })
          .catch(e => {
            console.log(e)
          })
      })
      .catch(e => {
        // console.log(UserStore.error)
        // let message = e.
        console.log(e)
        this.setState({
          open: true,
          message: e.error.message
        })
        this.setState({ message: e.error.message, detail: true })
      })
    // let campaign = CampaignStore.rpc('/', )
  }

  MaskCpf = props => {
    const { inputRef, ...other } = props

    return (
      <MaskedInput
        {...other}
        ref={ref => {
          inputRef(ref ? ref.inputElement : null)
        }}
        mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
      />
    )
  }

  render() {
    const { classes } = this.props
    // const { cpf, email, password, repeatPassword } = this.state

    if (!UserStore.workingModel) {
      return <span>Carregando...</span>
    }

    return (
      <Form onSubmit={this.handleSubmit} className={classNames(classes.formRegister)}>
        <Paper className={classNames(classes.root, classes.paddingPaper)} elevation={1}>
          <h2 className={classes.h2Header}>Cadastro</h2>
          <Grid container spacing={24}>
            <Hidden smDown>
              <Grid item sm={12} md={6}>
                <List>
                  <ListItem className={classes.flexStart}>
                    <Timeline className={classes.red} />
                    <ListItemText
                      primary="Marketing"
                      secondary="We've created the marketing campaign of the website. It was a very interesting collaboration."
                    />
                  </ListItem>
                  <ListItem className={classes.flexStart}>
                    <Code className={classes.blue} />
                    <ListItemText
                      primary="Fully Coded in HTML5"
                      secondary="We've created the marketing campaign of the website. It was a very interesting collaboration."
                    />
                  </ListItem>
                  <ListItem className={classes.flexStart}>
                    <People className={classes.purple} />
                    <ListItemText
                      primary="Built Audience"
                      secondary="We've created the marketing campaign of the website. It was a very interesting collaboration."
                    />
                  </ListItem>
                </List>
              </Grid>
            </Hidden>
            <Grid item sm={12} md={6} className={classNames(classes.formRegisterContent)}>
              <TextField
                className={classes.marginInput}
                required
                value={UserStore.workingModel.g('cpf')}
                onChange={this.handleChange('cpf')}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Face className={classes.gray} />
                    </InputAdornment>
                  ),
                  type: 'text',
                  placeholder: 'CPF...',
                  inputComponent: this.MaskCpf
                }}
              />
              <TextField
                className={classes.marginInput}
                required
                value={UserStore.workingModel.g('email')}
                onChange={this.handleChange('email')}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email className={classes.gray} />
                    </InputAdornment>
                  ),
                  type: 'email',
                  placeholder: 'Email...'
                }}
              />
              <TextField
                className={classes.marginInput}
                required
                value={UserStore.workingModel.g('password')}
                onChange={this.handleChange('password')}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Https className={classes.gray} />
                    </InputAdornment>
                  ),
                  type: 'password',
                  placeholder: 'Senha...'
                }}
              />
              <TextField
                className={classes.marginInput}
                error={this.state.error}
                label={this.state.labelError}
                value={UserStore.workingModel.g('repeat')}
                onChange={this.handleChange('repeat')}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Https className={classes.gray} />
                    </InputAdornment>
                  ),
                  type: 'password',
                  placeholder: 'Confirmar Senha...'
                }}
              />
              <div className={classNames(classes.footerForm)}>
                <Button aria-label="Delete" className={classNames(classes.button, classes.cssRoot)} size="large" type="submit" color="secondary">
                  Registrar
                </Button>
                <Button
                  aria-label="Delete"
                  className={classNames(classes.buttonNegative, classes.cssRootNegative)}
                  size="small"
                  onClick={() => this.props.router.push('/login')}
                >
                  Já sou cadastrado
                </Button>
              </div>
            </Grid>
          </Grid>
        </Paper>
        <MessageError close={this.handleClose} open={this.state.open} msgError={this.state.message} type={this.state.type} />
        {UserStore.busy() && !UserStore.error && (
          <LinearLayout absolute gravity="center" width="100%" height="100%" className={classNames(classes.loading)}>
            <CircularProgress />
          </LinearLayout>
        )}
      </Form>
    )
  }
}
