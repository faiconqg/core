import React from 'react'

export default class Listener extends React.Component {
  state = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      nextProps.onChange()
    }
    return nextProps
  }

  render() {
    const { classes } = this.props
    return null
  }
}
