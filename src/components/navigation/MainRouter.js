import React from 'react'
import ScrollToTop from './ScrollToTop'
import { withRouter, Redirect, Route, Switch } from 'react-router-dom'
import { observer } from './../../api'
import { CircularProgress } from '@material-ui/core'
import { AccessRoutesStore, RouterStore } from 'stores'
import NoMatch from './NoMatch'

let requires = {}

@withRouter
@observer
class LazyComp extends React.Component {
  componentDidMount() {
    if (!requires[this.props.component]) {
      requires[this.props.component] = require(`pages/${this.props.component}`).default
      this.forceUpdate()
    }
    // !requires[this.props.component] &&
    //   import(/* webpackChunkName: "components/[request]" */ `pages/${
    //     this.props.component
    //   }`)
    //     .then(result => {
    //       requires[this.props.component] = result.default
    //       this.forceUpdate()
    //     })
    //     .catch(err =>
    //       console.log(`pages/${this.props.component} não encontrada`)
    //     )
  }

  render() {
    const Component = requires[this.props.component]

    if (!Component) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <CircularProgress />
        </div>
      )
    }
    return <Component />
  }
}
@withRouter
@observer
class RecursiveRouter extends React.Component {
  render() {
    const { routes, prefix, ...props } = this.props

    return (
      <Switch>
        {routes.map((prop, key) => {
          if (prop.hasOwnProperty('try')) {
            prop = prop.toJS()
          }
          let RenderComponent = null
          if (prop.accessRoutes && prop.accessRoutes.length > 0) {
            RenderComponent = () => <RecursiveRouter key={key} prefix={prop.path + '/'} routes={prop.accessRoutes} />
          } else {
            RenderComponent = () => <LazyComp component={prop.component} />
          }
          return <Route path={'/' + (prefix || '') + prop.path} {...props} component={RenderComponent} key={key} />
        })}
        <NoMatch />
      </Switch>
    )
  }
}

export default
@withRouter
@observer
class MainRouter extends React.Component {
  componentDidMount() {
    AccessRoutesStore.isEmpty &&
      AccessRoutesStore.scope()
        .all()
        .then(() => RouterStore._updateLocation(window.location))
  }

  render() {
    // console.log(AccessRoutesStore.error)
    // console.log(this.props)

    if (AccessRoutesStore.busy()) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <CircularProgress />
        </div>
      )
    }

    if (AccessRoutesStore.error) {
      if (!AccessRoutesStore.error) {
        return <div>Servidor offline</div>
      } else if (AccessRoutesStore.error.code === 'AUTHORIZATION_REQUIRED') {
        return <div>Não autorizado</div>
      }
      return <div>Erro de rota!</div>
    }

    if (AccessRoutesStore.models.length === 0) {
      return <div>Você não tem acesso a nenhuma função do sistema, peça para um administrador lhe conceder acesso!</div>
    }

    if (window.location.pathname === '/') {
      if (AccessRoutesStore.models.get(0).has('accessRoutes') && AccessRoutesStore.models.get(0).get('accessRoutes').length > 0) {
        return <Redirect to={'/' + AccessRoutesStore.models.get(0).get('path') + '/' + AccessRoutesStore.models.get(0).get('accessRoutes')[0].path} />
      } else {
        return <Redirect to={'/' + AccessRoutesStore.models.get(0).get('path')} />
      }
    }

    return (
      <ScrollToTop>
        <RecursiveRouter routes={AccessRoutesStore.models} {...this.props} />
      </ScrollToTop>
    )
  }
}
