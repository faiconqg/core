import React from 'react'

const NoMatch = ({ location }) => (
  <div>
    <h2>404</h2>
    <br /> A página <code>{location.pathname}</code> não pôde ser encontrada
  </div>
)

export default NoMatch
