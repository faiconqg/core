import React from 'react'
import TextElement from './../elements/TextElement'

export default props => (
  <TextElement
    {...props}
    mask={[
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/
    ]}
    type="tel"
    digits={11}
    pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
  />
)
