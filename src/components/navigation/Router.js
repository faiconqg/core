import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import NoMatch from './NoMatch'

export default
@withRouter
class Router extends React.Component {
  render() {
    const { routes, match, ...props } = this.props

    return (
      <Switch>
        {routes.map((prop, key) => {
          return <Route key={key} {...props} path={match.path + prop.path} component={props => <prop.component {...props} />} />
        })}
        <NoMatch />
      </Switch>
    )
  }
}
