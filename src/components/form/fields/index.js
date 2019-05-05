import React from 'react'
import Text from './Text'
import CPF from './CPF'
import CNPJ from './CNPJ'
import PostalCode from './PostalCode'
import Date from './Date'
import DateNative from './DateNative'
import Email from './Email'
import Number from './Number'
import Tel from './Tel'
import URL from './URL'
export default model => {
  return {
    Text: props => <Text model={model} {...props} />,
    CPF: props => <CPF model={model} {...props} />,
    CNPJ: props => <CNPJ model={model} {...props} />,
    DateNative: props => <DateNative model={model} {...props} />,
    Date: props => <Date model={model} {...props} />,
    PostalCode: props => <PostalCode model={model} {...props} />,
    Email: props => <Email model={model} {...props} />,
    Number: props => <Number model={model} {...props} />,
    Tel: props => <Tel model={model} {...props} />,
    URL: props => <URL model={model} {...props} />
  }
}
