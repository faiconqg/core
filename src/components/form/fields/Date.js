import React from 'react'
import TextElement from './../elements/TextElement'
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'

const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy')

export default props => (
  <TextElement
    {...props}
    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
    type="text"
    keepCharPositions={true}
    pipe={autoCorrectedDatePipe}
  />
)
