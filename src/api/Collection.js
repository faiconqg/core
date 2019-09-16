import apiClient from './mobxRest/apiClient'
import BaseCollection from './mobxRest/Collection'
import SumModel from './SumModel'
import ErrorObject from './mobxRest/ErrorObject'
import { observable, action, runInAction } from 'mobx'
import moment from 'moment'
import { isMatch, find } from 'lodash'
// import { difference } from 'lodash'

export default class Collection extends BaseCollection {
  constructor(scope = null) {
    super()
    this._query = { data: { filter: Object.assign({}, scope) } }
    this._scopeQuery = { data: { filter: Object.assign({}, scope) } }
    this.sum = new SumModel()
    this.sum.collection = this
  }

  @observable
  pagination = {
    order: null,
    orderBy: null,
    rowsPerPage: null,
    page: null,
    search: ''
  }
  @observable
  count = 0
  @observable
  requestCount = null
  @observable
  requestExport = null
  _forceBusy = false
  _scopeQuery = null
  _query = null

  @observable
  workingModel = null

  @action
  async export(columns, filename) {
    const label = 'fetching'
    const { abort, promise } = apiClient().get(
      this.url() + '/export',
      { columns: columns, where: this._query.data.filter.where, include: this._query.data.filter.include, order: this._query.data.filter.order },
      { responseType: 'blob' }
    )

    this.requestExport = new Request(label, abort, 0)

    let data

    try {
      data = await promise
    } catch (body) {
      runInAction('fetch-export-error', () => {
        this.error = new ErrorObject(body)
        this.requestCount = null
      })

      throw body
    }

    runInAction('fetch-done', () => {
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      let finalFilename = this.url() + '_' + moment().format('YYYYMMDDhmmss') + '.xlsx'
      if (filename) {
        if (typeof filename === 'string') {
          finalFilename = filename
        } else {
          finalFilename = filename(finalFilename)
        }
      }
      link.setAttribute('download', finalFilename)
      document.body.appendChild(link)
      link.click()
      this.requestExport = null
      this.error = null
    })

    return data
  }

  init = props => {
    const ModelClass = this.model()
    this.workingModel = new ModelClass()
    this.workingModel.collection = this
    this.workingModel.set(props)
  }

  edit = props => {
    this.workingModel = this.build(props)
  }

  // @action
  // async rpcGet(method: string, body?: {}): Promise<*> {
  //   const label = 'fetching'
  //   const { promise, abort } = apiClient().get(
  //     `${this.url()}/${method}`,
  //     body || {}
  //   )

  //   this.request = new Request(label, abort, 0)

  //   let response

  //   try {
  //     response = await promise
  //   } catch (body) {
  //     runInAction('accept-fail', () => {
  //       this.request = null
  //       console.log(ErrorObject)
  //       this.error = new ErrorObject(label, body)
  //     })

  //     throw body
  //   }

  //   this.request = null
  //   this.error = null

  //   return response
  // }

  @action
  async fetchCount() {
    if (this.lastCount === JSON.stringify(this._query.data.filter.where)) {
      return this.count
    }
    const label = 'fetching'
    const { abort, promise } = apiClient().get(this.url() + '/count', this._query.data.filter)

    this.requestCount = new Request(label, abort, 0)

    let data

    try {
      data = await promise
    } catch (body) {
      runInAction('fetch-count-error', () => {
        this.error = new ErrorObject(body)
        this.requestCount = null
      })

      throw body
    }

    runInAction('fetch-done', () => {
      this.lastCount = JSON.stringify(this._query.data.filter.where)
      this.count = data.count
      this.requestCount = null
      this.error = null
    })

    return data.count
  }

  clean = () => {
    this._query = { data: { filter: {} } }
    return this
  }

  where = (filterObject, reset = false) => {
    Object.assign(this._query.data.filter, {
      where: Object.assign({}, reset ? {} : this._query.data.filter.where, filterObject)
    })
    return this
  }

  limit = size => {
    Object.assign(this._query.data.filter, { limit: size })
    return this
  }

  select = fields => {
    Object.assign(this._query.data.filter, { fields })
    return this
  }

  order = orderObject => {
    Object.assign(this._query.data.filter, { order: orderObject })
    return this
  }

  offset = size => {
    Object.assign(this._query.data.filter, { offset: size })
    return this
  }

  include = includes => {
    Object.assign(this._query.data.filter, { include: includes })
    return this
  }

  custom = (method, body, forceBusy = false) => {
    // console.log(this._forceBusy)
    this._forceBusy = forceBusy
    return this.rpc(method, body)
  }

  find = query => {
    return find(this.models.toJS(), attributes => isMatch(attributes.toJS(), query))
  }

  get = (id, required = false) => {
    const model = this.models.find(item => item.id === parseInt(id, 10))

    if (!model && required) {
      throw Error(`Invariant: Model must be found with id: ${id}`)
    }

    return model
  }

  all = () => this.fetch(this._query)

  busy = () => this.requests.length > 0 || this._forceBusy

  scope = () => {
    this._query = Object.assign({}, this._query, this._scopeQuery)
    return this
  }

  busyCount = () => !!this.requestCount

  busyExport = () => !!this.requestExport

  // @action
  // set(
  //   resources: Array<{ [key: string]: any }>,
  //   { add = true, change = true, remove = true } = {}
  // ): void {
  //   if (remove) {
  //     const ids = resources.map(r => r.id)
  //     const toRemove = difference(this._ids(), ids)
  //     if (toRemove.length) this.remove(toRemove)
  //   }

  //   let model
  //   resources.forEach(resource => {
  //     let index = model ? this.models.indexOf(model) : this.models.length
  //     model = this.get(resource.id)

  //     if (model && change) model.set(resource)
  //     if (!model && add) this.addAt([resource], index)
  //   })
  // }

  // @action
  // add(data: Array<{ [key: string]: any }>) {
  //   const models = data.map(d => this.build(d))
  //   this.models.push(...models)
  //   return models
  // }

  // @action
  // addAt(data: Array<{ [key: string]: any }>, index) {
  //   const models = data.map(d => this.build(d))
  //   this.models.splice(index, 0, ...models)
  //   return models
  // }
}
