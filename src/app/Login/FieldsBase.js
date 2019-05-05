import React from 'react'
import moment from 'moment'

export default class FieldsBase extends React.Component {
  componentDidMount() {
    this.handleValidation(this.props.value || '')
  }

  onChangeValidation = (value, message = null) => {
    this.setState({ message }, () => {
      if (this.props.onChangeValidation && value !== !!this.state.message) {
        this.props.onChangeValidation(value)
      }
    })
  }

  handleChange = e => {
    this.props.onChange(e.target.value)
    this.handleValidation(e.target.value)
  }

  handleChangeDate = e => {
    if (e.target.value.length === 10) {
      this.props.onChange(moment.utc(e.target.value, 'DD/MM/YYYY'))
    } else {
      this.props.onChange(e.target.value)
    }
    this.handleValidation(e.target.value)
  }

  handleChangeBool = e => {
    this.props.onChange(e.target.checked)
    this.handleValidation(e.target.checked)
  }
}
