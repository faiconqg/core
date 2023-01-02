import axios from 'axios'
import { forEach, isNull, merge } from 'lodash'
import qs from 'qs'
import { AppStore } from './../'

type Request = {
  abort: () => void,
  promise: Promise<*>
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type Options = {
  method: Method,
  headers?: ?{ [key: string]: string },
  data?: ?{ [key: string]: mixed },
  qs?: any
}

function ajaxOptions(url: string, options: Options): ?{} {
  const baseOptions: Object = {
    url,
    method: options.method,
    responseType: options.responseType || 'json'
  }

  if (options.headers) baseOptions.headers = options.headers

  if (options.method === 'GET' && options.data) {
    let sendObject = {}
    Object.keys(options.data).forEach(key => {
      if (options.data[key]) {
        sendObject[key] = JSON.stringify(options.data[key])
          .replace(/^"/, '')
          .replace(/"$/, '')
      } else {
        sendObject[key] = null
      }
    })
    url = `${url}?${qs.stringify(sendObject, options.qs)}`
    return Object.assign({}, baseOptions, { url })
  }

  const formData = new FormData()
  let hasFile = false

  forEach(options.data, (val: any, attr: string) => {
    hasFile = hasFile || val instanceof File || val instanceof Blob

    if (!isNull(val)) formData.append(attr, val)
  })

  if (hasFile) {
    return Object.assign({}, baseOptions, {
      cache: false,
      processData: false,
      data: formData
    })
  }

  return Object.assign({}, baseOptions, { data: options.data })
}

function ajax(url: string, options: Options): Request {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const xhr = axios(
    Object.assign({}, ajaxOptions(url, options), {
      cancelToken: source.token
    })
  )

  const promise = new Promise((resolve, reject) => {
    xhr
      .then(response => {
        return resolve(response.data)
      })
      .catch(function(error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled')
        } else if (error.message === 'Network Error') {
          error.message = 'Verifique sua conexão com a internet e tente novamente.'
          return reject(error)
        } else {
          return reject((error && error.response && error.response.data) || error)
        }
      })
  }).catch(function(err) {
    // console.log(err) // Aqui posso salvar todos os erros em algum lugar
    if (err && err.error && (err.error.code === 'AUTHORIZATION_REQUIRED' || err.error.code === 'INVALID_TOKEN')) {
      AppStore.invalidateToken()
    }
    return Promise.reject(err)
  })

  const abort = () => {
    source.cancel()
  }

  return { abort, promise }
}

export default () => ({
  apiPath: '',
  commonOptions: {},

  get(path: string, data: ?{}, options?: {} = {}): Request {
    return ajax(`${this.apiPath}${path}`, merge({}, { method: 'GET', data }, this.commonOptions, options))
  },

  post(path: string, data: ?{}, options?: {} = {}): Request {
    return ajax(`${this.apiPath}${path}`, merge({}, { method: 'POST', data }, this.commonOptions, options))
  },

  put(path: string, data: ?{}, options?: {} = {}): Request {
    return ajax(`${this.apiPath}${path}`, merge({}, { method: 'PUT', data }, this.commonOptions, options))
  },

  patch(path: string, data: ?{}, options?: {} = {}): Request {
    return ajax(`${this.apiPath}${path}`, merge({}, { method: 'PATCH', data }, this.commonOptions, options))
  },

  del(path: string, options?: {} = {}): Request {
    return ajax(`${this.apiPath}${path}`, merge({}, { method: 'DELETE' }, this.commonOptions, options))
  }
})
