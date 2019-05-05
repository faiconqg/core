import React from 'react'
import _FormElement from './_FormElement'
import { observer } from './../../../api'

export default
@observer
class TextElement extends _FormElement {
  // TODO: Unificar MaskElement e text element
  // TODO: Jogar essa inteligência para um elemento comum aos dois
  state = {
    valid: false,
    validated: false
  }

  get valid() {
    return this.state.valid
  }

  get validated() {
    return this.state.valid
  }

  handleComplete = e => {
    if (e.target.rawValue.length === this.props.digits) {
      this.props.onComplete(e)
      // console.log(e.target.rawValue)
    }
  }

  handleChange = e => {
    this.props.model.s(this.props.name, e.target.value)
    e.target.rawValue = e.target.value.replace(/[/._-]/gi, '')
    this.setState({
      valid: e.target.validity.valid,
      validated: !e.target.validity.valid
    })
    // console.log(e.target.rawValue)
    if (this.props.onComplete) {
      this.handleComplete(e)
    }
    if (this.props.onChange) {
      this.props.onChange(e)
    }
  }

  resolveValue = () => {
    if (this.props.render) {
      return this.props.render(this.props.model.g(this.props.name))
    } else {
      return this.props.model.g(this.props.name)
    }
  }

  render() {
    const { style, errorStyle, inputRef, error, mask, ...props } = this.props

    if (inputRef) {
      inputRef(this)
    }

    const resolvedStyle = Object.assign({}, style, error || (this.state.validated && !this.state.valid) ? { borderColor: 'red' } : {}, errorStyle)

    if (mask) {
      return <this.F.MaskedInput {...props} mask={mask} value={this.resolveValue()} onChange={this.handleChange} style={resolvedStyle} />
    } else {
      return <this.F.TextField {...props} value={this.resolveValue()} onChange={this.handleChange} style={resolvedStyle} />
    }

    // return (
    //   <TextElement
    //     {...props}
    //     InputProps={{
    //       inputComponent: this.getMask(mask)
    //     }}
    //     customChange={this.handleChange}
    //   />
    // )
  }
}
