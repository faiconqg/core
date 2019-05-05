import React from 'react'
import TextElement from './../elements/TextElement'

export default props => (
  <TextElement
    type="tel"
    mask={[
      '(',
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/
    ]}
    digits={11}
    pattern="\(\d{2}\) \d{5}-\d{4}"
    {...props}
  />
)
