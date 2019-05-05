import React from 'react'
import TextElement from './../elements/TextElement'

export default props => (
  <TextElement
    {...props}
    mask={[
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
      '/',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/
    ]}
    digits={14}
    type="tel"
    pattern="\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}"
  />
)
