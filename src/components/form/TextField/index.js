import React from 'react'
import { TextField as BaseTextField } from '@material-ui/core'
import MaskedInput from 'react-text-mask'

export default class TextField extends React.Component {
  componentDidMount() {
    Mask = props => {
      const { inputRef, ...other } = props

      return (
        <MaskedInput
          {...other}
          ref={ref => {
            inputRef(ref ? ref.inputElement : null)
          }}
          guide={false}
          mask={this.props.mask}
        />
      )
    }
  }

  render() {
    const { mask, InputProps, ...props } = this.props

    return (
      <BaseTextField
        {...props}
        InputProps={Object.assign(
          {},
          InputProps,
          mask
            ? {
                inputComponent: Mask
              }
            : {}
        )}
      />
    )
  }
}

let Mask
