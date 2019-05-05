import React from 'react'
import { AppStore } from 'stores'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, render, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      // if (UserStore.logged) {
      if (AppStore.token) {
        if (render) {
          return render()
        } else {
          return <Component {...props} />
        }
      } else {
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    }}
  />
)

export default PrivateRoute
