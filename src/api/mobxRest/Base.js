// @flow
import { action, observable, IObservableArray } from 'mobx'
import apiClient from './apiClient'
import Request from './Request'
import ErrorObject from './ErrorObject'

export default class Base {
  @observable.shallow requests: IObservableArray = []
  @observable error = null

  /**
   * Returns the resource's url.
   *
   * @abstract
   */
  url(): string {
    throw new Error('You must implement this method')
  }

  withoutId(): boolean {
    return false
  }

  withRequest(
    labels: string | Array<string>,
    promise: Promise<*>,
    abort: ?() => void
  ): Request {
    if (typeof labels === 'string') {
      labels = [labels]
    }

    const handledPromise = promise
      .then(response => {
        this.requests.remove(request)
        return response
      })
      .catch(error => {
        console.log(error)
        this.requests.remove(request)
        const errorObject = new ErrorObject(error)
        this.error = errorObject.error
        throw errorObject
      })

    const request = new Request(handledPromise, {
      labels,
      abort
    })

    this.requests.push(request)

    return request
  }

  getRequest(label: string): ?Request {
    return this.requests.find(request => request.labels.indexOf(label) !== -1)
  }

  getAllRequests(label: string): Array<Request> {
    return this.requests.filter(request => request.labels.indexOf(label) !== -1)
  }

  /**
   * Questions whether the request exists
   * and matches a certain label
   */
  isRequest(label: string): boolean {
    return !!this.getRequest(label)
  }

  /**
   * Call an RPC action for all those
   * non-REST endpoints that you may have in
   * your API.
   */
  @action
  // rpc(label: string, endpoint: string, options?: {}): Request {
  rpc(endpoint: string, options?: {}): Request {
    const { promise, abort } = apiClient().post(
      `${this.url()}/${endpoint}`,
      options
    )

    return this.withRequest(endpoint, promise, abort)
  }

  @action
  // rpc(label: string, endpoint: string, options?: {}): Request {
  rpcGet(endpoint: string, options?: {}): Request {
    const { promise, abort } = apiClient().get(
      `${this.url()}/${endpoint}`,
      options
    )

    return this.withRequest(endpoint, promise, abort)
  }
}
