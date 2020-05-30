import React from 'react'

export default class JsonRenderer extends React.Component {
  render() {
    const { value } = this.props

    return (
      Object.keys(value)
                .map((k) => `${k}: ${value[k]}`)
                .join(', ')
    )
  }
}
