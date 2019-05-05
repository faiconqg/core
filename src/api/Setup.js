// import React from 'react'
import apiClient from './mobxRest/apiClient'
import adapter from './Adapter'

export default (
  apiPath,
  token = null,
  headers = null,
  tokenKey = 'Authorization'
) => {
  let headersObj = { 'Content-Type': 'application/json' }

  if (headers) {
    headersObj = Object.assign(headersObj, headers)
  }

  if (token) {
    headersObj[tokenKey] = token
  }

  apiClient(adapter(), {
    apiPath,
    commonOptions: {
      headers: headersObj
    }
  })
}
