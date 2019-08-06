import React from 'react'
import Check from '@material-ui/icons/Check'
import Remove from '@material-ui/icons/Remove'

export default class BooleanRenderer extends React.Component {
  render() {
    const { value } = this.props

    if (value) {
      return <Check />
    } else {
      return <Remove />
    }
  }
}
