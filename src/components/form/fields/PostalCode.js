import React from 'react'
import TextElement from './../elements/TextElement'

export default props => (
  <TextElement
    {...props}
    mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
    digits={8}
    type="tel"
    pattern="\d{5}-\d{3}"
  />
)
