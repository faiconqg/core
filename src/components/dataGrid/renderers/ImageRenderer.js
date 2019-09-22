import React from 'react'
import circle from 'resources/vectors/circle.svg'
import { ResourceLoader } from 'api'

export default class ImageRenderer extends React.Component {
  render() {
    const { value } = this.props

    return (
      <img
        style={{
          objectFit: 'contain',
          width: 30,
          height: 30,
          padding: '0 0 0 0'
        }}
        alt="imagem"
        src={value ? ResourceLoader.load(value) : circle}
      />
    )
  }
}
