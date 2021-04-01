import React from 'react'
import { withStyles } from '@material-ui/core'
import {UserStore} from 'stores'
import { inject } from './../../api'
// import { RealmStore } from 'stores'
// import Warning from '@material-ui/icons/Warning'
// import CheckCircle from '@material-ui/icons/CheckCircle'

const styles = theme => ({})

export default
@withStyles(styles)
@inject('router')
class BypassQrCode extends React.Component {  
  state = {
    isFech: false
  }

  render() {

    if(!UserStore.busy() && !this.state.isFech) {
      this.setState({isFech: true}, () => {
        if(this.props.match.params.hash) {
          UserStore.qrLogin(this.props.match.params.hash, this.props.match.params.realm)
          .catch(e => window.alert(e.error.message))
          .finally(() => this.props.router.push('/'))
        } else {
          window.alert('Hash inválido')
        }
      })
      
    }

    return 'Carregando...'
  }
}
