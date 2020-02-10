import BaseModel from './mobxRest/Model'
import _ from 'lodash'

function secureGet(item, key) {
  if (item) {
    if (item.hasOwnProperty('try')) {
      return item.try(key)
    } else {
      return item[key]
    }
  } else {
    return null
  }
}

export default class Model extends BaseModel {
  _query = { data: { filter: {} } }

  get primaryKey(): string {
    return (this.hasOwnProperty('pk') && this.pk()) || 'id'
  }

  where = filterObject => {
    Object.assign(this._query.data.filter, { where: filterObject })
    return this
  }

  include = includes => {
    Object.assign(this._query.data.filter, { include: includes })
    return this
  }

  one = (data = null, reset = false) => {
    if (!this.isNew && reset) {
      this.reset({})
    }
    return this.fetch(data ? { data: data } : this._query)
  }

  recursiveGet = keys => {
    let item = this
    keys.forEach(key => {
      item = secureGet(item, key)
      item = item === 0 ? 0 : item || ''
    })
    return item
  }

  busy = () => this.requests.length > 0 || this._forceBusy

  recursiveSet = (keys, value, item = {}) => {
    if (keys.length > 1) {
      item[keys[0]] = this.recursiveSet(keys.slice(1), value, item[keys[0]])
    } else {
      item[keys[0]] = value
    }
    return item
  }

  try = key => {
    if (this.has(key)) {
      return this.get(key)
    } else {
      return ''
    }
  }

  clean = () => {
    this.error = null
  }

  g = key => {
    // let splitedKey = key.split('.')
    // return this.recursiveGet(splitedKey)
    return _.get(this.toJS(), key)
  }

  s = (key, value) => {
    let splitedKey = key.split('.')
    return this.set(this.recursiveSet(splitedKey, value, this.toJS()))
  }
}
